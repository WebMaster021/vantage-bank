import { useState } from 'react';
import { X, Send, AlertCircle, Hash, DollarSign } from 'lucide-react';
import api from '../services/api';

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    myAccountId: string;
}

const TransferModal = ({ isOpen, onClose, onSuccess, myAccountId }: TransferModalProps) => {
    const [targetId, setTargetId] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const amountInCents = Math.round(parseFloat(amount) * 100);

            const payload = {
                accountId: myAccountId,
                targetAccountId: targetId,
                amount: amountInCents,
                type: 'TRANSFER'
            };

            await api.post('/transactions', payload);

            setAmount('');
            setTargetId('');
            onSuccess();
            onClose();

        } catch (err: any) {
            console.error(err);
            const message = err.response?.data?.message || "Transfer failed. Check the Account ID.";
            setError(message);
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
                        <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                            <Send size={20} />
                        </div>
                        Transfer Funds
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleTransfer} className="p-6 space-y-5">

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm">
                            <AlertCircle size={18} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Recipient Account ID</label>
                        <div className="relative group">
                            <Hash className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                value={targetId}
                                onChange={(e) => setTargetId(e.target.value)}
                                className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm placeholder:text-slate-700"
                                placeholder="e.g. 550e8400-e29b-..."
                                required
                            />
                        </div>
                    </div>

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

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? 'Processing...' : 'Confirm Transfer'}
                            {!loading && <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransferModal;