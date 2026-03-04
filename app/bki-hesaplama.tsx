import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { COLORS } from '@/constants/colors';
import { BkiRecord } from '@/mocks/data';
import { useAppData } from '@/providers/AppDataProvider';

export default function BkiHesaplamaScreen() {
  const [kilo, setKilo] = useState<string>('');
  const [boy, setBoy] = useState<string>('');
  const [bkiDegeri, setBkiDegeri] = useState<string>('');
  const { bkiRecords, addBkiRecord, deleteBkiRecord } = useAppData();

  const hesapla = useCallback(() => {
    const kiloNum = parseFloat(kilo);
    const boyNum = parseFloat(boy);
    if (isNaN(kiloNum) || isNaN(boyNum) || boyNum === 0) {
      Alert.alert('Hata', 'Lütfen geçerli kilo ve boy değerleri giriniz.');
      return;
    }
    const boyM = boyNum / 100;
    const bki = kiloNum / (boyM * boyM);
    setBkiDegeri(bki.toFixed(2));

    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
    const newRecord: BkiRecord = {
      id: Date.now().toString(),
      value: parseFloat(bki.toFixed(2)),
      date: dateStr,
    };
    addBkiRecord(newRecord);
  }, [kilo, boy, addBkiRecord]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="BKİ Hesaplama" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TextInput
          style={styles.input}
          placeholder="Kilonuzu Giriniz"
          placeholderTextColor={COLORS.textSecondary}
          value={kilo}
          onChangeText={setKilo}
          keyboardType="numeric"
          testID="input-kilo"
        />
        <TextInput
          style={styles.input}
          placeholder="Boyunuzu Giriniz"
          placeholderTextColor={COLORS.textSecondary}
          value={boy}
          onChangeText={setBoy}
          keyboardType="numeric"
          testID="input-boy"
        />

        {bkiDegeri !== '' && (
          <Text style={styles.resultText}>Bkİ Değeri: {bkiDegeri}</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={hesapla} activeOpacity={0.8} testID="hesapla-button">
          <Text style={styles.buttonText}>Hesapla</Text>
        </TouchableOpacity>

        <View style={styles.recordsSection}>
          {bkiRecords.map((record) => (
            <View key={record.id} style={styles.recordRow}>
              <Text style={styles.recordText}>Bkİ Değeri: {record.value}</Text>
              <Text style={styles.recordDate}>{record.date}</Text>
              <TouchableOpacity onPress={() => deleteBkiRecord(record.id)} testID={`delete-${record.id}`}>
                <Trash2 size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  resultText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  recordsSection: {
    gap: 10,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  recordText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  recordDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginRight: 12,
  },
});
