import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { History, CircleDot } from 'lucide-react';
import { useKanban } from './hooks/useKanban';
import Board from './components/layout/Board';
import TaskEditor from './components/modals/TaskEditor';
import MembersModal from './components/modals/MembersModal';
import Sidebar from './components/sidebar/Sidebar';

function App() {
  const kanban = useKanban();
  const [editingTask, setEditingTask] = useState(null);

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  return (
    <>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            color: '#334155',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        }}
      />
      
      <Board 
        data={kanban.data}
        theme={kanban.theme}
        setTheme={kanban.setTheme}
        filterType={kanban.filterType}
        setFilterType={kanban.setFilterType}
        searchTerm={kanban.searchTerm}
        setSearchTerm={kanban.setSearchTerm}
        showArchived={kanban.showArchived}
        setShowArchived={kanban.setShowArchived}
        onDragEnd={kanban.onDragEnd}
        onAddColumn={kanban.addColumn}
        onDeleteColumn={kanban.deleteColumn}
        onUpdateColumnTitle={kanban.updateColumnTitle}
        onAddTask={kanban.addTask}
        onDeleteTask={kanban.deleteTask}
        onEditTask={handleEditTask}
        onToggleTimer={kanban.toggleTimer}
        onTogglePriority={kanban.togglePriority}
        onArchiveTask={(taskId) => {
          const task = kanban.data.tasks[taskId];
          kanban.updateTask(taskId, { archived: !task.archived });
        }}
        onExport={kanban.handleExport}
        onImport={kanban.handleImport}
        onOpenHistory={() => {
          kanban.setIsHistoryOpen(true);
          kanban.setIsStatsOpen(false);
        }}
        onOpenStats={() => {
          kanban.setIsStatsOpen(true);
          kanban.setIsHistoryOpen(false);
        }}
        onOpenMembers={() => kanban.setIsMembersModalOpen(true)}
        formatTime={kanban.formatTime}
      />

      {/* Modals */}
      {editingTask && (
        <TaskEditor 
          task={kanban.data.tasks[editingTask.id]}
          onClose={() => setEditingTask(null)}
          onUpdate={kanban.updateTask}
          onAddSubtask={kanban.addSubtask}
          onToggleSubtask={kanban.toggleSubtask}
          onDeleteSubtask={kanban.deleteSubtask}
          onToggleTag={kanban.toggleTag}
          onAddComment={kanban.addComment}
          onTogglePriority={kanban.togglePriority}
          formatTime={kanban.formatTime}
          members={kanban.data.members}
          history={kanban.data.history}
        />
      )}

      {kanban.isMembersModalOpen && (
        <MembersModal 
          members={kanban.data.members}
          onClose={() => kanban.setIsMembersModalOpen(false)}
          onAddMember={kanban.addMember}
          onDeleteMember={kanban.deleteMember}
        />
      )}

      {/* Sidebars */}
      <Sidebar 
        isOpen={kanban.isHistoryOpen}
        onClose={() => kanban.setIsHistoryOpen(false)}
        title="Actividad Reciente"
        icon={History}
        type="history"
        data={kanban.data}
        formatTime={kanban.formatTime}
      />

      <Sidebar 
        isOpen={kanban.isStatsOpen}
        onClose={() => kanban.setIsStatsOpen(false)}
        title="Estadísticas de Tablero"
        icon={CircleDot}
        type="stats"
        data={kanban.data}
        formatTime={kanban.formatTime}
      />
    </>
  );
}

export default App;
