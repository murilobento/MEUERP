import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';
import './LoginPage.css';

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
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-icon">
                        <LogIn size={32} />
                    </div>
                    <h1>Sistema ERP</h1>
                    <p>Gestão Empresarial</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="login-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-with-icon">
                            <Mail size={18} />
                            <input
                                id="email"
                                type="email"
                                className="input"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <div className="input-with-icon">
                            <Lock size={18} />
                            <input
                                id="password"
                                type="password"
                                className="input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>

                    <div className="login-demo">
                        <p>Credenciais de demonstração:</p>
                        <code>admin@erp.com / admin123</code>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
