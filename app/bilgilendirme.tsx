import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { COLORS } from '@/constants/colors';
import { BILGILENDIRME_TOPICS, BILGILENDIRME_ANSWERS } from '@/mocks/data';

export default function BilgilendirmeScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Bilgilendirme" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {BILGILENDIRME_TOPICS.map((topic, index) => (
          <View key={index}>
            <TouchableOpacity
              style={styles.topicCard}
              onPress={() => toggleExpand(index)}
              activeOpacity={0.7}
              testID={`topic-${index}`}
            >
              <Text style={styles.topicText}>{topic}</Text>
            </TouchableOpacity>
            {expandedIndex === index && BILGILENDIRME_ANSWERS[topic] && (
              <View style={styles.answerBox}>
                <Text style={styles.answerText}>{BILGILENDIRME_ANSWERS[topic]}</Text>
              </View>
            )}
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
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  topicCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topicText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500' as const,
  },
  answerBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    marginTop: -4,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  answerText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
});
