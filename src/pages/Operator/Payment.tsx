import CardOperator from '../../components/Cards/CardOperator';

const Payment = () => {


  return (
    <CardOperator title="Registrar Pago" subtitle="Registrar un pago asociado a un alumno." color="red" >
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
    </CardOperator>
  );
};

export default Payment;