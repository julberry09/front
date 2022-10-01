import {axios} from 'utils';

export const authenticatedByEmail = async data => axios.post('/api/user/auth/mail', data);

export const authnumcheckByEmail = async params => axios.get('/api/user/auth/confirm', {params});

export const signinByUserId = async data => axios.post('/api/user/auth/signin', data);

export const signupByUserId = async data => axios.post('/api/user/auth/signup', data);

export const updateByUserId = async (id,data) => axios.put('/api/user/' + id,data);

export const updateWoPhotoByUserId = async (id,data) => axios.put('/api/user/info/' + id,data);

export const deleteByUserId = async (id) => axios.delete('/api/user/' + id);

export const getUserByUserId = async (id) => axios.get('/api/user/' + id);

export const getPhotoByUserId = async (id) => axios.get('/api/user/auth/download-file/' + id) ;



/**
 * @param {{refreshToken: string}} data
 */
export const authRefresh = async data =>
    axios.put('/api/user/token-refresh',null,{
        headers: data
    });
/**
 * @param {{userId: text}} params
 */
export const authIdCheck = async params =>
    axios.get('/api/user/auth/check-id-duplicate', {params});

