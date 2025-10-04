'use client';

import { YStack, XStack, Heading, ButtonComponent as Button, TextComponent as Text, LanguageSwitcherConnected } from '@anyexamai/ui';
import { useTranslation } from '@anyexamai/i18n';
import { useAuth, signOut } from '@anyexamai/api';
import { UsageWidget } from '@anyexamai/app';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const handleUpgrade = () => {
    router.push('/checkout?source=web');
  };

  return (
    <YStack
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      backgroundColor="$background"
      paddingVertical="$4"
    >
      <XStack
        maxWidth={1200}
        width="100%"
        marginHorizontal="auto"
        paddingHorizontal="$6"
        alignItems="center"
        justifyContent="space-between"
        // RTL: Logo on right, menu on left
        flexDirection="row"
      >
        {/* Logo - appears on the right in RTL */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Heading
            fontFamily="$heading"
            fontSize="$7"
            fontWeight="700"
            color="$primary"
            cursor="pointer"
          >
            {t('app_name')}
          </Heading>
        </Link>

        {/* Navigation - appears on the left in RTL */}
        <XStack gap="$4" alignItems="center">
          {/* Language Switcher - always visible */}
          <LanguageSwitcherConnected variant="dropdown" />

          {isAuthenticated ? (
            <>
              {/* Desktop Navigation */}
              <XStack gap="$4" display={['none', 'none', 'flex']} alignItems="center">
                {/* Usage Widget */}
                <UsageWidget
                  mode="compact"
                  showUpgradeButton={true}
                  onUpgradePress={handleUpgrade}
                />

                <Link href="/" style={{ textDecoration: 'none' }}>
                  <Text
                    fontSize="$4"
                    fontWeight="500"
                    color="$color"
                    cursor="pointer"
                    hoverStyle={{ color: '$primary' }}
                  >
                    {t('navigation.home')}
                  </Text>
                </Link>
                <Link href="/browse" style={{ textDecoration: 'none' }}>
                  <Text
                    fontSize="$4"
                    fontWeight="500"
                    color="$color"
                    cursor="pointer"
                    hoverStyle={{ color: '$primary' }}
                  >
                    {t('navigation.browse')}
                  </Text>
                </Link>
                <Link href="/history" style={{ textDecoration: 'none' }}>
                  <Text
                    fontSize="$4"
                    fontWeight="500"
                    color="$color"
                    cursor="pointer"
                    hoverStyle={{ color: '$primary' }}
                  >
                    {t('navigation.history')}
                  </Text>
                </Link>

                {/* User Menu Dropdown */}
                <div style={{ position: 'relative' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => setMenuOpen(!menuOpen)}
                  >
                    <Text fontSize="$4" fontWeight="500">
                      {user?.email?.split('@')[0] || 'المستخدم'}
                    </Text>
                  </Button>

                  {menuOpen && (
                    <YStack
                      position="absolute"
                      top="100%"
                      left={0}
                      marginTop="$2"
                      backgroundColor="$background"
                      borderWidth={1}
                      borderColor="$borderColor"
                      borderRadius="$4"
                      padding="$2"
                      minWidth={150}
                      gap="$2"
                      zIndex={1000}
                      shadowColor="$shadowColor"
                      shadowOffset={{ width: 0, height: 2 }}
                      shadowOpacity={0.1}
                      shadowRadius={8}
                    >
                      <Link href="/profile" style={{ textDecoration: 'none' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          fullWidth
                          justifyContent="flex-start"
                          onPress={() => setMenuOpen(false)}
                        >
                          <Text fontSize="$3">{t('navigation.profile')}</Text>
                        </Button>
                      </Link>
                      <Link href="/subscription" style={{ textDecoration: 'none' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          fullWidth
                          justifyContent="flex-start"
                          onPress={() => setMenuOpen(false)}
                        >
                          <Text fontSize="$3">
                            {t('i18n.language') === 'ar' ? 'الاشتراك' : 'Subscription'}
                          </Text>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        justifyContent="flex-start"
                        onPress={handleLogout}
                      >
                        <Text fontSize="$3" color="$red10">
                          {t('auth.logout')}
                        </Text>
                      </Button>
                    </YStack>
                  )}
                </div>
              </XStack>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                display={['flex', 'flex', 'none']}
                onPress={() => setMenuOpen(!menuOpen)}
              >
                <Text fontSize="$6">☰</Text>
              </Button>
            </>
          ) : (
            <XStack gap="$3">
              <Link href="/login">
                <Button variant="ghost" size="md">
                  {t('auth.login')}
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="md">
                  {t('auth.signup')}
                </Button>
              </Link>
            </XStack>
          )}
        </XStack>
      </XStack>

      {/* Mobile Menu - shown when menuOpen is true */}
      {isAuthenticated && menuOpen && (
        <YStack
          display={['flex', 'flex', 'none']}
          padding="$4"
          gap="$3"
          borderTopWidth={1}
          borderTopColor="$borderColor"
          marginTop="$4"
        >
          {/* Usage Widget in Mobile Menu */}
          <UsageWidget
            mode="compact"
            showUpgradeButton={true}
            onUpgradePress={handleUpgrade}
          />

          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              justifyContent="flex-start"
              onPress={() => setMenuOpen(false)}
            >
              {t('navigation.home')}
            </Button>
          </Link>
          <Link href="/browse" style={{ textDecoration: 'none' }}>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              justifyContent="flex-start"
              onPress={() => setMenuOpen(false)}
            >
              {t('navigation.browse')}
            </Button>
          </Link>
          <Link href="/history" style={{ textDecoration: 'none' }}>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              justifyContent="flex-start"
              onPress={() => setMenuOpen(false)}
            >
              {t('navigation.history')}
            </Button>
          </Link>
          <Link href="/profile" style={{ textDecoration: 'none' }}>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              justifyContent="flex-start"
              onPress={() => setMenuOpen(false)}
            >
              {t('navigation.profile')}
            </Button>
          </Link>
          <Link href="/subscription" style={{ textDecoration: 'none' }}>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              justifyContent="flex-start"
              onPress={() => setMenuOpen(false)}
            >
              {t('i18n.language') === 'ar' ? 'الاشتراك' : 'Subscription'}
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            justifyContent="flex-start"
            onPress={handleLogout}
          >
            <Text color="$red10">{t('auth.logout')}</Text>
          </Button>
        </YStack>
      )}
    </YStack>
  );
}
