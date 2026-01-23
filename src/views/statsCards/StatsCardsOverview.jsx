//  frontend_AcademiA\src\views\statsCards\StatsCardsOverview.jsx

//  View que muestra las StatsCards, y el estado de carga de las mismas

import React from 'react';
import StatCard from '../../components/statCard/StatCard';
import { CCard, CCardBody, CRow, CCol, CSpinner} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSchool, cilCheckCircle, cilWarning, cilChevronBottom, cilCalendar, cilChartLine, cilSearch} from '@coreui/icons';

const StatsCardsOverview = ({ summary = {}, loading = false }) => {
  // Maneja el valor mientras carga
  const renderValue = (val) => {
    if (loading) return <CSpinner size="sm" variant="grow" />; // Spinner pequeño
    return val || "";
  };

  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <StatCard
          title="Promedio General"
          // value={renderValue(summary?.average)}
          value={10}
          subtext = {'Sin aplazos'}
          color="primary"
          // icon={cilChartLine}
        />
      </CCol>

      <CCol sm={6} lg={3}>
        <StatCard
          title="Materias Aprobadas" 
          value={5}
          // value={renderValue(summary?.approved)}
          subtext = {'de 11'}
          icon={cilCheckCircle} color="success"
        />
      </CCol>

      <CCol sm={6} lg={3}>
        <StatCard
          title="Asistencia Global"
          value={renderValue(summary?.attendance)}
          icon={cilCalendar}
          color="info"
        />
      </CCol>

      <CCol sm={6} lg={3}>
        <StatCard
          title="Requieren Atención"
          value={renderValue(summary?.failed)}
          icon={cilWarning}
          color="danger"
        />
      </CCol>


    </CRow>
  );
};

export default StatsCardsOverview;