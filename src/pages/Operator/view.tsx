import { useState, useEffect } from 'react';
import { FaWallet } from 'react-icons/fa6';
import CardOperator from '../../components/Cards/CardOperator';
import TabletStudent from '../../components/Tables/TableStudent';
import { Student } from '../../types/student';
import { colorVariants } from '../../types/colorVariants';
import clsx from 'clsx';

import { useNavigate } from 'react-router-dom';

const View = ({
  color,
}: {
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
}) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const navigate = useNavigate();

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
          <>{navigate(`/student/${selectedStudent.id}`)}</>
        )}
      </div>
    </CardOperator>
  );
};

export default View;
