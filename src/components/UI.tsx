import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden",
        className
      )}
    >
      {title && (
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <div>
            <h3 className="text-[10px] font-black text-slate-900 tracking-[0.2em]">{title}</h3>
            {subtitle && <p className="text-[8px] text-slate-400 tracking-widest mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-slate-200" />
            <div className="w-1 h-1 rounded-full bg-slate-200" />
          </div>
        </div>
      )}
      <div className="p-5">{children}</div>
    </motion.div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = ({ 
  children, 
  className, 
  variant = 'primary',
  ...props 
}) => {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200",
    outline: "bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none",
  };

  return (
    <button
      className={cn(
        "px-5 py-2.5 rounded-lg font-bold text-xs tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-sm",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const SectionHeading: React.FC<{ title: string; subtitle?: string; centered?: boolean }> = ({ title, subtitle, centered }) => (
  <div className={cn("mb-12", centered && "text-center")}>
    <h2 className="text-3xl font-black text-slate-900 tracking-tighter sm:text-4xl mb-4">{title}</h2>
    {subtitle && <p className="text-sm text-slate-500 max-w-2xl mx-auto font-medium tracking-widest leading-relaxed">{subtitle}</p>}
    <div className={cn("h-1 w-12 bg-indigo-600 mt-6", centered && "mx-auto")} />
  </div>
);
