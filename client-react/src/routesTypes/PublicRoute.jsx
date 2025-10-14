import { useContext } from 'react';
import { AuthContext } from '../AuthProvider';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const isLoggedIn = useContext(AuthContext);

    if (isLoggedIn.user) {
        return <Navigate to="/allCurrencies" />;
    } else {
        return children;
    }
};

export default PublicRoute;