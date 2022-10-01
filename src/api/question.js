import {axios} from 'utils';

/**
 * @param {{userId: number}} params
 */
export const getQuestionsByUserId = async params =>
    axios.get('/api/question/question-show-by-userId', {params});
/**
 * @param {{id: number}} params
 */
export const getQuestionById = async params =>
    axios.get('/api/question/question-show', {params});

/**
 * @param {{id: number}} params
 */
export const deleteQuestionById = async params =>
    axios.delete('/api/question/question', {params});

/**
 * @param {{question:{title: text, body:text}}} data
 */
export const postQuestionById = async data =>
  axios.post('/api/question/question', data);

//ADMIN
/**
 *
 */
export const getAllQuestions = async () =>
  axios.get('/api/question/admin/question-show-all');

/**
 * @param {{adminId: number, responseContents: {title: text, body:text}, questionId: number}} data
 */
export const postResponse = async data =>
  axios.post('/api/response/admin/response',data);