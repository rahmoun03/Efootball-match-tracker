import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(AuthService.getCurrentUser());
    const [loading, setLoading] = useState(false); // Can be used for initial load check if needed

    const login = async (email, password) => {
        setLoading(true);
        try {
            const data = await AuthService.login(email, password);
            setUser({ email: email }); // Or decode token to get user info
            return data;
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password) => {
        return await AuthService.register(email, password);
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
