import { useHistory } from 'react-router-dom';
import { useUserContext } from './usercontext';


const Logout = () => {

    const nav = useHistory();
    const { setEmail } = useUserContext();

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem('email');
    setEmail(null)
    nav.push('/signin'); 
    };

  return (
    <button
      onClick={handleLogout}
      className="bg-blue-500 text-white p-2 rounded mb-4"
    >
      Logout
    </button>
  );
};

export default Logout;
