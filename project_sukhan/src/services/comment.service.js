import axiosClient from '../utils/axiosClient';

export const commentService = {
  getPoemComments: (poemId, page = 1) =>
    axiosClient.get(`/comments/poem/${poemId}?page=${page}`),

  postComment: (data) =>
    axiosClient.post('/comments/post', data),

  updateComment: (id, data) =>
    axiosClient.put(`/comments/${id}`, data),

  deleteComment: (id) =>
    axiosClient.delete(`/comments/${id}`)
};
