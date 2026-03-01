import React, { useState } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Calculator } from './pages/Calculator';
import { Learn } from './pages/Learn';
import { About } from './pages/About';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const { t } = useLanguage();

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home onStart={() => setActivePage('calculator')} />;
      case 'calculator':
        return <Calculator />;
      case 'learn':
        return <Learn />;
      case 'about':
        return <About />;
      default:
        return <Home onStart={() => setActivePage('calculator')} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header activePage={activePage} setActivePage={setActivePage} />
      
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-slate-50 border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white">
                <span className="text-xs font-bold">B</span>
              </div>
              <span className="text-lg font-bold text-slate-900">Biocipher</span>
            </div>
            
            <div className="flex gap-8 text-sm text-slate-500">
              <button onClick={() => setActivePage('home')} className="hover:text-indigo-600 transition-colors">{t('common.home')}</button>
              <button onClick={() => setActivePage('calculator')} className="hover:text-indigo-600 transition-colors">{t('common.calculator')}</button>
              <button onClick={() => setActivePage('learn')} className="hover:text-indigo-600 transition-colors">{t('common.learn')}</button>
              <button onClick={() => setActivePage('about')} className="hover:text-indigo-600 transition-colors">{t('common.about')}</button>
            </div>

            <div className="text-sm text-slate-400">
              © 2026 Biocipher Educational Platform. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
