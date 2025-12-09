
import type { Transaction, MonthlySummary, AnalysisResult } from './types';

declare const Papa: any;

export const parseCSV = (file: File): Promise<Transaction[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results: any) => {
                if (results.errors.length) {
                    reject(new Error(`CSV Parsing Error: ${results.errors[0].message}`));
                    return;
                }
                try {
                    const transactions: Transaction[] = results.data.map((row: any) => {
                        const jumlah = parseFloat(row['Jumlah (Rp)'].replace(/\./g, ''));
                        if (isNaN(jumlah)) {
                            throw new Error(`Invalid number format for 'Jumlah (Rp)' in row: ${JSON.stringify(row)}`);
                        }
                        return {
                            tanggalTransaksi: new Date(row['Tanggal Transaksi']),
                            kodeTransaksi: row['Kode Transaksi'],
                            jenisTransaksi: row['Jenis Transaksi'] as 'Penerimaan' | 'Pengeluaran',
                            kategori: row['Kategori'],
                            deskripsi: row['Deskripsi'],
                            jumlah: jumlah,
                            metodePembayaran: row['Metode Pembayaran'],
                        };
                    });
                    resolve(transactions);
                } catch (e) {
                    reject(e);
                }
            },
            error: (error: Error) => {
                reject(error);
            },
        });
    });
};

export const analyzeData = (transactions: Transaction[]): AnalysisResult => {
    let totalPenerimaan = 0;
    let totalPengeluaran = 0;
    const monthlyData: { [key: string]: { penerimaan: number; pengeluaran: number } } = {};

    transactions.forEach(tx => {
        if (tx.jenisTransaksi === 'Penerimaan') {
            totalPenerimaan += tx.jumlah;
        } else {
            totalPengeluaran += tx.jumlah;
        }

        const month = tx.tanggalTransaksi.toLocaleString('id-ID', { year: 'numeric', month: 'short' });
        if (!monthlyData[month]) {
            monthlyData[month] = { penerimaan: 0, pengeluaran: 0 };
        }
        if (tx.jenisTransaksi === 'Penerimaan') {
            monthlyData[month].penerimaan += tx.jumlah;
        } else {
            monthlyData[month].pengeluaran += tx.jumlah;
        }
    });

    const monthlySummaries: MonthlySummary[] = Object.entries(monthlyData)
        .map(([month, data]) => ({
            month,
            'Penerimaan': data.penerimaan,
            'Pengeluaran': data.pengeluaran,
            'Arus Kas Bersih': data.penerimaan - data.pengeluaran,
        }))
        .sort((a, b) => {
             const dateA = new Date(`01 ${a.month.replace(' ', ' ')}`);
             const dateB = new Date(`01 ${b.month.replace(' ', ' ')}`);
             return dateA.getTime() - dateB.getTime();
        });
    
    const saldoAkhir = totalPenerimaan - totalPengeluaran;

    return {
        totalPenerimaan,
        totalPengeluaran,
        saldoAkhir,
        monthlySummaries,
        rawTransactions: transactions,
    };
};
