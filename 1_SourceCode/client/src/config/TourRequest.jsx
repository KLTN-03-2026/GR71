import { request } from './request';
import { apiClient } from './axiosClient';

const apiTour = '/api/tour';

export const requestGetAllTour = async () => {
    const res = await request.get(`${apiTour}/all`);
    return res.data;
};

export const requestCreateTour = async (data) => {
    const res = await apiClient.post(`${apiTour}/create`, data);
    return res.data;
};

export const requestUploadImagesTour = async (data) => {
    const res = await request.post(`${apiTour}/upload-images`, data);
    return res.data;
};

export const requestUpdateTour = async (id, data) => {
    const res = await apiClient.put(`${apiTour}/update/${id}`, data);
    return res.data;
};

export const requestGetAllTourByAdmin = async () => {
    const res = await request.get(`${apiTour}/all-admin`);
    return res.data;
};

export const requestDeleteTour = async (id) => {
    const res = await apiClient.delete(`${apiTour}/delete/${id}`);
    return res.data;
};

export const requestGetTourById = async (id) => {
    const res = await request.get(`${apiTour}/detail/${id}`);
    return res.data;
};

export const requestGetAllDestination = async () => {
    const res = await request.get(`${apiTour}/all-destination`);
    return res.data;
};

export const requestSearchTour = async (searchData) => {
    const res = await request.post(`${apiTour}/search`, searchData);
    return res.data;
};
