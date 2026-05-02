import { request } from './request';
import { apiClient } from './axiosClient';

const apiFeedback = '/api/feedback';

export const requestCreateFeedback = async (data) => {
    const res = await apiClient.post(`${apiFeedback}/create`, data);
    return res.data;
};

export const requestGetAllFeedback = async () => {
    const res = await apiClient.get(`${apiFeedback}/get-all-feedback`);
    return res.data;
};
