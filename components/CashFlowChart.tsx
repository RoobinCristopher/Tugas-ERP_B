
import React from 'react';
import type { MonthlySummary } from '../types';

interface CashFlowChartProps {
    data: MonthlySummary[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg border border-slate-600 shadow-lg">
        <p className="font-bold text-white">{label}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.color || pld.fill }}>
            {`${pld.name}: ${formatCurrency(pld.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};


export const CashFlowChart: React.FC<CashFlowChartProps> = ({ data }) => {
    const Recharts = (window as any).Recharts;

    if (!Recharts) {
        return (
            <div style={{ width: '100%', height: 300 }} className="flex items-center justify-center text-slate-400">
                Memuat Grafik...
            </div>
        );
    }
    
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } = Recharts;

    return (
        <div style={{ width: '100%', height: 300 }}>
             <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorPenerimaan" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.2}/>
                        </linearGradient>
                        <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.2}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#47556930" />
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8' }} fontSize={12} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8' }} fontSize={12} axisLine={false} tickLine={false} tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value as number)} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(71, 85, 105, 0.3)'}} />
                    <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                    <Bar dataKey="Penerimaan" fill="url(#colorPenerimaan)" stroke="#2dd4bf" />
                    <Bar dataKey="Pengeluaran" fill="url(#colorPengeluaran)" stroke="#f43f5e" />
                    <Bar dataKey="Arus Kas Bersih">
                        {
                            data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry['Arus Kas Bersih'] >= 0 ? '#38bdf8' : '#fb7185'} />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
