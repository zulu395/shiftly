"use client";

import React from "react";
// Importing LuX from Lucide icons as requested
import { LuX } from "react-icons/lu";

// --- 1. SelectPill (Individual Pill Component) ---

// Using type for props definition
type SelectPillProps = {
  title: string;
  isSelected: boolean;
  /**
   * Callback function when the pill is clicked.
   * Passes the title and the *new* desired selection state.
   */
  onSelectChange: (title: string, shouldBeSelected: boolean) => void;
};

/**
 * Renders a single selectable pill.
 * This is a "dumb" component that just displays its props.
 */
export const SelectPill: React.FC<SelectPillProps> = ({
  title,
  isSelected,
  onSelectChange,
}) => {
  const baseClasses =
    "flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full cursor-pointer transition-all duration-200 border";

  const selectedClasses = "bg-white border-brand-primary";

  const unselectedClasses =
    "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400";

  const handleClick = () => {
    onSelectChange(title, !isSelected);
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${
        isSelected ? selectedClasses : unselectedClasses
      }`}
      aria-pressed={isSelected}
      type="button"
    >
      <span className="text-sm font-medium">{title}</span>
      {/* Use the LuX icon when selected */}
      {isSelected && <LuX className="w-4 h-4 opacity-70" />}
    </button>
  );
};

// --- 2. SelectPillGroup (Group & State) ---

// Using type for props definition
type SelectPillGroupProps = {
  /** Array of all available string options. */
  options: readonly string[];
  /** Array of the currently selected string options. */
  selectedItems: string[];
  /** Callback function to update the parent's state. */
  onSelectedItemsChange: (newSelectedItems: string[]) => void;
};

/**
 * Renders a list of SelectPill components and manages the
 * selection state by firing callbacks.
 */
export const SelectPillGroup: React.FC<SelectPillGroupProps> = ({
  options,
  selectedItems,
  onSelectedItemsChange,
}) => {
  /**
   * Handles the toggle logic from a child SelectPill.
   */
  const handlePillToggle = (title: string, shouldBeSelected: boolean) => {
    let newSelectedItems: string[];

    if (shouldBeSelected) {
      newSelectedItems = [...selectedItems, title];
    } else {
      newSelectedItems = selectedItems.filter((item) => item !== title);
    }

    onSelectedItemsChange(newSelectedItems);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 justify-center">
      {options.map((option) => (
        <SelectPill
          key={option}
          title={option}
          isSelected={selectedItems.includes(option)}
          onSelectChange={handlePillToggle}
        />
      ))}
    </div>
  );
};
