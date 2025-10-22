import { useEffect, useState } from 'react';
import { fetchTasks } from '../services/tasks.js';
import { 
  FiFileText, 
  FiCheckCircle, 
  FiClock, 
  FiTrendingUp, 
  FiAlertTriangle,
  FiTarget,
} from 'react-icons/fi';

export default function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const darkMode = localStorage.getItem('darkMode') ? JSON.parse(localStorage.getItem('darkMode')) : false;

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await fetchTasks();
        setTasks(res.tasks || []);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const getFilteredTasks = () => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (timeRange) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return tasks;
    }
    
    return tasks.filter(task => new Date(task.createdAt) >= filterDate);
  };

  const filteredTasks = getFilteredTasks();
  const completedTasks = filteredTasks.filter(task => task.completed);
  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completionRate = filteredTasks.length > 0 ? Math.round((completedTasks.length / filteredTasks.length) * 100) : 0;

  // Prioridades
  const priorityStats = {
    urgent: filteredTasks.filter(t => t.priority === 'urgent').length,
    high: filteredTasks.filter(t => t.priority === 'high').length,
    medium: filteredTasks.filter(t => t.priority === 'medium').length,
    low: filteredTasks.filter(t => t.priority === 'low').length
  };

  // Categorias
  const categoryStats = {
    work: filteredTasks.filter(t => t.category === 'work').length,
    personal: filteredTasks.filter(t => t.category === 'personal').length,
    health: filteredTasks.filter(t => t.category === 'health').length,
    finance: filteredTasks.filter(t => t.category === 'finance').length,
    education: filteredTasks.filter(t => t.category === 'education').length,
    other: filteredTasks.filter(t => t.category === 'other').length
  };

  // Tareas vencidas
  const overdueTasks = filteredTasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Estadisticas</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-3 rounded-lg cursor-pointer gradient-to-r bg-gradient-to-r from-blue-600 to-purple-600 text-white focus:outline-none"
        >
          <option value="week">Última semana</option>
          <option value="month">Último mes</option>
          <option value="year">Último año</option>
          <option value="all">Todo el tiempo</option>
        </select>
      </div>

      {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Tareas</p>
              <p className="text-3xl font-bold text-blue-800">{filteredTasks.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <FiFileText className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Completadas</p>
              <p className="text-3xl font-bold text-green-800">{completedTasks.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-800">{pendingTasks.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <FiClock className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Progreso</p>
              <p className="text-3xl font-bold text-purple-800">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="text-white text-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribucion de prioridades */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Distribución por Prioridad</h3>
          <div className="space-y-4">
            {Object.entries(priorityStats).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${
                    priority === 'urgent' ? 'bg-purple-500' :
                    priority === 'high' ? 'bg-red-500' :
                    priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}></div>
                  <span className="capitalize font-medium text-gray-700">
                    {priority === 'urgent' ? 'Urgente' :
                     priority === 'high' ? 'Alta' :
                     priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        priority === 'urgent' ? 'bg-purple-500' :
                        priority === 'high' ? 'bg-red-500' :
                        priority === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${filteredTasks.length > 0 ? (count / filteredTasks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribucion de categorias */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Distribución por Categoría</h3>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${
                    category === 'work' ? 'bg-blue-500' :
                    category === 'personal' ? 'bg-green-500' :
                    category === 'health' ? 'bg-red-500' :
                    category === 'finance' ? 'bg-yellow-500' :
                    category === 'education' ? 'bg-purple-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="capitalize font-medium text-gray-700">
                    {category === 'work' ? 'Trabajo' :
                     category === 'personal' ? 'Personal' :
                     category === 'health' ? 'Salud' :
                     category === 'finance' ? 'Finanzas' :
                     category === 'education' ? 'Educación' : 'Otro'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        category === 'work' ? 'bg-blue-500' :
                        category === 'personal' ? 'bg-green-500' :
                        category === 'health' ? 'bg-red-500' :
                        category === 'finance' ? 'bg-yellow-500' :
                        category === 'education' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${filteredTasks.length > 0 ? (count / filteredTasks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerta de tareas vencidas */}
      {overdueTasks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <FiAlertTriangle className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-semibold text-red-800">Tareas Vencidas</h3>
          </div>
          <p className="text-red-700 mb-4">
            Tienes {overdueTasks.length} tarea{overdueTasks.length !== 1 ? 's' : ''} vencida{overdueTasks.length !== 1 ? 's' : ''} que necesitan atención inmediata.
          </p>
          <div className="space-y-2">
            {overdueTasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-200">
                <div>
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <p className="text-sm text-red-600">
                    Vencida el {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
                  {task.priority === 'urgent' ? (
                    <>
                      <FiAlertTriangle className="text-xs" />
                      Urgente
                    </>
                  ) : task.priority === 'high' ? (
                    <>
                      <FiTarget className="text-xs" />
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
              </div>
            ))}
            {overdueTasks.length > 3 && (
              <p className="text-sm text-red-600">
                Y {overdueTasks.length - 3} más...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Consejos de productividad */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
          Consejos de productividad
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FiTarget className="text-sm" />
              Enfoque en prioridades
            </h4>
            <p className="text-sm text-gray-600">
              {priorityStats.urgent > 0 || priorityStats.high > 0 
                ? `Tienes ${priorityStats.urgent + priorityStats.high} tareas de alta prioridad. Enfócate en completarlas primero.`
                : '¡Excelente! No tienes tareas urgentes pendientes.'}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FiTrendingUp className="text-sm" />
              Mejora continua
            </h4>
            <p className="text-sm text-gray-600">
              {completionRate >= 80 
                ? '¡Increíble! Tu tasa de completación es excelente. Mantén este ritmo.'
                : completionRate >= 60 
                ? 'Buen progreso. Intenta completar más tareas para mejorar tu productividad.'
                : 'Considera dividir las tareas grandes en tareas más pequeñas y manejables.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
