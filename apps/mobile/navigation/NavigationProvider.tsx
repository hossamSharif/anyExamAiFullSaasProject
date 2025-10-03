import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { I18nManager } from 'react-native';

const prefix = Linking.createURL('/');

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const linking = {
    prefixes: [prefix, 'anyexamai://'],
    config: {
      screens: {
        // Auth screens
        login: 'login',
        signup: 'signup',
        'forgot-password': 'forgot-password',
        // Main app with tabs
        index: {
          path: '',
          screens: {
            Home: '',
            Browse: 'browse',
            History: 'history',
            Profile: 'profile',
          },
        },
      },
    },
  };

  useEffect(() => {
    // Ensure RTL is properly set
    if (!I18nManager.isRTL) {
      I18nManager.forceRTL(true);
      // This will require a restart on native platforms
    }
  }, []);

  return (
    <NavigationContainer linking={linking}>
      {children}
    </NavigationContainer>
  );
}
