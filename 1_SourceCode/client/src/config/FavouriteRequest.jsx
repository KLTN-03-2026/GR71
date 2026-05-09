import { apiClient } from './axiosClient';

const apiFavourite = '/api/favourite';

export const requestToggleFavourite = async (productId) => {
    const res = await apiClient.post(`${apiFavourite}/toggle`, { productId });
    return res.data;
};

export const requestGetFavouriteByUserId = async () => {
    const res = await apiClient.get(`${apiFavourite}/get-favourite-by-user-id`);
    return res.data;
};

export const requestRemoveFavourite = async (productId) => {
    const res = await apiClient.delete(`${apiFavourite}/remove/${productId}`);
    return res.data;
};

export const requestCheckIsFavourite = async (productId) => {
    const res = await apiClient.get(`${apiFavourite}/check/${productId}`);
    return res.data;
};
