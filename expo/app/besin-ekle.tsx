import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { History } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { COLORS } from '@/constants/colors';
import { FOOD_ITEMS } from '@/mocks/data';
import { useAppData } from '@/providers/AppDataProvider';

export default function BesinEkleScreen() {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const { saveFoodSelection } = useAppData();
  const router = useRouter();

  const toggleItem = useCallback((index: number) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const handleSave = useCallback(() => {
    if (selectedItems.size === 0) {
      Alert.alert('Uyarı', 'Lütfen en az bir besin seçiniz.');
      return;
    }
    saveFoodSelection(Array.from(selectedItems));
    Alert.alert('Başarılı', `${selectedItems.size} besin kaydedildi.`);
    setSelectedItems(new Set());
  }, [selectedItems, saveFoodSelection]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Besin Ekle" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => router.push('/besin-gecmisi' as any)}
          activeOpacity={0.7}
          testID="food-history-btn"
        >
          <History size={18} color="#1E40AF" />
          <Text style={styles.historyBtnText}>Geçmiş Besinlerim</Text>
        </TouchableOpacity>

        {FOOD_ITEMS.map((item, index) => {
          const isSelected = selectedItems.has(index);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.foodCard, isSelected && styles.foodCardSelected]}
              onPress={() => toggleItem(index)}
              activeOpacity={0.7}
              testID={`food-${index}`}
            >
              <Text style={[styles.foodText, isSelected && styles.foodTextSelected]}>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={handleSave} activeOpacity={0.8} testID="save-food-button">
          <Text style={styles.buttonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  historyBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#1E40AF',
  },
  foodCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  foodCardSelected: {
    backgroundColor: '#FEE2E2',
    borderColor: COLORS.primary,
  },
  foodText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
  },
  foodTextSelected: {
    color: COLORS.primary,
    fontWeight: '600' as const,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 28,
    backgroundColor: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
