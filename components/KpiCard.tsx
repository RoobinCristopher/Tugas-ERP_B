
import React from 'react';

interface KpiCardProps {
    title: string;
    value: number;
    type: 'income' | 'expense' | 'balance';
}

const ICONS = {
    income: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
           <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
    ),
    expense: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
        </svg>
    ),
    balance: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
    ),
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, type }) => {
    const valueColor = type === 'balance' ? (value >= 0 ? 'text-green-400' : 'text-red-400') : 'text-white';
    
    const iconBgColor = 
        type === 'income' ? 'bg-green-500/10' :
        type === 'expense' ? 'bg-red-500/10' : 'bg-cyan-500/10';

    return (
        <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 flex items-start space-x-4 transition-all duration-300 ease-in-out hover:bg-slate-800/50 hover:border-cyan-400/50 hover:scale-105">
            <div className={`flex-shrink-0 p-3 rounded-full ${iconBgColor}`}>
                {ICONS[type]}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-400">{title}</p>
                <p className={`text-3xl font-bold tracking-tight ${valueColor}`}>{formatCurrency(value)}</p>
            </div>
        </div>
    );
};
