import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Platform } from 'react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { COLORS } from '@/constants/colors';
import { CONTACT_INFO } from '@/mocks/data';

const CONTACT_ITEMS = [
  { label: `Telefon: ${CONTACT_INFO.phone}`, action: () => Linking.openURL(`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`) },
  { label: `E-Posta : ${CONTACT_INFO.email}`, action: () => Linking.openURL(`mailto:${CONTACT_INFO.email}`) },
  { label: `Website : ${CONTACT_INFO.website}`, action: () => Linking.openURL(`https://${CONTACT_INFO.website}`) },
  { label: 'Whatsapp ile yaz', action: () => {
    const url = Platform.OS === 'web'
      ? `https://wa.me/905456647662`
      : `whatsapp://send?phone=905456647662`;
    Linking.openURL(url).catch(() => {});
  }},
  { label: 'Uzmana sor', action: () => {} },
];

export default function IletisimScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="İletişim" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {CONTACT_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={item.action}
            activeOpacity={0.7}
            testID={`contact-${index}`}
          >
            <Text style={styles.cardText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
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
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500' as const,
  },
});
