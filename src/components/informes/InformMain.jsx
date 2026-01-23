// 

// Corazón visual del reporte de informes. Recibe los datos y los distribuye en las secciones del informe.

import React, { useRef } from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';
import { Button } from 'primereact/button'; // Usamos botones de Prime para consistencia
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import StatsCardsOverview from '../../views/statsCards/StatsCardsOverview';
import InformHeader from './InformHeader';

import { generatePDF, generateExcel } from './exportUtils';


const InformMain = ({ config, data, loading }) => {

    const dt = useRef(null); // Referencia a la tabla

    // Botones de exportación para el header de la tabla
    const header = (
        <div className="d-flex align-items-center justify-content-end gap-2">

            <Button type="button" icon="pi pi-file-excel" severity="success" rounded
                onClick={() => generateExcel(config, data.list)}
                tooltip="Exportar XLS"
                tooltipOptions={{ position: 'bottom' }}
                size="small"
                // Deshabilitamos si no hay datos
                disabled={loading || !data?.list?.length} 
            />

            <Button type="button" icon="pi pi-file-pdf" severity="danger" rounded
                onClick={() => generatePDF(config, data.list)}
                tooltip="Exportar PDF"
                tooltipOptions={{ position: 'bottom' }}
                size="small"
                // Deshabilitamos si no hay datos
                disabled={loading || !data?.list?.length} 
                 />
        </div>
    );

    // Función para renderizar el cuerpo de la celda según el bodyType de la config
    const bodyTemplate = (rowData, col) => {
        const value = rowData[col.field];

        if (col.bodyType === 'badge') {
            const severity = col.severity ? col.severity(value) : 'info';
            return <span className={`badge bg-${severity}`}>{value}</span>;
        }

        if (col.bodyType === 'tag') {
            return <span className="px-2 py-1 rounded bg-light border fw-semibold text-uppercase" style={{ fontSize: '0.7rem' }}>
                {value}
            </span>;
        }

        return value;
    };

    return (
        <CCard className="shadow-sm border-0">
            <CCardHeader className="bg-white py-3 border-bottom-0">
                <InformHeader
                    title={config.title}
                    subtitle={config.subtitle}
                />
            </CCardHeader>

            <CCardBody className="pt-0">
                {/* MÉTRICAS (Usa StatsCardsOverview) */}
                <div className="mb-4">
                    <StatsCardsOverview
                        summary={data?.summary}
                        loading={loading}
                    />
                </div>

                {/* TABLA (PrimeReact) */}
                <div className="table-container border rounded">
                    <DataTable
                        ref={dt} // Conectamos la referencia
                        header={header} // Botones en el header
                        value={data?.list || []}
                        loading={loading}
                        stripedRows
                        size="small"
                        rows={10}
                        paginator
                        className="p-datatable-sm custom-datatable"
                        responsiveLayout="stack"
                        emptyMessage="No se encontraron registros para el informe."
                    >
                        {config.columns.map((col) => (
                            <Column
                                key={col.field}
                                field={col.field}
                                header={col.header}
                                sortable={col.sortable}
                                body={(rowData) => bodyTemplate(rowData, col)}
                                style={{ minWidth: '150px' }}
                            />
                        ))}
                    </DataTable>
                </div>
            </CCardBody>
        </CCard>
    );
};

export default InformMain;
