import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Check localStorage when app loads
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);

        const verifyUser = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const response = await fetch('http://localhost:4000/api/verify', {
                        headers: {
                            'auth-token': localStorage.getItem('auth-token')
                        }
                    });
                    
                    if (response.ok) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        localStorage.removeItem('user');
                    }
                } catch (error) {
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };
    
        verifyUser();
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}