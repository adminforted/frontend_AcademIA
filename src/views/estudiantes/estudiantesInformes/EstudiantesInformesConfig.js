// frontend_AcademiA\src\views\estudiantes\estudiantesInformes\EstudiantesInformesConfig.js

import { cilChartLine, cilCheckCircle, cilCalendar, cilWarning } from '@coreui/icons';

export const EstudiantesInformesConfig = {
    title: "Informes Estudiantes",
    subtitle: "Reportes y listados académicos",

    // Campos calculados
    // Recibe un item (estudiante) y devuelve el item con campos extra
    mapper: (item) => {
        return {
            ...item, // Mantenemos los datos originales

            // Creamos el CAMPO CALCULADO
            condicion: item.nota >= 7 ? 'Aprobado' : 'No Aprobado',
        };
    },

    // LÓGICA DE CÁLCULOS
    // Recibe la lista procesada y devuelve el objeto summary
    summaryCalculator: (list) => {
        if (!list || list.length === 0) return {};

        // Calcular Promedio
        const totalNotas = list.reduce((acc, curr) => acc + curr.nota, 0); // Asumimos que 'nota' es numérico
        const promedio = (totalNotas / list.length).toFixed(2);

        // Contar Aprobados (Nota >= 7)
        const aprobados = list.filter(i => i.nota >= 7).length;

        // Contar Reprobados
        const reprobados = list.length - aprobados;

        return {
            average: promedio,
            approved: aprobados,
            failed: reprobados,
            total: list.length
        };
    },



    // Configuración de Filtros (para InformConfig.jsx)
    tipoInforme: [
        {
            id: 'tipo_informe',
            label: 'Tipo de Informe',
            type: 'select',
            options: [
                { label: 'Aprobados / Desaprobados', value: 'apro' },
                // { label: 'Rendimimiento Académico', value: 'acad' },
                // { label: 'Asistencia Mensual', value: 'asist' }
            ]
        }

    ],

    filtros: [

        {
            id: 'ciclo',
            label: 'Ciclo',
            type: 'select',
            endpoint: '/combos/ciclo' // El componente sabrá que debe buscar opciones
        },
        {
            id: 'curso',
            label: 'Curso',
            type: 'select',
            endpoint: '/combos/cursos' // El componente sabrá que debe buscar opciones
        },
        {
            id: 'materia',
            label: 'Materia',
            type: 'select',
            endpoint: '/combos/materia' // El componente sabrá que debe buscar opciones
        },
        {
            id: 'solo_aprobados',
            label: 'Solo Aprobados',
            type: 'checkbox',
            defaultValue: false
        }
    ],

    // Construcción del endPoint para traer las notas finales.
    // Recibe los filtros y devuelve la URL.
    getEndpoint: (filters) => {
        return `http://localhost:8000/api/notas/curso/${filters.curso}/materia/${filters.materia}/notas-final`;
    },

    // Configuración de Métricas (para StatsCard.jsx vía InformMain)
    stats: [
        { key: 'average', title: 'Promedio General', color: 'primary' /*, icon: cilChartLine */ },
        { key: 'approved', title: 'Materias Aprobadas', color: 'success' /*, icon: cilCheckCircle */},
        { key: 'total', title: 'Asistencia Global', color: 'info' /*, icon: cilCalendar */},
        { key: 'failed', title: 'Requieren Atención', color: 'danger' /*, icon: cilWarning */ }
    ],

    // Configuración de Tabla (para PrimeReact DataTable)
    columns: [
        { field: 'alumno', header: 'Alumno', sortable: true, exportable: true },
        {
            field: 'nota',
            header: 'Nota Final',
            sortable: true,
            bodyType: 'badge', // Le dice a la tabla que use Badge
            severity: (val) => val >= 7 ? 'success' : 'danger',
            exportable: true // Asegura que en Excel salga el número y no el componente HTML
        },
        {
            field: 'condicion',
            header: 'Condición',
            sortable: true,
            // bodyType: 'tag', // Estilo tipo etiqueta

        },
        { field: 'observaciones', header: 'Observaciones' }
    ]
};