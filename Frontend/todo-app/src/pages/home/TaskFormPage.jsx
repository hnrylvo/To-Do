import { useEffect, useState } from 'react';
import { createTask, fetchTask, updateTask } from '../../services/tasks.js';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiCheck, 
  FiFileText, 
  FiUser, 
  FiTarget, 
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiEdit3
} from 'react-icons/fi';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Baja', icon: FiCheck, color: 'text-green-600' },
  { value: 'medium', label: 'Media', icon: FiClock, color: 'text-yellow-600' },
  { value: 'high', label: 'Alta', icon: FiTarget, color: 'text-red-600' },
  { value: 'urgent', label: 'Urgente', icon: FiClock, color: 'text-purple-600' }
];

const CATEGORY_OPTIONS = [
  { value: 'work', label: 'Trabajo', icon: FiFileText, color: 'text-blue-600' },
  { value: 'personal', label: 'Personal', icon: FiUser, color: 'text-green-600' },
  { value: 'health', label: 'Salud', icon: FiCheck, color: 'text-red-600' },
  { value: 'finance', label: 'Finanzas', icon: FiTrendingUp, color: 'text-yellow-600' },
  { value: 'education', label: 'Educación', icon: FiFileText, color: 'text-purple-600' },
  { value: 'other', label: 'Otro', icon: FiEdit3, color: 'text-gray-600' }
];

export default function TaskFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('other');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchTask(id);
        const task = res.task;
        setTitle(task?.title || '');
        setDescription(task?.description || '');
        setPriority(task?.priority || 'medium');
        setCategory(task?.category || 'other');
        setDueDate(task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      } catch (e) {
        setError(e.message || 'No se pudo cargar la tarea');
      } finally {
        setLoading(false);
      }
    };
    if (isEdit) load();
  }, [id, isEdit]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) { setError('El título es requerido'); return; }
    setSaving(true);
    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        dueDate: dueDate || null
      };
      
      if (isEdit) await updateTask(id, taskData);
      else await createTask(taskData);
      navigate('/');
    } catch (e) {
      setError(e.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isEdit ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <p className="text-gray-600">
            {isEdit ? 'Modifica los detalles de tu tarea' : 'Crea una nueva tarea para organizar tu trabajo'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="¿Qué necesitas hacer?"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Agrega más detalles sobre esta tarea..."
            />
          </div>

          {/* Priority and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {PRIORITY_OPTIONS.map(option => {
                  const IconComponent = option.icon;
                  return (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORY_OPTIONS.map(option => {
                  const IconComponent = option.icon;
                  return (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de vencimiento
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            {dueDate && (
              <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                <FiCalendar className="text-xs" />
                Vence el {new Date(dueDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>

          {/* Preview */}
          {(title || description) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Vista previa:</h4>
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 mt-1"></div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${title ? 'text-gray-800' : 'text-gray-400'}`}>
                      {title || 'Título de la tarea'}
                    </h3>
                    {description && (
                      <p className="mt-1 text-gray-600 text-sm">{description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {priority && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          priority === 'urgent' ? 'bg-purple-100 text-purple-800' :
                          priority === 'high' ? 'bg-red-100 text-red-800' :
                          priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {(() => {
                            const option = PRIORITY_OPTIONS.find(p => p.value === priority);
                            const IconComponent = option?.icon;
                            return IconComponent ? <IconComponent className="text-xs" /> : null;
                          })()}
                          {PRIORITY_OPTIONS.find(p => p.value === priority)?.label}
                        </span>
                      )}
                      {category && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          category === 'work' ? 'bg-blue-100 text-blue-800' :
                          category === 'personal' ? 'bg-green-100 text-green-800' :
                          category === 'health' ? 'bg-red-100 text-red-800' :
                          category === 'finance' ? 'bg-yellow-100 text-yellow-800' :
                          category === 'education' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {(() => {
                            const option = CATEGORY_OPTIONS.find(c => c.value === category);
                            const IconComponent = option?.icon;
                            return IconComponent ? <IconComponent className="text-xs" /> : null;
                          })()}
                          {CATEGORY_OPTIONS.find(c => c.value === category)?.label}
                        </span>
                      )}
                      {dueDate && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex items-center gap-1">
                          <FiCalendar className="text-xs" />
                          {new Date(dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </span>
              ) : (
                isEdit ? 'Actualizar Tarea' : 'Crear Tarea'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
