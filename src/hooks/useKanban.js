import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { initialData, defaultMembers } from '../utils/constants';
import toast from 'react-hot-toast';

export const useKanban = () => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('kanban-data');
    return savedData ? JSON.parse(savedData) : initialData;
  });

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('kanban-theme');
    return savedTheme || 'indigo';
  });

  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('kanban-data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('kanban-theme', theme);
  }, [theme]);

  // Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const anyTimerRunning = Object.values(prevData.tasks).some(t => t.timerRunning);
        if (!anyTimerRunning) return prevData;

        const updatedTasks = { ...prevData.tasks };
        Object.keys(updatedTasks).forEach(id => {
          if (updatedTasks[id].timerRunning) {
            updatedTasks[id] = {
              ...updatedTasks[id],
              totalTime: (updatedTasks[id].totalTime || 0) + 1,
            };
          }
        });

        return { ...prevData, tasks: updatedTasks };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addHistoryLog = (type, taskId, content) => {
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      taskId,
      content,
      timestamp: new Date().toISOString(),
    };
    
    setData(prev => ({
      ...prev,
      history: [newLog, ...(prev.history || [])].slice(0, 100),
    }));
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [
      hrs > 0 ? String(hrs).padStart(2, '0') : null,
      String(mins).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };
      setData({
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
      });
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });

    if (source.droppableId !== destination.droppableId) {
      addHistoryLog('task_move', draggableId, `Tarea movida de "${start.title}" a "${finish.title}"`);
      
      const lastColumnId = data.columnOrder[data.columnOrder.length - 1];
      if (destination.droppableId === lastColumnId) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#667eea', '#764ba2', '#f6d365', '#fda085', '#11998e', '#38ef7d']
        });
        toast.success('¡Tarea completada!', { icon: '🎉' });
      }
    }
  };

  const addTask = (columnId, content, dueDate) => {
    if (!content.trim()) return;

    const newTaskId = `task-${Date.now()}`;
    const newTask = {
      id: newTaskId,
      content,
      priority: 'low',
      dueDate,
      tags: [],
      subtasks: [],
    };

    const column = data.columns[columnId];
    const newTaskIds = [...column.taskIds, newTaskId];

    setData({
      ...data,
      tasks: { ...data.tasks, [newTaskId]: newTask },
      columns: { ...data.columns, [columnId]: { ...column, taskIds: newTaskIds } },
    });

    addHistoryLog('task_create', newTaskId, `Tarea creada: "${content}"`);
    toast.success('Tarea añadida');
  };

  const deleteTask = (columnId, taskId) => {
    const column = data.columns[columnId];
    const newTaskIds = column.taskIds.filter((id) => id !== taskId);

    const newTasks = { ...data.tasks };
    delete newTasks[taskId];

    setData({
      ...data,
      tasks: newTasks,
      columns: { ...data.columns, [columnId]: { ...column, taskIds: newTaskIds } },
    });

    addHistoryLog('task_delete', taskId, `Tarea eliminada`);
    toast.error('Tarea eliminada');
  };

  const updateTask = (taskId, updates) => {
    setData({
      ...data,
      tasks: {
        ...data.tasks,
        [taskId]: { ...data.tasks[taskId], ...updates },
      },
    });
    if (updates.content) {
        addHistoryLog('task_update', taskId, `Tarea actualizada: "${updates.content}"`);
    }
  };

  const toggleTimer = (taskId) => {
    const task = data.tasks[taskId];
    const isStarting = !task.timerRunning;
    
    updateTask(taskId, { timerRunning: isStarting });

    addHistoryLog(
      isStarting ? 'timer_start' : 'timer_stop',
      taskId,
      isStarting ? 'Temporizador iniciado' : `Temporizador detenido (${formatTime(task.totalTime || 0)})`
    );
    
    if (isStarting) toast('Temporizador iniciado', { icon: '⏱️' });
    else toast('Temporizador detenido', { icon: '⏸️' });
  };

  const togglePriority = (taskId) => {
    const priorities = ['low', 'medium', 'high'];
    const currentPriority = data.tasks[taskId].priority || 'low';
    const nextPriority = priorities[(priorities.indexOf(currentPriority) + 1) % priorities.length];
    
    updateTask(taskId, { priority: nextPriority });
    addHistoryLog('priority_change', taskId, `Prioridad cambiada a ${nextPriority}`);
  };

  const addSubtask = (taskId, content) => {
    if (!content.trim()) return;
    const newSubId = `sub-${Date.now()}`;
    const newSubtask = { id: newSubId, content, completed: false };
    
    updateTask(taskId, {
      subtasks: [...(data.tasks[taskId].subtasks || []), newSubtask],
    });
    addHistoryLog('subtask_add', taskId, `Subtarea añadida: "${content}"`);
  };

  const toggleSubtask = (taskId, subId) => {
    const task = data.tasks[taskId];
    const newSubtasks = task.subtasks.map(sub => 
      sub.id === subId ? { ...sub, completed: !sub.completed } : sub
    );
    updateTask(taskId, { subtasks: newSubtasks });
  };

  const deleteSubtask = (taskId, subId) => {
    const task = data.tasks[taskId];
    const newSubtasks = task.subtasks.filter(sub => sub.id !== subId);
    updateTask(taskId, { subtasks: newSubtasks });
  };

  const toggleTag = (taskId, tag) => {
    const task = data.tasks[taskId];
    const tags = task.tags || [];
    const isAdding = !tags.includes(tag);
    const newTags = isAdding ? [...tags, tag] : tags.filter(t => t !== tag);
      
    updateTask(taskId, { tags: newTags });
    addHistoryLog('tag_change', taskId, `${isAdding ? 'Etiqueta añadida' : 'Etiqueta eliminada'}: "${tag}"`);
  };

  const addComment = (taskId, text) => {
    if (!text.trim()) return;
    const newComment = {
      id: `com-${Date.now()}`,
      memberId: 'm1',
      text,
      timestamp: new Date().toISOString()
    };
 
    updateTask(taskId, {
      comments: [...(data.tasks[taskId].comments || []), newComment]
    });
    addHistoryLog('comment_add', taskId, 'Nuevo comentario añadido');
  };

  const addMember = (name) => {
    if (!name.trim()) return;
    const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-fuchsia-500', 'bg-sky-500'];
    const newMember = {
      id: `m-${Date.now()}`,
      name,
      avatar: name.substring(0, 2).toUpperCase(),
      color: colors[Math.floor(Math.random() * colors.length)]
    };
 
    setData({
      ...data,
      members: [...(data.members || defaultMembers), newMember]
    });
    addHistoryLog('member_add', null, `Miembro añadido: ${name}`);
    toast.success(`Miembro ${name} añadido`);
  };

  const deleteMember = (memberId) => {
    if ((data.members || defaultMembers).length <= 1) return;
    
    const newMembers = (data.members || defaultMembers).filter(m => m.id !== memberId);
    const newTasks = { ...data.tasks };
    Object.keys(newTasks).forEach(taskId => {
      if (newTasks[taskId].assignedTo === memberId) {
        newTasks[taskId].assignedTo = null;
      }
    });
 
    setData({ ...data, members: newMembers, tasks: newTasks });
    addHistoryLog('member_delete', null, `Miembro eliminado`);
  };

  const addColumn = (title) => {
    if (!title.trim()) return;
    const newColumnId = `column-${Date.now()}`;
    const newColumn = { id: newColumnId, title, taskIds: [] };

    setData({
      ...data,
      columns: { ...data.columns, [newColumnId]: newColumn },
      columnOrder: [...data.columnOrder, newColumnId],
    });
    addHistoryLog('column_create', null, `Nueva lista creada: "${title}"`);
    toast.success('Lista añadida');
  };

  const deleteColumn = (columnId) => {
    const newColumnOrder = data.columnOrder.filter(id => id !== columnId);
    const newColumns = { ...data.columns };
    delete newColumns[columnId];
    
    setData({ ...data, columns: newColumns, columnOrder: newColumnOrder });
    addHistoryLog('column_delete', null, `Lista eliminada`);
  };

  const updateColumnTitle = (columnId, title) => {
    if (!title.trim()) return;
    setData({
      ...data,
      columns: {
        ...data.columns,
        [columnId]: { ...data.columns[columnId], title },
      },
    });
    addHistoryLog('column_rename', null, `Lista renombrada a "${title}"`);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kanban-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Tablero exportado');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (importedData.tasks && importedData.columns && importedData.columnOrder) {
          setData(importedData);
          toast.success('Tablero importado con éxito');
        } else {
          toast.error('Formato de archivo inválido');
        }
      } catch (err) {
        toast.error('Error al leer el archivo');
      }
    };
    reader.readAsText(file);
  };

  return {
    data,
    theme,
    setTheme,
    filterType,
    setFilterType,
    searchTerm,
    setSearchTerm,
    showArchived,
    setShowArchived,
    isHistoryOpen,
    setIsHistoryOpen,
    isStatsOpen,
    setIsStatsOpen,
    isMembersModalOpen,
    setIsMembersModalOpen,
    onDragEnd,
    addTask,
    deleteTask,
    updateTask,
    toggleTimer,
    togglePriority,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    toggleTag,
    addComment,
    addMember,
    deleteMember,
    addColumn,
    deleteColumn,
    updateColumnTitle,
    handleExport,
    handleImport,
    formatTime,
  };
};
