import React, { useState, useEffect } from 'react';

import incomeIcon from '../../assets/income.svg';
import outcomeIcon from '../../assets/outcome.svg';
import totalIcon from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('/transactions');
      
      const transactionsFormatted = response.data.transactions.map(
        (transaction: Transaction) => ({
          ...transaction,
          formattedValue: transaction.type === 'outcome' ? `- ${formatValue(transaction.value)}` : `${formatValue(transaction.value)}`,
          formattedDate: new Date(transaction.created_at).toLocaleDateString('pt-br'),
        })
      );
      
      const { income, outcome, total } = response.data.balance;
      
      const balanceFormatted = {
      	income: formatValue(income),
      	outcome: formatValue(outcome),
      	total: formatValue(total),
      }
      
      setTransactions(transactionsFormatted);
      setBalance(balanceFormatted);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={incomeIcon} alt="Income" />
            </header>
            {balance && (
              <h1 data-testid="balance-income">
                {balance.income}
              </h1>
            )}
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcomeIcon} alt="Outcome" />
            </header>

            {balance && (
              <h1 data-testid="balance-outcome">
                {balance.outcome}
              </h1>
            )}
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={totalIcon} alt="Total" />
            </header>
            {balance && (
              <h1 data-testid="balance-total">{balance.total}</h1>
            )}
          </Card>
        </CardContainer>

        {transactions && (
          <TableContainer>
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Preço</th>
                  <th>Categoria</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.formattedValue}
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>
                      {transaction.formattedDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
