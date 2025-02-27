import { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaWallet } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import CardOperator from '../../components/Cards/CardOperator';
import CardTransaction from '../../components/Cards/CardTransaction';
import StudentSearch from '../../components/Search/StudentSearch';
import { Student } from '../../types/student';
import { Transaction } from '../../types/transaction';
import { colorVariants } from '../../types/colorVariants';
import clsx from 'clsx';

const StudentCard = ({
  student,
  onReset,
  color,
}: {
  student: Student;
  onReset: () => void;
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
}) => (
  <motion.div
    animate={{ scale: [0.9, 1] }}
    transition={{ duration: 0.1 }}
    className={clsx("p-4 rounded-lg ", colorVariants[color].bg)}
  >
    <div className="flex justify-between">
      <div className={clsx(colorVariants[color].text)}>
        <h3 className="text-lg font-bold">{student.name}</h3>
        <p>ID: {student.id_card}</p>
        <p>Disciplina: {student.course}</p>
      </div>
      <button onClick={onReset} className= {clsx( colorVariants[color].btnSc)}>
        <FaArrowLeft size={24} />
      </button>
    </div>
  </motion.div>
);

const Payment = ({
  color,
}: {
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
})  => {
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
        <p className={ clsx("text-3xl font-bold mb-2", colorVariants[color].text)}>Estudiante</p>
        {!selectedStudent ? (
          <StudentSearch onSelect={setSelectedStudent} color="red"/>
        ) : (
          <StudentCard
            student={selectedStudent}
            onReset={() => setSelectedStudent(null)}
            color="red"
          />
        )}
      </div>

      <div>
        <p className={ clsx("text-3xl font-bold mb-2", colorVariants[color].text)}>Transacciones</p>
        {selectedStudent ? (
          selectedStudent && (
            <CardTransaction
              transactions={transactions}
              reloadTransactions={fetchTransactions}
              color="red"
            />
          )
        ) : (
          <p className={ clsx("text-l py-5 font-medium ", colorVariants[color].text)}>
            Seleccione un estudiante para ver sus transacciones
          </p>
        )}
      </div>
      <button className={clsx("inline-flex items-center justify-center py-4 px-10", colorVariants[color].btn)}>
        Comenzar Transacción
      </button>
    </CardOperator>
  );
};

export default Payment;
