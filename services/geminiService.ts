
import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult } from '../types';

const formatDataForPrompt = (analysisResult: AnalysisResult): string => {
    const summary = {
        totalPenerimaan: analysisResult.totalPenerimaan,
        totalPengeluaran: analysisResult.totalPengeluaran,
        saldoAkhir: analysisResult.saldoAkhir,
        ringkasanBulanan: analysisResult.monthlySummaries.map(s => ({
            bulan: s.month,
            penerimaan: s.Penerimaan,
            pengeluaran: s.Pengeluaran,
            arusKasBersih: s['Arus Kas Bersih'],
        })),
    };
    return JSON.stringify(summary, null, 2);
}

export const getFinancialRecommendations = async (analysisResult: AnalysisResult): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const dataSummary = formatDataForPrompt(analysisResult);

    const prompt = `
        Anda adalah sistem ERP modul Cash Management dengan kemampuan analisis keuangan yang canggih.
        Analisis data transaksi berikut:

        ${dataSummary}

        Berdasarkan data ringkasan ini, berikan laporan dan rekomendasi manajemen keuangan yang mendalam.
        Fokus pada poin-poin berikut:

        1.  **Analisis Tren Arus Kas:** Jelaskan tren umum dari penerimaan, pengeluaran, dan arus kas bersih selama periode tersebut.
        2.  **Identifikasi Bulan Kritis:** Tunjuk bulan-bulan dengan pengeluaran tertinggi atau arus kas bersih negatif. Berikan kemungkinan penyebab dan sarankan tindakan mitigasi.
        3.  **Pola Pengeluaran:** Analisis pola pengeluaran. Apakah ada kategori pengeluaran yang dominan atau tidak terduga?
        4.  **Rekomendasi Strategis:** Berikan 3-5 rekomendasi konkret dan dapat ditindaklanjuti untuk meningkatkan kesehatan keuangan, seperti optimalisasi biaya, manajemen piutang, atau strategi investasi kas berlebih.

        Sajikan jawaban Anda dalam format markdown yang terstruktur dengan baik, menggunakan heading, list, dan tebal untuk keterbacaan yang maksimal. Gunakan bahasa Indonesia.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate content from Gemini API.");
    }
};
