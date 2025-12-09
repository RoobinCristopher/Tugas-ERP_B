
import React from 'react';
import type { MonthlySummary } from '../types';

interface MonthlySummaryTableProps {
    data: MonthlySummary[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const MonthlySummaryTable: React.FC<MonthlySummaryTableProps> = ({ data }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-400">
                <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
                    <tr>
                        <th scope="col" className="px-4 py-3">Bulan</th>
                        <th scope="col" className="px-4 py-3 text-right">Penerimaan</th>
                        <th scope="col" className="px-4 py-3 text-right">Pengeluaran</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index} className="border-b border-slate-700/50 odd:bg-slate-800/30 even:bg-slate-800/10 hover:bg-slate-700/40">
                            <th scope="row" className="px-4 py-3 font-medium text-white whitespace-nowrap">
                                {row.month}
                            </th>
                            <td className="px-4 py-3 text-right text-green-400 font-mono">{formatCurrency(row.Penerimaan)}</td>
                            <td className="px-4 py-3 text-right text-red-400 font-mono">{formatCurrency(row.Pengeluaran)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
