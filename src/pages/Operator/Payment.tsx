import { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaWallet } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import CardOperator from '../../components/Cards/CardOperator';
import CardTransaction from '../../components/Cards/CardTransaction';
import StudentSearch from '../../components/Search/StudentSearch';
import { Student } from '../../types/student';
import { Transaction } from '../../types/transaction';

const StudentCard = ({
  student,
  onReset,
}: {
  student: Student;
  onReset: () => void;
}) => (
  <motion.div
    animate={{ scale: [0.9, 1] }}
    transition={{ duration: 0.1 }}
    className="p-4 border rounded-lg shadow-md bg-white dark:bg-boxdark dark:border-boxdark"
  >
    <div className="flex justify-between">
      <div className="text-gray-800 dark:text-gray-200">
        <h3 className="text-lg font-bold">{student.name}</h3>
        <p>ID: {student.id_card}</p>
        <p>Disciplina: {student.course}</p>
      </div>
      <button onClick={onReset} className="text-red-500 hover:text-red-700">
        <FaArrowLeft size={24} />
      </button>
    </div>
  </motion.div>
);

const Payment = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = useCallback(async () => {
    if (!selectedStudent) return;
    try {
      const response = await fetch(
        `/transactions.list?student_id=${selectedStudent.id}`,
      );
      const data = await response.json();
      setTransactions(
        data.filter((transaction: Transaction) => !transaction.is_finished),
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
      subtitle="Asociado a un alumno."
      color="red"
    >
      <FaWallet size={20} className="text-white" />
      <div>
        <p className="text-3xl font-bold mb-2">Estudiante</p>
        {!selectedStudent ? (
          <StudentSearch onSelect={setSelectedStudent} />
        ) : (
          <StudentCard
            student={selectedStudent}
            onReset={() => setSelectedStudent(null)}
          />
        )}
      </div>

      <div>
        <p className="text-3xl font-bold">Transacciones</p>
        {selectedStudent ? (
          selectedStudent && (
            <CardTransaction
              transactions={transactions}
              reloadTransactions={fetchTransactions}
            />
          )
        ) : (
          <p className="text-lg py-5">
            Seleccione un estudiante para ver sus transacciones
          </p>
        )}
      </div>
      <button className="inline-flex items-center justify-center py-4 px-10 text-white bg-red-600 hover:bg-red-700">
        Comenzar Transacción
      </button>
    </CardOperator>
  );
};

export default Payment;
