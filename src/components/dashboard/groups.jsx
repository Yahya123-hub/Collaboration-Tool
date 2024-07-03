import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const GroupComponent = () => {
  const user = useSelector((state) => state.user); // Assuming Redux state contains user info
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/groups/${user.email}`); // Replace with your API endpoint
        setGroups(response.data.groups || []); // Assuming the API response has a 'groups' property
      } catch (error) {
        console.error('Error fetching groups:', error);
        setError('Error fetching groups');
        setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
      }
    };
    
    fetchGroups();
  }, [user.email]);

  return (
    <div className="min-h-screen flex items-start justify-center">
      <div className="bg-dark p-8 rounded-lg shadow-md w-full max-w-md backdrop-filter backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Groups You Are Part Of</h2>
        {error && (
          <div className="bg-red-500 text-white p-2 mb-4 rounded">
            {error}
          </div>
        )}
        {groups.length === 0 ? (
          <div className="text-white text-center">You have not made any groups yet.</div>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group._id} className="bg-gray-800 rounded-lg p-4">
                <p className="text-white">
                  <strong>Group ID:</strong> {group._id}
                </p>
                <div className="mt-2">
                  <p className="text-white">
                    <strong>Members:</strong>
                  </p>
                  <ul className="list-disc list-inside">
                    {group.members.map((member, index) => (
                      <li key={index} className="text-gray-300">
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-2 text-white">
                  <strong>Created At:</strong> {new Date(group.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupComponent;
