// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
// import Header from './components/Header';
//  // Ensure this path is correct
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import ResumeBuilder from './pages/ResumeBuilder';
// import JobSearch from './pages/JobSearch';
// import EmployerDashboard from './pages/EmployerDashboard';

// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Header />
//         <Routes>
//           <Route path="/login" component={<Login />} />
//           <Route path="/register" component={Register} />
//           <Route path="/dashboard" component={Dashboard} />
//           <Route path="/resume-builder" component={ResumeBuilder} />
//           <Route path="/job-search" component={JobSearch} />
//           <Route path="/employer" component={EmployerDashboard} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import JobSearch from './pages/JobSearch';
import EmployerDashboard from './pages/EmployerDashboard';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/job-search" element={<JobSearch />} />
          <Route path="/employer" element={<EmployerDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;