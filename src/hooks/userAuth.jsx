
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { logoutFirebase, userListener } from '../Config/authCall';
 
export const AuthContext = createContext(); //contexto a usar en la aplicación
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null); //el usuario con la sesión iniciada
 
  const [mounted, setMounted] = useState(false); //si esta montado el componente
 
  useEffect(() => {
    console.log(user)
    //si esta montado comienza el listener del usuario
    if (mounted)
      //solo empieza el listener si el usuario es true
      userListener(listenerUser);
    else setMounted(true);
  }, [mounted]);
  const listenerUser = (user) => {
    setUser(user);
  };
 
  const logout = () => {
    logoutFirebase();
  };
  const value = useMemo(
    () => ({
      user,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
 
export const useAuth = () => {
  return useContext(AuthContext);
};