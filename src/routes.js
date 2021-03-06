import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';
import Account from 'src/pages/Account';
import Paciente from 'src/pages/Pacientes/Paciente';
import Medico from 'src/pages/Medicos/Medico';
import Dashboard from 'src/pages/Dashboard';
import Login from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import Register from 'src/pages/Register';
import Procedimento from './pages/Procedimentos/Procedimento';
import Comercial from './pages/Comercial/Comercial';
import Acompanhamento from './pages/Acompanhamento/Acompanhamento';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element:<Dashboard/> },
      { path: 'account', element: <Account /> },
      { path: 'pacientes', element: <Paciente /> },
      { path: 'medicos', element: <Medico /> },
      { path: 'procedimentos', element: <Procedimento /> },
      { path: 'comercial', element: <Comercial /> },
      { path: 'acompanhamentos', element: <Acompanhamento /> },
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/login" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
