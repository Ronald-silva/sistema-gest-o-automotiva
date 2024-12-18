// frontend/src/api/api.js //
import axios from 'axios';

const API_URL = 'http://localhost:5000/cars';

export const fetchCars = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addCar = async (car) => {
    const response = await axios.post(API_URL, car);
    return response.data;
};

export const deleteCar = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};
