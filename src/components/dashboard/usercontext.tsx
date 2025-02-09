import { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  email: string | null;
  setEmail: (email: string) => void;
}

const UserContext = createContext<UserContextType>({
  email: null,
  setEmail: () => {},
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider: React.FC = ({ children }) => {
  const [email, setEmail] = useState<string | null>(() => {
    return localStorage.getItem('email');
  });

  useEffect(() => {
    if (email) {
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }
  }, [email]);

  return (
    <UserContext.Provider value={{ email, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};
