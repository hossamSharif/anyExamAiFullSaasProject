import { styled, Stack } from '@tamagui/core'
import type { GetProps, IconProps as TamaguiIconProps } from '@tamagui/core'
import * as LucideIcons from '@tamagui/lucide-icons'

// Icons that should be mirrored in RTL layouts
// These are directional icons that need to flip for right-to-left languages
const RTL_MIRROR_ICONS = [
  'ChevronRight',
  'ChevronLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowBigRight',
  'ArrowBigLeft',
  'Send',
  'Reply',
  'Forward',
  'Undo',
  'Redo',
  'LogIn',
  'LogOut',
  'MoveRight',
  'MoveLeft',
  'ChevronsRight',
  'ChevronsLeft',
  'CornerDownRight',
  'CornerDownLeft',
  'CornerUpRight',
  'CornerUpLeft',
  'TrendingUp',
  'TrendingDown',
] as const

// Styled wrapper for icons with RTL support
const IconWrapper = styled(Stack, {
  name: 'IconWrapper',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

  // RTL support - inherits direction from parent
  direction: 'inherit',

  variants: {
    shouldMirror: {
      true: {
        // Flip icon horizontally in RTL
        transform: [{ scaleX: -1 }],
      },
    },
  },
})

export type LucideIconName = keyof typeof LucideIcons

export interface IconProps extends Omit<GetProps<typeof IconWrapper>, 'children'> {
  /**
   * Name of the Lucide icon to render
   * @example 'Home', 'User', 'Settings'
   */
  name: LucideIconName

  /**
   * Icon size in pixels
   * @default 24
   */
  size?: number

  /**
   * Icon color - accepts Tamagui tokens or CSS color
   * @default '$color'
   */
  color?: string

  /**
   * Stroke width of the icon
   * @default 2
   */
  strokeWidth?: number

  /**
   * Manually control RTL mirroring
   * If true, icon will be mirrored regardless of RTL_MIRROR_ICONS list
   * If false, icon will never be mirrored
   * If undefined (default), will auto-mirror based on RTL_MIRROR_ICONS
   */
  mirrorRTL?: boolean

  /**
   * Additional props to pass to the underlying icon component
   */
  iconProps?: Partial<TamaguiIconProps>
}

/**
 * Icon component with automatic RTL mirroring support for directional icons
 *
 * @example
 * // Basic usage
 * <Icon name="Home" size={24} color="$primary" />
 *
 * @example
 * // With RTL mirroring (auto-detects directional icons)
 * <Icon name="ChevronRight" /> // Automatically flips in RTL layouts
 *
 * @example
 * // Force mirroring
 * <Icon name="ArrowRight" mirrorRTL={true} />
 *
 * @example
 * // Prevent mirroring
 * <Icon name="ChevronRight" mirrorRTL={false} />
 */
export const Icon = ({
  name,
  size = 24,
  color = '$color',
  strokeWidth = 2,
  mirrorRTL,
  iconProps,
  ...wrapperProps
}: IconProps) => {
  // Get the icon component from Lucide
  const IconComponent = LucideIcons[name]

  if (!IconComponent) {
    // Fallback if icon doesn't exist
    console.warn(`Icon "${name}" not found in @tamagui/lucide-icons`)
    return null
  }

  // Determine if icon should be mirrored
  // Priority: explicit mirrorRTL prop > RTL_MIRROR_ICONS list
  const shouldMirror =
    mirrorRTL !== undefined
      ? mirrorRTL
      : RTL_MIRROR_ICONS.includes(name as any)

  return (
    <IconWrapper shouldMirror={shouldMirror} {...wrapperProps}>
      <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        {...iconProps}
      />
    </IconWrapper>
  )
}

Icon.displayName = 'Icon'

// Export icon name type for convenience
export type { LucideIconName as IconName }

/**
 * Commonly used icon presets for quick access
 */
export const IconPresets = {
  // Navigation
  Home: 'Home' as LucideIconName,
  Back: 'ChevronLeft' as LucideIconName,
  Forward: 'ChevronRight' as LucideIconName,
  Menu: 'Menu' as LucideIconName,
  Close: 'X' as LucideIconName,

  // Actions
  Search: 'Search' as LucideIconName,
  Filter: 'Filter' as LucideIconName,
  Settings: 'Settings' as LucideIconName,
  Plus: 'Plus' as LucideIconName,
  Edit: 'Edit' as LucideIconName,
  Delete: 'Trash2' as LucideIconName,
  Save: 'Save' as LucideIconName,
  Download: 'Download' as LucideIconName,
  Upload: 'Upload' as LucideIconName,
  Share: 'Share2' as LucideIconName,

  // Status
  Check: 'Check' as LucideIconName,
  Error: 'AlertCircle' as LucideIconName,
  Warning: 'AlertTriangle' as LucideIconName,
  Info: 'Info' as LucideIconName,
  Success: 'CheckCircle' as LucideIconName,

  // User
  User: 'User' as LucideIconName,
  UserCircle: 'UserCircle' as LucideIconName,
  Users: 'Users' as LucideIconName,

  // Exam-specific
  Book: 'Book' as LucideIconName,
  FileText: 'FileText' as LucideIconName,
  ClipboardList: 'ClipboardList' as LucideIconName,
  Award: 'Award' as LucideIconName,
  Trophy: 'Trophy' as LucideIconName,
  Target: 'Target' as LucideIconName,
  Brain: 'Brain' as LucideIconName,
} as const
