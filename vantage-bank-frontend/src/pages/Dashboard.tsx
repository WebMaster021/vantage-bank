import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, LogOut, RefreshCw, Copy, Check } from 'lucide-react';
import api from '../services/api';
import type {Account, Transaction} from "../types";
import TransferModal from "../components/TransferModal.tsx";
import DepositWithdrawModal from '../components/DepositWithdrawModal.tsx';

const Dashboard = () => {
    const navigate = useNavigate();

    // State
    const [account, setAccount] = useState<Account | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]); // New State
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isFundsOpen, setIsFundsOpen] = useState(false);


    // 1. Fetch Account on Load
    useEffect(() => {
        fetchAccountData();
    }, []);

    // 2. Fetch Transactions ONLY when Account ID exists (Dependent Query)
    useEffect(() => {
        if (account?.id) {
            fetchTransactions(account.id);
        }
    }, [account]); // Runs whenever 'account' updates

    const fetchAccountData = async () => {
        try {
            const response = await api.get("/accounts/me");
            setAccount(response.data);
            // Note: We don't setLoading(false) here anymore.
            // We wait for the transactions to finish loading.
        } catch (error) {
            console.error("Failed to fetch account", error);
            // If 403/400, it usually means token invalid or no account
            navigate("/login");
        }
    };

    const fetchTransactions = async (accountId: string) => {
        try {
            const response = await api.get(`/transactions/${accountId}`);
            setTransactions(response.data);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            // NOW we are done loading everything
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const copyToClipboard = () => {
        if (account?.id) {
            navigator.clipboard.writeText(account.id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading Cybernetics...</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
            {/* Navbar */}
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <CreditCard size={24} className="text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">VANTAGE<span className="text-blue-500">BANK</span></span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="hidden md:block text-slate-400">
                            Welcome, <span className="text-white font-medium">{account?.fullName}</span>
                        </span>
                        <button onClick={handleLogout} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-red-400">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Balance Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CreditCard size={120} />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Total Balance</h2>
                        <div className="text-5xl font-bold text-white mb-4">
                            {/* Convert Cents (Long) to Dollars */}
                            ${(account?.balance ? account.balance / 100 : 0).toFixed(2)}
                            <span className="text-lg text-slate-500 font-normal ml-2">USD</span>
                        </div>

                        <div className="flex items-center gap-3 bg-slate-950/50 w-fit px-4 py-2 rounded-lg border border-slate-800">
                            <span className="text-slate-400 text-xs uppercase">Account ID</span>
                            <code className="text-blue-400 font-mono text-sm">{account?.id}</code>
                            <button onClick={copyToClipboard} className="text-slate-500 hover:text-white transition-colors">
                                {copied ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions & History Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Actions */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                            <h3 className="font-bold text-white mb-4">Quick Operations</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setIsTransferOpen(true)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all">
                                    Transfer Funds
                                </button>
                                <button
                                    onClick={() => setIsFundsOpen(true)}
                                    className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-all">
                                    Deposit / Withdraw
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Transactions List */}
                    <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 min-h-[300px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-white">Recent Activity</h3>
                            <button
                                onClick={() => account?.id && fetchTransactions(account.id)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <RefreshCw size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {transactions.length === 0 ? (
                                <div className="text-center text-slate-500 py-8">No recent transactions found</div>
                            ) : (
                                transactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${
                                                tx.type === 'DEPOSIT' ? 'bg-green-500/20 text-green-400' :
                                                    tx.type === 'WITHDRAWAL' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                            }`}>
                                                <RefreshCw size={18} />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{tx.type}</p>
                                                <p className="text-slate-500 text-xs">{new Date(tx.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className={`font-mono font-bold ${
                                            tx.type === 'DEPOSIT' ? 'text-green-400' : 'text-white'
                                        }`}>
                                            {tx.type === 'DEPOSIT' ? '+' : '-'}${ (tx.amount / 100).toFixed(2) }
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal Layer */}
            <TransferModal
                isOpen={isTransferOpen}
                onClose={() => setIsTransferOpen(false)}
                myAccountId={account?.id || ''}
                onSuccess={() => {
                    // Refresh data when transfer is done
                    if(account?.id) {
                        fetchAccountData();
                        fetchTransactions(account.id);
                    }
                }}
            />

            <DepositWithdrawModal
                isOpen={isFundsOpen}
                onClose={() => setIsFundsOpen(false)}
                myAccountId={account?.id || ''}
                onSuccess={() => {
                    if(account?.id) {
                        fetchAccountData();
                        fetchTransactions(account.id);
                    }
                }}
            />
        </div>
    );
};

export default Dashboard;