
import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { User } from '../types';
import { supabase } from '../utils/supabaseClient';
import { View } from '../App';
import { LogoIcon } from '../components/icons/LogoIcon';

interface SignUpPageProps {
    onNavigate: (view: View) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(UserContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Crear cuenta en Supabase Auth
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
            if (signUpError) {
                setError(signUpError.message);
                return;
            }

            // Crear perfil en tabla users
            const avatarUrl = `https://i.pravatar.cc/150?u=${email}`;
            const { data: inserted, error: insertError } = await supabase
              .from('users')
              .insert({ name, email, is_host: isHost, avatar_url: avatarUrl, bio: '' })
              .select('*')
              .single();

            if (insertError || !inserted) {
                setError(insertError?.message || 'No se pudo crear el perfil.');
                return;
            }

            const mappedUser: User = {
                id: Number(inserted.id),
                name: inserted.name,
                email: inserted.email,
                isHost: Boolean(inserted.is_host),
                avatarUrl: inserted.avatar_url || avatarUrl,
                bio: inserted.bio || '',
            };
            login(mappedUser);

            if (isHost) {
                onNavigate('new-listing');
            } else {
                onNavigate('home');
            }
        } catch (err: any) {
            console.error('SignUp error:', err);
            setError('Hubo un problema al registrar la cuenta.');
        }
    };

    return (
         <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zen-secondary">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                     <LogoIcon className="mx-auto h-12 w-auto text-zen-primary" />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-zen-charcoal">
                        Crea tu cuenta
                    </h2>
                     <p className="mt-2 text-center text-sm text-gray-600">
                        ¿Ya tienes una?{' '}
                        <button onClick={() => onNavigate('login')} className="font-medium text-zen-primary hover:text-zen-primary-dark">
                            Inicia sesión
                        </button>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                         <div>
                            <label htmlFor="name" className="sr-only">Nombre</label>
                            <input id="name" name="name" type="text" required value={name} onChange={e => setName(e.target.value)} className="bg-gray-100 appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-zen-primary focus:border-zen-primary focus:z-10 sm:text-sm" placeholder="Nombre completo" />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email</label>
                            <input id="email-address" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-100 appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-zen-primary focus:border-zen-primary focus:z-10 sm:text-sm" placeholder="Email" />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="bg-gray-100 appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-zen-primary focus:border-zen-primary focus:z-10 sm:text-sm" placeholder="Contraseña" />
                        </div>
                    </div>
                    
                    <div className="flex items-center">
                        <input id="isHost" name="isHost" type="checkbox" checked={isHost} onChange={e => setIsHost(e.target.checked)} className="h-4 w-4 text-zen-primary border-gray-300 rounded focus:ring-zen-primary" />
                        <label htmlFor="isHost" className="ml-2 block text-sm text-gray-900">Quiero rentar mi espacio (soy anfitrión)</label>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-zen-primary hover:bg-zen-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zen-primary">
                            Registrarse
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};