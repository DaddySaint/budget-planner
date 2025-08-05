import { useState, useEffect } from 'react';
import BudgetForm from './components/BudgetForm';
import BudgetBreakdown from './components/BudgetBreakdown';

function App() {
        const [budget, setBudget] = useState({
                salary: '',
                transpo: '',
                bills: '',
                investmentPercent: '',
                needsPercent: '50',
                wantsPercent: '20',
                customCategories: [],
        });
        const [breakdown, setBreakdown] = useState(null);

        const calculateBudget = () => {
                const salary = parseFloat (budget.salary) || 0;
                const dailyTranspo = parseFloat (budget.transpo) || 0;
                const bills = parseFloat (budget.bills) || 0;
                const investmentPercent = parseFloat (budget.investmentPercent) / 100 || 0;
                const needsPercent = parseFloat (budget.needsPercent) / 100 || 0;
                const wantsPercent = parseFloat (budget.wantsPercent) / 100 || 0;

                if (salary <= 0){
                        alert('Please enter a valid monthly salary. ');
                        return;
                }

                const monthlyTranspo = dailyTranspo * 30;
                const totalFixed = monthlyTranspo + bills;
                let remaining = salary - totalFixed;

                const totalCustom = budget.customCategories.reduce((sum, cat) => sum + cat.amount, 0);
                remaining -= totalCustom;

                if (remaining<0) {
                        alert('Fixed and custom expenses exceed your salary.');
                        return;
                }
                
                const investments = remaining * investmentPercent;
                const needs = remaining * needsPercent;
                const wants= remaining * wantsPercent;
                const savings = remaining - investments - needs - wants;

                if (investmentPercent + needsPercent + wantsPercent > 1) {
                        alert('Investment, Needs, and Wants percentages should not exceed 100%. ');
                        return;
                }

                setBreakdown({
                        salary,
                        monthlyTranspo,
                        bills,
                        investments,
                        needs,
                        wants,
                        customCategories: budget.customCategories,
                        savings,
                });
        };

                const saveBudget = () => {
                        localStorage.setItem('budget', JSON.stringify(budget));
                        alert('Budget saved successfully!');
                };

                const loadBudget = () => {
                        const saved = localStorage.getItem('budget');
                        if (saved){
                                setBudget(JSON.parse(saved));
                                alert('Budget Loaded successfully!');
                        }
                        else{
                                alert('No saved budget found.');
                        }
                };

                return (
                        <div className="container mx-auto p-4 max-w-3xl">
                        <h1 className="text-3xl font-bold text-center mb-6">Advanced Monthly Budget Planner</h1>
                        <BudgetForm
                                budget={budget}
                                setBudget={setBudget}
                                calculateBudget={calculateBudget}
                                saveBudget={saveBudget}
                                loadBudget={loadBudget}
                        />
                        {breakdown && <BudgetBreakdown breakdown={breakdown} />}
                        </div>
                );
}
export default App;
