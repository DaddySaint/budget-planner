import { render, screen, fireEvent } from '@testing-library/react';
import BudgetForm from '../src/components/BudgetForm';

describe('BudgetForm Component', () => {
    const mockSetBudget = jest.fn();
    const mockCalculateBudget = jest.fn();
    const mockDeleteBudget = jest.fn();
    const budget = {
        salary: '30000',
        transpo: '200',
        bills: '5000',
        investmentsPercent: '10',
        needsPercent: '50',
        wantsPercent: '20',
        customCategories: [],
    };
    const budgets = [{ id: '1', salary: '30000', created_at: new Date() }];

    test('renders form inputs', () => {
        render(
            <BudgetForm
                budget={budget}
                setBudget={mockSetBudget}
                calculateBudget={mockCalculateBudget}
                deleteBudget={mockDeleteBudget}
                budgets={budgets}
            />
        );
        expect(screen.getByLabelText(/Monthly Salary \(₱\)/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Daily Transportation \(₱\)/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Bills \(₱\)/i)).toBeInTheDocument();
    });

    test('adds cystom category', () => {
        render(
            <BudgetForm
                budget={budget}
                setBudget={mockSetBudget}
                calculateBudget={mockCalculateBudget}
                deleteBudget={mockDeleteBudget}
                budgets={budgets}
            />
        );
        fireEvent.change(screen.getByLabelText(/Custom Category Name/i), { target: { value: 'Groceries' } });
        fireEvent.change(screen.getByLabelText(/Custom Category Amount \(₱\)/i), { target: { value: '2000' } });
        fireEvent.click(screen.getByText('Add'));
        expect(mockSetBudget).toHaveBeenCalledWith({
            ...budget,
            customCategories: [{ name: 'Groceries', amount: 2000 }],
        });
    });
});