import { Outlet, Link } from 'react-router-dom';
import { LogOut, PlusCircle, History } from 'lucide-react';

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="text-xl font-bold text-indigo-600">eFootball Tracker</span>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link to="/dashboard" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    <History className="w-4 h-4 mr-2" />
                                    History
                                </Link>
                                <Link to="/matches/new" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    New Match
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                                <LogOut className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
}
