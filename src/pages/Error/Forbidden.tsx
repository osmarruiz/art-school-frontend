
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>403 - Acceso prohibido</h1>
      <p>No tienes permiso para acceder a esta página.</p>
      <Link to="/">Volver a la página principal</Link>
    </div>
  );
};

export default Forbidden;