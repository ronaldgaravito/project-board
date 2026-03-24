import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MoreHorizontal, Plus, Trash2, Calendar, Filter, Palette, CheckCircle2, Clock, AlertTriangle, Tag, CheckSquare, Square, X, Pencil, Check, ArrowRight, ArrowLeft, ArrowDown, ArrowUp, GripVertical, ListTodo, CircleDot, Circle, History } from 'lucide-react';

const themes = {
  indigo: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  sunset: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  ocean: 'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)',
  emerald: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  midnight: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
  rose: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
};

const tagColors = {
  bug: 'bg-rose-500/20 text-rose-600 border-rose-200',
  feature: 'bg-sky-500/20 text-sky-600 border-sky-200',
  design: 'bg-fuchsia-500/20 text-fuchsia-600 border-fuchsia-200',
  research: 'bg-amber-500/20 text-amber-600 border-amber-200',
  refactor: 'bg-emerald-500/20 text-emerald-600 border-emerald-200',
  urgent: 'bg-orange-500/20 text-orange-600 border-orange-200',
};

const defaultMembers = [
  { id: 'm1', name: 'Ronald', avatar: 'RO', color: 'bg-indigo-500' },
  { id: 'm2', name: 'Alex', avatar: 'AL', color: 'bg-emerald-500' },
  { id: 'm3', name: 'Jordan', avatar: 'JO', color: 'bg-amber-500' },
  { id: 'm4', name: 'Sam', avatar: 'SA', color: 'bg-rose-500' },
];

const initialData = {
  tasks: {
    'task-1': { 
      id: 'task-1', 
      content: 'Design UI for Trello clone', 
      priority: 'high', 
      dueDate: new Date().toISOString().split('T')[0],
      tags: ['design', 'feature'],
      subtasks: [
        { id: 'sub-1', content: 'Create color palette', completed: true },
        { id: 'sub-2', content: 'Design task cards', completed: false }
      ]
    },
    'task-2': { 
      id: 'task-2', 
      content: 'Implement drag and drop', 
      priority: 'medium', 
      dueDate: '',
      tags: ['feature'],
      subtasks: []
    },
    'task-3': { 
      id: 'task-3', 
      content: 'Add task functionality', 
      priority: 'low', 
      dueDate: '',
      tags: ['research'],
      subtasks: []
    },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2', 'task-3'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
  members: defaultMembers,
  history: [],
};

function App() {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('kanban-data');
    return savedData ? JSON.parse(savedData) : initialData;
  });
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('kanban-theme');
    return savedTheme || 'indigo';
  });
  const [filterType, setFilterType] = useState('all');
  const [editingColumn, setEditingColumn] = useState(null);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskContent, setEditingTaskContent] = useState('');
  const [editingTaskDate, setEditingTaskDate] = useState('');
  const [editingColTitleId, setEditingColTitleId] = useState(null);
  const [editingColTitle, setEditingColTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColTitle, setNewColTitle] = useState('');
  const [newSubtaskContent, setNewSubtaskContent] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(null); // taskId
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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
      history: [newLog, ...(prev.history || [])].slice(0, 100), // Keep last 100 logs
    }));
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
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        // Basic validation
        if (importedData.tasks && importedData.columns && importedData.columnOrder) {
          setData(importedData);
          alert('Data imported successfully!');
        } else {
          alert('Invalid file format.');
        }
      } catch (err) {
        alert('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const toggleTimer = (taskId) => {
    const task = data.tasks[taskId];
    const isStarting = !task.timerRunning;
    
    setData(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: {
          ...task,
          timerRunning: isStarting,
        }
      }
    }));

    addHistoryLog(
      isStarting ? 'timer_start' : 'timer_stop',
      taskId,
      isStarting ? 'Temporizador iniciado' : `Temporizador detenido (${formatTime(task.totalTime || 0)})`
    );
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

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setData(newState);

    if (source.droppableId !== destination.droppableId) {
      addHistoryLog(
        'task_move',
        draggableId,
        `Tarea movida de "${start.title}" a "${finish.title}"`
      );
    }
  };

  const handleAddTask = (columnId) => {
    if (!newTaskContent.trim()) return;

    const newTaskId = `task-${Date.now()}`;
    const newTask = {
      id: newTaskId,
      content: newTaskContent,
      priority: 'low',
      dueDate: newTaskDate,
      tags: [],
      subtasks: [],
    };

    const column = data.columns[columnId];
    const newTaskIds = [...column.taskIds, newTaskId];

    const newState = {
      ...data,
      tasks: {
        ...data.tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...data.columns,
        [columnId]: {
          ...column,
          taskIds: newTaskIds,
        },
      },
    };

    setData(newState);
    addHistoryLog('task_create', newTaskId, `Tarea creada: "${newTaskContent}"`);
    setNewTaskContent('');
    setNewTaskDate('');
    setEditingColumn(null);
  };

  const handleDeleteTask = (columnId, taskId) => {
    const column = data.columns[columnId];
    const newTaskIds = column.taskIds.filter((id) => id !== taskId);

    const newTasks = { ...data.tasks };
    delete newTasks[taskId];

    const newState = {
      ...data,
      tasks: newTasks,
      columns: {
        ...data.columns,
        [columnId]: {
          ...column,
          taskIds: newTaskIds,
        },
      },
    };

    setData(newState);
    addHistoryLog('task_delete', taskId, `Tarea eliminada`);
  };

  const handleUpdateTask = (taskId, newContent, newDate) => {
    if (!newContent.trim()) return;
    const newState = {
      ...data,
      tasks: {
        ...data.tasks,
        [taskId]: {
          ...data.tasks[taskId],
          content: newContent,
          dueDate: newDate !== undefined ? newDate : data.tasks[taskId].dueDate,
        },
      },
    };
    setData(newState);
    addHistoryLog('task_update', taskId, `Tarea actualizada: "${newContent}"`);
    setEditingTaskId(null);
    setEditingTaskDate('');
  };

  const togglePriority = (taskId) => {
    const priorities = ['low', 'medium', 'high'];
    const currentPriority = data.tasks[taskId].priority || 'low';
    const nextPriority = priorities[(priorities.indexOf(currentPriority) + 1) % priorities.length];
    
    const newState = {
      ...data,
      tasks: {
        ...data.tasks,
        [taskId]: {
          ...data.tasks[taskId],
          priority: nextPriority,
        },
      },
    };
    setData(newState);
    addHistoryLog('priority_change', taskId, `Prioridad cambiada a ${nextPriority}`);
  };

  const handleAddSubtask = (taskId) => {
    if (!newSubtaskContent.trim()) return;
    const newSubId = `sub-${Date.now()}`;
    const newSubtask = { id: newSubId, content: newSubtaskContent, completed: false };
    
    setData({
      ...data,
      tasks: {
        ...data.tasks,
        [taskId]: {
          ...data.tasks[taskId],
          subtasks: [...(data.tasks[taskId].subtasks || []), newSubtask],
        },
      },
    });
    addHistoryLog('subtask_add', taskId, `Subtarea añadida: "${newSubtaskContent}"`);
    setNewSubtaskContent('');
  };

  const toggleSubtask = (taskId, subId) => {
    const task = data.tasks[taskId];
    const newSubtasks = task.subtasks.map(sub => 
      sub.id === subId ? { ...sub, completed: !sub.completed } : sub
    );
    
    setData({
      ...data,
      tasks: {
        ...data.tasks,
        [taskId]: { ...task, subtasks: newSubtasks },
      },
    });
  };

  const handleDeleteSubtask = (taskId, subId) => {
    const task = data.tasks[taskId];
    const newSubtasks = task.subtasks.filter(sub => sub.id !== subId);
    
    setData({
      ...data,
      tasks: {
        ...data.tasks,
        [taskId]: { ...task, subtasks: newSubtasks },
      },
    });
  };

  const handleToggleTag = (taskId, tag) => {
    const task = data.tasks[taskId];
    const tags = task.tags || [];
    const isAdding = !tags.includes(tag);
    const newTags = isAdding
      ? [...tags, tag]
      : tags.filter(t => t !== tag);
      
    setData({
      ...data,
      tasks: {
        ...data.tasks,
        [taskId]: { ...task, tags: newTags },
      },
    });
    addHistoryLog('tag_change', taskId, `${isAdding ? 'Etiqueta añadida' : 'Etiqueta eliminada'}: "${tag}"`);
  };

  const handleAddColumn = () => {
    if (!newColTitle.trim()) return;
    const newColumnId = `column-${Date.now()}`;
    const newColumn = {
      id: newColumnId,
      title: newColTitle,
      taskIds: [],
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newColumnId]: newColumn,
      },
      columnOrder: [...data.columnOrder, newColumnId],
    };
    setData(newState);
    addHistoryLog('column_create', null, `Nueva lista creada: "${newColTitle}"`);
    setNewColTitle('');
    setIsAddingColumn(false);
  };

  const handleDeleteColumn = (columnId) => {
    const newColumnOrder = data.columnOrder.filter(id => id !== columnId);
    const newColumns = { ...data.columns };
    delete newColumns[columnId];
    
    setData({
      ...data,
      columns: newColumns,
      columnOrder: newColumnOrder,
    });
    addHistoryLog('column_delete', null, `Lista eliminada`);
  };

  const handleUpdateColumnTitle = (columnId) => {
    if (!editingColTitle.trim()) return;
    setData({
      ...data,
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          title: editingColTitle,
        },
      },
    });
    addHistoryLog('column_rename', null, `Lista renombrada a "${editingColTitle}"`);
    setEditingColTitleId(null);
  };

  const priorityColors = {
    low: 'bg-indigo-100 text-indigo-600',
    medium: 'bg-orange-100 text-orange-600',
    high: 'bg-red-100 text-red-600',
  };

  return (
    <div 
      className="min-h-screen p-8 font-sans text-white transition-all duration-700 ease-in-out"
      style={{ background: themes[theme] || themes.indigo, backgroundAttachment: 'fixed' }}
    >
      <header className="mx-auto mb-10 flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md">
            <div className="h-5 w-5 rounded-sm border-2 border-white/80"></div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
            Kanban<span className="font-light opacity-80">Flow</span>
          </h1>
        </div>

        <div className="flex flex-grow max-w-md mx-8">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/20">
            <button 
              onClick={handleExport}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center space-x-1"
              title="Exportar Tablero"
            >
              <ArrowDown size={18} />
              <span className="text-[10px] font-bold uppercase hidden md:inline">Exportar</span>
            </button>
            <label className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center space-x-1" title="Importar Tablero">
              <ArrowUp size={18} />
              <span className="text-[10px] font-bold uppercase hidden md:inline">Importar</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          <div className="h-8 w-[1px] bg-white/20 mx-2"></div>

          <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/20">
            {Object.keys(themes).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`w-6 h-6 rounded-lg transition-all ${theme === t ? 'ring-2 ring-white scale-110 z-10' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
                style={{ background: themes[t] }}
                title={t.charAt(0).toUpperCase() + t.slice(1)}
              />
            ))}
          </div>

          <div className="h-8 w-[1px] bg-white/20 mx-2"></div>

          <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/20">
            <button 
              onClick={() => setFilterType('all')}
              className={`p-2 rounded-lg transition-all ${filterType === 'all' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}
              title="All Tasks"
            >
              <Filter size={18} />
            </button>
            <button 
              onClick={() => setFilterType('high')}
              className={`p-2 rounded-lg transition-all ${filterType === 'high' ? 'bg-red-500/40 text-white' : 'text-white/60 hover:text-white'}`}
              title="High Priority"
            >
              <AlertTriangle size={18} />
            </button>
            <button 
              onClick={() => setFilterType('overdue')}
              className={`p-2 rounded-lg transition-all ${filterType === 'overdue' ? 'bg-orange-500/40 text-white' : 'text-white/60 hover:text-white'}`}
              title="Overdue"
            >
              <Clock size={18} />
            </button>
          </div>
          
          <div className="h-8 w-[1px] bg-white/20 mx-2"></div>

          <button 
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className={`p-2 rounded-xl transition-all border ${isHistoryOpen ? 'bg-white text-indigo-600 border-white' : 'bg-white/10 text-white/60 border-white/20 hover:text-white hover:bg-white/10'}`}
            title="Actividad del Tablero"
          >
            <History size={18} />
          </button>
          
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-pink-400 to-yellow-300 ring-2 ring-white/20 ml-4"></div>
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-[calc(100vh-180px)] items-start space-x-6 overflow-x-auto pb-6 scrollbar-hide">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds
              .map((taskId) => data.tasks[taskId])
              .filter(task => {
                const matchesSearch = task.content.toLowerCase().includes(searchTerm.toLowerCase());
                if (!matchesSearch) return false;
                
                if (filterType === 'high') return task.priority === 'high';
                if (filterType === 'overdue') {
                  if (!task.dueDate) return false;
                  return new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));
                }
                return true;
              });

            return (
              <div
                key={column.id}
                className="glass flex max-h-full w-80 flex-shrink-0 flex-col rounded-2xl shadow-xl transition-all"
              >
                <div className="flex items-center justify-between px-4 py-4">
                  {editingColTitleId === column.id ? (
                    <input 
                      autoFocus
                      className="text-xs font-bold uppercase tracking-widest text-slate-700 bg-transparent border-b border-indigo-400 focus:outline-none w-full mr-4"
                      value={editingColTitle}
                      onChange={(e) => setEditingColTitle(e.target.value)}
                      onBlur={() => handleUpdateColumnTitle(column.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateColumnTitle(column.id)}
                    />
                  ) : (
                    <h2 
                      onClick={() => {
                        setEditingColTitleId(column.id);
                        setEditingColTitle(column.title);
                      }}
                      className="text-xs font-bold uppercase tracking-widest text-slate-700 cursor-pointer hover:text-indigo-600 transition-colors"
                    >
                      {column.title}
                      <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-500">
                        {tasks.length}
                      </span>
                    </h2>
                  )}
                  <button 
                    onClick={() => handleDeleteColumn(column.id)}
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
                      className={`flex-grow min-h-[150px] overflow-y-auto px-4 pb-4 transition-colors ${
                        snapshot.isDraggingOver ? 'bg-black/5' : ''
                      }`}
                    >
                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className={`group mb-3 rounded-xl bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-card-hover ${
                                snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl ring-2 ring-indigo-400' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                  {editingTaskId === task.id ? (
                                    <div className="w-full space-y-3 p-2 bg-slate-50 rounded-xl border border-indigo-100 shadow-inner">
                                      <textarea
                                        autoFocus
                                        className="text-sm font-semibold leading-relaxed text-slate-700 w-full bg-white border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                        value={editingTaskContent}
                                        onChange={(e) => setEditingTaskContent(e.target.value)}
                                        rows={2}
                                      />
                                      
                                      <div className="flex items-center space-x-2">
                                        <div className="flex-grow">
                                          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Due Date</label>
                                          <input 
                                            type="date"
                                            className="text-xs text-slate-600 bg-white rounded-lg px-2 py-1.5 focus:outline-none w-full border border-slate-200"
                                            value={editingTaskDate}
                                            onChange={(e) => setEditingTaskDate(e.target.value)}
                                          />
                                        </div>
                                        <div className="w-1/3">
                                          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Priority</label>
                                          <button 
                                            onClick={() => togglePriority(task.id)}
                                            className={`w-full text-[10px] font-bold py-1.5 rounded-lg border transition-all ${priorityColors[task.priority || 'low']}`}
                                          >
                                            {(task.priority || 'low').toUpperCase()}
                                          </button>
                                        </div>
                                      </div>

                                      {/* Member & Tag Editor Row */}
                                      <div className="flex space-x-3">
                                        <div className="flex-grow">
                                          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Asignado a</label>
                                          <div className="flex flex-wrap gap-2">
                                            {(data.members || defaultMembers).map(member => (
                                              <button
                                                key={member.id}
                                                onClick={() => {
                                                  const newTask = { ...data.tasks[task.id], assignedTo: member.id };
                                                  setData({
                                                    ...data,
                                                    tasks: { ...data.tasks, [task.id]: newTask }
                                                  });
                                                  addHistoryLog('member_assign', task.id, `Asignado a ${member.name}`);
                                                }}
                                                className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white transition-all ring-offset-1 ${member.color} ${task.assignedTo === member.id ? 'ring-2 ring-indigo-500 scale-110 shadow-md' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
                                                title={member.name}
                                              >
                                                {member.avatar}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="w-1/2">
                                          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Tags</label>
                                          <div className="flex flex-wrap gap-1">
                                            {Object.keys(tagColors).map(tag => (
                                              <button
                                                key={tag}
                                                onClick={() => handleToggleTag(task.id, tag)}
                                                className={`text-[9px] font-bold px-2 py-1 rounded-md border transition-all ${
                                                  (task.tags || []).includes(tag) 
                                                    ? tagColors[tag] 
                                                    : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-300'
                                                }`}
                                              >
                                                {tag}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Subtask Editor */}
                                      <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Subtasks</label>
                                        {(task.subtasks || []).map(sub => (
                                          <div key={sub.id} className="flex items-center group/sub bg-white p-1.5 rounded-lg border border-slate-100">
                                            <button 
                                              onClick={() => toggleSubtask(task.id, sub.id)}
                                              className={`mr-2 transition-colors ${sub.completed ? 'text-green-500' : 'text-slate-300 hover:text-indigo-400'}`}
                                            >
                                              {sub.completed ? <CheckSquare size={14} /> : <Square size={14} />}
                                            </button>
                                            <span className={`text-xs flex-grow ${sub.completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                                              {sub.content}
                                            </span>
                                            <button 
                                              onClick={() => handleDeleteSubtask(task.id, sub.id)}
                                              className="opacity-0 group-hover/sub:opacity-100 p-1 text-slate-300 hover:text-red-400 transition-all"
                                            >
                                              <X size={12} />
                                            </button>
                                          </div>
                                        ))}
                                        <div className="relative">
                                          <input 
                                            type="text"
                                            placeholder="Add a subtask..."
                                            className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-2 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none pr-8"
                                            value={newSubtaskContent}
                                            onChange={(e) => setNewSubtaskContent(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask(task.id)}
                                          />
                                          <button 
                                            onClick={() => handleAddSubtask(task.id)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-700"
                                          >
                                            <Plus size={14} />
                                          </button>
                                        </div>
                                      </div>

                                      {/* History Log */}
                                      <div className="space-y-2 mt-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Historial Reciente</label>
                                        <div className="max-h-32 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                          {(data.history || [])
                                            .filter(log => log.taskId === task.id)
                                            .slice(0, 5)
                                            .map(log => (
                                              <div key={log.id} className="text-[10px] text-slate-500 flex items-start space-x-2 border-l-2 border-slate-100 pl-2">
                                                <span className="font-bold whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}:</span>
                                                <span>{log.content}</span>
                                              </div>
                                            ))}
                                          {(!data.history || data.history.filter(log => log.taskId === task.id).length === 0) && (
                                            <p className="text-[10px] text-slate-400 italic">Sin actividad registrada aún.</p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="pt-4 flex justify-between items-center border-t border-slate-100 mt-4">
                                        <div className="flex items-center space-x-2 text-slate-500">
                                          <Clock size={14} />
                                          <span className="text-xs font-bold font-mono">{formatTime(task.totalTime || 0)}</span>
                                        </div>
                                        <button 
                                          onClick={() => handleUpdateTask(task.id, editingTaskContent, editingTaskDate)}
                                          className="text-xs font-bold bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 shadow-sm active:scale-95 transition-all"
                                        >
                                          Cerrar y Guardar
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <p 
                                        onClick={() => {
                                          setEditingTaskId(task.id);
                                          setEditingTaskContent(task.content);
                                          setEditingTaskDate(task.dueDate || '');
                                        }}
                                        className="text-sm font-medium leading-relaxed text-slate-700 cursor-pointer flex-grow"
                                      >
                                        {task.content}
                                      </p>
                                      <div className="flex items-center space-x-1 ml-2">
                                        <button 
                                          onClick={() => toggleTimer(task.id)}
                                          className={`p-1.5 rounded-lg transition-all ${task.timerRunning ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-400 hover:text-indigo-600'}`}
                                          title={task.timerRunning ? 'Pausar' : 'Iniciar tiempo'}
                                        >
                                          {task.timerRunning ? <CircleDot size={14} /> : <Circle size={14} />}
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteTask(column.id, task.id)}
                                          className="translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 p-1.5 text-red-400 hover:text-red-600"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </>
                                  )}
                              </div>

                              {/* Tags Display */}
                              {(task.tags && task.tags.length > 0) && (
                                <div className="mt-2 flex flex-wrap gap-1">
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

                              {/* Subtasks Progress */}
                              {task.subtasks && task.subtasks.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                                    <div className="flex items-center space-x-1">
                                      <CheckCircle2 size={12} className={task.subtasks.every(s => s.completed) ? 'text-green-500' : 'text-slate-300'} />
                                      <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks</span>
                                    </div>
                                    <span>{Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100)}%</span>
                                  </div>
                                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-indigo-500 transition-all duration-500" 
                                      style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}                                <div className="mt-3 flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                      <Clock size={10} className={task.timerRunning ? 'text-indigo-500' : ''} />
                                      <span className="font-mono">{formatTime(task.totalTime || 0)}</span>
                                    </div>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        togglePriority(task.id);
                                      }}
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
                                  
                                  {task.assignedTo && (
                                    <div 
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm ring-1 ring-white ${
                                        (data.members || defaultMembers).find(m => m.id === task.assignedTo)?.color || 'bg-slate-400'
                                      }`}
                                      title={(data.members || defaultMembers).find(m => m.id === task.assignedTo)?.name}
                                    >
                                      {(data.members || defaultMembers).find(m => m.id === task.assignedTo)?.avatar}
                                    </div>
                                  )}
                                </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <div className="p-3">
                  {editingColumn === column.id ? (
                    <div className="rounded-xl bg-white p-3 shadow-md">
                      <textarea
                        autoFocus
                        value={newTaskContent}
                        onChange={(e) => setNewTaskContent(e.target.value)}
                        placeholder="What needs to be done?"
                        className="w-full resize-none rounded-lg border-2 border-slate-100 p-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
                        rows={3}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddTask(column.id);
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
                          onClick={() => handleAddTask(column.id)}
                          className="rounded-lg bg-indigo-500 px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-indigo-600 active:scale-95"
                        >
                          Add Card
                        </button>
                        <button
                          onClick={() => {
                            setEditingColumn(null);
                            setNewTaskContent('');
                          }}
                          className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 transition-all hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setEditingColumn(column.id)}
                      className="group flex w-full items-center justify-center space-x-2 rounded-xl border-2 border-dashed border-slate-300/50 py-3 transition-all hover:border-indigo-400 hover:bg-white/50"
                    >
                      <Plus size={18} className="text-slate-400 group-hover:text-indigo-500" />
                      <span className="text-sm font-semibold text-slate-500 group-hover:text-indigo-600">
                        Add a card
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          
          {isAddingColumn ? (
            <div className="flex w-80 flex-shrink-0 flex-col rounded-2xl bg-white text-slate-800 p-4 shadow-xl">
              <input
                autoFocus
                type="text"
                placeholder="List title..."
                className="w-full rounded-lg border-2 border-slate-100 p-2 text-sm font-bold focus:border-indigo-400 focus:outline-none"
                value={newColTitle}
                onChange={(e) => setNewColTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
              />
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={handleAddColumn}
                  className="rounded-lg bg-indigo-500 px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-indigo-600"
                >
                  Add List
                </button>
                <button
                  onClick={() => setIsAddingColumn(false)}
                  className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsAddingColumn(true)}
              className="flex h-32 w-80 flex-shrink-0 flex-col items-center justify-center space-y-3 rounded-2xl border-2 border-dashed border-white/30 bg-white/10 p-6 text-white transition-all hover:bg-white/20 active:scale-[0.98]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Plus size={24} />
              </div>
              <span className="font-bold tracking-tight">Add another list</span>
            </button>
          )}
        </div>
      </DragDropContext>

      {/* History Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-in-out z-50 transform ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-white/20 text-slate-800 flex flex-col`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="text-indigo-500" size={20} />
            <h2 className="text-lg font-bold tracking-tight">Actividad Reciente</h2>
          </div>
          <button 
            onClick={() => setIsHistoryOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
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
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-40">
              <History size={48} className="text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No hay actividad registrada aún en este tablero.</p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[10px] text-slate-400 italic text-center">
            Se mantienen los últimos 100 eventos de actividad.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
