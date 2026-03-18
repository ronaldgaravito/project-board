import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';

const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Design UI for Trello clone', priority: 'high' },
    'task-2': { id: 'task-2', content: 'Implement drag and drop', priority: 'medium' },
    'task-3': { id: 'task-3', content: 'Add task functionality', priority: 'low' },
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
};

function App() {
  const [data, setData] = useState(initialData);
  const [editingColumn, setEditingColumn] = useState(null);
  const [newTaskContent, setNewTaskContent] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskContent, setEditingTaskContent] = useState('');
  const [editingColTitleId, setEditingColTitleId] = useState(null);
  const [editingColTitle, setEditingColTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColTitle, setNewColTitle] = useState('');

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
  };

  const handleAddTask = (columnId) => {
    if (!newTaskContent.trim()) return;

    const newTaskId = `task-${Object.keys(data.tasks).length + 1}`;
    const newTask = {
      id: newTaskId,
      content: newTaskContent,
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
    setNewTaskContent('');
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
  };

  const handleUpdateTask = (taskId, newContent) => {
    if (!newContent.trim()) return;
    const newState = {
      ...data,
      tasks: {
        ...data.tasks,
        [taskId]: {
          ...data.tasks[taskId],
          content: newContent,
        },
      },
    };
    setData(newState);
    setEditingTaskId(null);
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
    setEditingColTitleId(null);
  };

  const priorityColors = {
    low: 'bg-indigo-100 text-indigo-600',
    medium: 'bg-orange-100 text-orange-600',
    high: 'bg-red-100 text-red-600',
  };

  return (
    <div className="min-h-screen p-8 font-sans text-white">
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
          <button className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium transition-all hover:bg-white/20 active:scale-95">
            Workspaces
          </button>
          <button className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium transition-all hover:bg-white/20 active:scale-95">
            Starred
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-pink-400 to-yellow-300 ring-2 ring-white/20"></div>
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-[calc(100vh-180px)] items-start space-x-6 overflow-x-auto pb-6 scrollbar-hide">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds
              .map((taskId) => data.tasks[taskId])
              .filter(task => task.content.toLowerCase().includes(searchTerm.toLowerCase()));

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
                                    <textarea
                                      autoFocus
                                      className="text-sm font-medium leading-relaxed text-slate-700 w-full bg-slate-50 rounded p-1 focus:outline-none"
                                      value={editingTaskContent}
                                      onChange={(e) => setEditingTaskContent(e.target.value)}
                                      onBlur={() => handleUpdateTask(task.id, editingTaskContent)}
                                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleUpdateTask(task.id, editingTaskContent)}
                                    />
                                  ) : (
                                    <p 
                                      onClick={() => {
                                        setEditingTaskId(task.id);
                                        setEditingTaskContent(task.content);
                                      }}
                                      className="text-sm font-medium leading-relaxed text-slate-700 cursor-pointer flex-grow"
                                    >
                                      {task.content}
                                    </p>
                                  )}
                                  <button 
                                    onClick={() => handleDeleteTask(column.id, task.id)}
                                    className="ml-2 translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                                  >
                                    <Trash2 size={14} className="text-red-400 hover:text-red-600" />
                                  </button>
                              </div>
                              <div className="mt-3 flex items-center space-x-2">
                                <div className="h-1.5 w-8 rounded-full bg-indigo-100 group-hover:bg-indigo-200"></div>
                                <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    togglePriority(task.id);
                                  }}
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase transition-colors ${priorityColors[task.priority || 'low']}`}
                                >
                                  {(task.priority || 'low')} Priority
                                </button>
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
    </div>
  );
}

export default App;
