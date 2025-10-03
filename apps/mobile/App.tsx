import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, I18nManager, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Enable RTL layout
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'Cairo-Regular': require('./assets/fonts/Cairo-Regular.ttf'),
          'Cairo-Bold': require('./assets/fonts/Cairo-Bold.ttf'),
          'Tajawal-Regular': require('./assets/fonts/Tajawal-Regular.ttf'),
          'Tajawal-Bold': require('./assets/fonts/Tajawal-Bold.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleArabic}>مرحباً بك في anyExamAi</Text>
      <Text style={styles.subtitleArabic}>منصة الامتحانات الذكية</Text>
      <Text style={styles.bodyArabic}>
        اختبر معرفتك باللغة العربية مع دعم كامل للكتابة من اليمين إلى اليسار
      </Text>
      <Text style={styles.englishText}>RTL Support Enabled ✓</Text>
      <StatusBar style="auto" />
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
  },
});
