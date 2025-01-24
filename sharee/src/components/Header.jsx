import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Job Portal</Link>
        <nav>
          {user ? (
            <>
              <Link to="/dashboard" className="mr-4">Dashboard</Link>
              {user.role === 'jobseeker' && (
                <>
                  <Link to="/resume-builder" className="mr-4">Resume Builder</Link>
                  <Link to="/job-search" className="mr-4">Job Search</Link>
                </>
              )}
              {user.role === 'employer' && (
                <Link to="/employer" className="mr-4">Employer Dashboard</Link>
              )}
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
