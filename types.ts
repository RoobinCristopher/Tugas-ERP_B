
export interface Transaction {
  tanggalTransaksi: Date;
  kodeTransaksi: string;
  jenisTransaksi: 'Penerimaan' | 'Pengeluaran';
  kategori: string;
  deskripsi: string;
  jumlah: number;
  metodePembayaran: string;
}

export interface MonthlySummary {
  month: string;
  Penerimaan: number;
  Pengeluaran: number;
  'Arus Kas Bersih': number;
}

export interface AnalysisResult {
  totalPenerimaan: number;
  totalPengeluaran: number;
  saldoAkhir: number;
  monthlySummaries: MonthlySummary[];
  rawTransactions: Transaction[];
}
