import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { COLORS } from '@/constants/colors';
import { FINDRISK_SECTIONS } from '@/mocks/data';
import { useAppData, TestResult } from '@/providers/AppDataProvider';

export default function OnTestlerScreen() {
  const [selections, setSelections] = useState<Record<number, number>>({});
  const { addTestResult } = useAppData();

  const selectOption = useCallback((sectionIndex: number, score: number) => {
    setSelections(prev => ({ ...prev, [sectionIndex]: score }));
  }, []);

  const handleSave = useCallback(() => {
    if (Object.keys(selections).length < FINDRISK_SECTIONS.length) {
      Alert.alert('Uyarı', 'Lütfen tüm soruları cevaplayınız.');
      return;
    }

    const totalScore = Object.values(selections).reduce((sum, s) => sum + s, 0);
    let risk = '';
    if (totalScore < 7) risk = 'Düşük risk';
    else if (totalScore < 12) risk = 'Orta risk';
    else if (totalScore < 15) risk = 'Yüksek risk';
    else risk = 'Çok yüksek risk';

    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;

    const result: TestResult = {
      id: Date.now().toString(),
      date: dateStr,
      score: totalScore,
      risk,
      selections: { ...selections },
    };

    addTestResult(result);
    Alert.alert('Sonuç', `Toplam Puan: ${totalScore}\nRisk Durumu: ${risk}`);
    setSelections({});
  }, [selections, addTestResult]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="FİNLANDİYA TİP-2 DİYABET RİSK ANKETİ (FINDRISK)" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {FINDRISK_SECTIONS.map((section, sIndex) => (
          <View key={sIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.options.map((option, oIndex) => {
              const isSelected = selections[sIndex] === option.score;
              return (
                <TouchableOpacity
                  key={oIndex}
                  style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                  onPress={() => selectOption(sIndex, option.score)}
                  activeOpacity={0.7}
                  testID={`option-${sIndex}-${oIndex}`}
                >
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>{option.label}</Text>
                  <Text style={[styles.optionScore, isSelected && styles.optionScoreSelected]}>{option.score}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleSave} activeOpacity={0.8} testID="save-test-button">
          <Text style={styles.buttonText}>Kaydet</Text>
        </TouchableOpacity>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: COLORS.text,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionRowSelected: {
    backgroundColor: '#FEE2E2',
    borderColor: COLORS.primary,
  },
  optionLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  optionLabelSelected: {
    fontWeight: '600' as const,
    color: COLORS.primary,
  },
  optionScore: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.textSecondary,
  },
  optionScoreSelected: {
    color: COLORS.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
