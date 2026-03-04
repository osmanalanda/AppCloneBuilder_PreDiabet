import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import ScreenHeader from '@/components/ScreenHeader';
import { COLORS } from '@/constants/colors';

export default function HakkimizdaScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Hakkımızda" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.paragraph}>
          PREDIABE-TR mobil uygulamasının geliştirilmesi ve kullanılabilirliğinin değerlendirilmesidir. Bu mobil uygulama prediyabetli bireylere sağlıkla ilgili konularda bilgi sunmak ve bireylerde sağlıklı yaşam biçimi davranışları oluşmasının sağlanmasını içermektedir.
        </Text>

        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop' }}
          style={styles.image}
          contentFit="cover"
        />

        <Text style={styles.paragraph}>
          Bu uygulama, Kastamonu Üniversitesi Sağlık Bilimleri Fakültesi tarafından prediyabetli bireylerin sağlıklı yaşam biçimi davranışlarını desteklemek amacıyla geliştirilmiştir.
        </Text>

        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop' }}
          style={styles.image}
          contentFit="cover"
        />
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
  paragraph: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
});
