import React from 'react';
import { SectionHeading, Card } from '../components/UI';
import { Shield, Users, Globe, Mail, Info, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4 py-20 space-y-24">
      <SectionHeading 
        title={t('common.about')} 
        subtitle="A platform dedicated to scientific transparency and genetic education."
        centered
      />

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-slate-900">{t('about.missionTitle')}</h3>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t('about.missionContent')}
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t('about.missionContent2')}
          </p>
          <div className="flex gap-4 pt-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <BookOpen size={20} />
              <span>{t('about.academicStandard')}</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Shield size={20} />
              <span>{t('about.privacyFirst')}</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50" />
          <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-xl">
            <Info className="text-indigo-600" size={24} />
            {t('about.disclaimerTitle')}
          </h4>
          <p className="text-slate-600 leading-relaxed mb-6">
            {t('about.disclaimerContent')}
          </p>
          <p className="text-slate-600 leading-relaxed">
            {t('about.disclaimerContent2')}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Users, title: t('about.communityDriven'), desc: t('about.communityDrivenDesc') },
          { icon: Globe, title: t('about.openScience'), desc: t('about.openScienceDesc') },
          { icon: Mail, title: t('about.contactUs'), desc: t('about.contactUsDesc') }
        ].map((item, i) => (
          <Card key={i} className="text-center p-8 hover:border-indigo-200 transition-colors">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <item.icon size={28} />
            </div>
            <h4 className="font-bold text-slate-900 mb-3 text-lg">{item.title}</h4>
            <p className="text-slate-600 leading-relaxed">{item.desc}</p>
          </Card>
        ))}
      </div>

      <div className="pt-12 border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>{t('about.copyright')}</p>
        <p className="mt-2">{t('about.version')}</p>
      </div>
    </div>
  );
};
