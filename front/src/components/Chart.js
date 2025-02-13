import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExpenseChart = ({ transactions }) => {
    const chartData = useMemo(() => {
        if (transactions.length === 0) return { labels: [], datasets: [] };

        const categories = {};
        transactions.forEach(({ category, amount, type }) => {
            if (!categories[category]) {
                categories[category] = { income: 0, expense: 0 };
            }
            categories[category][type] += amount;
        });

        const labels = Object.keys(categories);
        const incomeData = labels.map(category => categories[category].income);
        const expenseData = labels.map(category => categories[category].expense);

        return {
            labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
                {
                    label: 'Expense',
                    data: expenseData,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                }
            ]
        };
    }, [transactions]);

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <h3>Income & Expense by Category</h3>
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
    );
};

export default ExpenseChart;
