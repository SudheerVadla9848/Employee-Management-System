import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EmployeeSearch from './pages/EmployeeSearch';
import EmployeeAdd from './pages/EmployeeAdd';
import EmployeeView from './pages/EmployeeView';
import EmployeeEdit from './pages/EmployeeEdit';
import Layout from './components/Layout';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Update the document title based on the app name
    document.title = 'Employee Management System';
    
    // Find the title element with the data-default attribute and update it
    const titleElement = document.querySelector('title[data-default]');
    if (titleElement) {
      titleElement.textContent = 'Employee Management System';
    }
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/employees/search\" replace />} />
        <Route path="employees">
          <Route path="search" element={<EmployeeSearch />} />
          <Route path="add" element={<EmployeeAdd />} />
          <Route path=":id" element={<EmployeeView />} />
          <Route path=":id/edit" element={<EmployeeEdit />} />
        </Route>
      </Route>
      <Route path="*" element={
        isAuthenticated ? 
          <Navigate to="/employees/search\" replace /> : 
          <Navigate to="/login" replace />
      } />
    </Routes>
  );
}

export default App;