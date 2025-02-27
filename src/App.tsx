import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Admin from './pages/Dashboard/Admin';
import Operator from './pages/Dashboard/Operator';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import OperatorLayout from './layout/OperatorLayout';
import DefaultLayout from './layout/DefaultLayout';
import PublicLayout from './layout/PublicLayout';
import NotFound from './pages/Error/NotFound';
import Forbidden from './pages/Error/Forbidden';
import Payment from './pages/Operator/Payment';
import Enrollment from './pages/Operator/Enrollment';
import FormLayout from './pages/FormLayout';
import FormElements from './components/Forms/FormElements';


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





      {/* Componentes */}
      <Route
        path="/ui/alerts"
        element={
          <>
            <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <Alerts />
          </>
        }
      />
      <Route
        path="/ui/form"
        element={
          <>
            <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <FormLayout />
          </>
        }
      />
      <Route
        path="/ui/form/elements"
        element={
          <>
            <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <FormElements />
          </>
        }
      />
      <Route
        path="/ui/buttons"
        element={
          <>
            <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <Buttons />
          </>
        }
      />
    </Routes>
  );
}
export default App;
