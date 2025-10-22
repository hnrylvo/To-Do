import { useEffect, useState } from 'react';
import { deleteTask, fetchTasks, updateTask } from '../../services/tasks.js';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiPlus, 
  FiCheck, 
  FiEdit3, 
  FiTrash2, 
  FiCalendar,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiFileText,
  FiUser
} from 'react-icons/fi';
import { MdOutlineTask } from "react-icons/md";


const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
  urgent: 'bg-purple-100 text-purple-800 border-purple-200'
};

const CATEGORY_COLORS = {
  work: 'bg-blue-100 text-blue-800 border-blue-200',
  personal: 'bg-green-100 text-green-800 border-green-200',
  health: 'bg-red-100 text-red-800 border-red-200',
  finance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  education: 'bg-purple-100 text-purple-800 border-purple-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200'
};

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const navigate = useNavigate();
  const darkMode = localStorage.getItem('darkMode') ? JSON.parse(localStorage.getItem('darkMode')) : false;

  const refresh = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetchTasks();
      setTasks(res.tasks || []);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const onToggleCompleted = async (task) => {
    try {
      const res = await updateTask(task.id, { completed: !task.completed });
      setTasks((prev) => prev.map(t => t.id === task.id ? res.task : t));
    } catch (e) {
      setError(e.message || 'No se pudo actualizar la tarea');
    }
  };

  const onDelete = async (task) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await deleteTask(task.id);
      setTasks((prev) => prev.filter(t => t.id !== task.id));
    } catch (e) {
      setError(e.message || 'No se pudo eliminar la tarea');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && task.completed) ||
                         (filterStatus === 'pending' && !task.completed);
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      case 'dueDate':
        return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-600">Gestiona tus tareas de manera eficiente</p>
          </div>
          <Link 
            to="/tasks/new" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <FiPlus className="text-lg" />
            Nueva Tarea
          </Link>
        </div>
        
        {/* Estadisticas basicas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                <div className="text-sm text-blue-700">Total Tareas</div>
              </div>
              <FiFileText className="text-blue-500 text-2xl" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <div className="text-sm text-green-700">Completadas</div>
              </div>
              <FiCheckCircle className="text-green-500 text-2xl" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{totalCount - completedCount}</div>
                <div className="text-sm text-yellow-700">Pendientes</div>
              </div>
              <FiClock className="text-yellow-500 text-2xl" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
                <div className="text-sm text-purple-700">Progreso</div>
              </div>
              <FiTrendingUp className="text-purple-500 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y busqueda */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiSearch className="text-sm" />
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiFilter className="text-sm" />
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer"
            >
              <option value="all">Todas</option>
              <option value="pending">Pendientes</option>
              <option value="completed">Completadas</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer"
            >
              <option value="all">Todas</option>
              <option value="urgent">Urgente</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer"
            >
              <option value="all">Todas</option>
              <option value="work">Trabajo</option>
              <option value="personal">Personal</option>
              <option value="health">Salud</option>
              <option value="finance">Finanzas</option>
              <option value="education">Educación</option>
              <option value="other">Otro</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiCalendar className="text-sm" />
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer"
            >
              <option value="created">Fecha creación</option>
              <option value="title">Título</option>
              <option value="priority">Prioridad</option>
              <option value="dueDate">Fecha vencimiento</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Lista de tareas */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <MdOutlineTask className="text-6xl mb-4 text-blue-600 mx-auto block text-center" />
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all' 
              ? 'No se encontraron tareas' 
              : 'No hay tareas aún'}
          </h3>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Crea tu primera tarea para comenzar'}
          </p>
          <Link 
            to="/tasks/new" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Crear Primera Tarea
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedTasks.map(task => (
            <div key={task.id} className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 ${task.completed ? 'opacity-75' : ''}`}>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => onToggleCompleted(task)}
                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      task.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {task.completed ? <span className="text-sm">✓</span> : null}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.title}
                        </h3>
                        {task.dueDate && (
                          <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : (new Date(task.dueDate) < new Date() ? 'text-red-600' : 'text-gray-500')}`}>
                            Vence: {new Date(task.dueDate).toLocaleDateString('es-ES')}
                          </p>
                        )}
                        {task.description && (
                          <p className={`mt-2 ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                            {task.description}
                          </p>
                        )}
                        
                        {/* Etiquetas */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {task.priority && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium}`}>
                              {task.priority === 'urgent' ? (
                                <>
                                  <FiClock className="text-xs" />
                                  Urgente
                                </>
                              ) : task.priority === 'high' ? (
                                <>
                                  <FiCheck className="text-xs" />
                                  Alta
                                </>
                              ) : task.priority === 'medium' ? (
                                <>
                                  <FiClock className="text-xs" />
                                  Media
                                </>
                              ) : (
                                <>
                                  <FiCheck className="text-xs" />
                                  Baja
                                </>
                              )}
                            </span>
                          )}
                          {task.category && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${CATEGORY_COLORS[task.category] || CATEGORY_COLORS.other}`}>
                              {task.category === 'work' ? (
                                <>
                                  <FiFileText className="text-xs" />
                                  Trabajo
                                </>
                              ) : task.category === 'personal' ? (
                                <>
                                  <FiUser className="text-xs" />
                                  Personal
                                </>
                              ) : task.category === 'health' ? (
                                <>
                                  <FiCheckCircle className="text-xs" />
                                  Salud
                                </>
                              ) : task.category === 'finance' ? (
                                <>
                                  <FiTrendingUp className="text-xs" />
                                  Finanzas
                                </>
                              ) : task.category === 'education' ? (
                                <>
                                  <FiFileText className="text-xs" />
                                  Educación
                                </>
                              ) : (
                                task.category
                              )}
                            </span>
                          )}
                          {task.dueDate && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${
                              new Date(task.dueDate) < new Date() && !task.completed 
                                ? 'bg-red-100 text-red-800 border-red-200' 
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                            }`}>
                              <FiCalendar className="text-xs" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button 
                          onClick={() => navigate(`/tasks/${task.id}/edit`)} 
                          className="px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                        >
                          <FiEdit3 className="text-xs" />
                          Editar
                        </button>
                        <button 
                          onClick={() => onDelete(task)} 
                          className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                        >
                          <FiTrash2 className="text-xs" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
