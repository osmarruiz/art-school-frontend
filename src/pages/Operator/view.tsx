import { useState, useEffect } from 'react';
import { FaWallet } from 'react-icons/fa6';
import CardOperator from '../../components/Cards/CardOperator';
import TabletStudentSearch from '../../components/Tables/TableStudentSearch';
import { Student } from '../../types/student';
import { colorVariants } from '../../utils/colorVariants';
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

  useEffect(() => {
    if (selectedStudent) {
      navigate(`/student/${selectedStudent.id}`);
    }
  }, [selectedStudent, navigate]);

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
        {!selectedStudent && (
          <TabletStudentSearch onSelect={setSelectedStudent} color="red" />
        )}
      </div>
    </CardOperator>
  );
};

export default View;
