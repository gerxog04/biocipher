import { Language } from '../i18n/translations';

export type Allele = string;
export type Genotype = [Allele, Allele];

export interface TraitDefinition {
  id: string;
  nameKey: string;
  alleles: {
    symbol: string;
    nameKey: string;
    isDominant: boolean;
  }[];
  phenotypes: {
    nameKey: string;
    genotypes: string[][];
  }[];
}

export const TRAITS: Record<string, TraitDefinition> = {
  eyeColor: {
    id: 'eyeColor',
    nameKey: 'traits.eyeColor',
    alleles: [
      { symbol: 'B', nameKey: 'traits.brown', isDominant: true },
      { symbol: 'b', nameKey: 'traits.nonBrown', isDominant: false },
    ],
    phenotypes: [
      { nameKey: 'traits.brown', genotypes: [['B', 'B'], ['B', 'b']] },
      { nameKey: 'traits.nonBrown', genotypes: [['b', 'b']] },
    ],
  },
  hairColor: {
    id: 'hairColor',
    nameKey: 'traits.hairColor',
    alleles: [
      { symbol: 'H', nameKey: 'traits.dark', isDominant: true },
      { symbol: 'h', nameKey: 'traits.light', isDominant: false },
    ],
    phenotypes: [
      { nameKey: 'traits.dark', genotypes: [['H', 'H'], ['H', 'h']] },
      { nameKey: 'traits.light', genotypes: [['h', 'h']] },
    ],
  },
  bloodType: {
    id: 'bloodType',
    nameKey: 'traits.bloodType',
    alleles: [
      { symbol: 'IA', nameKey: 'traits.typeA', isDominant: true },
      { symbol: 'IB', nameKey: 'traits.typeB', isDominant: true },
      { symbol: 'i', nameKey: 'traits.typeO', isDominant: false },
    ],
    phenotypes: [
      { nameKey: 'traits.typeA', genotypes: [['IA', 'IA'], ['IA', 'i']] },
      { nameKey: 'traits.typeB', genotypes: [['IB', 'IB'], ['IB', 'i']] },
      { nameKey: 'traits.typeAB', genotypes: [['IA', 'IB']] },
      { nameKey: 'traits.typeO', genotypes: [['i', 'i']] },
    ],
  },
};

export function calculatePunnettSquare(parent1Genotype: Allele[], parent2Genotype: Allele[]) {
  const results: string[][] = [];
  for (const g1 of parent1Genotype) {
    for (const g2 of parent2Genotype) {
      const combined = [g1, g2].sort((a, b) => {
        if (a.startsWith('I') && b.startsWith('I')) return a.localeCompare(b);
        if (a.startsWith('I')) return -1;
        if (b.startsWith('I')) return 1;
        if (a === a.toUpperCase() && b === b.toLowerCase()) return -1;
        if (a === a.toLowerCase() && b === b.toUpperCase()) return 1;
        return a.localeCompare(b);
      });
      results.push(combined);
    }
  }
  return results;
}

export function getProbabilities(punnettResults: string[][], traitId: string) {
  const genotypeCounts: Record<string, number> = {};
  const phenotypeCounts: Record<string, number> = {};
  const trait = TRAITS[traitId];

  punnettResults.forEach(genotype => {
    const gStr = genotype.join('');
    genotypeCounts[gStr] = (genotypeCounts[gStr] || 0) + 1;

    const phenotype = trait.phenotypes.find(p => 
      p.genotypes.some(tg => tg.every((val, index) => val === genotype[index]))
    );
    if (phenotype) {
      phenotypeCounts[phenotype.nameKey] = (phenotypeCounts[phenotype.nameKey] || 0) + 1;
    }
  });

  const total = punnettResults.length;
  
  return {
    genotypes: Object.entries(genotypeCounts).map(([name, count]) => ({
      name,
      probability: (count / total) * 100,
    })),
    phenotypes: Object.entries(phenotypeCounts).map(([nameKey, count]) => ({
      nameKey,
      probability: (count / total) * 100,
    })),
  };
}

export function getSimpleGenotypeDescription(genotype: string, traitId: string, t: (k: string) => string): string {
  const trait = TRAITS[traitId];
  const phenotype = trait.phenotypes.find(p => p.genotypes.some(g => g.join('') === genotype));
  if (!phenotype) return genotype;

  const alleles: string[] = genotype.match(traitId === 'bloodType' ? /I[AB]|i/g : /./g) || [];
  const isHeterozygous = alleles[0] !== alleles[1];
  const phenoName = t(phenotype.nameKey);

  if (isHeterozygous) {
    // For blood type AB, it's just AB, not "carrier"
    if (traitId === 'bloodType' && genotype === 'IAIB') return phenoName;
    return `${phenoName} (${t('common.carrier')})`;
  }
  
  // For recessive phenotypes, we don't usually say "pure" in simple view unless it's dominant
  const isDominantPhenotype = trait.alleles.some(a => a.isDominant && alleles.includes(a.symbol));
  if (isDominantPhenotype) {
    return `${phenoName} (${t('common.pure')})`;
  }

  return phenoName;
}

export function inferGenotypeProbabilities(
  phenotypeKey: string, 
  traitId: string, 
  grandparents?: { p1: string; p2: string }
): Record<string, number> {
  const trait = TRAITS[traitId];
  const possibleGenotypes = trait.phenotypes.find(p => p.nameKey === phenotypeKey)?.genotypes || [];
  
  if (possibleGenotypes.length === 1) {
    return { [possibleGenotypes[0].join('')]: 1 };
  }

  // Advanced logic with grandparents
  if (grandparents && (grandparents.p1 || grandparents.p2)) {
    // If any grandparent is recessive, the parent MUST be heterozygous (if parent is dominant)
    const recessivePhenotype = trait.phenotypes.find(p => p.genotypes.length === 1 && p.genotypes[0][0] === p.genotypes[0][1] && !trait.alleles.find(a => a.symbol === p.genotypes[0][0])?.isDominant);
    
    const p1IsRecessive = grandparents.p1 === recessivePhenotype?.nameKey;
    const p2IsRecessive = grandparents.p2 === recessivePhenotype?.nameKey;

    if (p1IsRecessive || p2IsRecessive) {
      const hetero = possibleGenotypes.find(g => g[0] !== g[1]);
      if (hetero) return { [hetero.join('')]: 1 };
    }

    // If both grandparents are dominant, we use a 1:2 ratio (33% BB, 66% Bb) as a standard Mendelian assumption for a population of carriers
    const homoDom = possibleGenotypes.find(g => g[0] === g[1]);
    const hetero = possibleGenotypes.find(g => g[0] !== g[1]);
    if (homoDom && hetero) {
      return {
        [homoDom.join('')]: 0.333,
        [hetero.join('')]: 0.667
      };
    }
  }

  // Default: assume heterozygous for dominant phenotypes in School Mode or if no info
  const hetero = possibleGenotypes.find(g => g[0] !== g[1]);
  if (hetero) return { [hetero.join('')]: 1 };
  
  return { [possibleGenotypes[0].join('')]: 1 };
}
