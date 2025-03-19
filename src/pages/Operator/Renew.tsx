import { useState, } from 'react';
import {  FaRepeat } from 'react-icons/fa6';
import CardOperator from '../../components/Cards/CardOperator';
import CardTransaction from '../../components/Cards/CardTransaction';
import StudentSearch from '../../components/Tables/TableStudent';
import { Student } from '../../types/student';
import { colorVariants } from '../../types/colorVariants';
import clsx from 'clsx';
import CardStudent from '../../components/Cards/CardStudent';

const Renew = ({
  color,
}: {
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
})  => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  //const [transactions, setTransactions] = useState<Transaction[]>([]);

  

  return (
    <CardOperator
      title="Renovar matricula"
      subtitle="Asociado a un alumno."
      color="orange"
    >
      <FaRepeat size={20} className="text-white" />
      <div>
        <p className={ clsx("text-3xl font-bold mb-2", colorVariants[color].text)}>Estudiante</p>
        {!selectedStudent ? (
          <StudentSearch onSelect={setSelectedStudent} color="red"/>
        ) : (
          <CardStudent
            student={selectedStudent}
            onReset={() => setSelectedStudent(null)}
            color="orange"
          />
        )}
      </div>

      <div>
        <p className={ clsx("text-3xl font-bold mb-2", colorVariants[color].text)}>Renovaciones de matr&iacute;cula</p>
        {selectedStudent ? (
          selectedStudent && (
            <CardTransaction
              transactions={transactions}
              reloadTransactions={fetchTransactions}
              color="orange"
            />
          )
        ) : (
          <p className={ clsx("text-l py-5 font-medium ", colorVariants[color].text)}>
            Seleccione un estudiante para ver sus matr&iacute;culas
          </p>
        )}
      </div>

      <button className={clsx("inline-flex items-center justify-center py-4 px-10", colorVariants[color].btn)}>
        Renovar matricula
      </button>
    </CardOperator>
  );
};

export default Renew;
