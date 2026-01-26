import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, CreditCard } from 'lucide-react';
import api from '../services/api';

const Register = () => {
    const navigate = useNavigate();

    // FIXED: State now matches RegisterRequest.java exactly
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Register (Payload: { fullName, email, password })
            const registerResponse = await api.post('/auth/register', formData);
            const token = registerResponse.data.token;

            // 2. Save Token
            localStorage.setItem('token', token);

            // 3. Create Account (Default Savings)
            await api.post('/accounts', { type: 'SAVINGS' });

            // 4. Redirect
            navigate('/dashboard');

        } catch (err: any) {
            console.error("Registration failed", err);
            setError(err.response?.data?.message || "Registration failed. Email might be taken.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,0)_0%,_rgba(2,6,23,1)_100%)] z-0"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px]"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-500/20">
                        <CreditCard size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Join VANTAGE<span className="text-blue-500">BANK</span></h1>
                    <p className="text-slate-400 mt-2">Create your digital financial identity</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleRegister} className="space-y-5">

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* FIXED: Single Full Name Input */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;