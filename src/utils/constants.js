export const themes = {
  indigo: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  sunset: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  ocean: 'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)',
  emerald: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  midnight: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
  rose: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
};

export const tagColors = {
  bug: 'bg-rose-500/20 text-rose-600 border-rose-200',
  feature: 'bg-sky-500/20 text-sky-600 border-sky-200',
  design: 'bg-fuchsia-500/20 text-fuchsia-600 border-fuchsia-200',
  research: 'bg-amber-500/20 text-amber-600 border-amber-200',
  refactor: 'bg-emerald-500/20 text-emerald-600 border-emerald-200',
  urgent: 'bg-orange-500/20 text-orange-600 border-orange-200',
};

export const priorityColors = {
  low: 'bg-indigo-100 text-indigo-600',
  medium: 'bg-orange-100 text-orange-600',
  high: 'bg-red-100 text-red-600',
};

export const defaultMembers = [
  { id: 'm1', name: 'Ronald', avatar: 'RO', color: 'bg-indigo-500' },
  { id: 'm2', name: 'Alex', avatar: 'AL', color: 'bg-emerald-500' },
  { id: 'm3', name: 'Jordan', avatar: 'JO', color: 'bg-amber-500' },
  { id: 'm4', name: 'Sam', avatar: 'SA', color: 'bg-rose-500' },
];

export const initialData = {
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
      ],
      comments: [
        { id: 'com-1', memberId: 'm1', text: 'Initial design looks promising!', timestamp: new Date().toISOString() }
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
