
import React from 'react';
import type { AnalysisResult } from '../types';
import { KpiCard } from './KpiCard';
import { CashFlowChart } from './CashFlowChart';
import { MonthlySummaryTable } from './MonthlySummaryTable';
import { AiRecommendations } from './AiRecommendations';

interface DashboardProps {
    analysisResult: AnalysisResult;
    aiRecommendation: string;
    isLoadingAi: boolean;
    fileName: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ analysisResult, aiRecommendation, isLoadingAi, fileName }) => {
    const { totalPenerimaan, totalPengeluaran, saldoAkhir, monthlySummaries } = analysisResult;

    return (
        <div className="space-y-8 mt-8">
            <h2 className="text-2xl font-semibold text-white text-center">
                Hasil Analisis untuk <span className="text-cyan-400 font-mono">{fileName}</span>
            </h2>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Total Penerimaan" value={totalPenerimaan} type="income" />
                <KpiCard title="Total Pengeluaran" value={totalPengeluaran} type="expense" />
                <KpiCard title="Saldo Akhir" value={saldoAkhir} type="balance" />
            </div>

            {/* Chart and Table */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-slate-800/30 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-slate-700/50">
                    <h3 className="text-xl font-semibold mb-4 text-white">Tren Arus Kas Bulanan</h3>
                    <CashFlowChart data={monthlySummaries} />
                </div>
                <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-slate-700/50">
                    <h3 className="text-xl font-semibold mb-4 text-white">Ringkasan Bulanan</h3>
                    <MonthlySummaryTable data={monthlySummaries} />
                </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-slate-800/30 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-slate-700/50">
                <AiRecommendations recommendation={aiRecommendation} isLoading={isLoadingAi} />
            </div>
        </div>
    );
};
