//  frontend_AcademiA\src\components\DynamicForm\DynamicForm.jsx

import React, { useState, useEffect } from 'react'
import { CRow, CCol, CForm, CFormLabel, CFormInput, CButton, CInputGroup, CInputGroupText, CFormSelect } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilEnvelopeOpen, cilCalendar, cilPhone, cilLockLocked, cilList } from '@coreui/icons'

const DynamicForm = ({ fields, initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({})

  // Actualizar el estado interno cuando cambian los datos iniciales (ej: al pasar de Crear a Editar)
  useEffect(() => {
    setFormData(initialData || {})
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  // Lógica para elegir icono según el nombre del campo
  const getIcon = (name) => {
    const n = name.toLowerCase()
    if (n.includes('email')) return cilEnvelopeOpen
    if (n.includes('pass')) return cilLockLocked
    if (n.includes('fec') || n.includes('date')) return cilCalendar
    if (n.includes('tel') || n.includes('cel')) return cilPhone
    if (n.includes('tipo') || n.includes('id_')) return cilList
    return cilUser
  }

  return (
    <CForm onSubmit={handleSubmit}>
      <CRow className="g-3">
        {fields.map((field) => (
          <CCol md={field.fullWidth ? 12 : 6} key={field.name}>
            <CFormLabel className="small text-muted fw-bold">{field.label}</CFormLabel>
            <CInputGroup className="shadow-sm">
              <CInputGroupText><CIcon icon={getIcon(field.name)} /></CInputGroupText>
              
              {/* Renderizado condicional: Select o Input */}
              {field.type === 'select' ? (
                <CFormSelect
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                >
                  <option value="">Seleccionar...</option>
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </CFormSelect>
              ) : (
                <CFormInput
                  type={field.type || 'text'}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
            </CInputGroup>
          </CCol>
        ))}
      </CRow>
      <div className="mt-4 d-flex justify-content-end gap-2 border-top pt-3">
        <CButton color="secondary" variant="ghost" onClick={onCancel}>Cancelar</CButton>
        <CButton color="primary" type="submit" className="px-4 shadow">Guardar</CButton>
      </div>
    </CForm>
  )
}

export default DynamicForm
