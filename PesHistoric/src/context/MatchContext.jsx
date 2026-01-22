import { createContext, useContext, useState, useEffect } from 'react';
import MatchService from '../services/match.service';
import { useAuth } from './AuthContext';

const MatchContext = createContext();

export function MatchProvider({ children }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchMatches();
        } else {
            setMatches([]);
        }
    }, [user]);

    const fetchMatches = async () => {
        setLoading(true);
        try {
            const response = await MatchService.getAllMatches();
            // Assuming response.data is the list of matches from DRF
            // Mapper to match frontend structure if needed
            const formattedMatches = response.data.map(m => ({
                id: m.id,
                opponent: m.opponent_name,
                score: `${m.score_user ?? 0} - ${m.score_opponent ?? 0}`,
                date: new Date(m.created_at).toISOString().split('T')[0],
                result: calculateResult(m.score_user, m.score_opponent),
                stats: m.stats || {}
            }));
            setMatches(formattedMatches);
        } catch (error) {
            console.error("Failed to fetch matches", error);
        } finally {
            setLoading(false);
        }
    };

    const addMatch = async (matchData) => {
        try {
            // matchData here is expected to be FormData now from the creation page
            const response = await MatchService.createMatch(matchData);
            await fetchMatches(); // Refresh list to get formatted data from server
            return response.data;
        } catch (error) {
            console.error("Failed to add match", error);
            throw error;
        }
    };

    const calculateResult = (home, away) => {
        if (home === null || away === null) return 'pending';
        if (home > away) return 'win';
        if (home < away) return 'loss';
        return 'draw';
    };

    return (
        <MatchContext.Provider value={{ matches, addMatch, loading, fetchMatches }}>
            {children}
        </MatchContext.Provider>
    );
}

export function useMatches() {
    return useContext(MatchContext);
}
