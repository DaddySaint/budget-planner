import { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function BudgetBreakdown({ userId }) {
    const [budgets, setBudgets] = useState([]);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/budgets/${userId}`);
                setBudgets(response.data);
            } catch (error) {
                console.error('Error fetching budgets:', error);
            }
        };
        fetchBudgets();
    }, [userId]);

    const deleteBudget = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/budgets/${id}`);
            setBudgets(budgets.filter((budget) => budget.id !== id));
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    };

    const chartData = (budget) => ({
        labels: ['Investments', 'Needs', 'Wants', ...Object.keys(budget.custom_categories)],
        datasets: [
            {
                data: [
                    budget.investments_percent * (budget.salary - budget.transpo - budget.bills) / 100,
                    budget.needs_percent * (budget.salary - budget.transpo - budget.bills) / 100,
                    budget.wants_percent * (budget.salary - budget.transpo - budget.bills) / 100,
                    ...Object.values(budget.custom_categories),
                ],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    });

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Your Budgets</h2>
            {budgets.map((budget) => (
                <div key={budget.id} className="mb-4 p-4 border rounded">
                    <p>Salary: ₱{budget.salary}</p>
                    <p>Transportation: ₱{budget.transpo}</p>
                    <p>Bills: ₱{budget.bills}</p>
                    <p>Investments: {budget.investments_percent}%</p>
                    <p>Needs: {budget.needs_percent}%</p>
                    <p>Wants: {budget.wants_percent}%</p>
                    <p>Custom Categories: {JSON.stringify(budget.custom_categories)}</p>
                    <div className="w-64 h-64">
                        <Pie data={chartData(budget)} />
                    </div>
                    <button
                        onClick={() => deleteBudget(budget.id)}
                        className="mt-2 p-2 bg-red-500 text-black rounded"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}

export default BudgetBreakdown;