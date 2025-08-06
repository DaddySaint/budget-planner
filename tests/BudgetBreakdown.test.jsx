import { render, screen } from '@testing-library/react';
import BudgetBreakdown from '../src/components/BudgetBreakdown';

describe('BudgetBreakdown Component', () => {
    const breakdown = {
        salary: 30000,
        monthlyTranspo: 6000,
        bills: 5000,
        investments: 3000,
        needs: 9000,
        wants: 3000,
        customCategories: [
            { name: 'Groceries', amount: 2000 },
            { name: 'Entertainment', amount: 1000 },
        ],
        savings: 2000,
    };

    test('renders budget breakdown chart', () => {
        render(<BudgetBreakdown breakdown={breakdown} />);
        expect(screen.getByText(/Monthly Salary: ₱30000.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Transportation: ₱6000.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Groceries: ₱2000.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Savings: ₱5000.00/i)).toBeInTheDocument();
    });
});