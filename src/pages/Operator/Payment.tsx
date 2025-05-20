import { useState, useEffect, useCallback } from 'react';
import { FaWallet } from 'react-icons/fa6';
import CardOperator from '../../components/Cards/CardOperator';
import CardsTransaction from '../../components/ListTransaction/TransactionList';
import TabletStudentSearch from '../../components/Tables/TableStudentSearch';
import { Student } from '../../types/student';
import { Transaction } from '../../types/transaction';
import { colorVariants } from '../../utils/colorVariants';
import clsx from 'clsx';
import CardStudent from '../../components/Cards/CardStudent';
import { API_URL, API_KEY } from '../../utils/apiConfig';
import { addTransactionButton } from '../../components/buttons/TransactionButtons';
import useToast from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';

const Payment = ({
  color,
}: {
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
}) => {
  const { showSuccess, showError } = useToast();
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
        data.filter(
          (transaction: Transaction) =>
            !transaction.is_finished && !transaction.is_revoked,
        ),
      );
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }, [selectedStudent]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <CardOperator
      title="Registrar Pago"
      subtitle="Registra un nuevo pago para algún alumno."
      color="red"
    >
      <FaWallet size={20} className="text-white" />
      <div>
        <p
          className={clsx('text-3xl font-bold mb-2', colorVariants[color].text)}
        >
          Estudiante
        </p>
        {!selectedStudent ? (
          <TabletStudentSearch onSelect={setSelectedStudent} color="red" />
        ) : (
          <CardStudent
            student={selectedStudent}
            onReset={() => {
              setSelectedStudent(null);
              setTransactions([]);
            }}
            color="red"
          />
        )}
      </div>

      <div>
        <p
          className={clsx('text-3xl font-bold mb-2', colorVariants[color].text)}
        >
          Transacciones en curso
        </p>
        {selectedStudent ? (
          selectedStudent && (
            <CardsTransaction
              transactions={transactions}
              reloadTransactions={fetchTransactions}
              color="red"
            />
          )
        ) : (
          <p className={clsx('text-l py-5  ')}>
            Selecciona un estudiante para ver sus transacciones en curso.
          </p>
        )}
      </div>

      {selectedStudent ? (
        selectedStudent && (
          <>
            <button
              className={clsx(
                'inline-flex items-center justify-center py-4 px-5 xl:px-10',
                colorVariants['green'].btn,
              )}
              onClick={() => {
                navigate(`/student/${selectedStudent.id}`);
              }}
            >
              Ver transacciones
            </button>

            <button
              className={clsx(
                'inline-flex items-center justify-center py-4 px-5 xl:px-10',
                colorVariants[color].btn,
              )}
              onClick={async () =>
                await addTransactionButton(
                  selectedStudent.id,
                  fetchTransactions,
                  showError,
                  showSuccess,
                )
              }
            >
              Comenzar transacción
            </button>
          </>
        )
      ) : (
        <></>
      )}
    </CardOperator>
  );
};

export default Payment;
