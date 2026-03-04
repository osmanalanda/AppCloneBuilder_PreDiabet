export const FOOD_ITEMS = [
  'Çavdar unu ve kepekli ekmeğin yanı sıra buğday unu',
  'Balık Havyarı',
  'Et ve mantar et suyu, yanı sıra bunlara dayalı yemekler',
  'Yüksek yağlı içerikli süt ürünleri',
  'Siyah ve yeşil çay, bitkisel çaylar ve soğanlar, yabani gül suyu,',
  'Az yağlı balıklar (pollock, walleye, turna, hake vs.) - fırında kaynatın veya fırında pişirin',
  'Yağda konserve balık',
  'Füme, kurutulmuş ve tuzlu balık',
  'Sütlü tatlılar',
  'İç yağ',
  'Dondurma, reçeller, kremler, tatlılar',
  'Herhangi bir formda yağlı balık türleri',
];

export const FAQ_DATA = [
  {
    question: '1- Kan şekerinizi evde ölçebileceğinizi biliyor musunuz?',
    answer: 'Cevap- Kan şekerinizi glükometre ile ev ortamında ölçebilirsiniz. Yaklaşık 5 saniye içerisinde dijital alanda sonuç görünmektedir. Kan şekeri ölçerken ilk gelen kanı pamukla silmeli devamında gelen kanı ölçüm için kullanmalısınız.',
  },
  {
    question: '2- Prediyabet (gizli şeker) tehlikeli bir hastalık mıdır?',
    answer: 'Cevap- Kontrol altına alındıktan sonra prediyabet tehlikeli bir hastalık değildir. Hastalığı kontrol altında tutmanın bir diğer avantajı diyabete geçiş sürecinin önlenerek hastalık riskinin düşürülmesidir. Yaşam tarzı değişiklikleri prediyabet riskinin düşürülmesinde önemlidir. Dünya Sağlık Örgütü erişkinler için günde en az 30 dakika, haftanın en az beş günü olmak kaydıyla haftada minimum 150 dakika fiziksel aktivite yapılmasını önermektedir. Akdeniz diyetine bağlı bir beslenme sürdürülmesi yine düşük hastalık riski ile ilişkilendirilmiştir. Bu önerilere uyum sağlandığı taktirde prediyabet korkutulacak bir hastalık olmayacaktır.',
  },
  {
    question: '3- Prediyabeti (gizli şeker) nasıl kontrol altına alabilirim?',
    answer: 'Cevap- Hastalığın kontrol altında tutulması sağlıklı beslenme ve düzenli egzersiz ile mümkündür. Dünya Sağlık Örgütü önerilerine uygun yaşam tarzı değişiklikleri yapılmalıdır.',
  },
];

export const BILGILENDIRME_TOPICS = [
  'Prediyabe- TR mobil uygulaması nedir?',
  'Prediyabe- TR mobil uygulamasının hedefleri nelerdir?',
  'Prediyabe-TR mobil uygulamasının tasarımcıları kimlerdir?',
  'Sağlıklı Yaşam',
  'Prediyabeti Öğrenelim',
  'Prediyabetin Komplikasyonları',
  'Tanı ve Tedavi Yöntemleri',
];

export const BILGILENDIRME_ANSWERS: Record<string, string> = {
  'Prediyabe- TR mobil uygulaması nedir?': 'PREDIABE-TR mobil uygulamasının geliştirilmesi ve kullanılabilirliğinin değerlendirilmesidir. Bu mobil uygulama prediyabetli bireylere sağlıkla ilgili konularda bilgi sunmak ve bireylerde sağlıklı yaşam biçimi davranışları oluşmasının sağlanmasını içermektedir.',
  'Prediyabe- TR mobil uygulamasının hedefleri nelerdir?': 'Prediyabetli bireylerin sağlıklı yaşam biçimi davranışlarını geliştirmek ve prediyabet hakkında bilgi sunmaktır.',
  'Prediyabe-TR mobil uygulamasının tasarımcıları kimlerdir?': 'Bu uygulama Kastamonu Üniversitesi araştırmacıları tarafından geliştirilmiştir.',
  'Sağlıklı Yaşam': 'Sağlıklı yaşam, dengeli beslenme, düzenli fiziksel aktivite ve stres yönetimi ile mümkündür.',
  'Prediyabeti Öğrenelim': 'Prediyabet, kan şekeri seviyelerinin normalden yüksek ancak diyabet tanısı konulacak kadar yüksek olmadığı bir durumdur.',
  'Prediyabetin Komplikasyonları': 'Kontrol altına alınmadığında Tip 2 diyabete, kalp hastalıklarına ve diğer sağlık sorunlarına yol açabilir.',
  'Tanı ve Tedavi Yöntemleri': 'Açlık kan şekeri testi, oral glukoz tolerans testi ve HbA1c testi ile tanı konulabilir.',
};

export interface StepRecord {
  id: string;
  steps: number;
  date: string;
}

export const MOCK_STEPS: StepRecord[] = [
  { id: '1', steps: 0, date: '10/5/2025' },
  { id: '2', steps: 0, date: '10/8/2025' },
  { id: '3', steps: 0, date: '10/9/2025' },
  { id: '4', steps: 0, date: '10/10/2025' },
  { id: '5', steps: 0, date: '10/12/2025' },
  { id: '6', steps: 0, date: '10/17/2025' },
  { id: '7', steps: 0, date: '10/31/2025' },
  { id: '8', steps: 0, date: '11/1/2025' },
  { id: '9', steps: 0, date: '11/12/2025' },
];

export interface BkiRecord {
  id: string;
  value: number;
  date: string;
}

export const MOCK_BKI: BkiRecord[] = [
  { id: '1', value: 32.55, date: '12.11.2025' },
  { id: '2', value: 32.03, date: '31.10.2025' },
  { id: '3', value: 32.03, date: '31.10.2025' },
  { id: '4', value: 25.82, date: '08.10.2025' },
  { id: '5', value: 25.82, date: '08.10.2025' },
];

export const FINDRISK_SECTIONS = [
  {
    title: 'Yaşınız',
    options: [
      { label: '<45 yaş', score: 0 },
      { label: '45-54 yaş', score: 2 },
      { label: '55-64 yaş', score: 3 },
      { label: '>64 yaş', score: 4 },
    ],
  },
  {
    title: 'BKİ (Bilmiyorsanız Hesaplayın )',
    options: [
      { label: '<25 kg/m²', score: 0 },
      { label: '25-30 kg/m²', score: 1 },
      { label: '>30 kg/m²', score: 3 },
    ],
  },
  {
    title: 'Bel Çevresi (Gebelik öncesi bel çevresi tahmini olarak sorulacaktır)',
    options: [
      { label: '<80 cm', score: 0 },
      { label: '80-88 cm', score: 3 },
      { label: '>88 cm', score: 4 },
    ],
  },
  {
    title: 'Günde en az 30 dakika fiziksel aktivite yapıyor musunuz?',
    options: [
      { label: 'Evet', score: 0 },
      { label: 'Hayır', score: 2 },
    ],
  },
  {
    title: 'Ne sıklıkla sebze ve meyve yiyorsunuz?',
    options: [
      { label: 'Her gün', score: 0 },
      { label: 'Her gün değil', score: 1 },
    ],
  },
  {
    title: 'Hiç kan basıncı ilacı kullandınız mı?',
    options: [
      { label: 'Hayır', score: 0 },
      { label: 'Evet', score: 2 },
    ],
  },
  {
    title: 'Daha önce yüksek kan şekeri tespit edildi mi?',
    options: [
      { label: 'Hayır', score: 0 },
      { label: 'Evet', score: 5 },
    ],
  },
  {
    title: 'Aile bireylerinden diyabet tanısı alan var mı?',
    options: [
      { label: 'Hayır', score: 0 },
      { label: '1. derece akraba', score: 5 },
      { label: '2. derece akraba', score: 3 },
    ],
  },
];

export const CONTACT_INFO = {
  phone: '0545 664 76 62',
  email: 'ibrahim.topuz@ksbu.edu.tr',
  website: 'www.prediabet-tr.com',
};
