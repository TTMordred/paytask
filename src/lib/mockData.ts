export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'client' | 'worker';
  reputation: number;
  totalTasks: number;
  completedTasks: number;
  earnings?: number;
  joinedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  reward: number;
  deadline: string;
  status: 'draft' | 'published' | 'in_progress' | 'submitted' | 'approved' | 'rejected' | 'cancelled';
  clientId: string;
  workerId?: string;
  createdAt: string;
  submittedAt?: string;
  submissionNotes?: string;
  attachments?: string[];
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  clientRating?: number; // Added for client to rate worker
  workerRating?: number; // Added for worker to rate client
}

export interface Rating {
  id: string;
  taskId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  taskId: string;
  amount: number;
  status: 'pending' | 'escrowed' | 'released' | 'refunded';
  type: 'deposit' | 'payment' | 'refund';
  createdAt: string;
}

// Keys for localStorage
const LOCAL_STORAGE_KEYS = {
  USERS: 'paytask_users',
  TASKS: 'paytask_tasks',
  RATINGS: 'paytask_ratings',
  PAYMENTS: 'paytask_payments',
  CURRENT_USER: 'paytask_current_user',
};

// Initial Mock Data
const initialMockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'client',
    reputation: 4.8,
    totalTasks: 25,
    completedTasks: 23,
    joinedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'worker',
    reputation: 4.9,
    totalTasks: 47,
    completedTasks: 45,
    earnings: 2850,
    joinedAt: '2024-02-10',
  },
  {
    id: '3',
    name: 'Maya Patel',
    email: 'maya@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    role: 'worker',
    reputation: 4.7,
    totalTasks: 31,
    completedTasks: 29,
    earnings: 1920,
    joinedAt: '2024-03-05',
  }
];

const initialMockTasks: Task[] = [
  {
    id: '1',
    title: 'Write product descriptions for e-commerce site',
    description: 'Need compelling product descriptions for 10 tech gadgets. Each description should be 100-150 words, SEO-optimized, and highlight key features and benefits.',
    category: 'Writing',
    reward: 50,
    deadline: '2024-01-25T18:00:00Z',
    status: 'published',
    clientId: '1',
    createdAt: '2024-01-20T10:00:00Z',
    tags: ['copywriting', 'seo', 'ecommerce'],
    difficulty: 'medium',
  },
  {
    id: '2',
    title: 'Social media graphics design',
    description: 'Create 5 Instagram post graphics for a fitness brand. Modern, vibrant style with provided brand colors. Include motivational quotes and workout tips.',
    category: 'Design',
    reward: 75,
    deadline: '2024-01-23T16:00:00Z',
    status: 'in_progress',
    clientId: '1',
    workerId: '2',
    createdAt: '2024-01-18T14:30:00Z',
    tags: ['graphic design', 'social media', 'fitness'],
    difficulty: 'medium',
  },
  {
    id: '3',
    title: 'Simple data entry task',
    description: 'Transfer 200 customer contacts from PDF to Excel spreadsheet. Ensure accuracy and proper formatting.',
    category: 'Data Entry',
    reward: 25,
    deadline: '2024-01-22T12:00:00Z',
    status: 'submitted',
    clientId: '1',
    workerId: '3',
    createdAt: '2024-01-19T09:00:00Z',
    submittedAt: '2024-01-21T15:30:00Z',
    submissionNotes: 'Completed all 200 entries. Double-checked for accuracy and applied consistent formatting.',
    tags: ['data entry', 'excel', 'admin'],
    difficulty: 'easy',
  },
  {
    id: '4',
    title: 'Voice-over for explainer video',
    description: 'Record professional voice-over for 2-minute explainer video. Clear American accent, friendly tone. Script provided.',
    category: 'Audio',
    reward: 100,
    deadline: '2024-01-28T20:00:00Z',
    status: 'published',
    clientId: '1',
    createdAt: '2024-01-21T11:15:00Z',
    tags: ['voice over', 'audio', 'video'],
    difficulty: 'medium',
  }
];

const initialMockRatings: Rating[] = [
  {
    id: '1',
    taskId: '2',
    fromUserId: '1',
    toUserId: '2',
    rating: 5,
    comment: 'Excellent work! Graphics exceeded expectations.',
    createdAt: '2024-01-20T16:30:00Z',
  },
  {
    id: '2',
    taskId: '3',
    fromUserId: '3',
    toUserId: '1',
    rating: 5,
    comment: 'Great client, clear instructions and prompt payment.',
    createdAt: '2024-01-21T17:00:00Z',
  }
];

const initialMockPayments: Payment[] = [
  {
    id: '1',
    taskId: '1',
    amount: 50,
    status: 'escrowed',
    type: 'deposit',
    createdAt: '2024-01-20T10:05:00Z',
  },
  {
    id: '2',
    taskId: '2',
    amount: 75,
    status: 'escrowed',
    type: 'deposit',
    createdAt: '2024-01-18T14:35:00Z',
  },
  {
    id: '3',
    taskId: '3',
    amount: 25,
    status: 'released',
    type: 'payment',
    createdAt: '2024-01-21T16:00:00Z',
  }
];

// Helper to load data from localStorage or use initial mock data
const loadData = <T>(key: string, initialData: T[]): T[] => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : initialData;
  } catch (error) {
    console.error(`Error loading data from localStorage for key ${key}:`, error);
    return initialData;
  }
};

// Helper to save data to localStorage
const saveData = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to localStorage for key ${key}:`, error);
  }
};

// Export mutable mock data, loaded from localStorage
export let mockUsers: User[] = loadData(LOCAL_STORAGE_KEYS.USERS, initialMockUsers);
export let mockTasks: Task[] = loadData(LOCAL_STORAGE_KEYS.TASKS, initialMockTasks);
export let mockRatings: Rating[] = loadData(LOCAL_STORAGE_KEYS.RATINGS, initialMockRatings);
export let mockPayments: Payment[] = loadData(LOCAL_STORAGE_KEYS.PAYMENTS, initialMockPayments);

// Current logged in user (can be switched for demo)
// Load current user from localStorage, or default to the first mock user
const loadCurrentUser = (): User => {
  try {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    return storedUser ? JSON.parse(storedUser) : mockUsers[0];
  } catch (error) {
    console.error('Error loading current user from localStorage:', error);
    return mockUsers[0];
  }
};
export const currentUser: User = loadCurrentUser();

// Helper to update current user in localStorage
export const setCurrentUser = (user: User): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  // Note: In a real app, you might want to reload the page or update global state
  // to reflect the user change. For this mock, we'll assume it's handled.
};


export const getTasksByStatus = (status: Task['status']): Task[] => {
  return mockTasks.filter(task => task.status === status);
};

export const getTasksByUserId = (userId: string, role: 'client' | 'worker'): Task[] => {
  if (role === 'client') {
    return mockTasks.filter(task => task.clientId === userId);
  } else {
    return mockTasks.filter(task => task.workerId === userId);
  }
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getTaskById = (id: string): Task | undefined => {
  return mockTasks.find(task => task.id === id);
};

export const getPaymentsByTaskId = (taskId: string): Payment[] => {
  return mockPayments.filter(payment => payment.taskId === taskId);
};

export const addTask = (newTask: Task) => {
  mockTasks.push(newTask);
  saveData(LOCAL_STORAGE_KEYS.TASKS, mockTasks);
};

export const updateTaskStatus = (taskId: string, newStatus: Task['status'], workerId?: string) => {
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    const updates: Partial<Task> = { status: newStatus };
    if (workerId !== undefined) {
      updates.workerId = workerId;
    }
    mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates };
    saveData(LOCAL_STORAGE_KEYS.TASKS, mockTasks);
  }
};

export const updateTaskClientRating = (taskId: string, rating: number) => {
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    mockTasks[taskIndex] = { ...mockTasks[taskIndex], clientRating: rating };
    saveData(LOCAL_STORAGE_KEYS.TASKS, mockTasks);
  }
};

export const addPayment = (newPayment: Payment) => {
  mockPayments.push(newPayment);
  saveData(LOCAL_STORAGE_KEYS.PAYMENTS, mockPayments);
};

export const cancelTask = (taskId: string) => {
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    const task = mockTasks[taskIndex];
    if (task.status === 'published') { // Only allow cancellation if no worker has applied
      mockTasks[taskIndex] = { ...task, status: 'cancelled' };
      saveData(LOCAL_STORAGE_KEYS.TASKS, mockTasks);

      // Optionally, refund the escrowed amount
      const paymentToRefund = mockPayments.find(p => p.taskId === taskId && p.type === 'deposit' && p.status === 'escrowed');
      if (paymentToRefund) {
        paymentToRefund.status = 'refunded';
        saveData(LOCAL_STORAGE_KEYS.PAYMENTS, mockPayments);
        console.log(`Refunded $${paymentToRefund.amount} for cancelled task ${taskId}`);
      }
    } else {
      console.warn(`Task ${taskId} cannot be cancelled because its status is ${task.status}.`);
    }
  }
};
