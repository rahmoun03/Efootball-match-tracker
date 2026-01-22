import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMatches } from '../context/MatchContext';

export default function MatchDetailsPage() {
    const { id } = useParams();
    const { matches } = useMatches();
    const match = matches.find(m => m.id === parseInt(id));

    if (!match) {
        return <div className="p-4">Match not found</div>;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
                <Link to="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Match Details
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Played on {match.date}
                    </p>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Opponent</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{match.opponent}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Score</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{match.score}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Result</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 uppercase">{match.result}</dd>
                        </div>
                    </dl>
                </div>

                {/* Stats Section */}
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Game Statistics</h4>
                    {match.stats && (
                        <div className="space-y-4">
                            {/* Stats Rows */}
                            {['possession', 'shots_on_target', 'completed_passes'].map(stat => (
                                <div key={stat} className="grid grid-cols-3 gap-4 items-center border-b border-gray-100 pb-2">
                                    <div className="text-right font-semibold text-indigo-600">
                                        {match.stats[stat]?.user || 0}
                                    </div>
                                    <div className="text-center text-xs text-gray-500 uppercase tracking-wider">
                                        {stat.replace(/_/g, ' ')}
                                    </div>
                                    <div className="text-left font-semibold text-gray-800">
                                        {match.stats[stat]?.opponent || 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
