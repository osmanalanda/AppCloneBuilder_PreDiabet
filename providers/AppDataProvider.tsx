import { useCallback, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { BkiRecord, StepRecord } from '@/mocks/data';

export interface TestResult {
  id: string;
  date: string;
  score: number;
  risk: string;
  selections: Record<number, number>;
}

export interface WaterEntry {
  id: string;
  date: string;
  glasses: number;
}

export interface BloodSugarEntry {
  id: string;
  date: string;
  value: number;
  timing: 'fasting' | 'postmeal' | 'random';
}

export interface ProfileData {
  adSoyad: string;
  telefon: string;
  sifre: string;
}

export interface SavedFoods {
  date: string;
  items: number[];
}

const KEYS = {
  BKI: 'app_bki_records',
  STEPS: 'app_step_records',
  TESTS: 'app_test_results',
  PROFILE: 'app_profile',
  FOODS: 'app_saved_foods',
  WATER: 'app_water_entries',
  BLOOD_SUGAR: 'app_blood_sugar',
  AUTH: 'app_auth_state',
};

async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch (e) {
    console.log(`[AppData] Error loading ${key}:`, e);
  }
  return fallback;
}

async function saveJSON<T>(key: string, data: T): Promise<T> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log(`[AppData] Saved ${key}`);
  } catch (e) {
    console.log(`[AppData] Error saving ${key}:`, e);
  }
  return data;
}

export const [AppDataProvider, useAppData] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    AsyncStorage.getItem(KEYS.AUTH).then((val) => {
      if (val === 'true') setIsLoggedIn(true);
      setAuthLoading(false);
    }).catch(() => setAuthLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    if (username === 'admin' && password === 'admin') {
      await AsyncStorage.setItem(KEYS.AUTH, 'true');
      setIsLoggedIn(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.setItem(KEYS.AUTH, 'false');
    setIsLoggedIn(false);
  }, []);

  const bkiQuery = useQuery<BkiRecord[]>({
    queryKey: ['bki'],
    queryFn: () => loadJSON<BkiRecord[]>(KEYS.BKI, []),
  });

  const stepsQuery = useQuery<StepRecord[]>({
    queryKey: ['steps'],
    queryFn: () => loadJSON<StepRecord[]>(KEYS.STEPS, []),
  });

  const testsQuery = useQuery<TestResult[]>({
    queryKey: ['tests'],
    queryFn: () => loadJSON<TestResult[]>(KEYS.TESTS, []),
  });

  const profileQuery = useQuery<ProfileData>({
    queryKey: ['profile'],
    queryFn: () => loadJSON<ProfileData>(KEYS.PROFILE, { adSoyad: '', telefon: '', sifre: '' }),
  });

  const foodsQuery = useQuery<SavedFoods[]>({
    queryKey: ['foods'],
    queryFn: () => loadJSON<SavedFoods[]>(KEYS.FOODS, []),
  });

  const waterQuery = useQuery<WaterEntry[]>({
    queryKey: ['water'],
    queryFn: () => loadJSON<WaterEntry[]>(KEYS.WATER, []),
  });

  const bloodSugarQuery = useQuery<BloodSugarEntry[]>({
    queryKey: ['bloodSugar'],
    queryFn: () => loadJSON<BloodSugarEntry[]>(KEYS.BLOOD_SUGAR, []),
  });

  const bkiMutation = useMutation({
    mutationFn: (records: BkiRecord[]) => saveJSON(KEYS.BKI, records),
    onSuccess: (data) => queryClient.setQueryData(['bki'], data),
  });

  const stepsMutation = useMutation({
    mutationFn: (records: StepRecord[]) => saveJSON(KEYS.STEPS, records),
    onSuccess: (data) => queryClient.setQueryData(['steps'], data),
  });

  const testsMutation = useMutation({
    mutationFn: (results: TestResult[]) => saveJSON(KEYS.TESTS, results),
    onSuccess: (data) => queryClient.setQueryData(['tests'], data),
  });

  const profileMutation = useMutation({
    mutationFn: (profile: ProfileData) => saveJSON(KEYS.PROFILE, profile),
    onSuccess: (data) => queryClient.setQueryData(['profile'], data),
  });

  const foodsMutation = useMutation({
    mutationFn: (foods: SavedFoods[]) => saveJSON(KEYS.FOODS, foods),
    onSuccess: (data) => queryClient.setQueryData(['foods'], data),
  });

  const waterMutation = useMutation({
    mutationFn: (entries: WaterEntry[]) => saveJSON(KEYS.WATER, entries),
    onSuccess: (data) => queryClient.setQueryData(['water'], data),
  });

  const bloodSugarMutation = useMutation({
    mutationFn: (entries: BloodSugarEntry[]) => saveJSON(KEYS.BLOOD_SUGAR, entries),
    onSuccess: (data) => queryClient.setQueryData(['bloodSugar'], data),
  });

  const addBkiRecord = useCallback((record: BkiRecord) => {
    const current = bkiQuery.data ?? [];
    bkiMutation.mutate([record, ...current]);
  }, [bkiQuery.data]);

  const deleteBkiRecord = useCallback((id: string) => {
    const current = bkiQuery.data ?? [];
    bkiMutation.mutate(current.filter(r => r.id !== id));
  }, [bkiQuery.data]);

  const addStepRecord = useCallback((record: StepRecord) => {
    const current = stepsQuery.data ?? [];
    stepsMutation.mutate([record, ...current]);
  }, [stepsQuery.data]);

  const deleteStepRecord = useCallback((id: string) => {
    const current = stepsQuery.data ?? [];
    stepsMutation.mutate(current.filter(r => r.id !== id));
  }, [stepsQuery.data]);

  const addTestResult = useCallback((result: TestResult) => {
    const current = testsQuery.data ?? [];
    testsMutation.mutate([result, ...current]);
  }, [testsQuery.data]);

  const deleteTestResult = useCallback((id: string) => {
    const current = testsQuery.data ?? [];
    testsMutation.mutate(current.filter(r => r.id !== id));
  }, [testsQuery.data]);

  const updateProfile = useCallback((profile: ProfileData) => {
    profileMutation.mutate(profile);
  }, []);

  const saveFoodSelection = useCallback((items: number[]) => {
    const current = foodsQuery.data ?? [];
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
    foodsMutation.mutate([{ date: dateStr, items }, ...current]);
  }, [foodsQuery.data]);

  const addWaterEntry = useCallback((glasses: number) => {
    const current = waterQuery.data ?? [];
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
    const existing = current.find(e => e.date === dateStr);
    if (existing) {
      waterMutation.mutate(current.map(e => e.date === dateStr ? { ...e, glasses: e.glasses + glasses } : e));
    } else {
      waterMutation.mutate([{ id: Date.now().toString(), date: dateStr, glasses }, ...current]);
    }
  }, [waterQuery.data]);

  const addBloodSugarEntry = useCallback((entry: BloodSugarEntry) => {
    const current = bloodSugarQuery.data ?? [];
    bloodSugarMutation.mutate([entry, ...current]);
  }, [bloodSugarQuery.data]);

  const deleteBloodSugarEntry = useCallback((id: string) => {
    const current = bloodSugarQuery.data ?? [];
    bloodSugarMutation.mutate(current.filter(e => e.id !== id));
  }, [bloodSugarQuery.data]);

  return {
    bkiRecords: bkiQuery.data ?? [],
    stepRecords: stepsQuery.data ?? [],
    testResults: testsQuery.data ?? [],
    profile: profileQuery.data ?? { adSoyad: '', telefon: '', sifre: '' },
    savedFoods: foodsQuery.data ?? [],
    waterEntries: waterQuery.data ?? [],
    bloodSugarEntries: bloodSugarQuery.data ?? [],
    isLoading: bkiQuery.isLoading || stepsQuery.isLoading || testsQuery.isLoading || profileQuery.isLoading,
    isLoggedIn,
    authLoading,
    login,
    logout,
    addBkiRecord,
    deleteBkiRecord,
    addStepRecord,
    deleteStepRecord,
    addTestResult,
    deleteTestResult,
    updateProfile,
    saveFoodSelection,
    addWaterEntry,
    addBloodSugarEntry,
    deleteBloodSugarEntry,
  };
});
