import React, { useState, useEffect } from 'react';
import projectService from '../../services/projectService';
import InputValidated from '../atoms/inputValidatedSupplier';
import InputMovement from '../atoms/inputMovement';

const FormProject = ({ projectToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    project_company: '',
    project_client_name: '',
    project_name: '',
    project_sector: '',
    project_description: '',
    project_technologies: '',
    project_start_date: '',
    project_end_date: '',
    project_contact_full_name: '',
    project_contact_phone: '',
    project_contact_email: '',
    project_contact_position: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllErrors, setShowAllErrors] = useState(false);

  const sectors = [
    { value: 'Tecnología', label: 'Tecnología' },
    { value: 'Salud', label: 'Salud' },
    { value: 'Educación', label: 'Educación' },
    { value: 'Finanzas', label: 'Finanzas' },
    { value: 'Manufactura', label: 'Manufactura' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Energía', label: 'Energía' },
    { value: 'Transporte', label: 'Transporte' },
    { value: 'Gobierno', label: 'Gobierno' },
    { value: 'Otro', label: 'Otro' }
  ];

  useEffect(() => {
    if (projectToEdit) {
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        } catch (error) {
          console.error('Error formateando fecha:', error);
          return '';
        }
      };

      setFormData({
        project_company: projectToEdit.project_company || '',
        project_client_name: projectToEdit.project_client_name || '',
        project_name: projectToEdit.project_name || '',
        project_sector: projectToEdit.project_sector || '',
        project_description: projectToEdit.project_description || '',
        project_technologies: projectToEdit.project_technologies || '',
        project_start_date: formatDateForInput(projectToEdit.project_start_date),
        project_end_date: formatDateForInput(projectToEdit.project_end_date),
        project_contact_full_name: projectToEdit.project_contact_full_name || '',
        project_contact_phone: projectToEdit.project_contact_phone || '',
        project_contact_email: projectToEdit.project_contact_email || '',
        project_contact_position: projectToEdit.project_contact_position || ''
      });
    } else {
      validateFormOnLoad();
    }
  }, [projectToEdit]);

  const validateFormOnLoad = () => {
    const newErrors = {};

    if (!formData.project_company.trim()) {
      newErrors.project_company = 'La empresa es obligatoria';
    }
    if (!formData.project_client_name.trim()) {
      newErrors.project_client_name = 'El nombre del cliente es obligatorio';
    }
    if (!formData.project_name.trim()) {
      newErrors.project_name = 'El nombre del proyecto es obligatorio';
    }
    if (!formData.project_sector) {
      newErrors.project_sector = 'El sector es obligatorio';
    }
    if (!formData.project_start_date) {
      newErrors.project_start_date = 'La fecha de inicio es obligatoria';
    }
    if (!formData.project_contact_full_name.trim()) {
      newErrors.project_contact_full_name = 'El nombre del contacto es obligatorio';
    }
    if (!formData.project_contact_email.trim()) {
      newErrors.project_contact_email = 'El email del contacto es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.project_contact_email)) {
      newErrors.project_contact_email = 'El email no es válido';
    }

    setErrors(newErrors);
    setShowAllErrors(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'project_company':
        if (!value.trim()) {
          newErrors.project_company = 'La empresa es obligatoria';
        } else {
          delete newErrors.project_company;
        }
        break;

      case 'project_client_name':
        if (!value.trim()) {
          newErrors.project_client_name = 'El nombre del cliente es obligatorio';
        } else {
          delete newErrors.project_client_name;
        }
        break;

      case 'project_name':
        if (!value.trim()) {
          newErrors.project_name = 'El nombre del proyecto es obligatorio';
        } else {
          delete newErrors.project_name;
        }
        break;

      case 'project_sector':
        if (!value) {
          newErrors.project_sector = 'El sector es obligatorio';
        } else {
          delete newErrors.project_sector;
        }
        break;

      case 'project_start_date':
        if (!value) {
          newErrors.project_start_date = 'La fecha de inicio es obligatoria';
        } else if (isNaN(new Date(value).getTime())) {
          newErrors.project_start_date = 'La fecha de inicio no es válida';
        } else {
          delete newErrors.project_start_date;
        }
        break;

      case 'project_contact_full_name':
        if (!value.trim()) {
          newErrors.project_contact_full_name = 'El nombre del contacto es obligatorio';
        } else {
          delete newErrors.project_contact_full_name;
        }
        break;

      case 'project_contact_email':
        if (!value.trim()) {
          newErrors.project_contact_email = 'El email del contacto es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.project_contact_email = 'El email no es válido';
        } else {
          delete newErrors.project_contact_email;
        }
        break;

      case 'project_end_date':
        if (value && formData.project_start_date) {
          const startDate = new Date(formData.project_start_date);
          const endDate = new Date(value);
          
          if (isNaN(endDate.getTime())) {
            newErrors.project_end_date = 'La fecha de fin no es válida';
          } else if (endDate < startDate) {
            newErrors.project_end_date = 'La fecha de fin no puede ser anterior a la fecha de inicio';
          } else {
            delete newErrors.project_end_date;
          }
        } else {
          delete newErrors.project_end_date;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.project_company.trim()) {
      newErrors.project_company = 'La empresa es obligatoria';
    }
    if (!formData.project_client_name.trim()) {
      newErrors.project_client_name = 'El nombre del cliente es obligatorio';
    }
    if (!formData.project_name.trim()) {
      newErrors.project_name = 'El nombre del proyecto es obligatorio';
    }
    if (!formData.project_sector) {
      newErrors.project_sector = 'El sector es obligatorio';
    }
    if (!formData.project_start_date) {
      newErrors.project_start_date = 'La fecha de inicio es obligatoria';
    }
    if (!formData.project_contact_full_name.trim()) {
      newErrors.project_contact_full_name = 'El nombre del contacto es obligatorio';
    }
    if (!formData.project_contact_email.trim()) {
      newErrors.project_contact_email = 'El email del contacto es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.project_contact_email)) {
      newErrors.project_contact_email = 'El email no es válido';
    }

    if (formData.project_end_date && formData.project_start_date) {
      const startDate = new Date(formData.project_start_date);
      const endDate = new Date(formData.project_end_date);
      
      if (isNaN(startDate.getTime())) {
        newErrors.project_start_date = 'La fecha de inicio no es válida';
      }
      if (isNaN(endDate.getTime())) {
        newErrors.project_end_date = 'La fecha de fin no es válida';
      }
      
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && endDate < startDate) {
        newErrors.project_end_date = 'La fecha de fin no puede ser anterior a la fecha de inicio';
      }
    }

    setErrors(newErrors);
    setShowAllErrors(true);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSend = {
        ...formData,
        project_end_date: formData.project_end_date || null
      };

      if (projectToEdit) {
        await projectService.updateProject(projectToEdit.cod_project, dataToSend);
      } else {
        await projectService.addProject(dataToSend);
      }
      
      onSave();
      resetForm();
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      alert('Error al guardar el proyecto. Por favor, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      project_company: '',
      project_client_name: '',
      project_name: '',
      project_sector: '',
      project_description: '',
      project_technologies: '',
      project_start_date: '',
      project_end_date: '',
      project_contact_full_name: '',
      project_contact_phone: '',
      project_contact_email: '',
      project_contact_position: ''
    });
    setErrors({});
    setShowAllErrors(false);
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const shouldShowError = (fieldName) => {
    return showAllErrors || errors[fieldName];
  };

  return (
    <div className="p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {projectToEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputValidated
              name="project_company"
              value={formData.project_company}
              onChange={handleChange}
              placeholder="Nombre de la empresa"
              label="Empresa *"
              error={shouldShowError('project_company') ? errors.project_company : ''}
            />
          </div>

          <div>
            <InputValidated
              name="project_client_name"
              value={formData.project_client_name}
              onChange={handleChange}
              placeholder="Nombre del cliente"
              label="Cliente *"
              error={shouldShowError('project_client_name') ? errors.project_client_name : ''}
            />
          </div>
        </div>

        {/* Nombre del Proyecto - Ocupa todo el ancho */}
        <div>
          <InputValidated
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
            placeholder="Nombre del proyecto"
            label="Nombre del Proyecto *"
            error={shouldShowError('project_name') ? errors.project_name : ''}
          />
        </div>

        {/* Sector y Tecnologías - Sector pequeño, Tecnologías grande */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Selector de Sector - ocupa 1 columna */}
          <div className="md:col-span-1">
            <InputMovement
              name="project_sector"
              value={formData.project_sector}
              onChange={handleChange}
              label="Sector *"
              type="select"
              options={sectors}
              placeholder="Seleccionar sector"
              error={shouldShowError('project_sector') ? errors.project_sector : ''}
            />
          </div>

          {/* Campo de Tecnologías - ocupa 3 columnas */}
          <div className="md:col-span-3">
            <InputValidated
              name="project_technologies"
              value={formData.project_technologies}
              onChange={handleChange}
              placeholder="Tecnologías separadas por comas (Ej: React, Node.js, MongoDB, Python, AWS, Docker...)"
              label="Tecnologías"
              multiline
              rows={4}
              className="min-h-[100px] resize-y w-full"
            />
          </div>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputValidated
              name="project_start_date"
              type="date"
              value={formData.project_start_date}
              onChange={handleChange}
              label="Fecha de Inicio *"
              error={shouldShowError('project_start_date') ? errors.project_start_date : ''}
            />
          </div>

          <div>
            <InputValidated
              name="project_end_date"
              type="date"
              value={formData.project_end_date}
              onChange={handleChange}
              label="Fecha de Fin"
              error={shouldShowError('project_end_date') ? errors.project_end_date : ''}
            />
          </div>
        </div>

        {/* Descripción - Ocupa todo el ancho */}
        <div>
          <InputValidated
            name="project_description"
            value={formData.project_description}
            onChange={handleChange}
            placeholder="Describe el proyecto..."
            label="Descripción del Proyecto"
            multiline
            rows={4}
            className="min-h-[100px] resize-y"
          />
        </div>

        {/* Información de Contacto */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Información de Contacto
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputValidated
                name="project_contact_full_name"
                value={formData.project_contact_full_name}
                onChange={handleChange}
                placeholder="Nombre del contacto"
                label="Nombre Completo *"
                error={shouldShowError('project_contact_full_name') ? errors.project_contact_full_name : ''}
              />
            </div>

            <div>
              <InputValidated
                name="project_contact_phone"
                value={formData.project_contact_phone}
                onChange={handleChange}
                placeholder="Teléfono de contacto"
                label="Teléfono"
                type="tel"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <InputValidated
                name="project_contact_email"
                value={formData.project_contact_email}
                onChange={handleChange}
                placeholder="email@ejemplo.com"
                label="Email *"
                type="email"
                error={shouldShowError('project_contact_email') ? errors.project_contact_email : ''}
              />
            </div>

            <div>
              <InputValidated
                name="project_contact_position"
                value={formData.project_contact_position}
                onChange={handleChange}
                placeholder="Cargo del contacto"
                label="Cargo"
              />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-center space-x-3 pt-6 border-t">  
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2  font-medium text-white bg-blue-600   rounded-md  hover:bg-blue-700  "
          >
            {isSubmitting ? 'Guardando...' : (projectToEdit ? 'Actualizar' : 'Crear Proyecto')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormProject;