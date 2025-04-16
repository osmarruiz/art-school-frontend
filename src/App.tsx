import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

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
import Transactions from './pages/Admin/Transactions';
import Pendings from './pages/Admin/Pendings';
import PrivateRoute from './utils/PrivateRoute';
import ProtectedRoute from './utils/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import StudentProfile from './pages/StudentProfile';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
<>
    <Toaster position="bottom-right" />
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
          <PublicLayout bgClassName='login-bg'>
            <>
              <PageTitle title="Iniciar sesión | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <SignIn />
            </>
          </PublicLayout>
          </ProtectedRoute>
        }
      />

      {/* Rutas con DefaultLayout */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute
            element={
              <DefaultLayout bgClassName='admin-dashboard'>
                <>
                  <PageTitle title="Dashboard | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
                  <Admin />
                </>
              </DefaultLayout>
            }
           allowedRoles={['admin', 'viewer']}/>
        }
      />
      <Route
        path="/students"
        element={
          <PrivateRoute
        element={
          <DefaultLayout>
            <>
              <PageTitle title="Estudiantes | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <Students />
            </>
          </DefaultLayout>
          
        }
        allowedRoles={['admin', 'viewer']}/>
      }
      />
      <Route
        path="/disciplines"
        element={
          <PrivateRoute
        element={
          <DefaultLayout>
            <>
              <PageTitle title="Disciplinas | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <Disciplines />
            </>
          </DefaultLayout>
        }
        allowedRoles={['admin']}/>
      }
      />
      <Route
        path="/transactions"
        element={
          <PrivateRoute
        element={
          <DefaultLayout>
            <>
              <PageTitle title="Transacciones | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <Transactions />
            </>
          </DefaultLayout>
        }
        allowedRoles={['admin', 'viewer']}/>
      }
      />
      <Route
        path="/pendings"
        element={
          <PrivateRoute
        element={
          <DefaultLayout>
            <>
              <PageTitle title="Pendientes | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <Pendings />
            </>
          </DefaultLayout>
        }
        allowedRoles={['admin', 'viewer']}/>
      }
      />
      {/* Rutas con OperatorLayout */}
      <Route
        path="/operator"
        element={
          <PrivateRoute
        element={
          <OperatorLayout>
            <>
              <PageTitle title="Dashboard | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <Operator />
            </>
          </OperatorLayout>
        }
        allowedRoles={['operator']}/>
      }
      />
      <Route
        path="/payment"
        element={
          <PrivateRoute
        element={
          <OperatorLayout>
            <>
              <PageTitle title="Registrar Pago | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <Payment color="red" />
            </>
          </OperatorLayout>
        }
        allowedRoles={['operator']}/>
      }
      />
      <Route
        path="/enrollment"
        element={
          <PrivateRoute
        element={
          <OperatorLayout>
            <>
              <PageTitle title="Matricular Estudiante | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <Enrollment color="violet" key={Date.now()}/>
            </>
          </OperatorLayout>
        }
        allowedRoles={['operator']}/>
      }
      />
      <Route
        path="/renew"
        element={
          <PrivateRoute
        element={
          <OperatorLayout>
            <>
              <PageTitle title="Renovar Matr&iacute;cula | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <Renew color="orange" />
            </>
          </OperatorLayout>
        }
        allowedRoles={['operator']}/>
      }
      />
      <Route
        path="/student/:id"
        element={
          <PrivateRoute
        element={
          <OperatorLayout>
            <>
              <PageTitle title="Perfil de Estudiante | Escuela de Bellas Artes “Mariana Sansón Argüello”" />
              <StudentProfile key={Date.now()}/>
            </>
          </OperatorLayout>
        }
        allowedRoles={['operator','admin','viewer']}/>
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
    </>
  );
}
export default App;
