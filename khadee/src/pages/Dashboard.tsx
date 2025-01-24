import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface UserProfile {
  name: string;
  education: string;
  skills: string[];
  experience: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    const fetchApplications = async () => {
      try {
        const response = await api.get('/applications');
        setApplications(response.data);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      }
    };

    fetchProfile();
    fetchApplications();
  }, []);

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {profile && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Education:</strong> {profile.education}</p>
          <p><strong>Skills:</strong> {profile.skills.join(', ')}</p>
          <p><strong>Experience:</strong> {profile.experience}</p>
        </div>
      )}
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Applications</h2>
        {applications.length > 0 ? (
          <ul>
            {applications.map((app: any) => (
              <li key={app.id} className="mb-2">
                <strong>{app.jobTitle}</strong> at {app.company} - Status: {app.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No applications yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
