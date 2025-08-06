import { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

function BudgetForm({ userId }) {
  const [formData, setFormData] = useState({
    salary: '',
    transpo: '',
    bills: '',
    investmentsPercent: '',
    needsPercent: '',
    wantsPercent: '',
    customCategories: {},
  });
  const [breakdown, setBreakdown] = useState(null);
  const [customName, setCustomName] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addCustomCategory = () => {
    if (!customName || !customAmount) return;
    setFormData({
      ...formData,
      customCategories: {
        ...formData.customCategories,
        [customName]: Number(customAmount),
      },
    });
    setCustomName('');
    setCustomAmount('');
  };

  const calculateBudget = () => {
    const salary = Number(formData.salary);
    const transpo = Number(formData.transpo);
    const bills = Number(formData.bills);
    const investmentsPercent = Number(formData.investmentsPercent);
    const needsPercent = Number(formData.needsPercent);
    const wantsPercent = Number(formData.wantsPercent);

    const remaining = salary - transpo - bills;
    const investments = (investmentsPercent / 100) * remaining;
    const needs = (needsPercent / 100) * remaining;
    const wants = (wantsPercent / 100) * remaining;
    const customTotal = Object.values(formData.customCategories).reduce((a, b) => a + b, 0);

    setBreakdown({
      investments,
      needs,
      wants,
      customCategories: formData.customCategories,
      customTotal,
    });
  };

  const saveBudget = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/budgets`, {
        user_id: userId,
        salary: Number(formData.salary),
        transpo: Number(formData.transpo),
        bills: Number(formData.bills),
        investments_percent: Number(formData.investmentsPercent),
        needs_percent: Number(formData.needsPercent),
        wants_percent: Number(formData.wantsPercent),
        custom_categories: formData.customCategories,
      });
      alert('✅ Budget saved!');
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('❌ Failed to save budget');
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Budget Breakdown', 10, 10);
    if (breakdown) {
      doc.text(`Investments: $${breakdown.investments.toFixed(2)}`, 10, 20);
      doc.text(`Needs: $${breakdown.needs.toFixed(2)}`, 10, 30);
      doc.text(`Wants: $${breakdown.wants.toFixed(2)}`, 10, 40);
      let y = 50;
      for (const [name, amount] of Object.entries(breakdown.customCategories)) {
        doc.text(`${name}: $${amount.toFixed(2)}`, 10, y);
        y += 10;
      }
    }
    doc.save('budget.pdf');
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 mb-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 Create Your Budget</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {['salary', 'transpo', 'bills', 'investmentsPercent', 'needsPercent', 'wantsPercent'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {field.replace(/Percent/, ' (%)')}
            </label>
            <input
              type="number"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}
      </div>

      {/* Custom Categories */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">🧩 Custom Categories</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Category Name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-32 px-3 py-2 border border-gray-300 rounded"
          />
          <button
            onClick={addCustomCategory}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>

        {Object.keys(formData.customCategories).length > 0 && (
          <ul className="mt-3 text-sm text-gray-700 list-disc list-inside">
            {Object.entries(formData.customCategories).map(([key, value]) => (
              <li key={key}>
                {key}: ${value}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={calculateBudget}
          className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          💡 Calculate
        </button>
        <button
          onClick={saveBudget}
          className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          💾 Save
        </button>
        <button
          onClick={exportPDF}
          className="px-5 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
        >
          📄 Export PDF
        </button>
      </div>

      {breakdown && (
        <div className="mt-6 bg-gray-50 p-4 rounded shadow-inner">
          <h4 className="text-lg font-semibold mb-2 text-gray-800">📉 Breakdown</h4>
          <ul className="text-sm space-y-1">
            <li>Investments: ${breakdown.investments.toFixed(2)}</li>
            <li>Needs: ${breakdown.needs.toFixed(2)}</li>
            <li>Wants: ${breakdown.wants.toFixed(2)}</li>
            <li>Custom Total: ${breakdown.customTotal.toFixed(2)}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default BudgetForm;

