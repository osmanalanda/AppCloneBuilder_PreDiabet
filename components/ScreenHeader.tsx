import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, LogOut } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { useAppData } from '@/providers/AppDataProvider';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
}

export default function ScreenHeader({ title, showBack = true }: ScreenHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout } = useAppData();

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Çıkış',
      'Çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login' as any);
          },
        },
      ],
    );
  }, [logout, router]);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.redSection, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          {showBack ? (
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} testID="back-button">
              <ChevronLeft size={28} color={COLORS.white} />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconBtn} />
          )}
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.iconBtn} onPress={handleLogout} testID="logout-button">
            <LogOut size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.curveContainer}>
        <View style={styles.curve} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  redSection: {
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  curveContainer: {
    width: '100%',
    height: 30,
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
  },
  curve: {
    width: '100%',
    height: 60,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 9999,
    borderTopRightRadius: 9999,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.primary,
    marginTop: -4,
    marginBottom: 12,
    textAlign: 'center',
  },
});
