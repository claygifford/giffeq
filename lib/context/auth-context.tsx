import React, { createContext, useState } from 'react';

type Auth = {
  userName: string;
  createAccount: () => void;
};
const AuthContext = createContext({} as Auth);

function AuthProvider({ children }) {    
  const [userName, setUserName] = useState('John Smith');

  const createAccount = () => {
    setUserName('new name');
  };

  const value = {
    userName,
    createAccount,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
