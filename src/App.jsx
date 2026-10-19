import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginAdmin from './pages/LoginAdmin';
import Dashboard from './pages/DashBoard';
import ProjectDetail from './pages/ProjectDetails';
import UserDetail from './pages/UserDetails';
import "./App.css";

// Composant simple de protection de route basé sur la présence du token JWT
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-couleur3 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
        <Routes>
          {/* Route de Connexion Admin */}
          <Route path="/" element={<LoginAdmin />} />

          {/* Dashboard Principal */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Vue détaillée d'un Projet */}
          <Route 
            path="/projects/:id" 
            element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            } 
          />

          {/* Vue détaillée d'un Utilisateur */}
          <Route 
            path="/users/:id" 
            element={
              <ProtectedRoute>
                <UserDetail />
              </ProtectedRoute>
            } 
          />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}