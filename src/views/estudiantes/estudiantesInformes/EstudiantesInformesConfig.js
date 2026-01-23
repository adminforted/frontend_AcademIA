// frontend_AcademiA\src\views\estudiantes\estudiantesInformes\EstudiantesInformesConfig.js

import { cilChartLine, cilCheckCircle, cilCalendar, cilWarning } from '@coreui/icons';

export const EstudiantesInformesConfig = {
    title: "Informes de Estudiantes",
    subtitle: "Reportes y listados académicos",
    endpoint: "/estudiantes/informes", // URL de la FastAPI

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

    // Configuración de Métricas (para StatsCard.jsx vía InformMain)
    stats: [
        { key: 'average', title: 'Promedio General', color: 'primary', icon: cilChartLine },
        { key: 'approved', title: 'Materias Aprobadas', color: 'success', icon: cilCheckCircle },
        { key: 'attendance', title: 'Asistencia Global', color: 'info', icon: cilCalendar },
        { key: 'failed', title: 'Requieren Atención', color: 'danger', icon: cilWarning }
    ],

    // Configuración de Tabla (para PrimeReact DataTable)
    columns: [
        { field: 'nombre_alumno', header: 'Alumno', sortable: true, exportable: true },
        {
            field: 'nota_final',
            header: 'Nota Final',
            bodyType: 'badge', // Le dice a la tabla que use Badge
            severity: (val) => val >= 7 ? 'success' : 'danger',
            exportable: true // Asegura que en Excel salga el número y no el componente HTML
        },
        {
            field: 'condicion',
            header: 'Condición',
            bodyType: 'tag' // Otro estilo visual
        },
        { field: 'observaciones', header: 'Observaciones' }
    ]
};