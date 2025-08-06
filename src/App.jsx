import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import BudgetForm from './components/BudgetForm';
import BudgetBreakdown from './components/BudgetBreakdown';
import axios from 'axios';

function App() {
        const [budget, setBudget] = useState({
                salary: '',
                transpo: '200',
                bills: '',
                investmentsPercent: '10',
                needsPercent: '50',
                wantsPercent: '20',
                customCategories: [],
        });
        const [breakdown, setBreakdown] = useState(null);
        const [user, setUser] = useState(null);
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [budgets, setBudgets] = useState([]);
        const [error, setError] = useState(null);

        useEffect(() => {
                // Validate Firebase config
                if (!import.meta.env.VITE_FIREBASE_API_KEY) {
                        setError('Firebase configuration is missing. Please contact the administrator.');
                        return;
                }

                const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                        setUser(currentUser);
                        if (currentUser) {
                                fetchBudgets(currentUser.uid);
                        } else {
                                setBudgets([]);
                                setBreakdown(null);
                        }
                });
                return () => unsubscribe();
        }, []);

        const fetchBudgets = async (userId) => {
                try {
                        const response = await axios.get(`${import.meta.env.VITE_API_URL}/budgets/${userId}`);
                        setBudgets(response.data);
                } catch (error) {
                        setError('Failed to fetch budgets. Please try again later.');
                }
        };

        const calculateBudget = () => {
                const salary = parseFloat(budget.salary) || 0;
                const dailyTranspo = parseFloat(budget.transpo) || 0;
                const bills = parseFloat(budget.bills) || 0;
                const investmentsPercent = parseFloat(budget.investmentsPercent) / 100 || 0;
                const needsPercent = parseFloat(budget.needsPercent) / 100 || 0;
                const wantsPercent = parseFloat(budget.wantsPercent) / 100 || 0;

                if (salary <= 0) {
                        alert('Please enter a valid monthly salary.');
                        return;
                }

                const monthlyTranspo = dailyTranspo * 30;
                const totalFixed = monthlyTranspo + bills;
                let remaining = salary - totalFixed;

                const totalCustom = budget.customCategories.reduce((sum, cat) => sum + cat.amount, 0);
                remaining -= totalCustom;

                if (remaining < 0) {
                        alert('Fixed and custom expenses exceed your salary.');
                        return;
                }

                const investments = remaining * investmentsPercent;
                const needs = remaining * needsPercent;
                const wants = remaining * wantsPercent;
                const savings = remaining - investments - needs - wants;

                if (investmentsPercent + needsPercent + wantsPercent > 1) {
                        alert('Investments, Needs, and Wants percentages should not exceed 100%.');
                        return;
                }

                const breakdownData = {
                        salary,
                        monthlyTranspo,
                        bills,
                        investments,
                        needs,
                        wants,
                        customCategories: budget.customCategories,
                        savings,
                };
                setBreakdown(breakdownData);
                if (user) {
                        saveBudgetToDB({ ...budget, user_id: user.uid });
                }
        };

        const saveBudgetToDB = async (budgetData) => {
                try {
                        const response = await axios.post(`${import.meta.env.VITE_API_URL}/budgets`, budgetData);
                        setBudgets([...budgets, response.data]);
                } catch (error) {
                        setError('Failed to save budget. Please try again later.');
                }
        };

        const deleteBudget = async (id) => {
                try {
                        await axios.delete(`${import.meta.env.VITE_API_URL}/budgets/${id}`);
                        setBudgets(budgets.filter((b) => b.id !== id));
                } catch (error) {
                        setError('Failed to delete budget. Please try again later.');
                }
        };

        const handleLogin = async () => {
                try {
                        await signInWithEmailAndPassword(auth, email, password);
                        setEmail('');
                        setPassword('');
                        setError(null);
                } catch (error) {
                        setError('Login failed: ' + error.message);
                }
        };

        const handleLogout = async () => {
                try {
                        await signOut(auth);
                        setError(null);
                } catch (error) {
                        setError('Logout failed: ' + error.message);
                }
        };

        return (
                <div className="container mx-auto p-4 max-w-3xl">
                        <h1 className="text-3xl font-bold text-center mb-6">Advanced Budget Planner</h1>
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        {!user ? (
                                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                                        <h2 className="text-xl font-semibold mb-4">Login</h2>
                                        <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full p-2 border rounded mb-4"
                                                placeholder="Email"
                                        />
                                        <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full p-2 border rounded mb-4"
                                                placeholder="Password"
                                        />
                                        <button
                                                onClick={handleLogin}
                                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                        >
                                                Login
                                        </button>
                                </div>
                        ) : (
                                <>
                                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                                                <h2 className="text-xl font-semibold mb-4">Welcome, {user.email}</h2>
                                                <button
                                                        onClick={handleLogout}
                                                        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                                >
                                                        Logout
                                                </button>
                                        </div>
                                        <BudgetForm
                                                budget={budget}
                                                setBudget={setBudget}
                                                calculateBudget={calculateBudget}
                                                budgets={budgets}
                                                deleteBudget={deleteBudget}
                                        />
                                        {breakdown && <BudgetBreakdown breakdown={breakdown} />}
                                </>
                        )}
                </div>
        );
}

export default App;