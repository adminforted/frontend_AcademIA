// frontend_AcademiA\src\api\apiMaterias.jsx

import api from './api.js'; // Importamos la instancia configurada de axios (con interceptores, baseURL, etc.)

const ENDPOINT = '/api'; // Endpoint base específico


//  Obtiene todos los Ciclos Lectivos [getAll]
export const getCiclosAll = () => api.get(`${ENDPOINT}/ciclos/`);

// Exportamos todas las funciones CRUD bajo un objeto para ser consumido por el front
const apiMaterias = {
    getCiclosAll,
};

export default apiMaterias;