import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Droplets, Plus, Minus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { COLORS } from '@/constants/colors';
import { useAppData } from '@/providers/AppDataProvider';

const DAILY_GOAL = 8;

export default function SuTakibiScreen() {
  const { waterEntries, addWaterEntry } = useAppData();

  const today = useMemo(() => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  }, []);

  const todayEntry = useMemo(() => {
    return waterEntries.find(e => e.date === today);
  }, [waterEntries, today]);

  const todayGlasses = todayEntry?.glasses ?? 0;
  const progress = Math.min(todayGlasses / DAILY_GOAL, 1);

  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(fillAnim, {
      toValue: progress,
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start();
  }, [progress]);

  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const handleAdd = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    addWaterEntry(1);
  }, [addWaterEntry]);

  const recentEntries = useMemo(() => {
    return waterEntries.slice(0, 7);
  }, [waterEntries]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Su Takibi" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.glassContainer}>
          <View style={styles.glassOutline}>
            <Animated.View style={[styles.glassFill, { height: fillHeight }]} />
            <View style={styles.glassContent}>
              <Droplets size={32} color={progress >= 0.5 ? COLORS.white : '#3B82F6'} />
              <Text style={[styles.glassCount, progress >= 0.5 && styles.glassCountLight]}>
                {todayGlasses}/{DAILY_GOAL}
              </Text>
              <Text style={[styles.glassLabel, progress >= 0.5 && styles.glassLabelLight]}>bardak</Text>
            </View>
          </View>
        </View>

        {todayGlasses >= DAILY_GOAL && (
          <View style={styles.goalBanner}>
            <Text style={styles.goalText}>🎉 Günlük hedefinize ulaştınız!</Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.7} testID="add-water">
            <Plus size={24} color={COLORS.white} />
            <Text style={styles.addBtnText}>1 Bardak Ekle</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Son Kayıtlar</Text>
        {recentEntries.length === 0 ? (
          <Text style={styles.emptyText}>Henüz su kaydı bulunmamaktadır.</Text>
        ) : (
          recentEntries.map((entry) => (
            <View key={entry.id} style={styles.historyRow}>
              <Droplets size={16} color="#3B82F6" />
              <Text style={styles.historyDate}>{entry.date}</Text>
              <Text style={styles.historyGlasses}>{entry.glasses} bardak</Text>
              {entry.glasses >= DAILY_GOAL && <Text style={styles.checkMark}>✓</Text>}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  glassContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  glassOutline: {
    width: 140,
    height: 180,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#3B82F6',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: '#EFF6FF',
  },
  glassFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    borderRadius: 16,
  },
  glassContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCount: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#1E40AF',
    marginTop: 6,
  },
  glassCountLight: {
    color: COLORS.white,
  },
  glassLabel: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '500' as const,
  },
  glassLabelLight: {
    color: '#DBEAFE',
  },
  goalBanner: {
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  goalText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#166534',
  },
  buttonRow: {
    marginBottom: 24,
  },
  addBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.text,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    gap: 10,
  },
  historyDate: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500' as const,
  },
  historyGlasses: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '600' as const,
  },
  checkMark: {
    fontSize: 16,
    color: '#22C55E',
    fontWeight: '700' as const,
  },
});
