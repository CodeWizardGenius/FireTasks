import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Task, useTasks } from '../hooks/useTasks';
import { TaskItem } from '../components/TaskItem';

export default function HomeScreen() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100">
        <ActivityIndicator />
      </View>
    );
  }

  const { tasksQuery, addTaskMutation, deleteTaskMutation, updateTaskMutation } =
    useTasks(user.uid);

  const handleAdd = () => {
    const trimmed = newTitle.trim();
    if (!trimmed || addTaskMutation.isPending) return;

    addTaskMutation.mutate(trimmed, {
      onSettled: () => setNewTitle(''),
    });
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-100"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 items-center justify-center px-4">
        <View className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
          <Text className="mb-6 text-center text-3xl font-bold">FireTasks</Text>

          <Text className="mb-3 text-lg font-semibold">Tasks</Text>

          <View className="mb-4 flex-row items-center space-x-2">
            <TextInput
              className="flex-1 h-10 rounded-md border border-gray-300 px-3 text-sm"
              placeholder="Enter task title..."
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TouchableOpacity
              className={`h-10 items-center justify-center rounded-md px-4 ${
                addTaskMutation.isPending ? 'bg-blue-400' : 'bg-blue-600'
              }`}
              onPress={handleAdd}
              disabled={addTaskMutation.isPending}
            >
              <Text className="text-xs font-semibold text-white">
                {addTaskMutation.isPending ? 'Adding' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>

          {tasksQuery.isLoading ? (
            <View className="py-6 items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={tasksQuery.data as Task[] | undefined}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View className="h-2" />}
              ListEmptyComponent={
                <Text className="py-4 text-center text-xs text-gray-400">
                  Henüz görev yok. Yeni bir görev ekle.
                </Text>
              }
              renderItem={({ item }) => (
                <TaskItem
                  task={item}
                  onDelete={() => deleteTaskMutation.mutate(item.id)}
                  onUpdate={(title) =>
                    updateTaskMutation.mutate({ id: item.id, title })
                  }
                />
              )}
            />
          )}

          <TouchableOpacity
            className="mt-8 h-11 items-center justify-center rounded-md bg-blue-600"
            onPress={handleLogout}
          >
            <Text className="text-sm font-semibold text-white">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
