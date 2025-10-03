import React from 'react'
import { TamaguiProvider as TamaguiProviderOg, type TamaguiProviderProps } from '@tamagui/core'
import config from './tamagui.config'

export type { TamaguiProviderProps }

export const TamaguiProvider = ({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) => {
  // Determine color scheme - works on both web and native
  const [colorScheme, setColorScheme] = React.useState<'light' | 'dark'>('light')

  React.useEffect(() => {
    // Check for system color scheme preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setColorScheme(mediaQuery.matches ? 'dark' : 'light')

      const handler = (e: MediaQueryListEvent) => {
        setColorScheme(e.matches ? 'dark' : 'light')
      }
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [])

  return (
    <TamaguiProviderOg
      config={config}
      defaultTheme={colorScheme}
      {...rest}
    >
      {children}
    </TamaguiProviderOg>
  )
}
