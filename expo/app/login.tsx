import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useAppData } from '@/providers/AppDataProvider';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAppData();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = useCallback(async () => {
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Lütfen kullanıcı adı ve şifre giriniz.');
      return;
    }
    const success = await login(username.trim(), password.trim());
    if (success) {
      router.replace('/');
    } else {
      setError('Kullanıcı adı veya şifre hatalı.');
    }
  }, [username, password, login, router]);

  return (
    <View style={styles.container}>
      <View style={[styles.topSection, { paddingTop: insets.top + 40 }]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🏥</Text>
        </View>
        <Text style={styles.appName}>PREDIABET</Text>
        <Text style={styles.subtitle}>Sağlıklı Yaşam İçin</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.formSection}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View style={[styles.formCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.loginTitle}>Giriş Yap</Text>

          <View style={styles.inputWrapper}>
            <User size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Kullanıcı Adı"
              placeholderTextColor={COLORS.textSecondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              testID="input-username"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              placeholderTextColor={COLORS.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              testID="input-password"
            />
          </View>

          {error !== '' && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.8} testID="login-button">
            <Text style={styles.loginBtnText}>Giriş</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  topSection: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  logoEmoji: {
    fontSize: 36,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: COLORS.white,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    fontWeight: '500' as const,
  },
  formSection: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  formCard: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 36,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: COLORS.text,
    marginBottom: 28,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 14,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
});
