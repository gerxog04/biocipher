import React from 'react';
import { Dna, Calculator, BookOpen, Info, Menu, X, Globe } from 'lucide-react';
import { Button } from './UI';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/translations';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activePage, setActivePage }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('common.home'), icon: Dna },
    { id: 'calculator', label: t('common.calculator'), icon: Calculator },
    { id: 'learn', label: t('common.learn'), icon: BookOpen },
    { id: 'about', label: t('common.about'), icon: Info },
  ];

  const languages: { id: Language; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'ru', label: 'Русский' },
    { id: 'sr-Latn', label: 'Srpski (Latinica)' },
    { id: 'sr-Cyrl', label: 'Српски (Ћирилица)' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setActivePage('home')}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
              <Dna size={20} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Biocipher</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`text-sm font-medium transition-colors ${
                  activePage === item.id ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <Globe size={18} />
                {languages.find(l => l.id === language)?.label}
              </button>
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => {
                          setLanguage(lang.id);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                          language === lang.id ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button 
              variant="primary" 
              className="text-sm px-6"
              onClick={() => setActivePage('calculator')}
            >
              {t('common.startCalculation')}
            </Button>
          </nav>

          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-xl text-base font-medium ${
                    activePage === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 tracking-wider mb-2 px-4">Language</p>
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setLanguage(lang.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm rounded-xl ${
                      language === lang.id ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-600'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => {
                    setActivePage('calculator');
                    setIsMenuOpen(false);
                  }}
                >
                  {t('common.startCalculation')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
