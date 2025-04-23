import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../images/logo/logo.svg';
import {
  FaChartSimple,
  FaX,
  FaMoneyBillWave,
  FaPencil,
  FaBook,
} from 'react-icons/fa6';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../../utils/AuthContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const { user } = useAuth();
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="sidebar expanded">
      <aside
        ref={sidebar}
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-boxdark duration-300 ease-linear lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 border-stroke ">
          <NavLink to="/">
            <img src={Logo} alt="Logo" width={200} className=" pl-10 " />
          </NavLink>

          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden"
          >
            <FaX />
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            {/* <!-- Menu Group --> */}
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark1 ">
                MENÚ DE OPCIONES
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5">
                {/* <!-- Menu Item Dashboard --> */}
                <li>
                  <NavLink
                    to="/"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-boxdark-2  ${
                      (pathname === '/' || pathname.includes('dashboard')) &&
                      'bg-boxdark-2'
                    }`}
                  >
                    <FaChartSimple />
                    Dashboard
                  </NavLink>
                </li>
                {/* <!-- Menu Item Dashboard --> */}

                {/* <!-- Menu Item Tables --> */}
                <li>
                  <NavLink
                    to="/students"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-boxdark-2  ${
                      pathname.includes('students') && 'bg-boxdark-2'
                    }`}
                  >
                    <FaBook />
                    Estudiantes
                  </NavLink>
                </li>
                {/* <!-- Menu Item Tables --> */}

                {/* <!-- Menu Item Ingresos --> */}
                <li>
                  <NavLink
                    to="/transactions"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-boxdark-2  ${
                      pathname.includes('transactions') && 'bg-boxdark-2'
                    }`}
                  >
                    <FaMoneyBillWave />
                    Transacciones
                  </NavLink>
                </li>
                {/* <!-- Menu Item Ingresos --> */}

                {/* <!-- Menu Item Pendientes --> */}
                <li>
                  <NavLink
                    to="/pendings"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-boxdark-2  ${
                      pathname.includes('pendings') && 'bg-boxdark-2'
                    }`}
                  >
                    <FaPencil />
                    Pendientes
                  </NavLink>
                </li>
                {/* <!-- Menu Item Profile --> */}

                {/* <!-- Menu Item Settings --> */}
                {user?.role === 'admin' && (
                  <li>
                    <NavLink
                      to="/disciplines"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-boxdark-2  ${
                        pathname.includes('disciplines') && 'bg-boxdark-2'
                      }`}
                    >
                      <FaStar />
                      Disciplinas
                    </NavLink>
                  </li>
                )}
                {/* <!-- Menu Item Settings --> */}
              </ul>
            </div>
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
