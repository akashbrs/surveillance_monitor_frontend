import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

/* =========================
   Trigger
========================= */
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      // layout
      "flex h-10 w-full items-center justify-between rounded-lg",
      // calm, flat dark background
      "border border-gray-900/10 dark:border-white/10 bg-gray-900/[0.03] dark:bg-white/[0.03]",
      // typography
      "px-3 text-sm text-gray-900 dark:text-white",
      "placeholder:text-gray-900/40 dark:text-white/40",
      // focus
      "focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400/70",
      // disabled
      "disabled:cursor-not-allowed disabled:opacity-60",
      "[&>span]:line-clamp-1 [&>span]:text-gray-900 dark:[&>span]:text-white [&>span[data-placeholder]]:text-gray-900/40 dark:[&>span[data-placeholder]]:text-white/40",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 text-gray-900/50 dark:text-white/50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

/* =========================
   Scroll Buttons
========================= */
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>((props, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className="flex items-center justify-center py-1 text-gray-900/60 dark:text-white/60"
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>((props, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className="flex items-center justify-center py-1 text-gray-900/60 dark:text-white/60"
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

/* =========================
   Content (Dropdown)
========================= */
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      // no animations, no glow
      className={cn(
        "relative z-[60] max-h-80 min-w-[8rem] overflow-hidden rounded-md",
        "border border-gray-900/10 dark:border-white/10",
        "bg-background text-gray-900/90 dark:text-white/90",
        // explicitly remove radix data animations
        "data-[state=open]:!animate-none data-[state=closed]:!animate-none",
        position === "popper" &&
        "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
        className
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

/* =========================
   Label
========================= */
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>((props, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className="py-1.5 pl-3 pr-2 text-xs font-medium uppercase tracking-wide text-gray-900/50 dark:text-white/50"
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

/* =========================
   Item
========================= */
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-[4px]",
      "px-3 py-2 text-sm",
      // base: always readable
      "text-gray-900/85 dark:text-white/85 bg-transparent",
      // *very* subtle hover
      "data-[highlighted]:bg-gray-900/[0.05] dark:data-[highlighted]:bg-white/[0.05]",
      "data-[highlighted]:text-gray-900 dark:data-[highlighted]:text-white",
      // selected: soft, muted green bar + text tint
      "data-[state=checked]:bg-green-500/[0.05] dark:data-[state=checked]:bg-green-500/[0.1]",
      "data-[state=checked]:text-green-500 dark:data-[state=checked]:text-green-400",
      "data-[state=checked]:before:content-['']",
      "data-[state=checked]:before:absolute",
      "data-[state=checked]:before:left-0",
      "data-[state=checked]:before:top-0",
      "data-[state=checked]:before:h-full",
      "data-[state=checked]:before:w-[2px]",
      "data-[state=checked]:before:bg-green-500/80",
      // disabled
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

/* =========================
   Separator
========================= */
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>((props, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className="-mx-1 my-1 h-px bg-gray-900/10 dark:bg-white/10"
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

/* =========================
   EXPORTS
========================= */
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
