import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type Task = {
  id: string;
  title: string;
  createdAt?: any;
};

const fetchTasks = async (userId: string): Promise<Task[]> => {
  const ref = collection(db, 'users', userId, 'tasks');
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
};

export const useTasks = (userId: string) => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks', userId],
    queryFn: () => fetchTasks(userId),
    enabled: !!userId,
  });

  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const ref = collection(db, 'users', userId, 'tasks');
      await addDoc(ref, { title, createdAt: serverTimestamp() });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] }),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const ref = doc(db, 'users', userId, 'tasks', id);
      await deleteDoc(ref);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] }),
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const ref = doc(db, 'users', userId, 'tasks', id);
      await updateDoc(ref, { title });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] }),
  });

  return { tasksQuery, addTaskMutation, deleteTaskMutation, updateTaskMutation };
};
