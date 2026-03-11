import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import AppLayout from '../layouts/AppLayout';
import PublicLayout from '../layouts/PublicLayout';
import ProtectedRoute from '../layouts/ProtectedRoute';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectWorkspacePage from '../pages/ProjectWorkspacePage';
import ExperimentBuilderPage from '../pages/ExperimentBuilderPage';
import P1ExperimentPage from '../pages/P1ExperimentPage';
import P2ExperimentPage from '../pages/P2ExperimentPage';
import P3ExperimentPage from '../pages/P3ExperimentPage';
import ResultsViewerPage from '../pages/ResultsViewerPage';
import ExperimentHistoryPage from '../pages/ExperimentHistoryPage';
import ModelSettingsPage from '../pages/ModelSettingsPage';
import ProfileSettingsPage from '../pages/ProfileSettingsPage';
import AdminPage from '../pages/AdminPage';

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <div className="p-8 text-scientific-red font-bold">Router Error: Route not found or failed to load.</div>,
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:projectId', element: <ProjectWorkspacePage /> },
      { path: 'experiment', children: [
        { path: 'new', element: <ExperimentBuilderPage /> },
        { path: 'p1/:id', element: <P1ExperimentPage /> },
        { path: 'p2/:id', element: <P2ExperimentPage /> },
        { path: 'p3/:id', element: <P3ExperimentPage /> },
      ]},
      { path: 'results/:experimentId', element: <ResultsViewerPage /> },
      { path: 'history', element: <ExperimentHistoryPage /> },
      { path: 'settings', children: [
        { path: 'models', element: <ModelSettingsPage /> },
        { path: 'profile', element: <ProfileSettingsPage /> },
      ]},
      { path: 'admin', element: <AdminPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);
