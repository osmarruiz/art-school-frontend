
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <div  className='text-center pt-40 '>
      <h1 className='text-primary'>403 - Acceso prohibido</h1>
      <p>No tienes permiso para acceder a esta página.</p>
      <Link to="/" className='text-primary'>Volver a la página principal</Link>
    </div>
  );
};

export default Forbidden;