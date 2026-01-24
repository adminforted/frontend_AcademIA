// frontend_AcademiA\src\views\estudiantes\estudiantesInformes\EstudiantesInformes.jsx

// Componente que "limpia" la vista. Solo maneja el estado y conecta las piezas.
// Puro lenguaje humano. No hay lógica de fetching ni de mapeo de tablas.

import React, { useState } from 'react';
import { CContainer, CCard, CCardBody, CAlert, CSpinner, CRow, CCol, CFormSelect, CFormCheck, CFormLabel } from '@coreui/react';
import './EstudiantesInformes.css';

// import InformConfig from '../../../components/informes/InformConfig';
import InformMain from '../../../components/informes/InformMain';
import { EstudiantesInformesConfig } from './EstudiantesInformesConfig';
import { useInforme } from '../../../components/informes/useInform';

import { useInformesData } from '../../../components/informes/hooks/useInformesData'

export default function EstudiantesInformes() {
    // Estado inicial con los valores por defecto de la config
    // const [params, setParams] = useState({});

    // Usamos el Hook para manejar toda la lógica de:
    //   - Gestión de menús desplegables (Selects).
    //   - Gestión de lista de los select Ciclos, luego Cursos, y luego Materias.
    const {
        ciclos, cursos, materias,
        seleccion, handleCambio,
        loading: loadingFiltros, error: errorFiltros
    } = useInformesData();


    // ---------- Lógica de Validación ----------
    // Validamos que todos los filtros (select) se encuentren con alguna opción sleeccionada
    const filtrosCompletos = seleccion.tipoInforme && seleccion.ciclo && seleccion.curso && seleccion.materia;

    // Pasamos el endpoint SOLO si los filtros están completos. SInó, null (useInforme no hace nada).
    let endpointActivo = null;

    if (filtrosCompletos) {
        // Pasamos la "seleccion" a la función de la config.
        endpointActivo = EstudiantesInformesConfig.getEndpoint(seleccion);
    }
    console.log('🤞🤞Endpoint generado por config:', endpointActivo);

    // Extraemos el mapper del archivo de configuracion EstudiantesInformesConfig
    const dataMapper = EstudiantesInformesConfig.mapper;
    // Extraemos el "Calculador"
    const dataCalculator = EstudiantesInformesConfig.summaryCalculator

    // Hook que obtiene la lista de alumnos y sus notas (con dataMapper, los valores calculados ).
    const { data, loading, error } = useInforme(endpointActivo, seleccion, dataMapper, dataCalculator);

    console.log('🤞🤞🤞 Datos obtenidos por el Hook:', data);
    // const { data, loading, error } = useInforme(EstudiantesInformesConfig.endpoint, seleccion);

    // Llamada al motor de datos
    // const { data, loading, error } = useInforme(EstudiantesInformesConfig.endpoint, params);

    return (
        <div className="informes-wrapper pb-5">
            <CContainer fluid>
                <div className="d-flex justify-content-between align-items-center mb-3 pt-3">
                    <h2 className="fw-bold text-dark mb-0">{EstudiantesInformesConfig.title}</h2>
                </div>

                {/* Sección de Filtros */}
                <CCard className="border-0 shadow-sm mb-4">
                    <CCardBody className="py-2">

                        <CRow className="g-3">

                            {/* --- SELECT TIPO DE INFORME --- */}
                            <CCol md={3}>
                                <CFormLabel>Tipo de Informe</CFormLabel>
                                <CFormSelect
                                    value={seleccion.tipoInforme}
                                    onChange={(e) => handleCambio('tipoInforme', e.target.value)}
                                >
                                    <option value="">Seleccione Informe...</option>
                                    {/* Aquí podrías mapear desde tu Config si quisieras, por ahora hardcodeamos para probar */}
                                    <option value="aprobados">Aprobados / Desaprobados</option>
                                </CFormSelect>
                            </CCol>

                            {/* --- SELECT CICLO (Dinámico) --- */}
                            <CCol md={3}>
                                <CFormLabel>Ciclo Lectivo</CFormLabel>
                                <CFormSelect
                                    value={seleccion.ciclo}
                                    onChange={(e) => handleCambio('ciclo', e.target.value)}
                                    disabled={!seleccion.tipoInforme}
                                >
                                    <option value="">Seleccione Ciclo...</option>
                                    {/* --- Mapeo de las opciones del select --- */}
                                    {ciclos.map(c => (
                                        <option key={c.id_ciclo_lectivo} value={c.id_ciclo_lectivo}>{c.nombre_ciclo_lectivo}</option>
                                    ))}
                                </CFormSelect>
                            </CCol>

                            {/* --- SELECT CURSO (Dinámico) --- */}
                            <CCol md={3}>
                                <CFormLabel>Curso</CFormLabel>
                                <CFormSelect
                                    value={seleccion.curso}
                                    onChange={(e) => handleCambio('curso', e.target.value)}
                                    disabled={!seleccion.ciclo}
                                >
                                    <option value="">
                                        {loadingFiltros ? 'Cargando...' : 'Seleccione Curso...'}
                                    </option>
                                    {cursos.map(cur => (
                                        <option key={cur.id_curso} value={cur.id_curso}>
                                            {cur.curso}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>

                            {/* --- SELECT MATERIA (Dinámico) --- */}
                            <CCol md={3}>
                                <CFormLabel>Materia</CFormLabel>
                                <CFormSelect
                                    value={seleccion.materia}
                                    onChange={(e) => handleCambio('materia', e.target.value)}
                                    disabled={!seleccion.curso}
                                >
                                    <option value="">Seleccione Materia...</option>
                                    {materias.map(mat => (
                                        <option key={mat.id_materia} value={mat.id_materia}>
                                            {mat.nombre.nombre_materia}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>

                {/* Manejo de Errores (Tanto de filtros como del informe principal) */}
                {(error || errorFiltros) && (
                    <CAlert color="danger" className="border-0 shadow-sm">
                        {error || errorFiltros}
                    </CAlert>
                )}

                {/* Vista Principal del Informe */}
                <InformMain
                    config={EstudiantesInformesConfig}
                    data={data}
                    loading={loading}
                />
            </CContainer>
        </div>
    );
}