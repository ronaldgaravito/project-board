import React from 'react';
import { createPortal } from 'react-dom';
import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Trash2, Calendar, Clock, CheckCircle2, Circle, CircleDot, History } from 'lucide-react';
import { tagColors, priorityColors, defaultMembers } from '../../utils/constants';

const TaskCard = ({ 
  task, 
  index, 
  columnId, 
  onDelete, 
  onEdit, 
  onToggleTimer, 
  onTogglePriority, 
  onArchive,
  formatTime,
  members = defaultMembers
}) => {
  const assignedMember = members.find(m => m.id === task.assignedTo);
  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        const cardContent = (
          <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={`group mb-3 rounded-xl bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md relative ${
              snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl ring-2 ring-indigo-400 z-[100]' : ''
            } ${task.archived ? 'opacity-60 bg-slate-50 border-dashed border border-slate-200 shadow-none' : ''}`}
          >
            {/* Quick Actions */}
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 z-10">
              <button 
                onClick={(e) => { e.stopPropagation(); onArchive(task.id); }}
                className="p-1.5 rounded-lg bg-white/80 backdrop-blur-sm text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100 shadow-sm"
                title={task.archived ? "Restaurar" : "Archivar"}
              >
                <History size={14} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(columnId, task.id); }}
                className="p-1.5 rounded-lg bg-white/80 backdrop-blur-sm text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-slate-100 shadow-sm"
                title="Eliminar"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div 
              onClick={() => onEdit(task)}
              className="cursor-pointer"
            >
              <h3 className="text-sm font-semibold leading-relaxed text-slate-700 pr-12">
                {task.content}
              </h3>
              {task.description && (
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {task.description}
                </p>
              )}
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {task.tags.map(tag => (
                  <span 
                    key={tag} 
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${tagColors[tag] || 'bg-slate-100 text-slate-500'}`}
                  >
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            )}

            {/* Progress Bar */}
            {totalSubtasks > 0 && (
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 size={12} className={progress === 100 ? 'text-green-500' : 'text-slate-300'} />
                    <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
                  </div>
                  <span>{progress}%</span>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-indigo-500 transition-all duration-500" 
                  />
                </div>
              </div>
            )}

            {/* Footer Info */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  onClick={() => onToggleTimer(task.id)}
                  className={`flex items-center space-x-1 text-[10px] font-bold px-2 py-1 rounded-md cursor-pointer transition-all ${
                    task.timerRunning ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  {task.timerRunning ? <CircleDot size={11} /> : <Circle size={11} />}
                  <span className="font-mono">{formatTime(task.totalTime || 0)}</span>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); onTogglePriority(task.id); }}
                  className={`text-[9px] font-bold px-2 py-1 rounded uppercase transition-colors ${priorityColors[task.priority || 'low']}`}
                >
                  {task.priority || 'low'}
                </button>

                {task.dueDate && (
                  <div className={`flex items-center space-x-1 text-[10px] font-bold px-2 py-1 rounded ${
                    new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0)) 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Calendar size={10} />
                    <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
              </div>
              
              {assignedMember && (
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm ring-1 ring-white ${assignedMember.color}`}
                  title={assignedMember.name}
                >
                  {assignedMember.avatar}
                </div>
              )}
            </div>
          </motion.div>
        );

        if (snapshot.isDragging) {
          return createPortal(cardContent, document.body);
        }

        return cardContent;
      }}
    </Draggable>
  );
};

export default TaskCard;
