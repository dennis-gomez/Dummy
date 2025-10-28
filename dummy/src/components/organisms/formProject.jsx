import React, { useState, useEffect } from 'react';
import projectService from '../../services/projectService';

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

  const sectors = [
    'Tecnología',
    'Salud',
    'Educación',
    'Finanzas',
    'Manufactura',
    'Retail',
    'Energía',
    'Transporte',
    'Gobierno',
    'Otro'
  ];

  useEffect(() => {
    if (projectToEdit) {
      // Manejar fechas correctamente
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
    }
  }, [projectToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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

    // Validación de fechas
    if (formData.project_end_date && formData.project_start_date) {
      const startDate = new Date(formData.project_start_date);
      const endDate = new Date(formData.project_end_date);
      
      // Validar que la fecha no sea "Invalid Date"
      if (isNaN(startDate.getTime())) {
        newErrors.project_start_date = 'La fecha de inicio no es válida';
      }
      if (isNaN(endDate.getTime())) {
        newErrors.project_end_date = 'La fecha de fin no es válida';
      }
      
      // Solo validar si ambas fechas son válidas
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && endDate < startDate) {
        newErrors.project_end_date = 'La fecha de fin no puede ser anterior a la fecha de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Preparar datos para enviar - manejar fechas vacías
      const dataToSend = {
        ...formData,
        project_end_date: formData.project_end_date || null // Enviar null si está vacío
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
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {projectToEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Empresa *
            </label>
            <input
              type="text"
              name="project_company"
              value={formData.project_company}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.project_company ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nombre de la empresa"
            />
            {errors.project_company && (
              <p className="mt-1 text-sm text-red-600">{errors.project_company}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente *
            </label>
            <input
              type="text"
              name="project_client_name"
              value={formData.project_client_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.project_client_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nombre del cliente"
            />
            {errors.project_client_name && (
              <p className="mt-1 text-sm text-red-600">{errors.project_client_name}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Proyecto *
          </label>
          <input
            type="text"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.project_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nombre del proyecto"
          />
          {errors.project_name && (
            <p className="mt-1 text-sm text-red-600">{errors.project_name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sector *
            </label>
            <select
              name="project_sector"
              value={formData.project_sector}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.project_sector ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccionar sector</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
            {errors.project_sector && (
              <p className="mt-1 text-sm text-red-600">{errors.project_sector}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tecnologías
            </label>
            <input
              type="text"
              name="project_technologies"
              value={formData.project_technologies}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tecnologías separadas por comas"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Inicio *
            </label>
            <input
              type="date"
              name="project_start_date"
              value={formData.project_start_date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.project_start_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.project_start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.project_start_date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Fin
            </label>
            <input
              type="date"
              name="project_end_date"
              value={formData.project_end_date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.project_end_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.project_end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.project_end_date}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción del Proyecto
          </label>
          <textarea
            name="project_description"
            value={formData.project_description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe el proyecto..."
          />
        </div>

        {/* Información de Contacto */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Información de Contacto
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="project_contact_full_name"
                value={formData.project_contact_full_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.project_contact_full_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nombre del contacto"
              />
              {errors.project_contact_full_name && (
                <p className="mt-1 text-sm text-red-600">{errors.project_contact_full_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="project_contact_phone"
                value={formData.project_contact_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Teléfono de contacto"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="project_contact_email"
                value={formData.project_contact_email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.project_contact_email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="email@ejemplo.com"
              />
              {errors.project_contact_email && (
                <p className="mt-1 text-sm text-red-600">{errors.project_contact_email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo
              </label>
              <input
                type="text"
                name="project_contact_position"
                value={formData.project_contact_position}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cargo del contacto"
              />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Guardando...' : (projectToEdit ? 'Actualizar' : 'Crear Proyecto')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormProject;