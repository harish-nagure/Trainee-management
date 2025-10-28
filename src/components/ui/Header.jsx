import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ userRole = 'trainee', userName = 'User', onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: userRole === 'manager' ? '/manager-dashboard' : '/trainee-dashboard',
      icon: 'LayoutDashboard',
      roles: ['trainee', 'manager']
    },
    {
      label: 'Learning',
      path: '/syllabus-content-viewer',
      icon: 'BookOpen',
      roles: ['trainee']
    },
    {
      label: 'Progress',
      path: '/progress-reports',
      icon: 'TrendingUp',
      roles: ['trainee', 'manager']
    },
    {
      label: 'Assessment',
      path: '/assessment-entry',
      icon: 'ClipboardCheck',
      roles: ['manager']
    },
    {
      label: 'Interviews',
      path: '/interview-scheduling',
      icon: 'Calendar',
      roles: ['manager']
    }
  ];

  const visibleNavItems = navigationItems?.filter(item => 
    item?.roles?.includes(userRole)
  )?.slice(0, 4);

  const moreItems = navigationItems?.filter(item => 
    item?.roles?.includes(userRole)
  )?.slice(4);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="GraduationCap" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">TMS</h1>
              <p className="text-xs text-muted-foreground">Trainee Management</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {visibleNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              className="px-4"
            >
              {item?.label}
            </Button>
          ))}
          
          {moreItems?.length > 0 && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                iconName="MoreHorizontal"
                iconPosition="left"
                iconSize={16}
                className="px-4"
              >
                More
              </Button>
            </div>
          )}
        </nav>

        {/* User Profile & Mobile Menu */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            iconName={isMobileMenuOpen ? "X" : "Menu"}
            iconSize={20}
          >
          </Button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 px-3"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </Button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg elevation-2 z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{userName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                  </div>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors duration-150"
                  >
                    <Icon name="Settings" size={16} className="inline mr-2" />
                    Settings
                  </button>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors duration-150"
                  >
                    <Icon name="HelpCircle" size={16} className="inline mr-2" />
                    Help
                  </button>
                  <div className="border-t border-border mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-error hover:bg-muted transition-colors duration-150"
                    >
                      <Icon name="LogOut" size={16} className="inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-surface border-t border-border">
          <nav className="px-6 py-4 space-y-2">
            {navigationItems?.filter(item => item?.roles?.includes(userRole))?.map((item) => (
                <Button
                  key={item?.path}
                  variant={isActivePath(item?.path) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigation(item?.path)}
                  iconName={item?.icon}
                  iconPosition="left"
                  iconSize={16}
                  fullWidth
                  className="justify-start"
                >
                  {item?.label}
                </Button>
              ))}
          </nav>
        </div>
      )}
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;