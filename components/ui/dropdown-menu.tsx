"use client";

import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const DropdownMenu = Menu.Root;

function DropdownMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Menu.Trigger>) {
  return (
    <Menu.Trigger
      data-slot="dropdown-menu-trigger"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border/75 bg-card/84 px-4 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-1)] transition-all duration-150 ease-[cubic-bezier(.2,.7,.2,1)] hover:border-border hover:bg-card focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-4 text-muted-foreground" />
    </Menu.Trigger>
  );
}

type DropdownMenuContentProps = React.ComponentProps<typeof Menu.Popup> &
  Pick<
    React.ComponentProps<typeof Menu.Positioner>,
    "align" | "alignOffset" | "side" | "sideOffset"
  >;

function DropdownMenuContent({
  className,
  children,
  side = "bottom",
  sideOffset = 10,
  align = "end",
  alignOffset = 0,
  ...props
}: DropdownMenuContentProps) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className="z-50"
      >
        <Menu.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 min-w-60 overflow-hidden rounded-[var(--radius-2xl)] border border-border/80 bg-popover/96 p-1.5 text-popover-foreground shadow-[var(--shadow-3)] backdrop-blur duration-150 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        >
          {children}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-label"
      className={cn(
        "px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  inset = false,
  ...props
}: React.ComponentProps<typeof Menu.Item> & { inset?: boolean }) {
  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "flex cursor-default items-center gap-2 rounded-[var(--radius)] px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        inset && "pl-9",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuRadioGroup(
  props: React.ComponentProps<typeof Menu.RadioGroup>,
) {
  return <Menu.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Menu.RadioItem>) {
  return (
    <Menu.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "flex cursor-default items-center gap-2 rounded-[var(--radius)] px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[checked]:text-primary",
        className,
      )}
      {...props}
    >
      <span className="flex size-4 items-center justify-center">
        <Menu.RadioItemIndicator>
          <CheckIcon className="size-4" />
        </Menu.RadioItemIndicator>
      </span>
      <span>{children}</span>
    </Menu.RadioItem>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Menu.Separator>) {
  return (
    <Menu.Separator
      data-slot="dropdown-menu-separator"
      className={cn("my-1 h-px bg-border/80", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};
