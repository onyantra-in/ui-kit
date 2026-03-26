// ─── Simple prop-driven wrappers ──────────────────────────────────────────────
export { SimpleAlert } from './components/SimpleAlert';
export type { SimpleAlertProps } from './components/SimpleAlert';

export { SimpleBadge } from './components/SimpleBadge';
export type { SimpleBadgeProps } from './components/SimpleBadge';

export { SimpleSelect } from './components/SimpleSelect';
export type { SimpleSelectProps, SelectOption, SelectOptionGroup } from './components/SimpleSelect';

export { LabeledInput } from './components/LabeledInput';
export type { LabeledInputProps } from './components/LabeledInput';

export { LabeledTextarea } from './components/LabeledTextarea';
export type { LabeledTextareaProps } from './components/LabeledTextarea';

export { LabeledSwitch } from './components/LabeledSwitch';
export type { LabeledSwitchProps } from './components/LabeledSwitch';

export { SimpleTooltip } from './components/SimpleTooltip';
export type { SimpleTooltipProps } from './components/SimpleTooltip';

export { SimpleDialog } from './components/SimpleDialog';
export type { SimpleDialogProps } from './components/SimpleDialog';

export { SimpleDrawer } from './components/SimpleDrawer';
export type { SimpleDrawerProps } from './components/SimpleDrawer';

export { SimpleAlertDialog } from './components/SimpleAlertDialog';
export type { SimpleAlertDialogProps } from './components/SimpleAlertDialog';

export { SimpleTabs } from './components/SimpleTabs';
export type { SimpleTabsProps, TabItem } from './components/SimpleTabs';

export { SimpleDropdownMenu } from './components/SimpleDropdownMenu';
export type { SimpleDropdownMenuProps, MenuGroup, MenuItemDef } from './components/SimpleDropdownMenu';

export { SimpleCombobox } from './components/SimpleCombobox';
export type { SimpleComboboxProps, ComboboxOption } from './components/SimpleCombobox';

// ─── Other components ─────────────────────────────────────────────────────────
export * as Form from './components/Form';

export { BottomSheet } from './components/BottomSheet';
export type { BottomSheetProps } from './components/BottomSheet';

export { VoiceMicButton } from './components/VoiceMicButton';
export type { VoiceMicButtonProps } from './components/VoiceMicButton';

// Hooks
export { useVoiceInput } from './hooks/useVoiceInput';
export type { UseVoiceInputOptions, UseVoiceInputReturn } from './hooks/useVoiceInput';

// Utilities
export { cn, stringToHsl, stringToHslPair, formatDate, getAge } from './lib/utils';
