//  frontend_AcademiA\src\api\ApiAsistencia\apiInasistencia.js

import api from '../api'; // Importamos la instancia configurada de axios (con interceptores, baseURL, etc.)

const ENDPOINT = '/api/estudiantes/asistencias'; // Endpoint base específico

//  Obtiene las inasistencias de un estudiante [getInasisteniasPorEstudiante]
export const getInasisteniasPorEstudiante = (estudianteId, year) =>
    api.get(`${ENDPOINT}${estudianteId}${year}`);

// Exportamos todas las funciones CRUD bajo un objeto para ser consumido por useGenericCrud
const apiEstudiantes = {
    getAll,
    get,
    create,
    update,
    remove,
    getMateriasPorEstudiante, // También puedes exportar funciones especiales
};

export default getInasisteniasPorEstudiante;
