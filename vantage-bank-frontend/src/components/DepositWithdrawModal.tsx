import { useState } from 'react';
import { X, ArrowDownCircle, ArrowUpCircle, AlertCircle, Wallet, DollarSign } from 'lucide-react';
import api from '../services/api';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    myAccountId: string;
}

type Mode = 'DEPOSIT' | 'WITHDRAWAL';

const DepositWithdrawModal = ({ isOpen, onClose, onSuccess, myAccountId }: ModalProps) => {
    const [mode, setMode] = useState<Mode>('DEPOSIT');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const amountInCents = Math.round(parseFloat(amount) * 100);

            await api.post('/transactions', {
                accountId: myAccountId,
                amount: amountInCents,
                type: mode,
            });

            setAmount('');
            onSuccess();
            onClose();

        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || "Transaction failed. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <div className="p-2 bg-purple-600/20 rounded-lg text-purple-400">
                            <Wallet size={20} />
                        </div>
                        Manage Funds
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="p-6 pb-0">
                    <div className="flex p-1 bg-slate-950/50 rounded-xl border border-slate-800">
                        <button
                            onClick={() => setMode('DEPOSIT')}
                            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                                mode === 'DEPOSIT'
                                    ? 'bg-green-600 text-white shadow-lg shadow-green-900/20'
                                    : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            <ArrowDownCircle size={18} /> Deposit
                        </button>
                        <button
                            onClick={() => setMode('WITHDRAWAL')}
                            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                                mode === 'WITHDRAWAL'
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/20'
                                    : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            <ArrowUpCircle size={18} /> Withdraw
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm">
                            <AlertCircle size={18} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Amount (USD)</label>
                        <div className="relative group">
                            <DollarSign className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-lg placeholder:text-slate-700"
                                placeholder="0.00"
                                step="0.01"
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg ${
                            mode === 'DEPOSIT'
                                ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-900/20'
                                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/20'
                        }`}
                    >
                        {loading ? 'Processing...' : mode === 'DEPOSIT' ? 'Confirm Deposit' : 'Confirm Withdrawal'}
                        {!loading && (mode === 'DEPOSIT'
                                ? <ArrowDownCircle size={18} className="group-hover:translate-y-1 transition-transform" />
                                : <ArrowUpCircle size={18} className="group-hover:-translate-y-1 transition-transform" />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DepositWithdrawModal;