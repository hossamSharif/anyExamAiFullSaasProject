import { StatusBar } from 'expo-status-bar';
import { I18nManager } from 'react-native';
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationProvider } from './navigation/NavigationProvider';
import HomeScreen from './screens/HomeScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Enable RTL layout
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const Stack = createNativeStackNavigator();

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
    <NavigationProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // RTL gesture configuration
          gestureDirection: 'horizontal-inverted',
          animation: 'slide_from_left', // Reversed for RTL
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationProvider>
  );
}
