import { useState, useEffect, useCallback } from 'react';
import { FaWallet } from 'react-icons/fa6';
import CardOperator from '../../components/Cards/CardOperator';
import CardTransaction from '../../components/Cards/CardTransaction';
import TabletStudent from '../../components/Tables/TableStudent';
import { Student } from '../../types/student';
import { Transaction } from '../../types/transaction';
import { colorVariants } from '../../types/colorVariants';
import clsx from 'clsx';
import CardStudent from '../../components/Cards/CardStudent';
import { API_URL, API_KEY } from '../../utils/apiConfig';
import {
  addTransactionButton,
} from '../../utils/actionButton';
import useToast from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';

const View = ({
  color,
}: {
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
}) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  const fetchTransactions = useCallback(async () => {
    if (!selectedStudent) return;
    try {
      const response = await fetch(
        `${API_URL}/transactions.list?student_id=${selectedStudent.id}`,
        {
          headers: {
            Authorization: API_KEY,
          },
          credentials: 'include',
        },
      );
      const data = await response.json();
      setTransactions(
        data.filter((transaction: Transaction) => !transaction.is_finished && !transaction.is_revoked),
      );
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }, [selectedStudent]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    if (selectedStudent) {
      setSelectedStudent(null);
    }
  }, [selectedStudent]);

  return (
    <CardOperator
      title="Ver estudiante"
      subtitle="Selecciona un estudiante para ver toda su información."
      color="green"
    >
      <FaWallet size={20} className="text-white" />
      <div>
        <p
          className={clsx('text-3xl font-bold mb-2', colorVariants[color].text)}
        >
          Estudiante
        </p>
        {!selectedStudent ? (
          <TabletStudent onSelect={setSelectedStudent} color="red" />
        ) : (
          <>
          {navigate(`/student/${selectedStudent.id}`)}
          </>
        )}
      </div>

     

    </CardOperator>
  );
};

export default View;
