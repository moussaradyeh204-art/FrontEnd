import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider }  from './context/AuthContext';
import HomePage     from './pages/HomePage';
import CustomerPage from './pages/CustomerPage';
import EmployeePage from './pages/EmployeePage';
import ManagerPage  from './pages/ManagerPage';
import CheckoutPage from './pages/CheckoutPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"          element={<HomePage />}     />
            <Route path="/customer"  element={<CustomerPage />} />
            <Route path="/employee"  element={<EmployeePage />} />
            <Route path="/manager"   element={<ManagerPage />}  />
            <Route path="/checkout"  element={<CheckoutPage />} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
