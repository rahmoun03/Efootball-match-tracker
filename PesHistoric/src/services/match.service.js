import api from './api';

const getAllMatches = () => {
    return api.get('matches/');
};

const getMatch = (id) => {
    return api.get(`matches/${id}/`);
}

const createMatch = (matchData) => {
    // matchData should be FormData if uploading image
    return api.post('matches/', matchData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};

const updateMatch = (id, data) => {
    return api.put(`matches/${id}/`, data);
}

const deleteMatch = (id) => {
    return api.delete(`matches/${id}/`);
}

const getMatchStatsSummary = () => {
    return api.get('matches/stats/summary/');
};

const extractMatchData = (imageFile) => {
    const formData = new FormData();
    formData.append('screenshot', imageFile);
    return api.post('ocr/extract/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const MatchService = {
    getAllMatches,
    getMatch,
    createMatch,
    updateMatch,
    deleteMatch,
    getMatchStatsSummary,
    extractMatchData,
};

export default MatchService;
