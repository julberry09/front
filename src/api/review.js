import {axios} from 'utils';

 export const getReviewByReviewerId = async params =>
 axios.get('/api/review/list', {params});


 export const registerReview = async params =>
    axios.post('/api/review', params);

export const modifyReview = async (id, params) =>
    axios.put('/api/review/' + id, {params});

export const deleteReview = async (id, params) =>
    axios.delete('/api/review' + id, {params});

/**
 * @param {{partyInfoId: number}} params
 */
export const getPartyMember = async (params) =>
    axios.get('/api/match/partymembers/summary-for-review', { params });

export const isReviewed = async params =>
    axios.get('/api/review/is-reviewed', {params});

export const myReview = async params =>
    axios.get('/api/review/received-review', {params});
