import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Calendar } from 'lucide-react';
import TaskCard from './TaskCard';

const Column = ({ 
  column, 
  tasks, 
  onAddTask, 
  onDeleteColumn, 
  onUpdateColumnTitle, 
  onDeleteTask,
  onEditTask,
  onToggleTimer,
  onTogglePriority,
  onArchiveTask,
  formatTime
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');

  const handleUpdateTitle = () => {
    onUpdateColumnTitle(column.id, title);
    setIsEditingTitle(false);
  };

  const handleAddTask = () => {
    if (newTaskContent.trim()) {
      onAddTask(column.id, newTaskContent, newTaskDate);
      setNewTaskContent('');
      setNewTaskDate('');
      setIsAddingTask(false);
    }
  };

  return (
    <motion.div
      layout
      className="glass flex max-h-full w-80 flex-shrink-0 flex-col rounded-2xl shadow-xl transition-all"
    >
      <div className="flex items-center justify-between px-4 py-4">
        {isEditingTitle ? (
          <input 
            autoFocus
            className="text-xs font-bold uppercase tracking-widest text-slate-700 bg-transparent border-b border-indigo-400 focus:outline-none w-full mr-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle()}
          />
        ) : (
          <h2 
            onClick={() => setIsEditingTitle(true)}
            className="text-xs font-bold uppercase tracking-widest text-slate-700 cursor-pointer hover:text-indigo-600 transition-colors"
          >
            {column.title}
            <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-500">
              {tasks.length}
            </span>
          </h2>
        )}
        <button 
          onClick={() => onDeleteColumn(column.id)}
          className="rounded-full p-2 transition-colors hover:bg-red-50 text-slate-400 hover:text-red-400"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex-grow min-h-[150px] overflow-y-auto px-4 pb-4 transition-colors custom-scrollbar ${
              snapshot.isDraggingOver ? 'bg-black/5' : ''
            }`}
          >
            <AnimatePresence>
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  columnId={column.id}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                  onToggleTimer={onToggleTimer}
                  onTogglePriority={onTogglePriority}
                  onArchive={onArchiveTask}
                  formatTime={formatTime}
                />
              ))}
            </AnimatePresence>
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="p-3">
        {isAddingTask ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-white p-3 shadow-md"
          >
            <textarea
              autoFocus
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full resize-none rounded-lg border-2 border-slate-50 p-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddTask();
                }
              }}
            />
            <div className="mt-2 flex items-center space-x-2">
              <label className="flex items-center space-x-1 text-[10px] font-bold text-slate-400 cursor-pointer hover:text-indigo-500">
                <Calendar size={14} />
                <input 
                  type="date"
                  className="bg-transparent focus:outline-none"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                />
              </label>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <button
                onClick={handleAddTask}
                className="rounded-lg bg-indigo-500 px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-indigo-600 active:scale-95"
              >
                Add Card
              </button>
              <button
                onClick={() => setIsAddingTask(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 transition-all hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <button 
            onClick={() => setIsAddingTask(true)}
            className="group flex w-full items-center justify-center space-x-2 rounded-xl border-2 border-dashed border-slate-300/50 py-3 transition-all hover:border-indigo-400 hover:bg-white/50"
          >
            <Plus size={18} className="text-slate-400 group-hover:text-indigo-500" />
            <span className="text-sm font-semibold text-slate-500 group-hover:text-indigo-600">
              Add a card
            </span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Column;
