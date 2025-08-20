"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "4.5rem";

type SidebarContext = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, style, children, ...props }, ref) => {
    const [open, setOpen] = React.useState(false); // Começa fechado

    const contextValue = React.useMemo<SidebarContext>(
      () => ({ open, setOpen }),
      [open],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          style={{
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn("group/sidebar-wrapper flex min-h-screen w-full", className)}
          data-state={open ? "open" : "closed"}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = "SidebarProvider";

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
    const { setOpen } = useSidebar();
    return (
      <aside
        ref={ref}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={cn(
          "bg-card text-card-foreground border-r border-border",
          "fixed top-0 left-0 z-30 flex h-full flex-col transition-all duration-300 ease-in-out",
          "w-[var(--sidebar-width-icon)] group-data-[state=open]/sidebar-wrapper:w-[var(--sidebar-width)]",
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    );
  },
);
Sidebar.displayName = "Sidebar";


export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
    const { open } = useSidebar();
    return (
        <div 
            ref={ref}
            className={cn("flex-1 transition-all duration-300 ease-in-out",
            "ml-[var(--sidebar-width-icon)] group-data-[state=open]/sidebar-wrapper:ml-[var(--sidebar-width)]",
            className
        )}>
             <div className="relative h-full">
                {children}
                {/* Overlay de ofuscamento */}
                <div className={cn(
                    "absolute inset-0 z-20 bg-black/40 transition-opacity duration-300",
                    open ? "opacity-100" : "opacity-0 pointer-events-none"
                )} />
             </div>
        </div>
    );
});
SidebarInset.displayName = "SidebarInset";

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2 p-3", className)}
      {...props}
    />
  );
});
SidebarHeader.displayName = "SidebarHeader";

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2 p-3 mt-auto", className)}
      {...props}
    />
  );
});
SidebarFooter.displayName = "SidebarFooter";

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-3",
        className,
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
});
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li"> & { tooltip?: string }
>(({ className, tooltip, ...props }, ref) => {
  const { open } = useSidebar();
  return (
    <li
      ref={ref}
      className={cn("group/menu-item relative", className)}
      {...props}
    >
      {props.children}
      {!open && tooltip && (
        <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-4 opacity-0 group-hover/menu-item:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1.5 px-2.5 shadow-lg z-50 whitespace-nowrap">
          {tooltip}
        </div>
      )}
    </li>
  );
});
SidebarMenuItem.displayName = "SidebarMenuItem";

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
  }
>(({ asChild = false, isActive = false, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={cn(
        "flex w-full items-center gap-4 overflow-hidden rounded-md p-3 text-left text-sm outline-none transition-colors",
        "group-data-[state=closed]/sidebar-wrapper:justify-center group-data-[state=closed]/sidebar-wrapper:px-0",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring",
        { "bg-accent text-accent-foreground font-semibold": isActive },
        className,
      )}
      {...props}
    >
      {React.Children.map(props.children, (child, index) => {
        if (index === 0) return child;
        return (
          <div className="group-data-[state=closed]/sidebar-wrapper:hidden flex-1">
            {child}
          </div>
        );
      })}
    </Comp>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";