import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { Trash2, Plus, Calendar } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { COLORS } from '@/constants/colors';
import { StepRecord } from '@/mocks/data';
import { useAppData } from '@/providers/AppDataProvider';

const MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export default function AdimsayarScreen() {
  const { stepRecords, addStepRecord, deleteStepRecord } = useAppData();
  const [newSteps, setNewSteps] = useState<string>('');

  const now = new Date();
  const [selectedDay, setSelectedDay] = useState<number>(now.getDate());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const [pickerMonth, setPickerMonth] = useState<number>(now.getMonth());
  const [pickerYear, setPickerYear] = useState<number>(now.getFullYear());

  const selectedDateStr = useMemo(() => {
    return `${String(selectedDay).padStart(2, '0')}.${String(selectedMonth + 1).padStart(2, '0')}.${selectedYear}`;
  }, [selectedDay, selectedMonth, selectedYear]);

  const daysInPickerMonth = useMemo(() => getDaysInMonth(pickerYear, pickerMonth), [pickerYear, pickerMonth]);

  const totalSteps = useMemo(() => {
    return stepRecords.reduce((sum, r) => sum + r.steps, 0);
  }, [stepRecords]);

  const openDatePicker = useCallback(() => {
    setPickerMonth(selectedMonth);
    setPickerYear(selectedYear);
    setShowDatePicker(true);
  }, [selectedMonth, selectedYear]);

  const handleDaySelect = useCallback((day: number) => {
    setSelectedDay(day);
    setSelectedMonth(pickerMonth);
    setSelectedYear(pickerYear);
    setShowDatePicker(false);
  }, [pickerMonth, pickerYear]);

  const prevMonth = useCallback(() => {
    if (pickerMonth === 0) {
      setPickerMonth(11);
      setPickerYear(y => y - 1);
    } else {
      setPickerMonth(m => m - 1);
    }
  }, [pickerMonth]);

  const nextMonth = useCallback(() => {
    if (pickerMonth === 11) {
      setPickerMonth(0);
      setPickerYear(y => y + 1);
    } else {
      setPickerMonth(m => m + 1);
    }
  }, [pickerMonth]);

  const handleAddSteps = useCallback(() => {
    const stepsNum = parseInt(newSteps, 10);
    if (isNaN(stepsNum) || stepsNum <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir adım sayısı giriniz.');
      return;
    }
    const record: StepRecord = {
      id: Date.now().toString(),
      steps: stepsNum,
      date: selectedDateStr,
    };
    addStepRecord(record);
    setNewSteps('');
  }, [newSteps, addStepRecord, selectedDateStr]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Adımsayar" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.totalLabel}>ADIM SAYISI: <Text style={styles.totalValue}>{totalSteps.toLocaleString()}</Text></Text>

        <TouchableOpacity style={styles.datePickerBtn} onPress={openDatePicker} activeOpacity={0.7} testID="date-picker-btn">
          <Calendar size={18} color={COLORS.primary} />
          <Text style={styles.datePickerText}>{selectedDateStr}</Text>
        </TouchableOpacity>

        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            placeholder="Adım sayısı giriniz"
            placeholderTextColor={COLORS.textSecondary}
            value={newSteps}
            onChangeText={setNewSteps}
            keyboardType="numeric"
            testID="input-steps"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddSteps} activeOpacity={0.8} testID="add-steps-button">
            <Plus size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Geçmiş Adımlarım</Text>

        {stepRecords.length === 0 ? (
          <Text style={styles.emptyText}>Henüz adım kaydı bulunmamaktadır.</Text>
        ) : (
          stepRecords.map((record) => (
            <View key={record.id} style={styles.recordRow}>
              <Text style={styles.recordSteps}>Adım Sayısı: {record.steps}</Text>
              <Text style={styles.recordDate}>Tarih: {record.date}</Text>
              <TouchableOpacity onPress={() => deleteStepRecord(record.id)} testID={`delete-step-${record.id}`}>
                <Trash2 size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showDatePicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDatePicker(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={prevMonth} style={styles.calNavBtn}>
                <Text style={styles.calNavText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.calMonthText}>{MONTHS[pickerMonth]} {pickerYear}</Text>
              <TouchableOpacity onPress={nextMonth} style={styles.calNavBtn}>
                <Text style={styles.calNavText}>›</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.calGrid}>
              {Array.from({ length: daysInPickerMonth }, (_, i) => i + 1).map((day) => {
                const isSelected = day === selectedDay && pickerMonth === selectedMonth && pickerYear === selectedYear;
                return (
                  <TouchableOpacity
                    key={day}
                    style={[styles.calDay, isSelected && styles.calDaySelected]}
                    onPress={() => handleDaySelect(day)}
                  >
                    <Text style={[styles.calDayText, isSelected && styles.calDayTextSelected]}>{day}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  totalLabel: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: COLORS.text,
    marginBottom: 16,
  },
  totalValue: {
    color: COLORS.text,
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  datePickerText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600' as const,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  recordSteps: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500' as const,
    flex: 1,
  },
  recordDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    width: '85%',
    maxWidth: 360,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calNavText: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: '600' as const,
  },
  calMonthText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.text,
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  calDaySelected: {
    backgroundColor: COLORS.primary,
  },
  calDayText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500' as const,
  },
  calDayTextSelected: {
    color: COLORS.white,
    fontWeight: '700' as const,
  },
});
