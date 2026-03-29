import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, Circle, CircleDot, ArrowRight, Plus, Trash2, Clock } from 'lucide-react';

const Sidebar = ({ 
  isOpen, 
  onClose, 
  title, 
  icon: Icon, 
  type, 
  data, 
  formatTime 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[40]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-[50] border-l border-white/20 text-slate-800 flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2">
                <Icon className="text-indigo-500" size={20} />
                <h2 className="text-lg font-bold tracking-tight">{title}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {type === 'history' ? (
                <div className="space-y-6">
                  {data.history && data.history.length > 0 ? (
                    data.history.map((log, index) => {
                      const task = log.taskId ? data.tasks[log.taskId] : null;
                      return (
                        <div key={log.id} className="relative pl-6 pb-2">
                          {index !== data.history.length - 1 && (
                            <div className="absolute left-[9px] top-4 bottom-0 w-[2px] bg-slate-100"></div>
                          )}
                          <div className="absolute left-0 top-1 w-[20px] h-[20px] rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center z-10 shadow-sm">
                            {log.type === 'task_move' && <ArrowRight size={10} className="text-indigo-500" />}
                            {log.type === 'task_create' && <Plus size={10} className="text-indigo-500" />}
                            {log.type === 'task_delete' && <Trash2 size={10} className="text-rose-500" />}
                            {(!['task_move', 'task_create', 'task_delete'].includes(log.type)) && <Circle size={8} className="text-indigo-300 fill-indigo-300" />}
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="text-[9px] font-medium text-slate-300">
                                {new Date(log.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-slate-700 leading-snug">
                              {log.content}
                            </p>
                            {task && (
                              <div className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded inline-block font-bold">
                                Tarea: {task.content.length > 30 ? task.content.substring(0, 30) + '...' : task.content}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-40 py-20">
                      <History size={48} className="text-slate-300" />
                      <p className="text-sm font-medium text-slate-500">No hay actividad registrada aún.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Resumen General</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Total Tareas</p>
                        <p className="text-2xl font-black text-slate-700">{Object.keys(data.tasks).length}</p>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase">Completadas</p>
                        <p className="text-2xl font-black text-emerald-700">
                          {Object.values(data.tasks).filter(t => t.id && data.columns[data.columnOrder[data.columnOrder.length - 1]]?.taskIds.includes(t.id)).length}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Por Prioridad</h3>
                    <div className="space-y-4">
                      {['high', 'medium', 'low'].map(priority => {
                        const count = Object.values(data.tasks).filter(t => t.priority === priority).length;
                        const total = Object.keys(data.tasks).length || 1;
                        const percentage = Math.round((count / total) * 100);
                        
                        return (
                          <div key={priority} className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span className="capitalize text-slate-600">{priority}</span>
                              <span className="text-slate-400">{count} ({percentage}%)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                className={`h-full ${
                                  priority === 'high' ? 'bg-red-400' : priority === 'medium' ? 'bg-orange-400' : 'bg-indigo-400'
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tiempo Invertido</h3>
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center text-white">
                      <Clock size={32} className="text-white/80 mb-2" />
                      <p className="text-[10px] font-bold text-white/60 uppercase mb-1">Tiempo Total Registrado</p>
                      <p className="text-3xl font-black font-mono">
                        {formatTime(Object.values(data.tasks).reduce((acc, t) => acc + (t.totalTime || 0), 0))}
                      </p>
                    </div>
                  </section>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <p className="text-[10px] text-slate-400 italic text-center">
                {type === 'history' ? 'Se mantienen los últimos 100 eventos.' : 'Estadísticas basadas en el tablero actual.'}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
