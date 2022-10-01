import { axios } from '../utils';

/**
 *
 */
export const getNoticeList = async () =>
  axios.get('/api/notice/notice-list');
/**
 * @param {{id: number}} params
 */
export const getNoticeById = async params =>
  axios.get('/api/notice/notice-show', {params});
/**
 * @param {{adminId: number, notice:{title: text, body:text}}} data
 */
export const postNotice = async data =>
  axios.post('/api/notice/admin/notice', data);

/**
 * @param {{id: number}} params
 */
export const deleteNoticeById = async params =>
  axios.delete('/api/notice/admin/notice', {params});