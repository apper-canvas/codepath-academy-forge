import React from "react";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose, className }) => {
  const location = useLocation();

  const navigation = [
    {
      name: "Course Catalog",
      href: "/",
      icon: "BookOpen",
      description: "Browse all courses"
    },
    {
      name: "My Learning",
      href: "/learning",
      icon: "GraduationCap",
      description: "Continue your progress"
    },
    {
      name: "Progress",
      href: "/progress", 
      icon: "TrendingUp",
      description: "View achievements"
    },
    {
      name: "Bookmarks",
      href: "/bookmarks",
      icon: "Bookmark",
      description: "Saved lessons"
    },
  ];

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.href}
      onClick={mobile ? onClose : undefined}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
          isActive
            ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white shadow-lg"
            : "text-gray-400 hover:text-white hover:bg-surface/50"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-indicator"
              className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-r-full"
            />
          )}
          <ApperIcon
            name={item.icon}
            size={20}
            className={cn(
              "transition-colors duration-200",
              isActive ? "text-primary" : "group-hover:text-primary"
            )}
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{item.name}</div>
            <div className="text-xs text-gray-500 truncate">{item.description}</div>
          </div>
        </>
      )}
    </NavLink>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className={cn(
      "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-surface lg:border-r lg:border-gray-700",
      className
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-700">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
          <ApperIcon name="Code" size={18} className="text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CodePath
          </h1>
          <p className="text-xs text-gray-400">Academy</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <ApperIcon name="Sparkles" size={16} className="text-primary" />
          <span>Keep Learning!</span>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-gray-700 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Code" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CodePath
              </h1>
              <p className="text-xs text-gray-400">Academy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} mobile />
          ))}
        </nav>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;