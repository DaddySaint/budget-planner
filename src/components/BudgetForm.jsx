import { useState } from 'react';

function BudgetForm({ budget, setBudget,  calculateBudget, saveBudget, loadBudget }) {
    const [customCategory, setCustomCategory] = useState({name: '', amount: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBudget({...budget, [name]: value });
    };

    const addCustomCategory = () => {
        const name = CustomCategory.name.trim();
        const amount = parseFloat (customCategory.amount) || 0;
        if (name && amount > 0) {
            setBudget({
                ...Budget,
                customCategories: [...budget.customCategories, { name, amount } ]
            });
            setCustomCategory({name: '', amount: '' })
        }
        else {
            alert('Please enter a valid category name and amount.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
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
          onClick={saveBudget}
          className="flex-1 bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
        >
          Save Budget
        </button>
        <button
          onClick={loadBudget}
          className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Load Saved Budget
        </button>
      </div>
    </div>
    );
}

export default BudgetForm;