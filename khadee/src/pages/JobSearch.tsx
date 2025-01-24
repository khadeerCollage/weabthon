import React, { useState, useEffect, FormEvent } from 'react'; // Added FormEvent
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
}

const JobSearch: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs', {
        params: { search: searchTerm, location },
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const handleSearch = (e: FormEvent) => { // Changed React.FormEvent to FormEvent
    e.preventDefault();
    fetchJobs();
  };

  const handleApply = async (jobId: string) => {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Failed to apply for job:', error);
    }
  };

  if (!user) {
    return <div>Please log in to search for jobs.</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Job Search</h1>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs..."
            className="flex-grow px-3 py-2 border rounded"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-1/4 px-3 py-2 border rounded"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Search
          </button>
        </div>
      </form>
      <div>
        {jobs.map((job) => (
          <div key={job.id} className="mb-4 p-4 border rounded">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-600">{job.company} - {job.location}</p>
            <p className="mt-2">{job.description}</p>
            <button
              onClick={() => handleApply(job.id)}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobSearch;
