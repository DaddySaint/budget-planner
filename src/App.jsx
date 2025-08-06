import { useState, useEffect } from 'react';
import { auth } from './firebase';
import {
        onAuthStateChanged,
        signOut,
        signInWithEmailAndPassword,
} from 'firebase/auth';

import BudgetForm from './components/BudgetForm';
import BudgetBreakdown from './components/BudgetBreakdown';
import './App.css';

function App() {
        const [user, setUser] = useState(null);
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');

        useEffect(() => {
                const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                        setUser(currentUser);
                });
                return () => unsubscribe();
        }, []);

        const handleLogin = async () => {
                try {
                        await signInWithEmailAndPassword(auth, email, password);
                        setError('');
                } catch (err) {
                        setError('Login failed. Check email/password.');
                }
        };

        const handleLogout = async () => {
                try {
                        await signOut(auth);
                } catch (error) {
                        console.error('Logout error:', error);
                }
        };

        return (
                <div className="container mx-auto p-4">
                        {user ? (
                                <>
                                        <h1 className="text-2xl font-bold mb-4">Budget Planner</h1>
                                        <button
                                                onClick={handleLogout}
                                                className="mb-4 p-2 bg-red-500 text-white rounded"
                                        >
                                                Logout
                                        </button>
                                        <BudgetForm userId={user.uid} />
                                        <BudgetBreakdown userId={user.uid} />
                                </>
                        ) : (
                                <>
                                        <h1 className="text-2xl font-bold mb-4">Please log in</h1>
                                        {error && <p className="text-red-500 mb-2">{error}</p>}
                                        <input
                                                type="email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="block border mb-2 p-2 w-full"
                                        />
                                        <input
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="block border mb-4 p-2 w-full"
                                        />
                                        <button
                                                onClick={handleLogin}
                                                className="p-2 bg-blue-500 text-white rounded"
                                        >
                                                Login
                                        </button>
                                </>
                        )}
                </div>
        );
}

export default App;
