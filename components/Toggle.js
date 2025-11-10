import React, { useState } from 'react';
import './Toggle.css';

/**
 * Toggle
 * Single two-state button
 */
export const Toggle = ({
  pressed = false,
  defaultPressed = false,
  onPressedChange,
  disabled = false,
  children,
  className = '',
  icon,
  badge,
  color,
  size = 'md',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(defaultPressed || pressed);

  const handleClick = () => {
    if (disabled) return;

    const newState = !isPressed;
    setIsPressed(newState);
    onPressedChange?.(newState);
  };

  const classes = [
    'toggle',
    size !== 'md' ? `toggle-${size}` : '',
    color ? `toggle-${color}` : '',
    icon && !children ? 'toggle-icon-only' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      data-state={isPressed ? 'on' : 'off'}
      aria-pressed={isPressed}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {icon && <span className="toggle-icon">{icon}</span>}
      {children}
      {badge && <span className="toggle-badge">{badge}</span>}
    </button>
  );
};

/**
 * ToggleGroup
 * Group of toggle buttons
 */
export const ToggleGroup = ({
  type = 'single', // single or multiple
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  children,
  className = '',
  variant = 'default', // default or outline
  size = 'md',
  separated = false,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(
    defaultValue || (type === 'single' ? '' : [])
  );

  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = (itemValue) => {
    if (disabled) return;

    let newValue;

    if (type === 'single') {
      // Single selection: toggle or select
      newValue = currentValue === itemValue ? '' : itemValue;
    } else {
      // Multiple selection: toggle in array
      const valueArray = Array.isArray(currentValue) ? currentValue : [];
      if (valueArray.includes(itemValue)) {
        newValue = valueArray.filter(v => v !== itemValue);
      } else {
        newValue = [...valueArray, itemValue];
      }
    }

    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  const isItemActive = (itemValue) => {
    if (type === 'single') {
      return currentValue === itemValue;
    } else {
      return Array.isArray(currentValue) && currentValue.includes(itemValue);
    }
  };

  const classes = [
    'toggle-group',
    variant !== 'default' ? `variant-${variant}` : '',
    size !== 'md' ? `toggle-group-${size}` : '',
    separated ? 'separated' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="group" {...props}>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              active: isItemActive(child.props.value),
              onClick: () => handleValueChange(child.props.value),
              disabled: disabled || child.props.disabled
            })
          : child
      )}
    </div>
  );
};

/**
 * ToggleGroupItem
 * Individual item within a toggle group
 */
export const ToggleGroupItem = ({
  value,
  active = false,
  onClick,
  disabled = false,
  children,
  className = '',
  icon,
  badge,
  color,
  iconOnly = false,
  ...props
}) => {
  const classes = [
    'toggle-group-item',
    active ? 'active' : '',
    color ? `toggle-${color}` : '',
    iconOnly ? 'icon-only' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      data-state={active ? 'on' : 'off'}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      value={value}
      {...props}
    >
      {icon && <span className="toggle-icon">{icon}</span>}
      {children}
      {badge && <span className="toggle-badge">{badge}</span>}
    </button>
  );
};

/**
 * useToggleState Hook
 * Helper hook for managing toggle state
 */
export const useToggleState = (initialState = false) => {
  const [isOn, setIsOn] = useState(initialState);

  const toggle = () => setIsOn(prev => !prev);
  const turnOn = () => setIsOn(true);
  const turnOff = () => setIsOn(false);

  return {
    isOn,
    toggle,
    turnOn,
    turnOff,
    setIsOn
  };
};

/**
 * useToggleGroup Hook
 * Helper hook for managing toggle group state
 */
export const useToggleGroup = (initialValue, type = 'single') => {
  const [value, setValue] = useState(initialValue || (type === 'single' ? '' : []));

  const toggleValue = (itemValue) => {
    if (type === 'single') {
      setValue(value === itemValue ? '' : itemValue);
    } else {
      const valueArray = Array.isArray(value) ? value : [];
      if (valueArray.includes(itemValue)) {
        setValue(valueArray.filter(v => v !== itemValue));
      } else {
        setValue([...valueArray, itemValue]);
      }
    }
  };

  const isActive = (itemValue) => {
    if (type === 'single') {
      return value === itemValue;
    } else {
      return Array.isArray(value) && value.includes(itemValue);
    }
  };

  const clearAll = () => {
    setValue(type === 'single' ? '' : []);
  };

  return {
    value,
    setValue,
    toggleValue,
    isActive,
    clearAll
  };
};

// Export all components
export default {
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  useToggleState,
  useToggleGroup
};

