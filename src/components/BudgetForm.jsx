import { useState } from 'react';
import { jsPDF } from 'jspdf';

function BudgetForm({ budget, setBudget, calculateBudget, budgets, deleteBudget }) {
  const [customCategory, setCustomCategory] = useState({ name: '', amount: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBudget({ ...budget, [name]: value });
  };

  const addCustomCategory = () => {
    const name = customCategory.name.trim();
    const amount = parseFloat(customCategory.amount) || 0;
    if (name && amount > 0) {
      setBudget({
        ...budget,
        customCategories: [...budget.customCategories, { name, amount }],
      });
      setCustomCategory({ name: '', amount: '' });
    } else {
      alert('Please enter a valid category name and amount.');
    }
  };

  const removeCustomCategory = (index) => {
    setBudget({
      ...budget,
      customCategories: budget.customCategories.filter((_, i) => i !== index),
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Budget Breakdown', 10, 10);
    doc.text(`Monthly Salary: ₱${budget.salary}`, 10, 20);
    doc.text(`Transportation: ₱${(parseFloat(budget.transpo) * 30 || 0).toFixed(2)}`, 10, 30);
    doc.text(`Bills: ₱${(budget.bills || 0).toFixed(2)}`, 10, 40);
    const remaining = (parseFloat(budget.salary) || 0) - (parseFloat(budget.transpo) * 30 || 0) - (parseFloat(budget.bills) || 0);
    doc.text(`Investments: ₱${(remaining * (parseFloat(budget.investmentsPercent) / 100 || 0)).toFixed(2)}`, 10, 50);
    doc.text(`Needs: ₱${(remaining * (parseFloat(budget.needsPercent) / 100 || 0)).toFixed(2)}`, 10, 60);
    doc.text(`Wants: ₱${(remaining * (parseFloat(budget.wantsPercent) / 100 || 0)).toFixed(2)}`, 10, 70);
    let y = 80;
    if (budget.customCategories.length > 0) {
      doc.text('Custom Categories:', 10, y);
      y += 10;
      budget.customCategories.forEach((cat) => {
        doc.text(`${cat.name}: ₱${cat.amount.toFixed(2)}`, 10, y);
        y += 10;
      });
    }
    doc.save('budget.pdf');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Enter Your Budget</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Monthly Salary (₱)</label>
        <input
          type="number"
          name="salary"
          value={budget.salary}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="e.g., 30000"
          min="0"
          step="0.01"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Daily Transportation Expense (₱)</label>
        <input
          type="number"
          name="transpo"
          value={budget.transpo}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="e.g., 200"
          min="0"
          step="0.01"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Monthly Bills (₱)</label>
        <input
          type="number"
          name="bills"
          value={budget.bills}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="e.g., 5000"
          min="0"
          step="0.01"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Investments Allocation (%)</label>
        <input
          type="number"
          name="investmentsPercent"
          value={budget.investmentsPercent}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          min="0"
          max="100"
          step="1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Needs Allocation (%)</label>
        <input
          type="number"
          name="needsPercent"
          value={budget.needsPercent}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          min="0"
          max="100"
          step="1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Wants Allocation (%)</label>
        <input
          type="number"
          name="wantsPercent"
          value={budget.wantsPercent}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          min="0"
          max="100"
          step="1"
        />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Add Custom Category</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            value={customCategory.name}
            onChange={(e) => setCustomCategory({ ...customCategory, name: e.target.value })}
            className="w-1/2 p-2 border rounded"
            placeholder="Category Name"
          />
          <input
            type="number"
            value={customCategory.amount}
            onChange={(e) => setCustomCategory({ ...customCategory, amount: e.target.value })}
            className="w-1/2 p-2 border rounded"
            placeholder="Amount (₱)"
            min="0"
            step="0.01"
          />
          <button
            onClick={addCustomCategory}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>
      </div>
      <div className="mb-4">
        {budget.customCategories.map((cat, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded mb-2">
            <span>{cat.name}: ₱{cat.amount.toFixed(2)}</span>
            <button
              onClick={() => removeCustomCategory(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={calculateBudget}
          className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Calculate Budget
        </button>
        <button
          onClick={exportToPDF}
          className="flex-1 bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
        >
          Export to PDF
        </button>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Saved Budgets</h3>
        {budgets.map((b) => (
          <div key={b.id} className="flex justify-between items-center p-2 bg-gray-100 rounded mb-2">
            <span>Salary: ₱{b.salary.toFixed(2)} (Created: {new Date(b.created_at).toLocaleDateString()})</span>
            <button
              onClick={() => deleteBudget(b.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BudgetForm;