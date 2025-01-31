import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/Cards/CardDataStats';

const Operator: React.FC = () => {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const horaActual = new Date().getHours();

    if (horaActual >= 5 && horaActual < 12) {
      setMensaje('¡Buenos días! ☀️');
    } else if (horaActual >= 12 && horaActual < 18) {
      setMensaje('¡Buenas tardes! 🌤️');
    } else {
      setMensaje('¡Buenas noches! 🌙');
    }
  }, []);

  return (
    <>
      <div className="grid place-items-center ">
        <div className=" bg-white dark:bg-boxdark dark:border-strokedark p-17 rounded-sm border border-stroke  ">
          <div className=" mb-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {mensaje}
              </h4>
              <span className="text-s font-medium">
                Selecciona cualquiera de las siguientes operaciones
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5 ">
            <button>
              <CardDataStats title="Matricular Estudiante" color="violet">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="18"
                  fill="currentColor"
                  className="bi bi-person-plus fill-white"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                  <path
                    fill-rule="evenodd"
                    d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"
                  />
                </svg>
              </CardDataStats>
            </button>
            <button>
              <CardDataStats title="Registrar Pago" color="red">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="18"
                  fill="currentColor"
                  className="bi bi-wallet2 fill-white"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
                </svg>
              </CardDataStats>
            </button>
            <button>
              <CardDataStats title="Renovar Matricula" color="orange">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="18"
                  fill="currentColor"
                  className="bi bi-arrow-repeat fill-white"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
                  <path
                    fill-rule="evenodd"
                    d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"
                  />
                </svg>
              </CardDataStats>
            </button>
            <button>
              <CardDataStats title="Vizualizar Estudiantes" color="green">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="18"
                  fill="currentColor"
                  className="bi bi-eyeglasses fill-white"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4m2.625.547a3 3 0 0 0-5.584.953H.5a.5.5 0 0 0 0 1h.541A3 3 0 0 0 7 8a1 1 0 0 1 2 0 3 3 0 0 0 5.959.5h.541a.5.5 0 0 0 0-1h-.541a3 3 0 0 0-5.584-.953A2 2 0 0 0 8 6c-.532 0-1.016.208-1.375.547M14 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
                </svg>
              </CardDataStats>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Operator;
