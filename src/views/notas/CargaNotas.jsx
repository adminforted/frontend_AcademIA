//  frontend_AcademiA\src\views\notas\CargaNotas.jsx

import React, { useState, useEffect } from 'react'
import { CButton, CCard, CCardHeader, CCardBody, CCardFooter, CCol, CRow, CContainer, CFormInput, CFormLabel, } from '@coreui/react'

import GenericTable from '../../components/usersTable/GenericTable.jsx'
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'

//   Para cargar la planilla modelo
import ModeloPlanilla from './Modelo_Planilla.jsx'

//  Importar hook para obtener datos de los estudiantes
//  import { useStudentsData } from '../../hooks/useStudentsData.js'

//  Importar hook para obtener notas de los estudiantes
import { usePlanillaCalificaciones } from '../../hooks/useCalificaciones.js';

// Importar configuración de columnas
import { getTableColumns } from '../../utils/columns.js'

//  Importamos el servicio apiMaterias que contiene la función getCiclosAll.
import apiMaterias, { getCiclosAll } from '../../api/apiMaterias.jsx'

// Estado inicial para filtros
const initialFilters = []



// Importar componentes reutilizables
import TablePagination from '../../components/tablePagination/TablePagination.jsx'
import AdvancedFilters from '../../components/advancedFilters/AdvancedFilters.jsx'
import TableActions from '../../components/tableActions/TableActions.jsx'
import ModalConfirmDel from '../../modals/ModalConfirmDel.jsx'
import ModalNewEdit from '../../modals/ModalNewEdit.jsx'


import '../../css/PersonalStyles.css'


export default function CargaNotaAlumno() {


    const [unitCharge, setUnitCharge] = useState(false);

    const [formData, setFormData] = useState({
        nota: 8.5, // Valor inicial
        alumno: '',
        tipo: ''
    });

    // Usamos el hook para traer datos y los desestructuramos
    /*
    const {
        studentsData: tableData,
        setStudentsData: setTableData,
        loading
    } = useStudentsData();

    */

    const [materiaId, setMateriaId] = useState('');
    const [ciclos, setCiclos] = useState([]);
    const [selectedCicloId, setSelectedCicloId] = useState(""); // ← guarda solo el ID como string o number



    const {
        data: tableData,
        loading,
        error
    } = usePlanillaCalificaciones(materiaId, ciclos);

    console.log('materiaId:', materiaId);
    console.log('tableData:', tableData);
    console.log('loading:', loading);
    console.log('error:', error);


    // Manejador genérico de cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            // Convertir la nota a número si es el campo 'nota'
            [name]: name === 'nota' ? parseFloat(value) : value,
        }));
    };

    // ---------- Estados principales ----------
    const [searchTerm, setSearchTerm] = useState('') // Búsqueda global
    const [columnFilters, setColumnFilters] = useState(initialFilters) // Filtros por columna
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 }) // Paginación
    const [sorting, setSorting] = useState([]) // Ordenamiento


    // ==================== CARGAR LOS CICLOS AL MONTAR EL COMPONENTE ====================
    useEffect(() => {
        const fetchCiclos = async () => {
            try {
                const response = await apiMaterias.getCiclosAll();  // Ejecuto la apiMaterias.getCiclos
                setCiclos(response.data);   // Guardo los datos en la variable ciclos


            } catch (err) {
                console.error("Error al cargar ciclos lectivos:", err);
            }
        };
        fetchCiclos();
    }, []);



    // ==================== CONFIGURACIÓN ESPECÍFICA DE COLUMNAS PARA CARGA NOTAS ====================
    const cargaNotasColumnsConfig = [
        { id: 'index', header: 'Nº', cell: ({ row }) => row.index + 1 },

        {
            accessorKey: 'apellido_nombre',
            id: 'alumno',
            header: 'Alumno/a',
            cell: ({ row }) => {
                const a = row.original.alumno;
                return `${a.apellido.toUpperCase()}, ${a.nombre.toUpperCase()}`;
            },
        },
        { accessorKey: '', header: '1ºT' },
        { accessorKey: '', header: '2ºT' },
        { accessorKey: '', header: '3ºT' },
        { accessorKey: '', header: 'Prom.' },
        { accessorKey: '', header: 'DIC.' },
        { accessorKey: '', header: 'FEB.' },
        { accessorKey: '', header: 'Calif. Def.' },
        { accessorKey: '', header: 'Observaciones' },
    ]

    // ==================== GENERACIÓN DE COLUMNAS CON FUNCIÓN REUTILIZABLE ====================

    const columns = getTableColumns(
        cargaNotasColumnsConfig,
        () => { }, // funciones vacías o null
        null,
        { showSelection: false, showActions: false }
    )

    // ---------- Configuración de TanStack Table ----------
    const table = useReactTable({
        data: tableData || [], // Por seguridad, por si los datos son nulos
        columns,
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setSearchTerm,
        onColumnFiltersChange: setColumnFilters,
        state: {
            pagination,
            sorting,
            globalFilter: searchTerm,
            columnFilters,
        },
    })

    return (
        <div>

            {/* ----------  BODY --------------- */}
            {/* CONFIGURACIÓN (Mantenida del estilo original para contexto) */}
            <CCard className="mb-4 no-print shadow-sm">
                <CCardHeader className="fw-semibold bg-white">
                    Filtros de Selección
                </CCardHeader>
                <CCardBody>
                    <CRow className="g-3">
                        <CCol md={3}>
                            <label className="form-label text-uppercase small fw-semibold text-secondary">Ciclo Lectivo</label>

                            {/* Select Dinámico con los datos de la DB */}
                            <select
                                className="form-select"
                                value={selectedCicloId}
                                onChange={(e) => setSelectedCicloId(e.target.value)}
                            >
                                {/*  Primera opcióndel select */}
                                <option value="">Seleccionar Ciclo</option>

                                {/*  Mapeo las opciones restantes del select */}
                                {ciclos.map((ciclos) => (
                                    <option
                                        key={ciclos.id_ciclo_lectivo}
                                        value={ciclos.id_ciclo_lectivo}
                                    >
                                        {ciclos.nombre_ciclo_lectivo}
                                    </option>
                                ))}
                            </select>

                        </CCol>
                        <CCol md={3}>
                            <label className="form-label text-uppercase small fw-semibold text-secondary">Curso</label>
                            <select className="form-select">
                                <option>5° A</option>
                            </select>
                        </CCol>
                        <CCol md={3}>
                            <label className="form-label text-uppercase small fw-semibold text-secondary">Materia</label>
                            <select className="form-select" onChange={(e) => setMateriaId(e.target.value)}>
                                <option value="">Seleccione materia</option>
                                <option value="2">TIC</option>
                                <option value="1">Matemática</option>
                            </select>
                        </CCol>



                        <CCol md={3} className="d-flex align-items-end ">
                            <div className="form-check mb-0 text-nowrap">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="checkCargaIndividual"
                                    checked={unitCharge}  // Es mejor controlar el input con 'checked' vinculado al estado
                                    onChange={(e) => setUnitCharge(e.target.checked)} // Forma correcta de actualizar
                                />
                                <label
                                    className="form-check-label text-uppercase small fw-semibold text-secondary"
                                    htmlFor="checkCargaIndividual"
                                >
                                    Carga Individual
                                </label>
                            </div>
                        </CCol>
                    </CRow>
                    {unitCharge && (
                        <CRow className="g-3">
                            <CCol md={3}>
                                <label className="form-label text-uppercase small fw-semibold text-secondary">Alumno</label>
                                <select className="form-select">
                                    <option>Ruiz, Juan Carlos</option>
                                </select>
                            </CCol>
                            <CCol md={3}>
                                <label className="form-label text-uppercase small fw-semibold text-secondary">Tipo</label>
                                <select className="form-select">
                                    <option>1°T</option>
                                </select>

                            </CCol>
                            <CCol md={4}>
                                <CFormLabel htmlFor="nota">
                                    Nota (Ej: 1.0 a 10.0) <span className="text-danger">*</span>
                                </CFormLabel>
                                <CFormInput
                                    id="nota"
                                    name="nota"
                                    type="number"
                                    step="0.5" // Permite notas con medio punto
                                    min="1.0"
                                    max="10.0"
                                    value={formData.nota}
                                    onChange={handleChange}
                                    placeholder="Ej: 8.5"
                                    required
                                />
                            </CCol>
                        </CRow>
                    )}
                </CCardBody>
            </CCard>

            {/* VISTA PREVIA DEL INFORME (REPLICA DE LA IMAGEN) */}
            {!unitCharge && (
                <CCard className="shadow-sm">
                    <CCardHeader className="fw-semibold bg-white d-flex justify-content-between">
                        <span>Vista Previa del Acta</span>
                        <span className="text-muted small">Página 1 de 7</span>
                    </CCardHeader>

                    <CCardBody className="p-4" style={{ overflowX: 'auto' }}>

                        {/* Contenedor estilo "Hoja de Papel" */}
                        <div className="border p-3 mx-auto" style={{ minWidth: '800px', backgroundColor: '#fff' }}>

                            {/* ENCABEZADO DE LA PLANILLA */}
                            <CRow className="mb-3 align-items-center">
                                <CCol xs={2} className="text-center">
                                    {/* Placeholder para Logo */}
                                    <div className="bg-light border d-flex align-items-center justify-content-center" style={{ width: '60px', height: '80px', margin: '0 auto' }}>
                                        <small className="text-muted" style={{ fontSize: '10px' }}>LOGO</small>
                                    </div>
                                </CCol>
                                <CCol xs={10}>
                                    <h5 className="text-center fw-bold mb-3">PLANILLAS DE CALIFICACIONES - CL: 2025</h5>

                                    {/* Grilla de Datos del Encabezado */}
                                    <div className="border">
                                        <CRow className="g-0 border-bottom">
                                            <CCol xs={6} className="p-1 border-end d-flex">
                                                <span className="fw-bold me-2">CURSO Y DIV.:</span>
                                                <span>5A</span>
                                            </CCol>
                                            <CCol xs={6} className="p-1 d-flex">
                                                <span className="fw-bold me-2">Turno</span>
                                                <span className="fst-italic">Mañana</span>
                                            </CCol>
                                        </CRow>
                                        <CRow className="g-0 border-bottom">
                                            <CCol xs={6} className="p-1 border-end d-flex">
                                                <span className="fw-bold me-2">ASIGNATURA:</span>
                                                <span>5A - TIC</span>
                                            </CCol>
                                            <CCol xs={6} className="p-1 d-flex">
                                                <span className="fw-bold me-2">Fecha</span>
                                                <span>23/05/2025</span>
                                            </CCol>
                                        </CRow>
                                        <CRow className="g-0">
                                            <CCol xs={12} className="p-1 d-flex">
                                                <span className="fw-bold me-2">DOCENTE:</span>
                                                <span>Pablo S. Pannone</span>
                                            </CCol>
                                        </CRow>
                                    </div>
                                </CCol>
                            </CRow>

                            {/* TABLA DE NOTAS */}
                            <table className="table table-bordered table-sm align-middle text-center" style={{ fontSize: '0.9rem' }}>
                                {/*< ModeloPlanilla /> */}
                                {/* Tabla de estudiantes */}
                                <GenericTable table={table} />
                            </table>


                        </div>
                    </CCardBody>
                </CCard>
            )}

            {/* ----------  /BODY --------------- */}


            {/* ----------  FOOTER --------------- */}
            <CCardFooter
                className="bg-white border-top px-3 py-1" >

                <div className="d-flex justify-content-between align-items-center">
                    <span className="small text-muted">Sistema de Gestión Académica</span>
                    <span className="small text-muted">Impreso el: {new Date().toLocaleDateString()}</span>
                </div>

            </CCardFooter>

        </div>





    )


}