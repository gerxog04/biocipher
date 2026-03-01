import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Microscope, GraduationCap, ShieldCheck } from 'lucide-react';
import { Button, SectionHeading } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';

interface HomeProps {
  onStart: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStart }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(79,70,229,0.05)_0%,transparent_100%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-full">
              {t('home.simulatorTag')}
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
              {t('hero.title').split(' ').map((word, i) => (
                <span key={i} className={word.toLowerCase() === 'probability' || word.toLowerCase() === 'вероятность' || word.toLowerCase() === 'verovatnoću' || word.toLowerCase() === 'вероватноћу' ? 'text-indigo-600' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                variant="primary" 
                className="px-8 py-4 text-lg flex items-center gap-2 group"
                onClick={onStart}
              >
                {t('common.openCalculator')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="px-8 py-4 text-lg">
                {t('home.viewDocs')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title={t('home.precisionTitle')} 
          subtitle={t('home.precisionSubtitle')}
          centered
        />
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: t('home.mendelianLaws'),
              desc: t('home.mendelianLawsDesc'),
              icon: Microscope,
              color: "bg-blue-50 text-blue-600"
            },
            {
              title: t('home.educationalFocus'),
              desc: t('home.educationalFocusDesc'),
              icon: GraduationCap,
              color: "bg-indigo-50 text-indigo-600"
            },
            {
              title: t('home.trustworthyData'),
              desc: t('home.trustworthyDataDesc'),
              icon: ShieldCheck,
              color: "bg-emerald-50 text-emerald-600"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 rounded-[3rem] mx-4 sm:mx-8 lg:mx-12 py-20 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">{t('home.whyUse')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: t('home.accuracy'), value: "100%" },
              { label: t('home.traits'), value: "3+" },
              { label: t('home.modes'), value: "2" },
              { label: t('home.logic'), value: "Pure Math" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-bold text-indigo-400 mb-2">{stat.value}</div>
                <div className="text-slate-400 text-sm tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
