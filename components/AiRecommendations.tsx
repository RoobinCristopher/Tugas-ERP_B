
import React from 'react';

interface AiRecommendationsProps {
    recommendation: string;
    isLoading: boolean;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3"></div>
        <div className="h-4 bg-slate-700 rounded w-3/4 mt-4"></div>
        <div className="h-4 bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        <div className="h-6 bg-slate-700 rounded w-1/2 mt-8"></div>
        <div className="h-4 bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-700 rounded w-4/5"></div>
        <div className="h-4 bg-slate-700 rounded"></div>
    </div>
);

const MarkdownRenderer = ({ text }: { text: string }) => {
    const lines = text.split('\n');
    return (
        <div className="text-slate-300 space-y-4 leading-relaxed">
            {lines.map((line, i) => {
                if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-xl font-bold text-white mt-6 mb-2 border-b border-slate-700 pb-2">{line.substring(3)}</h2>;
                }
                 if (line.match(/^\d+\.\s/)) {
                     const content = line.substring(line.indexOf('.') + 1).trim();
                     const parts = content.split('**');
                     return (
                        <div key={i} className="flex items-start">
                            <span className="text-cyan-400 font-semibold mr-3">{line.substring(0, line.indexOf('.') + 1)}</span>
                            <p>
                                {parts.map((part, index) => 
                                    index % 2 === 1 ? <strong key={index} className="font-semibold text-slate-100">{part}</strong> : <span>{part}</span>
                                )}
                            </p>
                        </div>
                     );
                }
                if (line.startsWith('* ')) {
                     return <div key={i} className="flex items-start"><span className="text-cyan-400 mt-1 mr-3">&#8226;</span><p>{line.substring(2)}</p></div>;
                }
                if (line.trim() === '') {
                    return null;
                }
                const parts = line.split('**');
                return (
                    <p key={i}>
                        {parts.map((part, index) => 
                            index % 2 === 1 ? <strong key={index} className="font-semibold text-slate-100">{part}</strong> : <span>{part}</span>
                        )}
                    </p>
                );
            })}
        </div>
    );
};


export const AiRecommendations: React.FC<AiRecommendationsProps> = ({ recommendation, isLoading }) => {
    return (
        <div>
            <div className="flex items-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-xl font-semibold text-white">Rekomendasi Keuangan Berbasis AI</h3>
            </div>
            <div className="pl-0 sm:pl-11 border-l-2 border-slate-700/50 ml-4 sm:ml-0">
                <div className="pl-4 sm:pl-0">
                    {isLoading ? <LoadingSkeleton /> : <MarkdownRenderer text={recommendation} />}
                </div>
            </div>
        </div>
    );
};
