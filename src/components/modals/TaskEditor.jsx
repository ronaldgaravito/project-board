import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckSquare, Square, Plus, Trash2, Clock, MessageSquare, ArrowRight, CheckCircle2, Calendar, AlertTriangle } from 'lucide-react';
import { tagColors, priorityColors, defaultMembers } from '../../utils/constants';

const TaskEditor = ({ 
  task, 
  onClose, 
  onUpdate, 
  onAddSubtask, 
  onToggleSubtask, 
  onDeleteSubtask,
  onToggleTag,
  onAddComment,
  onTogglePriority,
  formatTime,
  members = defaultMembers,
  history = []
}) => {
  const [content, setContent] = useState(task.content);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleSave = () => {
    onUpdate(task.id, { content, description, dueDate });
    onClose();
  };

  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500 rounded-xl text-white">
              <CheckCircle2 size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Editar Tarea</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Main Title & Description */}
          <section className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Título de la Tarea</label>
              <textarea
                className="text-lg font-bold text-slate-700 w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none focus:bg-white transition-all"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Descripción</label>
              <textarea
                className="text-sm text-slate-600 w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none focus:bg-white transition-all"
                placeholder="Añadir una descripción detallada..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </section>

          {/* Settings Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Fecha de Entrega</label>
              <div className="relative">
                <input 
                  type="date"
                  className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none pl-10"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Prioridad</label>
              <button 
                onClick={() => onTogglePriority(task.id)}
                className={`w-full flex items-center justify-center space-x-2 font-bold py-3 rounded-xl border transition-all ${priorityColors[task.priority || 'low']}`}
              >
                <AlertTriangle size={16} />
                <span>{(task.priority || 'low').toUpperCase()}</span>
              </button>
            </div>
          </div>

          {/* Members & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Asignar Miembro</label>
              <div className="flex flex-wrap gap-2">
                {members.map(member => (
                  <button
                    key={member.id}
                    onClick={() => onUpdate(task.id, { assignedTo: member.id })}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-all ring-offset-2 ${member.color} ${task.assignedTo === member.id ? 'ring-2 ring-indigo-500 scale-110 shadow-lg' : 'opacity-40 hover:opacity-80 hover:scale-105'}`}
                    title={member.name}
                  >
                    {member.avatar}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Etiquetas</label>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(tagColors).map(tag => (
                  <button
                    key={tag}
                    onClick={() => onToggleTag(task.id, tag)}
                    className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                      (task.tags || []).includes(tag) 
                        ? tagColors[tag] 
                        : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    {tag.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subtasks */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Subtareas ({progress}%)</label>
              {totalSubtasks > 0 && (
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {task.subtasks?.map(sub => (
                  <motion.div 
                    key={sub.id} 
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center group/sub bg-slate-50 p-2.5 rounded-xl border border-slate-200/50 hover:bg-white transition-all shadow-sm"
                  >
                    <button 
                      onClick={() => onToggleSubtask(task.id, sub.id)}
                      className={`mr-3 transition-colors ${sub.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-400'}`}
                    >
                      {sub.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                    <span className={`text-sm flex-grow font-medium ${sub.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {sub.content}
                    </span>
                    <button 
                      onClick={() => onDeleteSubtask(task.id, sub.id)}
                      className="opacity-0 group-hover/sub:opacity-100 p-1.5 text-slate-300 hover:text-red-400 transition-all hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="relative group">
                <input 
                  type="text"
                  placeholder="Añadir una subtarea..."
                  className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none focus:bg-white pr-12 transition-all"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onAddSubtask(task.id, newSubtask);
                      setNewSubtask('');
                    }
                  }}
                />
                <button 
                  onClick={() => { onAddSubtask(task.id, newSubtask); setNewSubtask(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-700 p-1.5 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* Comments */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 text-slate-700">
              <MessageSquare size={18} className="text-indigo-500" />
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comentarios</label>
            </div>
            <div className="space-y-4">
              {task.comments?.map(comment => {
                const member = members.find(m => m.id === comment.memberId);
                return (
                  <div key={comment.id} className="flex space-x-3">
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${member?.color || 'bg-slate-400'}`}>
                      {member?.avatar || '??'}
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex-grow shadow-sm hover:bg-white transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-700">{member?.name || 'Unknown'}</span>
                        <span className="text-[9px] text-slate-400">{new Date(comment.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                );
              })}
              {(!task.comments || task.comments.length === 0) && (
                <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">No hay comentarios aún.</p>
              )}
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Escribe un comentario..."
                  className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none focus:bg-white pr-12 transition-all"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onAddComment(task.id, newComment);
                      setNewComment('');
                    }
                  }}
                />
                <button 
                  onClick={() => { onAddComment(task.id, newComment); setNewComment(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-700 p-1.5 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* Activity Mini-list */}
          <section className="space-y-4 pb-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Actividad Reciente</label>
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/50 max-h-40 overflow-y-auto custom-scrollbar">
              {history
                .filter(log => log.taskId === task.id)
                .slice(0, 5)
                .map(log => (
                  <div key={log.id} className="text-[10px] text-slate-500 flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold mr-2">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>{log.content}</span>
                    </div>
                  </div>
                ))}
              {history.filter(log => log.taskId === task.id).length === 0 && (
                <p className="text-[10px] text-slate-400 italic">Sin actividad registrada aún.</p>
              )}
            </div>
          </section>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-slate-500">
            <Clock size={18} className="text-indigo-400" />
            <span className="text-sm font-bold font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200">{formatTime(task.totalTime || 0)}</span>
          </div>
          <button 
            onClick={handleSave}
            className="bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 shadow-lg active:scale-95 transition-all"
          >
            Guardar y Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskEditor;
