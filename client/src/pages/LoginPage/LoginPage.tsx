import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';


const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ email, password });
            navigate('/admin/users');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-info p-4">
            <div className="w-full max-w-[420px] bg-bg-primary rounded-2xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-fadeIn max-sm:p-6">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-info rounded-2xl flex items-center justify-center text-white">
                        <LogIn size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary mb-1">Sistema ERP</h1>
                    <p className="text-text-secondary text-sm">Gestão Empresarial</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {error && <div className="p-3 px-4 bg-danger-light text-danger rounded-lg text-sm text-center">{error}</div>}

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-text-primary">Email</label>
                        <div className="relative flex items-center">
                            <Mail size={18} className="absolute left-3.5 text-text-tertiary pointer-events-none" />
                            <input
                                id="email"
                                type="email"
                                className="w-full pl-11 pr-3 py-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light placeholder:text-text-tertiary"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-medium text-text-primary">Senha</label>
                        <div className="relative flex items-center">
                            <Lock size={18} className="absolute left-3.5 text-text-tertiary pointer-events-none" />
                            <input
                                id="password"
                                type="password"
                                className="w-full pl-11 pr-3 py-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light placeholder:text-text-tertiary"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-md border-none cursor-pointer transition-all bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>

                    <div className="mt-4 p-4 bg-bg-secondary rounded-lg text-center">
                        <p className="text-xs text-text-secondary mb-2">Credenciais de demonstração:</p>
                        <code className="block text-[13px] text-primary font-mono">admin@erp.com / admin123</code>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
