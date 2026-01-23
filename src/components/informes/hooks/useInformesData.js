//  frontend_AcademiA\src\components\informes\hooks\useInformesData.js

// Custom Hook que centraliza la lógica de las peticiones, gestionando los estados de las opciones y lo que el usuario va seleccionando.

import { useState, useEffect } from 'react';
import { getCiclosAll, getMateriasCurso } from '../../../api/apiMaterias';
import { getCursosCiclo } from '../../../api/apiCursos'

export const useInformesData = () => {
    // Estados para las opciones de los Selects
    const [ciclos, setCiclos] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [materias, setMaterias] = useState([]);

    // Estados de UI
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados para los valores seleccionados
    const [seleccion, setSeleccion] = useState({
        tipoInforme: '',
        ciclo: '',
        curso: '',
        materia: ''
    });

    // Cargar CICLOS cuando se selecciona un Tipo de Informe
    useEffect(() => {
        if (seleccion.tipoInforme) {
            const fetchCiclos = async () => {
                setLoading(true);
                try {
                     console.log('A punto de leer Ciclos lectivos');
                    const response = await getCiclosAll();
                    console.log('Ciclos lectivos obtenidos: ', response.data);
                    setCiclos(response.data);
                    setError(null);
                } catch (err) {
                    setError("Error al cargar ciclos");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchCiclos();
        } else {
            // Si limpian el tipo de informe, reseteamos todo lo de abajo
            setCiclos([]);
            setSeleccion(prev => ({ ...prev, ciclo: '', curso: '', materia: '' }));
        }
    }, [seleccion.tipoInforme]); // Se ejecuta cada vez que cambia el estado de seleccion.tipoInforme


    // Cargar CURSOS cuando se selecciona un Ciclo
    useEffect(() => {
        // Buscamos si hay un ID de ciclo seleccionado
        console.log('Lo que usa el useEffect como ID de ciclo selecionado: ', seleccion.ciclo);
        if (seleccion.ciclo) {
            const fetchCursos = async () => {
                setLoading(true); // Reutilizamos el loading general
                try {
                    // Llamamos al endpoint pasando el ID del ciclo
                    console.log('A punto de leer Cursos del ciclo seleccionado:', seleccion.ciclo );
                    const response = await getCursosCiclo(seleccion.ciclo);
                    console.log('Cursos obtenidos del ciclo seleccionado: ', response.data);
                    setCursos(response.data);
                } catch (err) {
                    setError("Error al cargar cursos");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchCursos();
        } else {
            // Si el usuario deselecciona el ciclo, vaciamos la lista de cursos
            setCursos([]);
        }
    }, [seleccion.ciclo]); // Se ejecuta cada vez que cambia el ID del ciclo


    // Cargar MATERIAS cuando se selecciona un Curso
    useEffect(() => {
        if (seleccion.curso) {
            const fetchMaterias = async () => {
                setLoading(true);
                try {
                    // Llamamos al endpoint pasando el ID del curso
                    const response = await getMateriasCurso(seleccion.curso);
                    console.log('Materias obtenidas del curso ', seleccion.curso, 'seleccionado: ', response.data);
                    setMaterias(response.data);
                } catch (err) {
                    setError("Error al cargar materias");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchMaterias();
        } else {
            // Si deseleccionan el curso, vaciamos la lista de materias
            setMaterias([]);
        }
    }, [seleccion.curso]); // Se dispara cuando cambia 'seleccion.curso'


    // Manejador de cambios (cascada)
    const handleCambio = (campo, valor) => {
        setSeleccion(prev => ({
            ...prev,
            [campo]: valor,
            // Si cambia un nivel superior, reseteamos los inferiores (en casacada)
            ...(campo === 'tipoInforme' && { ciclo: '', curso: '', materia: '' }),
            ...(campo === 'ciclo' && { curso: '', materia: '' }),
            ...(campo === 'curso' && { materia: '' }),
        }));
    };

    return { ciclos, cursos, materias, seleccion, loading, error, handleCambio };
};







