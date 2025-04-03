import axios from 'axios';
const BASE_URL = 'http://127.0.0.1:5000/api';

const postRequest = async (endpoint, payload) => {
    try {
        const response = await axios.post(`${BASE_URL}/${endpoint}`, payload);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};

export const evaluate_code = (concepts, st_code, model_type) => {
    return postRequest("evaluate_code", { concepts, st_code, model_type });
};

export const compare_code = (pr_code, st_code, model_type) => {
    return postRequest("compare_code", { pr_code, st_code, model_type });
}
