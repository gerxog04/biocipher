import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from '../context/LanguageContext';

interface ProbabilityChartProps {
  data: { nameKey?: string; name?: string; probability: number }[];
  title: string;
}

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ data, title }) => {
  const { t } = useLanguage();

  return (
    <div className="h-64 w-full">
      <h4 className="text-sm font-semibold text-slate-500 mb-4 tracking-wider">{title}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey={(d) => d.nameKey ? t(d.nameKey) : d.name} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
            unit="%"
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
            labelFormatter={(label) => label}
          />
          <Bar dataKey="probability" radius={[4, 4, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PunnettSquareProps {
  p1Genotype: string[];
  p2Genotype: string[];
  results: string[][];
}

export const PunnettSquare: React.FC<PunnettSquareProps> = ({ p1Genotype, p2Genotype, results }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-2">
        {/* Top Left Empty */}
        <div className="aspect-square"></div>
        
        {/* Parent 2 Alleles (Top) */}
        {p2Genotype.map((allele, i) => (
          <div key={i} className="aspect-square flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-100 font-bold text-indigo-700 text-xl">
            {allele}
          </div>
        ))}

        {/* Parent 1 Allele 1 + Row */}
        <div className="aspect-square flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-100 font-bold text-indigo-700 text-xl">
          {p1Genotype[0]}
        </div>
        <div className="aspect-square flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-slate-900 text-xl shadow-sm">
          {results[0].join('')}
        </div>
        <div className="aspect-square flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-slate-900 text-xl shadow-sm">
          {results[1].join('')}
        </div>

        {/* Parent 1 Allele 2 + Row */}
        <div className="aspect-square flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-100 font-bold text-indigo-700 text-xl">
          {p1Genotype[1]}
        </div>
        <div className="aspect-square flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-slate-900 text-xl shadow-sm">
          {results[2].join('')}
        </div>
        <div className="aspect-square flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-slate-900 text-xl shadow-sm">
          {results[3].join('')}
        </div>
      </div>
    </div>
  );
};
