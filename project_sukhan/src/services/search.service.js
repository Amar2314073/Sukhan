import axiosClient from "../utils/axiosClient";

export const searchService = {
    searchPoems: (q, params = {}) => axiosClient.get('/search/poems', {params: {q, ...params}}),
    searchPoets: (q, params = {}) => axiosClient.get('/search/poets', {params: {q, ...params}}),
    searchBooks: (q, params = {}) => axiosClient.get('/search/books', {params: {q, ...params}}),
    searchCollections: (q, params = {}) => axiosClient.get('/search/collections', {params: {q, ...params}}),
    searchCategories: (q, params = {}) => axiosClient.get('/search/categories', {params: {q, ...params}})
}