import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { Trash2, Activity, Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { COLORS } from '@/constants/colors';
import { useAppData, BloodSugarEntry } from '@/providers/AppDataProvider';

const TIMING_OPTIONS: { key: BloodSugarEntry['timing']; label: string }[] = [
  { key: 'fasting', label: 'Açlık' },
  { key: 'postmeal', label: 'Tokluk' },
  { key: 'random', label: 'Rastgele' },
];

const MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

function getStatusInfo(value: number, timing: BloodSugarEntry['timing']): { label: string; color: string } {
  if (timing === 'fasting') {
    if (value < 100) return { label: 'Normal', color: '#22C55E' };
    if (value < 126) return { label: 'Prediyabet', color: '#F59E0B' };
    return { label: 'Yüksek', color: '#EF4444' };
  }
  if (timing === 'postmeal') {
    if (value < 140) return { label: 'Normal', color: '#22C55E' };
    if (value < 200) return { label: 'Prediyabet', color: '#F59E0B' };
    return { label: 'Yüksek', color: '#EF4444' };
  }
  if (value < 140) return { label: 'Normal', color: '#22C55E' };
  if (value < 200) return { label: 'Dikkat', color: '#F59E0B' };
  return { label: 'Yüksek', color: '#EF4444' };
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export default function KanSekeriScreen() {
  const { bloodSugarEntries, addBloodSugarEntry, deleteBloodSugarEntry } = useAppData();
  const [value, setValue] = useState<string>('');
  const [timing, setTiming] = useState<BloodSugarEntry['timing']>('fasting');

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

  const handleAdd = useCallback(() => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir kan şekeri değeri giriniz.');
      return;
    }
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const nowTime = new Date();
    const dateStr = `${selectedDateStr} ${String(nowTime.getHours()).padStart(2, '0')}:${String(nowTime.getMinutes()).padStart(2, '0')}`;
    const entry: BloodSugarEntry = {
      id: Date.now().toString(),
      date: dateStr,
      value: num,
      timing,
    };
    addBloodSugarEntry(entry);
    setValue('');

    const status = getStatusInfo(num, timing);
    Alert.alert('Kayıt Eklendi', `Kan Şekeri: ${num} mg/dL\nDurum: ${status.label}`);
  }, [value, timing, addBloodSugarEntry, selectedDateStr]);

  const averageValue = useMemo(() => {
    if (bloodSugarEntries.length === 0) return 0;
    const sum = bloodSugarEntries.reduce((acc, e) => acc + e.value, 0);
    return Math.round(sum / bloodSugarEntries.length);
  }, [bloodSugarEntries]);

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

  return (
    <View style={styles.container}>
      <ScreenHeader title="Kan Şekeri Takibi" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {bloodSugarEntries.length > 0 && (
          <View style={styles.avgCard}>
            <Activity size={24} color="#7C3AED" />
            <View style={styles.avgInfo}>
              <Text style={styles.avgLabel}>Ortalama Kan Şekeri</Text>
              <Text style={styles.avgValue}>{averageValue} mg/dL</Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.datePickerBtn} onPress={openDatePicker} activeOpacity={0.7} testID="date-picker-btn">
          <Calendar size={18} color={COLORS.primary} />
          <Text style={styles.datePickerText}>{selectedDateStr}</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Kan şekeri değeri (mg/dL)"
          placeholderTextColor={COLORS.textSecondary}
          value={value}
          onChangeText={setValue}
          keyboardType="numeric"
          testID="input-blood-sugar"
        />

        <View style={styles.timingRow}>
          {TIMING_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.timingBtn, timing === opt.key && styles.timingBtnActive]}
              onPress={() => setTiming(opt.key)}
              activeOpacity={0.7}
              testID={`timing-${opt.key}`}
            >
              <Text style={[styles.timingText, timing === opt.key && styles.timingTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.8} testID="add-blood-sugar">
          <Text style={styles.addBtnText}>Kaydet</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Geçmiş Kayıtlar</Text>

        {bloodSugarEntries.length === 0 ? (
          <Text style={styles.emptyText}>Henüz kan şekeri kaydı bulunmamaktadır.</Text>
        ) : (
          bloodSugarEntries.map((entry) => {
            const status = getStatusInfo(entry.value, entry.timing);
            const timingLabel = TIMING_OPTIONS.find(o => o.key === entry.timing)?.label ?? '';
            return (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryTop}>
                  <View>
                    <Text style={styles.entryValue}>{entry.value} mg/dL</Text>
                    <Text style={styles.entryDate}>{entry.date} · {timingLabel}</Text>
                  </View>
                  <View style={styles.entryRight}>
                    <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                      <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                    </View>
                    <TouchableOpacity onPress={() => deleteBloodSugarEntry(entry.id)} testID={`delete-bs-${entry.id}`}>
                      <Trash2 size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Referans Değerler</Text>
          <View style={styles.infoRow}>
            <View style={[styles.infoDot, { backgroundColor: '#22C55E' }]} />
            <Text style={styles.infoText}>Açlık: {'<'}100 mg/dL Normal</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={[styles.infoDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.infoText}>Açlık: 100-125 mg/dL Prediyabet</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={[styles.infoDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.infoText}>Açlık: ≥126 mg/dL Diyabet</Text>
          </View>
        </View>
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
  avgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  avgInfo: {
    flex: 1,
  },
  avgLabel: {
    fontSize: 13,
    color: '#6D28D9',
    fontWeight: '500' as const,
  },
  avgValue: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: '#4C1D95',
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
  timingRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  timingBtn: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timingBtnActive: {
    backgroundColor: '#FEE2E2',
    borderColor: COLORS.primary,
  },
  timingText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500' as const,
  },
  timingTextActive: {
    color: COLORS.primary,
    fontWeight: '700' as const,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
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
    marginBottom: 24,
  },
  entryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 8,
  },
  entryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.text,
  },
  entryDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  entryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  infoCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#92400E',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  infoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#78350F',
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
