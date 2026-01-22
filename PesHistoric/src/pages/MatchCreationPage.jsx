import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Check, Loader } from 'lucide-react';
import { extractMatchData } from '../lib/ocr';
import { useMatches } from '../context/MatchContext';
import MatchService from '../services/match.service';

export default function MatchCreationPage() {
    const navigate = useNavigate();
    const { addMatch } = useMatches();
    const [file, setFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedData, setExtractedData] = useState({
        opponent: '',
        score: '',
        possession: { user: 0, opponent: 0 },
        shots_on_target: { user: 0, opponent: 0 },
        completed_passes: { user: 0, opponent: 0 }
    });

    const handleImageUpload = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setSelectedImage(URL.createObjectURL(selectedFile));
            setIsProcessing(true);
            try {
                // Use Frontend OCR (Tesseract.js)
                const data = await extractMatchData(selectedFile);

                setExtractedData({
                    opponent: data.opponent || '',
                    score: data.score || '',
                    possession: data.stats?.possession || { user: 0, opponent: 0 },
                    shots_on_target: data.stats?.shots_on_target || { user: 0, opponent: 0 },
                    completed_passes: data.stats?.completed_passes || { user: 0, opponent: 0 }
                });
            } catch (error) {
                console.error("Failed to extract data", error);
                alert("Failed to extract data from image");
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExtractedData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('opponent_name', extractedData.opponent);
        const [scoreUser, scoreOpponent] = extractedData.score.split('-').map(s => s.trim());
        formData.append('score_user', scoreUser || 0);
        formData.append('score_opponent', scoreOpponent || 0);

        // Also send raw stats as JSON if needed, or simple fields
        // Backend expects 'stats' JSON field, we can mock or construct it
        const stats = {
            possession: extractedData.possession,
            shots_on_target: extractedData.shots_on_target,
            completed_passes: extractedData.completed_passes
        };
        formData.append('stats', JSON.stringify(stats));

        if (file) {
            formData.append('screenshot', file);
        }

        try {
            await addMatch(formData);
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to create match", error);
            alert("Failed to create match");
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">New Match</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Upload a screenshot of the match statistics to automatically extract data.
                        </p>
                    </div>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Match Screenshot
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            {selectedImage ? (
                                                <div className="relative">
                                                    <img src={selectedImage} alt="Preview" className="mx-auto h-64 object-contain" />
                                                    {isProcessing && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                                                            <Loader className="animate-spin h-8 w-8 text-indigo-600" />
                                                            <span className="ml-2 text-indigo-600 font-medium">Processing...</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            )}
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                                >
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="opponent" className="block text-sm font-medium text-gray-700">
                                            Opponent Name
                                        </label>
                                        <input
                                            type="text"
                                            name="opponent"
                                            id="opponent"
                                            value={extractedData.opponent}
                                            onChange={handleChange}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="score" className="block text-sm font-medium text-gray-700">
                                            Score
                                        </label>
                                        <input
                                            type="text"
                                            name="score"
                                            id="score"
                                            value={extractedData.score}
                                            onChange={handleChange}
                                            placeholder="e.g. 3 - 1"
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-4">Detailed Stats</h4>

                                    {/* Possession */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500">Possession (User)</label>
                                            <input type="number" name="possession_user" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                onChange={(e) => setExtractedData(prev => ({ ...prev, possession: { ...prev.possession, user: e.target.value } }))} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500">Possession (Opponent)</label>
                                            <input type="number" name="possession_opponent" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                onChange={(e) => setExtractedData(prev => ({ ...prev, possession: { ...prev.possession, opponent: e.target.value } }))} />
                                        </div>
                                    </div>

                                    {/* Shots on Target */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500">Shots on Target (User)</label>
                                            <input type="number" name="shots_user" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                onChange={(e) => setExtractedData(prev => ({ ...prev, shots_on_target: { ...prev.shots_on_target, user: e.target.value } }))} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500">Shots on Target (Opponent)</label>
                                            <input type="number" name="shots_opponent" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                onChange={(e) => setExtractedData(prev => ({ ...prev, shots_on_target: { ...prev.shots_on_target, opponent: e.target.value } }))} />
                                        </div>
                                    </div>

                                    {/* Completed Passes */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500">Passes (User)</label>
                                            <input type="number" name="passes_user" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                onChange={(e) => setExtractedData(prev => ({ ...prev, completed_passes: { ...prev.completed_passes, user: e.target.value } }))} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500">Passes (Opponent)</label>
                                            <input type="number" name="passes_opponent" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                onChange={(e) => setExtractedData(prev => ({ ...prev, completed_passes: { ...prev.completed_passes, opponent: e.target.value } }))} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    Save Match
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
