import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import api from '../services/api';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import JobSearch from './pages/JobSearch';
import EmployerDashboard from './pages/EmployerDashboard';

const AuthContext = createContext(null);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/check');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to check auth:', error);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setUser(response.data);
      history.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const register = async (email: string, password: string, role: string) => {
    try {
      const response = await api.post('/auth/register', { email, password, role });
      setUser(response.data);
      history.push('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      history.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/resume-builder" component={ResumeBuilder} />
          <Route path="/job-search" component={JobSearch} />
          <Route path="/employer" component={EmployerDashboard} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;