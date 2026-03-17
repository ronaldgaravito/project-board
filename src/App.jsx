import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';

const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Design UI for Trello clone' },
    'task-2': { id: 'task-2', content: 'Implement drag and drop' },
    'task-3': { id: 'task-3', content: 'Add task functionality' },
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
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

            return (
              <div
                key={column.id}
                className="glass flex max-h-full w-80 flex-shrink-0 flex-col rounded-2xl shadow-xl transition-all"
              >
                <div className="flex items-center justify-between px-4 py-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700">
                    {column.title}
                    <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-500">
                      {tasks.length}
                    </span>
                  </h2>
                  <button className="rounded-full p-2 transition-colors hover:bg-black/5">
                    <MoreHorizontal size={18} className="text-slate-500" />
                  </button>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-grow overflow-y-auto px-4 pb-4 transition-colors ${
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
                                <p className="text-sm font-medium leading-relaxed text-slate-700">
                                  {task.content}
                                </p>
                                <button className="ml-2 translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                                  <Trash2 size={14} className="text-red-400 hover:text-red-600" />
                                </button>
                              </div>
                              <div className="mt-3 flex items-center space-x-2">
                                <div className="h-1.5 w-8 rounded-full bg-indigo-100 group-hover:bg-indigo-200"></div>
                                <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                                <span className="text-[10px] text-slate-400">Low Priority</span>
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
                  <button className="group flex w-full items-center justify-center space-x-2 rounded-xl border-2 border-dashed border-slate-300/50 py-3 transition-all hover:border-indigo-400 hover:bg-white/50">
                    <Plus size={18} className="text-slate-400 group-hover:text-indigo-500" />
                    <span className="text-sm font-semibold text-slate-500 group-hover:text-indigo-600">
                      Add a card
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
          
          <button className="flex w-80 flex-shrink-0 flex-col items-center justify-center space-y-3 rounded-2xl border-2 border-dashed border-white/30 bg-white/10 p-6 text-white transition-all hover:bg-white/20 active:scale-[0.98]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Plus size={24} />
            </div>
            <span className="font-bold tracking-tight">Add another list</span>
          </button>
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
