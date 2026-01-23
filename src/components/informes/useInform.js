// frontend_AcademiA\src\components\informes\useInform.js

// Hook genérico. Se encarga del ciclo de vida de la petición: Carga -> Petición -> Validación -> Formateo -> Estado Final.

import { useState, useEffect, useCallback } from 'react';
import api from '../../api/api' // Tu servicio de API con Axios/Fetch ya configurado

export const useInforme = (endpoint, params = {}) => {
    const [data, setData] = useState({ summary: {}, list: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log ("Params que recibe useInforms: ",params )

    const fetchInforme = useCallback(async () => {
        // Evitamos peticiones si no hay endpoint
        if (!endpoint) return;

        setLoading(true);
        setError(null);

        try {
            // FastAPI recibirá estos params como Query Parameters
            const response = await api.get(endpoint, { params });
            
            // Acá se puede aplicar lógica de formateo genérica, de ser necesario. 
            // Suponemos que el backend devuelve { summary: {...}, list: [...] }
            const result = response.data;

            setData({
                summary: result.summary || {},
                list: Array.isArray(result.list) ? result.list : []
            });
        } catch (err) {
            console.error("Error en el informe:", err);
            setError(err.response?.data?.detail || "Error al cargar el informe");
        } finally {
            setLoading(false);
        }
    }, [endpoint, JSON.stringify(params)]); // Se dispara cuando cambia el endpoint o los filtros


    useEffect(() => {
        fetchInforme();
    }, [fetchInforme]);

    return { data, loading, error, refetch: fetchInforme };
};