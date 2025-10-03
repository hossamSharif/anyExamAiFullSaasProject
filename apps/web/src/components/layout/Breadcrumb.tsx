'use client';

import { XStack, TextComponent as Text } from '@anyexamai/ui';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /**
   * Separator character
   * Default: '/'
   * Note: In RTL, the separator direction is automatically handled by the browser
   */
  separator?: string;
}

/**
 * Breadcrumb navigation component with RTL support
 * Automatically reverses order for RTL languages
 *
 * Usage:
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: 'الرئيسية', href: '/' },
 *     { label: 'المنتجات', href: '/products' },
 *     { label: 'تفاصيل المنتج' }
 *   ]}
 * />
 * ```
 */
export function Breadcrumb({ items, separator = '/' }: BreadcrumbProps) {
  return (
    <XStack gap="$2" alignItems="center" flexWrap="wrap">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <XStack key={index} gap="$2" alignItems="center">
            {item.href && !isLast ? (
              <Link href={item.href} style={{ textDecoration: 'none' }}>
                <Text
                  fontSize="$3"
                  color="$colorHover"
                  cursor="pointer"
                  hoverStyle={{ color: '$primary' }}
                >
                  {item.label}
                </Text>
              </Link>
            ) : (
              <Text
                fontSize="$3"
                color={isLast ? '$color' : '$colorHover'}
                fontWeight={isLast ? '600' : '400'}
              >
                {item.label}
              </Text>
            )}

            {!isLast && (
              <Text fontSize="$3" color="$colorHover">
                {separator}
              </Text>
            )}
          </XStack>
        );
      })}
    </XStack>
  );
}
