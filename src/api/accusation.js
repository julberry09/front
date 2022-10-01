import {axios} from 'utils';

export const getPartyMembers = async params =>
    axios.get('/api/accusation/party-members', {params});

export const getAccusationsByMemberId = async params =>
    axios.get('/api/accusation', {params});

export const getAccusationByMemberId = async (id, params) =>
    axios.get('/api/accusation/list/' + id, {params});

export const registerAccusation = async params =>
    axios.post('/api/accusation', params);

export const modifyAccusation = async (id, params) =>
    axios.put('/api/accusation/list/' + id, {params});

export const deleteAccusation = async (id, params) =>
    axios.delete('/api/accusation/list/' + id, {params});

export const getAdminAccusations = async params =>
    axios.get('/api/accusation/admin/accusations', {params});

export const getAdminAccusation = async (id, params) =>
    axios.get('/api/accusation/admin/accusations/' + id, {params});

export const processAccusationByAdmin = async (id, params) =>
    axios.put('/api/accusation/admin/accusations/' + id, params);
