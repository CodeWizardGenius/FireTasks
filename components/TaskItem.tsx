import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Task } from '../hooks/useTasks';

type Props = {
  task: Task;
  onDelete: () => void;
  onUpdate: (title: string) => void;
};

export const TaskItem: React.FC<Props> = ({ task, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const saveEdit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onUpdate(trimmed);
    setIsEditing(false);
  };

  return (
    <View className="flex-row items-center justify-between py-1">
      {isEditing ? (
        <View className="flex-1 flex-row items-center space-x-2">
          <TextInput
            className="flex-1 h-8 rounded-md border border-gray-300 px-2 text-sm"
            value={title}
            onChangeText={setTitle}
          />
          <TouchableOpacity onPress={saveEdit}>
            <Text className="text-xs font-semibold text-blue-600">Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(false)}>
            <Text className="text-xs text-gray-500">Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          className="flex-1 flex-row items-center space-x-2"
          onPress={() => setIsEditing(true)}
          activeOpacity={0.7}
        >
          <View className="h-4 w-4 rounded-full border border-gray-400" />
          <Text className="text-sm">{task.title}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={onDelete}>
        <Text className="text-xs font-semibold text-red-500">Delete</Text>
      </TouchableOpacity>
    </View>
  );
};
