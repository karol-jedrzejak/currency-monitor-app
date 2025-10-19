import React from 'react';
import { TriangleAlert } from 'lucide-react';

const ErrorPage = () => {
    return (
        <div className="flex-grow flex justify-center items-center">
            <div className="text-red-600 p-2">404 - Strony nie znaleziono</div>
            <div className="text-red-600 p-2"><TriangleAlert size={48}/></div>
        </div>
    );
}

export default ErrorPage;