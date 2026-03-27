import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { useAppData } from '@/providers/AppDataProvider';

const MENU_ITEMS = [
  { label: 'Profil', route: '/profil' },
  { label: 'Bilgilendirme', route: '/bilgilendirme' },
  { label: 'BKİ Hesaplama', route: '/bki-hesaplama' },
  { label: 'Ön Testler', route: '/on-testler' },
  { label: 'Son Testler', route: '/son-testler' },
  { label: 'İletişim', route: '/iletisim' },
  { label: 'Hakkımızda', route: '/hakkimizda' },
  { label: 'S.S.S.', route: '/sss' },
  { label: 'Besin Ekle', route: '/besin-ekle' },
  { label: 'Adımsayar', route: '/adimsayar' },
  { label: 'Su Takibi', route: '/su-takibi' },
  { label: 'Kan Şekeri', route: '/kan-sekeri' },
] as const;

export default function HomeScreen() {
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
    <View style={styles.container}>
      <View style={[styles.redHeader, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <View style={{ width: 40 }} />
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.iconBtn} onPress={handleLogout} testID="logout-button">
            <LogOut size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.curveContainer}>
        <View style={styles.curve} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🏥</Text>
          </View>
          <Text style={styles.logoText}>PREDIABET</Text>
        </View>

        <View style={styles.grid}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuCard}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
              testID={`menu-${index}`}
            >
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  redHeader: {
    backgroundColor: COLORS.primary,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 6,
  },
  logoIcon: {
    fontSize: 28,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 12,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.text,
    textAlign: 'center',
  },
});
