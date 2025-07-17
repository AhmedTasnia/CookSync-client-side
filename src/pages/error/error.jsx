import React from 'react';
import { Link } from 'react-router-dom';
import { Frown } from 'lucide-react';

const error = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen fira-sans-medium bg-gradient-to-br from-green-100 to-white px-4">
            <div className="text-center animate-fade-in-up">
                <h1 className="text-[10rem] font-extrabold text-green-600 drop-shadow-lg">
                    404
                </h1>
                <div className="flex items-center justify-center gap-2">
                    <Frown size={32} className="text-green-700" />
                    <p className="text-2xl font-semibold text-gray-800">Page Not Found</p>
                </div>
                <p className="mt-4 text-gray-600 max-w-md mx-auto">
                    Oops! It seems the page you're looking for has been pruned or never existed.
                </p>
                <Link
                    to="/"
                    className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-2xl shadow transition-all duration-300"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default error;
