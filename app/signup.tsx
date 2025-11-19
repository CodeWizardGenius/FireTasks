import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen() {
  const { signup, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    router.replace('/');
  }

  const onSubmit = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Email ve şifre zorunludur.');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı.');
      return;
    }

    try {
      setSubmitting(true);
      await signup(email.trim(), password);
      router.replace('/');
    } catch (e: any) {
      console.error(e);
      setError('Kayıt başarısız. Email daha önce kullanılmış olabilir.');
      Alert.alert('Signup error', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-100"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-xs rounded-2xl bg-white p-6 shadow">
          <Text className="mb-6 text-center text-3xl font-bold">FireTasks</Text>

          <Text className="mb-3 text-lg font-semibold">Signup</Text>

          <Text className="mb-1 text-sm text-gray-600">Email</Text>
          <TextInput
            className="h-10 rounded-md border border-gray-300 px-3 text-sm"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text className="mt-3 mb-1 text-sm text-gray-600">Password</Text>
          <TextInput
            className="h-10 rounded-md border border-gray-300 px-3 text-sm"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? (
            <Text className="mt-2 text-xs text-red-500">{error}</Text>
          ) : null}

          <TouchableOpacity
            className={`mt-6 h-11 items-center justify-center rounded-md ${
              submitting ? 'bg-blue-400' : 'bg-blue-600'
            }`}
            onPress={onSubmit}
            disabled={submitting}
          >
            <Text className="text-sm font-semibold text-white">
              {submitting ? 'Signing up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <View className="mt-4 items-center">
            <Text className="text-xs text-gray-500">
              Already have an account?
            </Text>
            <Link
              href="/login"
              className="mt-1 text-xs font-semibold text-blue-600"
            >
              Go to Login
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
