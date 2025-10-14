import { useContext } from 'react';
import { AuthContext } from '../AuthProvider';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isLoggedIn = useContext(AuthContext);

    if (!isLoggedIn.user) {
        return <Navigate to="/login" />;
    } else {
        return children;
    }
};

export default PrivateRoute;