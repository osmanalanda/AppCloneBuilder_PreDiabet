import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { COLORS } from '@/constants/colors';
import { FAQ_DATA } from '@/mocks/data';

export default function SSSScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="S.S.S." />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {FAQ_DATA.map((faq, index) => (
          <View key={index} style={styles.faqBlock}>
            <Text style={styles.question}>{faq.question}</Text>
            <Text style={styles.answer}>{faq.answer}</Text>
          </View>
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
  faqBlock: {
    marginBottom: 20,
  },
  question: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: COLORS.text,
    marginBottom: 8,
  },
  answer: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 21,
  },
});
