import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  skills: string;
}

const ResumeBuilder: React.FC = () => {
  const authContext: { user: any } | null = useAuth();
  const user = authContext ? authContext.user : null;
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    skills: '',
  });

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await api.get('/resume');
        setResumeData(response.data);
      } catch (error) {
        console.error('Failed to fetch resume data:', error);
      }
    };

    fetchResumeData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/resume', resumeData);
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Failed to save resume:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/resume/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Failed to export resume:', error);
    }
  };

  if (!user) {
    return <div>Please log in to use the Resume Builder.</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Resume Builder</h1>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={resumeData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={resumeData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-2">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={resumeData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="education" className="block mb-2">Education</label>
          <textarea
            id="education"
            name="education"
            value={resumeData.education}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="experience" className="block mb-2">Experience</label>
          <textarea
            id="experience"
            name="experience"
            value={resumeData.experience}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="skills" className="block mb-2">Skills</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={resumeData.skills}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
          Save Resume
        </button>
        <button type="button" onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded">
          Export PDF
        </button>
      </form>
    </div>
  );
};

export default ResumeBuilder;
