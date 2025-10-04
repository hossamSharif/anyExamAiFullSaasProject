/**
 * FilterChip - Active filter indicator with remove action
 *
 * Shows applied filters with X button to remove. RTL-aware.
 */

import React from 'react'
import { XStack, Text } from '@anyexam/ui'
import { X } from '@tamagui/lucide-icons'

interface FilterChipProps {
  label: string
  onRemove: () => void
  isRTL: boolean
}

export function FilterChip({ label, onRemove, isRTL }: FilterChipProps) {
  return (
    <XStack
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius="$10"
      backgroundColor="$blue3"
      borderWidth={1}
      borderColor="$blue8"
      alignItems="center"
      gap="$2"
      direction={isRTL ? 'rtl' : 'ltr'}
    >
      <Text fontSize="$3" fontWeight="500" color="$blue11">
        {label}
      </Text>
      <XStack
        width={18}
        height={18}
        alignItems="center"
        justifyContent="center"
        borderRadius="$10"
        backgroundColor="$blue5"
        pressStyle={{ backgroundColor: '$blue6', scale: 0.9 }}
        onPress={onRemove}
        cursor="pointer"
      >
        <X size={12} color="$blue11" />
      </XStack>
    </XStack>
  )
}
