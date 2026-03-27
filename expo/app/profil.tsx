import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { CircleCheck } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import { COLORS } from '@/constants/colors';
import { useAppData } from '@/providers/AppDataProvider';

export default function ProfilScreen() {
  const { profile, updateProfile } = useAppData();
  const [adSoyad, setAdSoyad] = useState<string>(profile.adSoyad);
  const [telefon, setTelefon] = useState<string>(profile.telefon);
  const [sifre, setSifre] = useState<string>(profile.sifre);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    setAdSoyad(profile.adSoyad);
    setTelefon(profile.telefon);
    setSifre(profile.sifre);
  }, [profile]);

  const handleUpdate = useCallback(() => {
    updateProfile({ adSoyad, telefon, sifre });
    setShowSuccess(true);
    fadeAnim.setValue(0);
    slideAnim.setValue(-20);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setShowSuccess(false);
      });
    }, 2500);
  }, [adSoyad, telefon, sifre, updateProfile]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="" showBack={true} />

      {showSuccess && (
        <Animated.View style={[styles.successBanner, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <CircleCheck size={20} color="#166534" />
          <Text style={styles.successText}>Profil Başarıyla Güncellendi</Text>
        </Animated.View>
      )}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🏥</Text>
          </View>
          <Text style={styles.logoText}>PREDIABET</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Adı Soyadı"
            placeholderTextColor={COLORS.textSecondary}
            value={adSoyad}
            onChangeText={setAdSoyad}
            testID="input-name"
          />
          <TextInput
            style={styles.input}
            placeholder="Telefon"
            placeholderTextColor={COLORS.textSecondary}
            value={telefon}
            onChangeText={setTelefon}
            keyboardType="phone-pad"
            testID="input-phone"
          />
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            placeholderTextColor={COLORS.textSecondary}
            value={sifre}
            onChangeText={setSifre}
            secureTextEntry
            testID="input-password"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate} activeOpacity={0.8} testID="update-profile-button">
          <Text style={styles.buttonText}>Profili Güncelle</Text>
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
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginHorizontal: 20,
    marginTop: -4,
    marginBottom: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: '#86EFAC',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  successText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#166534',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 8,
  },
  logoIcon: {
    fontSize: 32,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  form: {
    gap: 16,
    marginBottom: 32,
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
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
