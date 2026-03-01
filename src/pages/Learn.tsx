import React from 'react';
import { motion } from 'motion/react';
import { SectionHeading, Card } from '../components/UI';
import { BookOpen, Dna, Layers, Lightbulb, Microscope, GraduationCap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Learn: React.FC = () => {
  const { t } = useLanguage();

  const sections = [
    {
      title: t('learn.mendel1Title'),
      content: t('learn.mendel1Content'),
      icon: Dna,
    },
    {
      title: t('learn.mendel2Title'),
      content: t('learn.mendel2Content'),
      icon: Layers,
    },
    {
      title: t('learn.genotypePhenotypeTitle'),
      content: t('learn.genotypePhenotypeContent'),
      icon: Lightbulb,
    },
    {
      title: t('learn.dominantRecessiveTitle'),
      content: t('learn.dominantRecessiveContent'),
      icon: Microscope,
    },
    {
      title: t('learn.polygenicTitle'),
      content: t('learn.polygenicContent'),
      icon: BookOpen,
    }
  ];

  const articles = [
    {
      title: t('learn.article1Title'),
      excerpt: t('learn.article1Excerpt'),
      tag: t('learn.article1Tag')
    },
    {
      title: t('learn.article2Title'),
      excerpt: t('learn.article2Excerpt'),
      tag: t('learn.article2Tag')
    },
    {
      title: t('learn.article3Title'),
      excerpt: t('learn.article3Excerpt'),
      tag: t('learn.article3Tag')
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-20 space-y-24">
      <SectionHeading 
        title={t('common.learn')} 
        subtitle={t('learn.subtitle')}
        centered
      />

      <div className="grid gap-12">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            <div className="w-16 h-16 shrink-0 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <section.icon size={32} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">{section.title}</h3>
              <p className="text-lg text-slate-600 leading-relaxed">{section.content}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-12">
        <SectionHeading title={t('learn.articlesTitle')} subtitle={t('learn.articlesSubtitle')} />
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <Card key={i} className="group cursor-pointer hover:border-indigo-200 transition-colors">
              <span className="text-[10px] font-bold text-indigo-600 tracking-widest mb-4 block">{article.tag}</span>
              <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{article.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{article.excerpt}</p>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                {t('learn.readArticle')} <GraduationCap size={16} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-24">
        <Card className="bg-indigo-600 text-white border-none p-12 text-center">
          <h3 className="text-3xl font-bold mb-6">{t('learn.readyToTest')}</h3>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            {t('learn.readyToTestDesc')}
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors"
          >
            {t('common.startCalculation')}
          </button>
        </Card>
      </div>
    </div>
  );
};
