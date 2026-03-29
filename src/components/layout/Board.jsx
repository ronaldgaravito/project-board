import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowDown, ArrowUp, Filter, AlertTriangle, Clock, History, CircleDot, Search, X } from 'lucide-react';
import { themes } from '../../utils/constants';
import Column from '../kanban/Column';

const Board = ({ 
  data, 
  theme, 
  setTheme, 
  filterType, 
  setFilterType, 
  searchTerm, 
  setSearchTerm,
  showArchived,
  setShowArchived,
  onDragEnd,
  onAddColumn,
  onDeleteColumn,
  onUpdateColumnTitle,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onToggleTimer,
  onTogglePriority,
  onArchiveTask,
  onExport,
  onImport,
  onOpenHistory,
  onOpenStats,
  onOpenMembers,
  formatTime
}) => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColTitle, setNewColTitle] = useState('');

  const handleAddColumn = () => {
    if (newColTitle.trim()) {
      onAddColumn(newColTitle);
      setNewColTitle('');
      setIsAddingColumn(false);
    }
  };

  return (
    <div 
      className="min-h-screen p-8 text-white transition-all duration-1000 ease-in-out font-sans"
      style={{ background: themes[theme] || themes.indigo, backgroundAttachment: 'fixed' }}
    >
      <header className="mx-auto mb-10 flex max-w-7xl items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-lg border border-white/30">
            <div className="h-5 w-5 rounded-md border-2 border-white/80"></div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white drop-shadow-lg">
            Kanban<span className="font-light opacity-80">Flow</span>
          </h1>
        </motion.div>

        <div className="flex flex-grow max-w-md mx-8">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full group"
          >
            <input 
              type="text" 
              placeholder="Search tasks everywhere..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-white/20 placeholder-white/60 transition-all backdrop-blur-md group-hover:bg-white/15"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/80 transition-colors" size={18} />
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4"
        >
          {/* Theme Selector */}
          <div className="flex items-center bg-white/10 rounded-2xl p-1.5 border border-white/20 backdrop-blur-md">
            {Object.keys(themes).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`w-6 h-6 rounded-lg transition-all ${theme === t ? 'ring-2 ring-white scale-110 z-10 shadow-lg' : 'opacity-40 hover:opacity-100 hover:scale-110'}`}
                style={{ background: themes[t] }}
                title={t.charAt(0).toUpperCase() + t.slice(1)}
              />
            ))}
          </div>

          <div className="h-8 w-[1px] bg-white/20"></div>

          {/* Action Buttons */}
          <div className="flex items-center bg-white/10 rounded-2xl p-1.5 border border-white/20 backdrop-blur-md">
            <button 
              onClick={() => setFilterType('all')}
              className={`p-2 rounded-xl transition-all ${filterType === 'all' ? 'bg-white/20 text-white shadow-inner' : 'text-white/60 hover:text-white'}`}
              title="Todas las tareas"
            >
              <Filter size={18} />
            </button>
            <button 
              onClick={() => setFilterType('high')}
              className={`p-2 rounded-xl transition-all ${filterType === 'high' ? 'bg-red-500/40 text-white shadow-inner' : 'text-white/60 hover:text-white'}`}
              title="Alta Prioridad"
            >
              <AlertTriangle size={18} />
            </button>
            <button 
              onClick={() => setFilterType('overdue')}
              className={`p-2 rounded-xl transition-all ${filterType === 'overdue' ? 'bg-orange-500/40 text-white shadow-inner' : 'text-white/60 hover:text-white'}`}
              title="Vencidas"
            >
              <Clock size={18} />
            </button>
            <button 
              onClick={() => setShowArchived(!showArchived)}
              className={`p-2 rounded-xl transition-all ${showArchived ? 'bg-slate-500/40 text-white shadow-inner' : 'text-white/60 hover:text-white'}`}
              title={showArchived ? "Ocultar Archivados" : "Mostrar Archivados"}
            >
              <History size={18} className={showArchived ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>
          </div>

          <div className="h-8 w-[1px] bg-white/20"></div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={onOpenHistory}
              className="p-2.5 rounded-2xl bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all backdrop-blur-md shadow-lg"
              title="Actividad del Tablero"
            >
              <History size={18} />
            </button>
            <button 
              onClick={onOpenStats}
              className="p-2.5 rounded-2xl bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all backdrop-blur-md shadow-lg"
              title="Estadísticas"
            >
              <CircleDot size={18} />
            </button>
            <div 
              className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-pink-400 to-yellow-300 ring-2 ring-white/30 cursor-pointer shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center font-bold text-white text-xs border border-white/20" 
              onClick={onOpenMembers} 
              title="Gestionar Equipo"
            >
              RO
            </div>
          </div>
        </motion.div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-[calc(100vh-180px)] items-start space-x-6 overflow-x-auto pb-6 scrollbar-hide">
          <AnimatePresence>
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds
                .map((taskId) => data.tasks[taskId])
                .filter(task => {
                  const matchesSearch = task.content.toLowerCase().includes(searchTerm.toLowerCase());
                  if (!matchesSearch) return false;
                  
                  if (task.archived && !showArchived) return false;
                  if (showArchived && !task.archived) return false;

                  if (filterType === 'high') return task.priority === 'high';
                  if (filterType === 'overdue') {
                    if (!task.dueDate) return false;
                    return new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));
                  }
                  return true;
                });

              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  onAddTask={onAddTask}
                  onDeleteColumn={onDeleteColumn}
                  onUpdateColumnTitle={onUpdateColumnTitle}
                  onDeleteTask={onDeleteTask}
                  onEditTask={onEditTask}
                  onToggleTimer={onToggleTimer}
                  onTogglePriority={onTogglePriority}
                  onArchiveTask={onArchiveTask}
                  formatTime={formatTime}
                />
              );
            })}
          </AnimatePresence>
          
          {isAddingColumn ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex w-80 flex-shrink-0 flex-col rounded-2xl bg-white text-slate-800 p-4 shadow-2xl border border-white/20"
            >
              <input
                autoFocus
                type="text"
                placeholder="List title..."
                className="w-full rounded-xl border-2 border-slate-50 p-3 text-sm font-bold focus:border-indigo-400 focus:outline-none transition-all"
                value={newColTitle}
                onChange={(e) => setNewColTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
              />
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={handleAddColumn}
                  className="rounded-xl bg-indigo-500 px-6 py-2 text-xs font-bold text-white transition-all hover:bg-indigo-600 shadow-lg active:scale-95"
                >
                  Add List
                </button>
                <button
                  onClick={() => setIsAddingColumn(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddingColumn(true)}
              className="flex h-32 w-80 flex-shrink-0 flex-col items-center justify-center space-y-3 rounded-2xl border-2 border-dashed border-white/30 bg-white/10 p-6 text-white transition-all hover:bg-white/20 shadow-lg backdrop-blur-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shadow-inner">
                <Plus size={24} />
              </div>
              <span className="font-bold tracking-tight text-white/90">Add another list</span>
            </motion.button>
          )}
        </div>
      </DragDropContext>

      {/* Floating Bottom Toolbar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 flex items-center space-x-6 shadow-2xl z-40"
      >
        <button onClick={onExport} className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors group">
          <ArrowDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Exportar</span>
        </button>
        <div className="h-4 w-[1px] bg-white/20"></div>
        <label className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors cursor-pointer group">
          <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Importar</span>
          <input type="file" accept=".json" onChange={onImport} className="hidden" />
        </label>
      </motion.div>
    </div>
  );
};

export default Board;
