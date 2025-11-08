
import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { supabase } from '../utils/supabaseClient';
import { View } from '../App';
import { LogoIcon } from '../components/icons/LogoIcon';

interface LoginPageProps {
    onNavigate: (view: View) => void;
    onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(UserContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) {
                setError(authError.message || 'Email o contraseña incorrectos.');
                return;
            }

            const { data: userRow, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('email', email)
              .limit(1)
              .single();

            if (userError || !userRow) {
                setError('No se encontró el perfil de usuario.');
                return;
            }

            const mappedUser = {
                id: Number(userRow.id),
                name: userRow.name,
                email: userRow.email,
                avatarUrl: userRow.avatar_url || `https://i.pravatar.cc/150?u=${userRow.email}`,
                isHost: Boolean(userRow.is_host),
                bio: userRow.bio || '',
            };
            login(mappedUser);
            onLoginSuccess();
        } catch (err: any) {
            console.error('Login error:', err);
            setError('Hubo un problema al iniciar sesión.');
        }
    };

    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zen-secondary">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div className="text-center">
                    <LogoIcon className="mx-auto h-12 w-auto text-zen-primary" />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-zen-charcoal">
                        Inicia sesión en tu cuenta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        O{' '}
                        <button onClick={() => onNavigate('signup')} className="font-medium text-zen-primary hover:text-zen-primary-dark">
                            crea una cuenta nueva
                        </button>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-gray-100 appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-zen-primary focus:border-zen-primary focus:z-10 sm:text-sm"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-100 appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-zen-primary focus:border-zen-primary focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-zen-primary hover:bg-zen-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zen-primary"
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};