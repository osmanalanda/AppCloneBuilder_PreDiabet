import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { COLORS } from '@/constants/colors';
import { useAppData } from '@/providers/AppDataProvider';

function getRiskColor(risk: string): string {
  if (risk.includes('Düşük')) return '#22C55E';
  if (risk.includes('Orta')) return '#F59E0B';
  if (risk.includes('Çok yüksek')) return '#7C2D12';
  if (risk.includes('Yüksek')) return '#EF4444';
  return COLORS.textSecondary;
}

export default function SonTestlerScreen() {
  const { testResults, deleteTestResult } = useAppData();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Son Testler" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {testResults.length === 0 ? (
          <Text style={styles.emptyText}>Henüz test sonucu bulunmamaktadır.</Text>
        ) : (
          testResults.map((result) => (
            <View key={result.id} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultDate}>Tarih: {result.date}</Text>
                <View style={styles.rightSection}>
                  <Text style={styles.resultScore}>Puan: {result.score}</Text>
                  <TouchableOpacity onPress={() => deleteTestResult(result.id)} testID={`delete-test-${result.id}`}>
                    <Trash2 size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={[styles.resultRisk, { color: getRiskColor(result.risk) }]}>{result.risk}</Text>
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
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
  resultCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 16,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultDate: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500' as const,
  },
  resultScore: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: COLORS.primary,
  },
  resultRisk: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
