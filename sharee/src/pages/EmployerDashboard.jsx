import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
}

interface Application {
  id: string;
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  status: string;
}

const EmployerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [newJob, setNewJob] = useState({ title: '', description: '', location: '' });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/employer/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get('/employer/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/employer/jobs', newJob);
      setNewJob({ title: '', description: '', location: '' });
      fetchJobs();
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  const handleApplicationStatus = async (applicationId: string, status: string) => {
    try {
      await api.put(`/employer/applications/${applicationId}`, { status });
      fetchApplications();
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };

  if (!user || user.role !== 'employer') {
    return <div>Access denied. This page is for employers only.</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Employer Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Post a New Job</h2>
        <form onSubmit={handleJobSubmit} className="max-w-lg">
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">Job Title</label>
            <input
              type="text"
              id="title"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2">Job Description</label>
            <textarea
              id="description"
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block mb-2">Location</label>
            <input
              type="text"
              id="location"
              value={newJob.location}
              onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Post Job
          </button>
        </form>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Job Listings</h2>
        {jobs.map((job) => (
          <div key={job.id} className="mb-4 p-4 border rounded">
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.location}</p>
            <p className="mt-2">{job.description}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Applications</h2>
        {applications.map((app) => (
          <div key={app.id} className="mb-4 p-4 border rounded">
            <h3 className="text-lg font-semibold">{app.applicantName}</h3>
            <p className="text-gray-600">{app.applicantEmail}</p>
            <p className="mt-2">Status: {app.status}</p>
            <div className="mt-2">
              <button
                onClick={() => handleApplicationStatus(app.id, 'accepted')}
                className="bg-green-600 text-white px-2 py-1 rounded mr-2"
              >
                Accept
              </button>
              <button
                onClick={() => handleApplicationStatus(app.id, 'rejected')}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployerDashboard;
