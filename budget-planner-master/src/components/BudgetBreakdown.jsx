import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function BudgetBreakdown({ breakdown }) {
    const chartData = {
        labels: [
            'Transportation',
            'Bills',
            'Investments',
            'Needs',
            'Wants',
            ...breakdown.customCategories.map((cat) => cat.name),
            'Savings',
        ].filter((_, index) => {
            const values = [
                breakdown.monthlyTranspo,
                breakdown.bills,
                breakdown.investments,
                breakdown.needs,
                breakdown.wants,
                ...breakdown.customCategories.map((cat) => cat.amount),
                breakdown.savings,
            ];
            return values[index] > 0;
        }),
        datasets: [
            {
                data: [
                    breakdown.monthlyTranspo,
                    breakdown.bills,
                    breakdown.investments,
                    breakdown.needs,
                    breakdown.wants,
                    ...breakdown.customCategories.map((cat) => cat.amount),
                    breakdown.savings,
                ].filter((value) => value > 0),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#C9CBCF',
                    ...Array(breakdown.customCategories.length)
                        .fill()
                        .map((_, i) => `hsl(${(i * 50) % 360}, 70%, 50%)`),
                ],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label: (context) =>
                        `₱${context.raw.toFixed(2)} (${((context.raw / breakdown.salary) * 100).toFixed(1)}%)`,
                },
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Budget Breakdown</h2>
            <div className="space-y-2">
                <p>
                    <span className="font-semibold">Monthly Salary:</span> ₱{breakdown.salary.toFixed(2)}
                </p>
                <p>
                    <span className="font-semibold">Transportation:</span> ₱{breakdown.monthlyTranspo.toFixed(2)}
                </p>
                <p>
                    <span className="font-semibold">Bills:</span> ₱{breakdown.bills.toFixed(2)}
                </p>
                <p>
                    <span className="font-semibold">Investments:</span> ₱{breakdown.investments.toFixed(2)}
                </p>
                <p>
                    <span className="font-semibold">Needs:</span> ₱{breakdown.needs.toFixed(2)}
                </p>
                <p>
                    <span className="font-semibold">Wants:</span> ₱{breakdown.wants.toFixed(2)}
                </p>
                {breakdown.customCategories.length > 0 && (
                    <>
                        <p className="font-semibold mt-2">Custom Categories:</p>
                        {breakdown.customCategories.map((cat, index) => (
                            <p key={index}>{cat.name}: ₱{cat.amount.toFixed(2)}</p>
                        ))}
                    </>
                )}
                <p className="font-semibold mt-4">Savings: ₱{breakdown.savings.toFixed(2)}</p>
            </div>
            <div className="mt-6">
                <Pie data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

export default BudgetBreakdown;
