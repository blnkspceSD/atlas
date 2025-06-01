"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  LayoutGrid,
  Bookmark,
  FileText,
  UserCircle,
  MessageSquare,
  Settings,
  LogOut,
  ChevronsUpDown,
  Plus,
  UserCog,
  Blocks,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const sidebarVariants = {
  open: {
    width: "15rem",
  },
  closed: {
    width: "3.05rem",
  },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
};

const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentPath: string;
}

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse, currentPath }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  
  // Determine if sidebar should be expanded (either manually expanded or hovered)
  const isExpanded = !isCollapsed || isHovered;
  
  return (
    <>
      {/* Mobile Backdrop */}
        {isOpen && (
          <motion.div 
          className="fixed inset-0 bg-black/50 md:hidden z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}

      {/* Mobile Sidebar */}
        {isOpen && (
          <motion.aside 
          className="flex flex-col flex-shrink-0 overflow-y-auto w-64 bg-background border-r border-border z-40 h-full fixed top-0 inset-y-auto left-0 md:hidden shadow-lg"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ 
              type: "tween", 
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="text-primary text-xl font-bold">atlas.</div>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Close sidebar"
              >
                ✕
              </button>
            </div>

              {/* Navigation Links */}
            <ScrollArea className="flex-grow py-2">
              <div className="space-y-6">
                {/* EXPLORE */}
                <div>
                  <h2 className="px-3 mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    EXPLORE
                  </h2>
                  <div className="space-y-1">
                    <Link
                      href="/"
                      onClick={onClose}
                      className={cn(
                        "flex h-10 w-full flex-row items-center rounded-md px-3 py-2 transition hover:bg-muted hover:text-primary",
                        pathname === "/" && "bg-muted text-blue-600",
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" />
                      <p className="ml-3 text-sm font-medium">Jobs</p>
                    </Link>
                    <Link
                      href="/saved"
                      onClick={onClose}
                      className={cn(
                        "flex h-10 w-full flex-row items-center rounded-md px-3 py-2 transition hover:bg-muted hover:text-primary",
                        pathname?.includes("saved") && "bg-muted text-blue-600",
                      )}
                    >
                      <Bookmark className="h-4 w-4" />
                      <p className="ml-3 text-sm font-medium">Saved</p>
                    </Link>
                  </div>
                </div>

                {/* PERSONAL */}
                <div>
                  <h2 className="px-3 mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    PERSONAL
                  </h2>
                  <div className="space-y-1">
                    <Link
                      href="/applications"
                      onClick={onClose}
                      className={cn(
                        "flex h-10 w-full flex-row items-center rounded-md px-3 py-2 transition hover:bg-muted hover:text-primary",
                        pathname?.includes("applications") && "bg-muted text-blue-600",
                      )}
                    >
                      <FileText className="h-4 w-4" />
                      <p className="ml-3 text-sm font-medium">Applications</p>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={onClose}
                      className={cn(
                        "flex h-10 w-full flex-row items-center rounded-md px-3 py-2 transition hover:bg-muted hover:text-primary",
                        pathname?.includes("profile") && "bg-muted text-blue-600",
                      )}
                    >
                      <UserCircle className="h-4 w-4" />
                      <p className="ml-3 text-sm font-medium">Resume</p>
                    </Link>
                  </div>
                </div>

                {/* COMMUNITY */}
                <div>
                  <h2 className="px-3 mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    COMMUNITY
                  </h2>
                  <div className="space-y-1">
                    <Link
                      href="/feed"
                      onClick={onClose}
                      className={cn(
                        "flex h-10 w-full flex-row items-center rounded-md px-3 py-2 transition hover:bg-muted hover:text-primary",
                        pathname?.includes("feed") && "bg-muted text-blue-600",
                      )}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <p className="ml-3 text-sm font-medium">Feed</p>
                    </Link>
                  </div>
                </div>

                {/* ACCOUNT */}
                <div>
                  <h2 className="px-3 mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    ACCOUNT
                    </h2>
                  <div className="space-y-1">
                    <Link
                      href="/settings"
                      onClick={onClose}
                      className={cn(
                        "flex h-10 w-full flex-row items-center rounded-md px-3 py-2 transition hover:bg-muted hover:text-primary",
                        pathname?.includes("settings") && "bg-muted text-blue-600",
                      )}
                    >
                      <Settings className="h-4 w-4" />
                      <p className="ml-3 text-sm font-medium">Settings</p>
                    </Link>
                    <Link
                      href="/logout"
                      onClick={onClose}
                      className={cn(
                        "flex h-10 w-full flex-row items-center rounded-md px-3 py-2 transition hover:bg-muted hover:text-primary",
                        pathname?.includes("logout") && "bg-muted text-blue-600",
                      )}
                    >
                      <LogOut className="h-4 w-4" />
                      <p className="ml-3 text-sm font-medium">Logout</p>
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Atlas User</p>
                  <p className="text-xs text-muted-foreground truncate">user@example.com</p>
                </div>
              </div>
            </div>
            </div>
          </motion.aside>
      )}

      {/* Desktop Sidebar */}
      <motion.div
        className={cn(
          "sidebar hidden md:flex fixed left-0 z-40 h-full shrink-0 border-r border-border bg-background"
        )}
        initial={isCollapsed ? "closed" : "open"}
        animate={isExpanded ? "open" : "closed"}
        variants={sidebarVariants}
        transition={transitionProps}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className={`relative z-40 flex text-muted-foreground h-full w-full flex-col transition-all`}
          variants={contentVariants}
        >
          <motion.ul variants={staggerVariants} className="flex h-full w-full flex-col">
            <div className="flex grow flex-col w-full">
              <div className="flex h-[54px] w-full shrink-0 border-b border-border p-2">
                <div className="mt-[1.5px] flex w-full">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="w-full" asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex w-fit items-center gap-2 px-2" 
                      >
                        <Avatar className='rounded size-4'>
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <motion.li
                          variants={variants}
                          className="flex w-fit items-center gap-2"
                        >
                          {isExpanded && (
                            <>
                              <p className="text-sm font-medium">atlas.</p>
                              <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                            </>
                          )}
                        </motion.li>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        asChild
                        className="flex items-center gap-2"
                      >
                        <Link href="/settings">
                          <UserCog className="h-4 w-4" /> Manage settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="flex items-center gap-2"
                      >
                        <Link href="/ui-showcase">
                          <Blocks className="h-4 w-4" /> UI Showcase
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/sidebar-demo"
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Sidebar Demo
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex h-full w-full flex-col p-2">
                <div className="flex grow flex-col gap-4">
                  <ScrollArea className="h-16 grow py-2">
                    <div className={cn("flex w-full flex-col gap-1")}>
                      {/* EXPLORE */}
                      <Link
                        href="/"
                        className={cn(
                          "flex h-10 w-full flex-row items-center rounded-md px-3 py-2 transition hover:bg-muted hover:text-primary",
                          pathname === "/" && "bg-muted text-blue-600",
                        )}
                      >
                        <LayoutGrid className="h-4 w-4" />
                        <motion.li variants={variants}>
                          {isExpanded && (
                            <p className="ml-3 text-sm font-medium">Jobs</p>
                          )}
                        </motion.li>
                      </Link>
                      <Link
                        href="/saved"
                        className={cn(
                          "flex h-10 w-full flex-row items-center rounded-md px-3 py-2 transition hover:bg-muted hover:text-primary",
                          pathname?.includes("saved") && "bg-muted text-blue-600",
                        )}
                      >
                        <Bookmark className="h-4 w-4" />
                        <motion.li variants={variants}>
                          {isExpanded && (
                            <p className="ml-3 text-sm font-medium">Saved</p>
                          )}
                        </motion.li>
                      </Link>
                      
                      <Separator className="w-full" />
                      
                      {/* PERSONAL */}
                      <Link
                        href="/applications"
                        className={cn(
                          "flex h-10 w-full flex-row items-center rounded-md px-3 py-2 transition hover:bg-muted hover:text-primary",
                          pathname?.includes("applications") && "bg-muted text-blue-600",
                        )}
                      >
                        <FileText className="h-4 w-4" />
                        <motion.li variants={variants}>
                          {isExpanded && (
                            <p className="ml-3 text-sm font-medium">Applications</p>
                          )}
                        </motion.li>
                      </Link>
                      <Link
                        href="/profile"
                        className={cn(
                          "flex h-10 w-full flex-row items-center rounded-md px-3 py-2 transition hover:bg-muted hover:text-primary",
                          pathname?.includes("profile") && "bg-muted text-blue-600",
                        )}
                      >
                        <UserCircle className="h-4 w-4" />
                        <motion.li variants={variants}>
                          {isExpanded && (
                            <p className="ml-3 text-sm font-medium">Resume</p>
                          )}
                        </motion.li>
                      </Link>
                      
                      <Separator className="w-full" />
                      
                      {/* COMMUNITY */}
                      <Link
                        href="/feed"
                        className={cn(
                          "flex h-10 w-full flex-row items-center rounded-md px-3 py-2 transition hover:bg-muted hover:text-primary",
                          pathname?.includes("feed") && "bg-muted text-blue-600",
                        )}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <motion.li variants={variants}>
                          {isExpanded && (
                            <div className="ml-3 flex items-center gap-2">
                              <p className="text-sm font-medium">Feed</p>
                              <Badge
                                className={cn(
                                  "flex h-fit w-fit items-center gap-1.5 rounded border-none bg-blue-50 px-1.5 text-blue-600 dark:bg-blue-700 dark:text-blue-300",
                                )}
                                variant="outline"
                              >
                                NEW
                              </Badge>
                            </div>
                          )}
                        </motion.li>
                      </Link>
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="flex flex-col py-2">
                  <Link
                    href="/settings"
                    className="mt-auto flex h-10 w-full flex-row items-center rounded-md px-3 py-2 transition hover:bg-muted hover:text-primary"
                  >
                    <Settings className="h-4 w-4 shrink-0" />
                    <motion.li variants={variants}>
                      {isExpanded && (
                        <p className="ml-3 text-sm font-medium">Settings</p>
                      )}
                    </motion.li>
                  </Link>
                  <div>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger className="w-full">
                        <div className="flex h-10 w-full flex-row items-center gap-2 rounded-md px-3 py-2 transition hover:bg-muted hover:text-primary">
                          <Avatar className="size-4">
                            <AvatarFallback>AU</AvatarFallback>
                          </Avatar>
                          <motion.li
                            variants={variants}
                            className="flex w-full items-center gap-2"
                          >
                            {isExpanded && (
                              <>
                                <p className="text-sm font-medium">Account</p>
                                <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                              </>
                            )}
                          </motion.li>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent sideOffset={5}>
                        <div className="flex flex-row items-center gap-2 p-2">
                          <Avatar className="size-6">
                            <AvatarFallback>AU</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-medium">Atlas User</span>
                            <span className="line-clamp-1 text-xs text-muted-foreground">
                              user@example.com
                            </span>
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          asChild
                          className="flex items-center gap-2"
                        >
                          <Link href="/profile">
                            <UserCircle className="h-4 w-4" /> Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <LogOut className="h-4 w-4" /> Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
        </div>
          </motion.ul>
        </motion.div>
      </motion.div>
    </>
  );
}

export default Sidebar; 