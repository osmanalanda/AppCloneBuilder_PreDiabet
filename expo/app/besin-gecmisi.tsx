import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { UtensilsCrossed } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { COLORS } from '@/constants/colors';
import { FOOD_ITEMS } from '@/mocks/data';
import { useAppData } from '@/providers/AppDataProvider';

export default function BesinGecmisiScreen() {
  const { savedFoods } = useAppData();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Geçmiş Besinlerim" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {savedFoods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <UtensilsCrossed size={40} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>Henüz besin kaydı bulunmamaktadır.</Text>
          </View>
        ) : (
          savedFoods.map((entry, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>{entry.date}</Text>
                </View>
                <Text style={styles.countText}>{entry.items.length} besin</Text>
              </View>
              <View style={styles.foodList}>
                {entry.items.map((foodIndex, fIdx) => (
                  <View key={fIdx} style={styles.foodRow}>
                    <View style={styles.bullet} />
                    <Text style={styles.foodText}>{FOOD_ITEMS[foodIndex] ?? `Besin #${foodIndex}`}</Text>
                  </View>
                ))}
              </View>
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
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateBadge: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: COLORS.primary,
  },
  countText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500' as const,
  },
  foodList: {
    gap: 6,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
  foodText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
    flex: 1,
  },
});
