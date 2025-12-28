//  frontend_AcademiA\src\utils\FormConfigs\formConfigs.js

//  Archivo de configuraci´n de los formularios de las modales.

// Función para obtener la fecha actual en formato YYYY-MM-DD
const getTodayDate = () => new Date().toISOString().split('T')[0];

export const docenteFields = [
    { name: 'apellido', label: 'Apellido', type: 'text', required: true },
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'fec_nac', label: 'Fecha de Nacimiento', type: 'date', required: true },
    { name: 'domicilio', label: 'Domicilio', type: 'text', required: true },
    { name: 'localidad', label: 'Localidad', type: 'text', required: true },
    { name: 'nacionalidad', label: 'Nacionalidad', type: 'text', required: true },
    { name: 'cel', label: 'Celular', type: 'text', required: false },
    { name: 'email', label: 'Correo Electrónico', type: 'email' },
    { name: 'dni', label: 'Documento', type: 'number', required: true, placeholder: 'Ingrese número sin puntos' },
    { name: 'created_at', label: 'Fecha Alta', type: 'date', required: true, defaultValue: getTodayDate() },
];

export const materiaFields = [
    { name: 'nombre_materia', label: 'Nombre de Materia', type: 'text', required: true, fullWidth: true },
    { name: 'id_curso', label: 'Curso Asignado', type: 'select', options: [] /* Se llenará desde API */ }
];