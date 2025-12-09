
import React, { useState, useCallback, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { analyzeData, parseCSV } from './utils/dataProcessor';
import { getFinancialRecommendations } from './services/geminiService';
import type { AnalysisResult } from './types';

const App: React.FC = () => {
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [aiRecommendation, setAiRecommendation] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [showDashboard, setShowDashboard] = useState(false);

    const resetState = () => {
        setAnalysisResult(null);
        setAiRecommendation('');
        setError(null);
        setIsLoading(false);
        setFileName('');
        setShowDashboard(false);
    };

    const handleFileProcess = useCallback(async (file: File) => {
        resetState();
        if (!file) return;

        setFileName(file.name);
        setIsLoading(true);
        setError(null);

        try {
            const transactions = await parseCSV(file);
            const results = analyzeData(transactions);
            setAnalysisResult(results);
        } catch (err) {
            console.error("Processing Error:", err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred during file processing.');
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => {
        if (analysisResult) {
            const fetchRecommendation = async () => {
                try {
                    const recommendation = await getFinancialRecommendations(analysisResult);
                    setAiRecommendation(recommendation);
                } catch (err) {
                    console.error("Gemini API Error:", err);
                    setError(err instanceof Error ? err.message : 'Failed to get AI recommendations.');
                    setAiRecommendation('Gagal memuat rekomendasi dari AI. Silakan coba lagi.');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchRecommendation();
            const timer = setTimeout(() => setShowDashboard(true), 100);
            return () => clearTimeout(timer);
        }
    }, [analysisResult]);

    return (
        <div className="relative min-h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-x-hidden">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_50%_200px,#38bdf811,transparent)] -z-10" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <header className="text-center mb-8 md:mb-12">
                     <div className="flex items-center justify-center gap-4">
                        <svg className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 7L12 12M12 12L22 7M12 12V22M17 4.5L7 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            ERP Cash Flow <span className="text-cyan-400">Analysis</span>
                        </h1>
                    </div>
                    <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                        Unggah data transaksi Anda untuk mendapatkan analisis arus kas mendalam dan rekomendasi keuangan dari AI.
                    </p>
                </header>

                <main>
                    <div className="max-w-2xl mx-auto mb-8">
                        <FileUpload onFileSelect={handleFileProcess} disabled={isLoading} />
                    </div>

                    {error && (
                        <div className="max-w-4xl mx-auto bg-red-900/50 border border-red-600 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
                    <div className={`transition-opacity duration-1000 ease-in-out ${showDashboard ? 'opacity-100' : 'opacity-0'}`}>
                        {analysisResult && (
                            <Dashboard 
                                analysisResult={analysisResult}
                                aiRecommendation={aiRecommendation}
                                isLoadingAi={isLoading && !aiRecommendation}
                                fileName={fileName}
                            />
                        )}
                    </div>

                    {!isLoading && !analysisResult && !error && <WelcomeMessage />}
                </main>
            </div>
        </div>
    );
};

const WelcomeMessage: React.FC = () => (
    <div className="text-center mt-16 p-8 bg-slate-800/30 backdrop-blur-sm rounded-xl max-w-3xl mx-auto border border-slate-700/50">
         <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-white">Selamat Datang di Modul Analisis Arus Kas</h2>
        <p className="mt-2 text-slate-400">
            Mulai dengan mengunggah file CSV transaksi keuangan Anda untuk visualisasi data dan wawasan yang didukung AI.
        </p>
    </div>
);


export default App;
