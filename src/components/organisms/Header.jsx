import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, title = "CodePath Academy" }) => {
  return (
    <header className="lg:pl-64 bg-background border-b border-gray-700 sticky top-0 z-30 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            onClick={onMenuClick}
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center">
              <ApperIcon name="Code" size={14} className="text-white" />
            </div>
            <span className="font-display font-semibold text-white">CodePath</span>
          </div>

          {/* Desktop Title */}
          <div className="hidden lg:block">
            <h1 className="text-xl font-display font-semibold text-white">
              {title}
            </h1>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="p-2">
            <ApperIcon name="Settings" size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;