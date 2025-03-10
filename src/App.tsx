import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Admin from './pages/Dashboard/Admin';
import Operator from './pages/Dashboard/Operator';
import OperatorLayout from './layout/OperatorLayout';
import DefaultLayout from './layout/DefaultLayout';
import PublicLayout from './layout/PublicLayout';
import NotFound from './pages/Error/NotFound';
import Forbidden from './pages/Error/Forbidden';
import Payment from './pages/Operator/Payment';
import Enrollment from './pages/Operator/Enrollment';
import Renew from './pages/Operator/Renew';
import Students from './pages/Admin/Students';
import Disciplines from './pages/Admin/Disciplines';


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 600);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      {/* Rutas con DefaultLayout */}
      <Route
        path="/"
        element={
          <DefaultLayout>
            <>
              <PageTitle title="Dashboard | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <Admin />
            </>
          </DefaultLayout>
        }
      />
      <Route
        path="/students"
        element={
          <DefaultLayout>
            <>
              <PageTitle title="Estudiantes | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <Students />
            </>
          </DefaultLayout>
        }
      />
       <Route
        path="/disciplines"
        element={
          <DefaultLayout>
            <>
              <PageTitle title="Estudiantes | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <Disciplines />
            </>
          </DefaultLayout>
        }
      />
      {/* Rutas con OperatorLayout */}
      <Route
        path="/operator"
        element={
          <OperatorLayout>
            <>
              <PageTitle title="Dashboard | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <Operator />
            </>
          </OperatorLayout>
        }
      />
      <Route
        path="/payment"
        element={
          <OperatorLayout>
            <>
              <PageTitle title="Registrar Pago | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <Payment color='red'/>
            </>
          </OperatorLayout>
        }
      />
      <Route
        path="/enrollment"
        element={
          <OperatorLayout>
            <>
              <PageTitle title="Matricular Estudiante | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <Enrollment color='violet'/>
            </>
          </OperatorLayout>
        }
      />
      <Route
        path="/renew"
        element={
          <OperatorLayout>
            <>
              <PageTitle title="Renovar Matr&iacute;cula | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <Renew color='orange'/>
            </>
          </OperatorLayout>
        }
      />
      {/* Rutas con PublicLayout */}
      <Route
        path="/auth/signin"
        element={
          <PublicLayout>
            <>
              <PageTitle title="Iniciar sesi&oacute;n | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <SignIn />
            </>
          </PublicLayout>
        }
      />
      <Route
        path="*"
        element={
          <PublicLayout>
            <>
              <PageTitle title="P&aacute;gina no encontrada | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <NotFound />
            </>
          </PublicLayout>
        }
      />
      <Route
        path="/403"
        element={
          <PublicLayout>
            <>
              <PageTitle title="Acceso prohibido | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <Forbidden />
            </>
          </PublicLayout>
        }
      />

    </Routes>
  );
}
export default App;
