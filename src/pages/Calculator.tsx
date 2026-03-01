import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeading, Card, Button } from '../components/UI';
import { TRAITS, calculatePunnettSquare, getProbabilities, inferGenotypeProbabilities, getSimpleGenotypeDescription } from '../utils/genetics';
import { PunnettSquare, ProbabilityChart } from '../components/GeneticsUI';
import { Info, ChevronDown, ChevronUp, AlertCircle, Settings2, GraduationCap, Users, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Calculator: React.FC = () => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'school' | 'advanced'>('school');
  const [viewMode, setViewMode] = useState<'simple' | 'scientific'>('simple');
  const [selectedTrait, setSelectedTrait] = useState('eyeColor');
  
  // School Mode State
  const [p1Phenotype, setP1Phenotype] = useState('');
  const [p2Phenotype, setP2Phenotype] = useState('');

  // Advanced Mode State
  const [p1Genotype, setP1Genotype] = useState('');
  const [p2Genotype, setP2Genotype] = useState('');
  const [showMath, setShowMath] = useState(false);

  // Grandparents State
  const [grandparents, setGrandparents] = useState({
    maternalGM: '',
    maternalGF: '',
    paternalGM: '',
    paternalGF: ''
  });

  const trait = TRAITS[selectedTrait];

  const results = useMemo(() => {
    let g1Probs: Record<string, number> = {};
    let g2Probs: Record<string, number> = {};

    if (mode === 'school') {
      if (!p1Phenotype || !p2Phenotype) return null;
      g1Probs = inferGenotypeProbabilities(p1Phenotype, selectedTrait);
      g2Probs = inferGenotypeProbabilities(p2Phenotype, selectedTrait);
    } else {
      // In advanced mode, if genotypes are explicitly selected, use them
      if (p1Genotype && p2Genotype) {
        g1Probs = { [p1Genotype]: 1 };
        g2Probs = { [p2Genotype]: 1 };
      } else if (p1Phenotype && p2Phenotype) {
        // If grandparents are provided, use conditional probability
        g1Probs = inferGenotypeProbabilities(p1Phenotype, selectedTrait, { p1: grandparents.maternalGM, p2: grandparents.maternalGF });
        g2Probs = inferGenotypeProbabilities(p2Phenotype, selectedTrait, { p1: grandparents.paternalGM, p2: grandparents.paternalGF });
      } else {
        return null;
      }
    }

    // Calculate weighted average of Punnett squares if multiple parent genotypes are possible
    const childGenotypeProbs: Record<string, number> = {};
    const childPhenotypeProbs: Record<string, number> = {};
    let totalCombinations = 0;

    Object.entries(g1Probs).forEach(([g1Str, p1Prob]) => {
      Object.entries(g2Probs).forEach(([g2Str, p2Prob]) => {
        const alleles1 = g1Str.match(selectedTrait === 'bloodType' ? /I[AB]|i/g : /./g) || [];
        const alleles2 = g2Str.match(selectedTrait === 'bloodType' ? /I[AB]|i/g : /./g) || [];
        const punnett = calculatePunnettSquare(alleles1, alleles2);
        const outcomes = getProbabilities(punnett, selectedTrait);
        const weight = p1Prob * p2Prob;

        outcomes.genotypes.forEach(out => {
          childGenotypeProbs[out.name] = (childGenotypeProbs[out.name] || 0) + (out.probability * weight);
        });
        outcomes.phenotypes.forEach(out => {
          childPhenotypeProbs[out.nameKey] = (childPhenotypeProbs[out.nameKey] || 0) + (out.probability * weight);
        });
      });
    });

    // For visualization, we pick the most likely parent genotypes
    const bestG1 = Object.entries(g1Probs).sort((a, b) => b[1] - a[1])[0][0];
    const bestG2 = Object.entries(g2Probs).sort((a, b) => b[1] - a[1])[0][0];
    const alleles1 = bestG1.match(selectedTrait === 'bloodType' ? /I[AB]|i/g : /./g) || [];
    const alleles2 = bestG2.match(selectedTrait === 'bloodType' ? /I[AB]|i/g : /./g) || [];
    const punnett = calculatePunnettSquare(alleles1, alleles2);

    return { 
      g1: alleles1, 
      g2: alleles2, 
      punnett, 
      g1Probs,
      g2Probs,
      probs: {
        genotypes: Object.entries(childGenotypeProbs).map(([name, probability]) => ({ name, probability })),
        phenotypes: Object.entries(childPhenotypeProbs).map(([nameKey, probability]) => ({ nameKey, probability }))
      }
    };
  }, [mode, selectedTrait, p1Phenotype, p2Phenotype, p1Genotype, p2Genotype, grandparents]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <SectionHeading 
        title={t('hero.title')} 
        subtitle={t('hero.subtitle')}
        centered
      />

      {/* Toggles */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center">
          <button
            onClick={() => setMode('school')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              mode === 'school' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <GraduationCap size={18} />
            {t('common.schoolMode')}
          </button>
          <button
            onClick={() => setMode('advanced')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              mode === 'advanced' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Settings2 size={18} />
            {t('common.advancedMode')}
          </button>
        </div>

        <div className="bg-slate-100 p-1 rounded-2xl flex items-center">
          <button
            onClick={() => setViewMode('simple')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              viewMode === 'simple' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Eye size={18} />
            {t('common.simpleView')}
          </button>
          <button
            onClick={() => setViewMode('scientific')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              viewMode === 'scientific' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <EyeOff size={18} />
            {t('common.scientificView')}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <Card title={t('common.calculator')}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('traits.eyeColor')}</label>
                <select 
                  value={selectedTrait}
                  onChange={(e) => {
                    setSelectedTrait(e.target.value);
                    setP1Phenotype('');
                    setP2Phenotype('');
                    setP1Genotype('');
                    setP2Genotype('');
                    setGrandparents({ maternalGM: '', maternalGF: '', paternalGM: '', paternalGF: '' });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {Object.values(TRAITS).map(t_def => (
                    <option key={t_def.id} value={t_def.id}>{t(t_def.nameKey)}</option>
                  ))}
                </select>
              </div>

              {/* Mother Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                  {t('common.mother')}
                </h4>
                
                {mode === 'advanced' && viewMode === 'scientific' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{t('common.genotype')}</label>
                    <select 
                      value={p1Genotype}
                      onChange={(e) => setP1Genotype(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 font-mono"
                    >
                      <option value="">Select...</option>
                      {trait.phenotypes.flatMap(p => p.genotypes).map(g => (
                        <option key={g.join('')} value={g.join('')}>{g.join('')}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{t('common.phenotype')}</label>
                    <select 
                      value={p1Phenotype}
                      onChange={(e) => setP1Phenotype(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900"
                    >
                      <option value="">Select...</option>
                      {trait.phenotypes.map(p => (
                        <option key={p.nameKey} value={p.nameKey}>{t(p.nameKey)}</option>
                      ))}
                    </select>
                  </div>
                )}

                {mode === 'advanced' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">{t('common.maternalGrandmother')}</label>
                      <select 
                        value={grandparents.maternalGM}
                        onChange={(e) => setGrandparents(prev => ({ ...prev, maternalGM: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900"
                      >
                        <option value="">Unknown</option>
                        {trait.phenotypes.map(p => (
                          <option key={p.nameKey} value={p.nameKey}>{t(p.nameKey)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">{t('common.maternalGrandfather')}</label>
                      <select 
                        value={grandparents.maternalGF}
                        onChange={(e) => setGrandparents(prev => ({ ...prev, maternalGF: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900"
                      >
                        <option value="">Unknown</option>
                        {trait.phenotypes.map(p => (
                          <option key={p.nameKey} value={p.nameKey}>{t(p.nameKey)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Father Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  {t('common.father')}
                </h4>
                
                {mode === 'advanced' && viewMode === 'scientific' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{t('common.genotype')}</label>
                    <select 
                      value={p2Genotype}
                      onChange={(e) => setP2Genotype(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 font-mono"
                    >
                      <option value="">Select...</option>
                      {trait.phenotypes.flatMap(p => p.genotypes).map(g => (
                        <option key={g.join('')} value={g.join('')}>{g.join('')}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{t('common.phenotype')}</label>
                    <select 
                      value={p2Phenotype}
                      onChange={(e) => setP2Phenotype(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900"
                    >
                      <option value="">Select...</option>
                      {trait.phenotypes.map(p => (
                        <option key={p.nameKey} value={p.nameKey}>{t(p.nameKey)}</option>
                      ))}
                    </select>
                  </div>
                )}

                {mode === 'advanced' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">{t('common.paternalGrandmother')}</label>
                      <select 
                        value={grandparents.paternalGM}
                        onChange={(e) => setGrandparents(prev => ({ ...prev, paternalGM: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900"
                      >
                        <option value="">Unknown</option>
                        {trait.phenotypes.map(p => (
                          <option key={p.nameKey} value={p.nameKey}>{t(p.nameKey)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">{t('common.paternalGrandfather')}</label>
                      <select 
                        value={grandparents.paternalGF}
                        onChange={(e) => setGrandparents(prev => ({ ...prev, paternalGF: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900"
                      >
                        <option value="">Unknown</option>
                        {trait.phenotypes.map(p => (
                          <option key={p.nameKey} value={p.nameKey}>{t(p.nameKey)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex gap-4">
            <AlertCircle className="text-amber-600 shrink-0" size={20} />
            <p className="text-xs text-amber-800 leading-relaxed">
              {t('common.disclaimer')}
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {results ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <Card title={t('common.punnettSquare')}>
                    <PunnettSquare 
                      p1Genotype={results.g1} 
                      p2Genotype={results.g2} 
                      results={results.punnett} 
                    />
                  </Card>
                  <Card title={t('common.probabilities')}>
                    <ProbabilityChart 
                      data={results.probs.phenotypes} 
                      title={t('common.results')} 
                    />
                  </Card>
                </div>

                {/* Possible Parent Genotypes (Advanced Mode) */}
                {mode === 'advanced' && (
                  <Card title="Inferred Parent Genotypes">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <h5 className="text-xs font-bold text-slate-400">{t('common.mother')}</h5>
                        {Object.entries(results.g1Probs).map(([g, prob]) => (
                          <div key={g} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="font-mono font-bold text-slate-900">{viewMode === 'scientific' ? g : getSimpleGenotypeDescription(g, selectedTrait, t)}</span>
                            <span className="text-xs font-bold text-indigo-600">{(Number(prob) * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <h5 className="text-xs font-bold text-slate-400">{t('common.father')}</h5>
                        {Object.entries(results.g2Probs).map(([g, prob]) => (
                          <div key={g} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="font-mono font-bold text-slate-900">{viewMode === 'scientific' ? g : getSimpleGenotypeDescription(g, selectedTrait, t)}</span>
                            <span className="text-xs font-bold text-indigo-600">{(Number(prob) * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}

                <Card title={t('common.genotype')}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {results.probs.genotypes.map((g, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <div className="text-sm font-mono font-bold text-slate-900 mb-1">
                          {viewMode === 'scientific' ? g.name : getSimpleGenotypeDescription(g.name, selectedTrait, t)}
                        </div>
                        <div className="text-xs text-indigo-600 font-bold">{g.probability.toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="space-y-4">
                  <button 
                    onClick={() => setShowMath(!showMath)}
                    className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold text-sm transition-colors"
                  >
                    {showMath ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    {showMath ? t('common.hideMath') : t('common.showMath')}
                  </button>
                  
                  <AnimatePresence>
                    {showMath && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <Card className="bg-slate-50 border-slate-200">
                          <div className="prose prose-slate prose-sm max-w-none">
                            <h4 className="text-slate-900 font-bold mb-4">Calculation Logic</h4>
                            <ol className="list-decimal list-inside space-y-3 text-slate-600">
                              <li>
                                <strong>Gamete Generation:</strong> Alleles are segregated according to Mendel's First Law.
                              </li>
                              <li>
                                <strong>Punnett Square Analysis:</strong> All possible combinations of maternal and paternal gametes are evaluated.
                              </li>
                              {mode === 'advanced' && (
                                <li>
                                  <strong>Conditional Probability:</strong> If grandparents are provided, the likelihood of a parent being a carrier (heterozygous) is adjusted. For example, if a parent has a dominant phenotype but one of their parents is recessive, the probability of being a carrier becomes 100%.
                                </li>
                              )}
                              <li>
                                <strong>Probability Normalization:</strong> Final percentages are calculated by weighting each possible parental genotype combination by its probability.
                              </li>
                            </ol>
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-6">
                  <Info size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t('common.awaitingInput')}</h3>
                <p className="text-slate-500 max-w-sm">
                  {t('common.awaitingInputDesc')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
