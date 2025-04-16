
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='text-center pt-40 ' >
      <h1 className='text-primary'>404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" className='hover:text-primary'>Volver a la página principal</Link>
    </div>
  );
};

export default NotFound;