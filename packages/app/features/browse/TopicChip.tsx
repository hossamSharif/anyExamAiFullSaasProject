/**
 * TopicChip - Multi-select chip for topics
 *
 * Visual feedback for selected/unselected state with Arabic support.
 */

import React from 'react'
import { XStack, Text } from '@anyexam/ui'
import { Check } from '@tamagui/lucide-icons'

interface TopicChipProps {
  topic: string
  selected: boolean
  onPress: () => void
  isRTL: boolean
}

export function TopicChip({ topic, selected, onPress, isRTL }: TopicChipProps) {
  return (
    <XStack
      paddingHorizontal="$4"
      paddingVertical="$2.5"
      borderRadius="$10"
      borderWidth={1.5}
      borderColor={selected ? '$blue9' : '$borderColor'}
      backgroundColor={selected ? '$blue3' : '$background'}
      alignItems="center"
      gap="$2"
      pressStyle={{ scale: 0.96, opacity: 0.9 }}
      onPress={onPress}
      cursor="pointer"
      animation="quick"
      direction={isRTL ? 'rtl' : 'ltr'}
    >
      {selected && <Check size={16} color="$blue10" />}
      <Text
        fontSize="$4"
        fontWeight={selected ? '600' : '400'}
        color={selected ? '$blue11' : '$gray11'}
      >
        {topic}
      </Text>
    </XStack>
  )
}
