import { StyleSheet, Text, View, Platform } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titleArabic}>مرحباً بك في anyExamAi</Text>
      <Text style={styles.subtitleArabic}>منصة الامتحانات الذكية</Text>
      <Text style={styles.bodyArabic}>
        اختبر معرفتك باللغة العربية مع دعم كامل للكتابة من اليمين إلى اليسار
      </Text>
      <Text style={styles.englishText}>RTL Support Enabled ✓</Text>
      <Text style={styles.englishText}>Solito Navigation Connected ✓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    direction: 'rtl',
  },
  titleArabic: {
    fontFamily: 'Cairo-Bold',
    fontSize: 28,
    marginBottom: 10,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  subtitleArabic: {
    fontFamily: 'Cairo-Regular',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  bodyArabic: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 24,
  },
  englishText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 5,
  },
});
