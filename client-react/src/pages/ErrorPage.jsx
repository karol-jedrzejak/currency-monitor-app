import { TriangleAlert } from 'lucide-react';

const ErrorPage = () => {
    return (
        <div className="flex-grow flex justify-center items-center">
            <div className='bg-white dark:bg-gray-950 flex justify-center items-center p-6 shadow-md rounded-2xl'>
                <div className="text-red-600 p-2">404 - Strony nie znaleziono</div>
                <div className="text-red-600 p-2"><TriangleAlert size={48}/></div>
            </div>
        </div>
    );
}

export default ErrorPage;