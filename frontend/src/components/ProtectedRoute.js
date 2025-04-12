import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    if (requiredRole && user.status !== requiredRole) {
        return <Navigate to="/userdashboard" />;
    }

    return children;
}