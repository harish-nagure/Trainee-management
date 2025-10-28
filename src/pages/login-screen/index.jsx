import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';
import { Eye, EyeOff, Shield, AlertCircle, Lock, User, Mail } from 'lucide-react';


const LoginScreen = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    traineeId: '',
    password: '',
    role: '',
    rememberMe: false
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  
  const roleOptions = [
    { value: 'manager', label: 'Manager', description: 'Administrative access' },
    { value: 'trainee', label: 'Trainee', description: 'Learning access' }
  ];
  
  // Mock user data for demonstration
  const mockUsers = {
    manager: {
      email: 'admin@traineesystem.com',
      password: 'Manager123!',
      redirectPath: '/manager-dashboard'
    },
    trainee: {
      email: 'john.doe@company.com',
      traineeId: 'TRN001',
      password: 'Trainee123!',
      redirectPath: '/trainee-dashboard'
    }
  };
  
  // Account lockout timer
  useEffect(() => {
    let timer;
    if (isLocked && lockTimeRemaining > 0) {
      timer = setInterval(() => {
        setLockTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockTimeRemaining]);
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Role validation
    if (!formData?.role) {
      newErrors.role = 'Please select your role';
    }
    
    // Email validation for both roles
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Trainee ID validation for trainee role
    if (formData?.role === 'trainee' && !formData?.traineeId) {
      newErrors.traineeId = 'Trainee ID is required';
    }
    
    // Password validation
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };
  
  const handleLogin = async (e) => {
    e?.preventDefault();
    
    if (isLocked) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication logic
      const mockUser = mockUsers?.[formData?.role];
      
      const isValidCredentials = 
        formData?.email === mockUser?.email &&
        formData?.password === mockUser?.password &&
        (formData?.role !== 'trainee' || formData?.traineeId === mockUsers?.trainee?.traineeId);
      
      if (isValidCredentials) {
        // Successful login
        setFailedAttempts(0);
        
        // Store user session (in real app, handle JWT tokens)
        if (formData?.rememberMe) {
          localStorage.setItem('userSession', JSON.stringify({
            role: formData?.role,
            email: formData?.email,
            traineeId: formData?.traineeId,
            timestamp: Date.now()
          }));
        }
        
        // Redirect to appropriate dashboard
        navigate(mockUser?.redirectPath);
      } else {
        // Failed login
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        
        if (newFailedAttempts >= 3) {
          setIsLocked(true);
          setLockTimeRemaining(300); // 5 minutes lockout
          setErrors({
            general: 'Account locked due to multiple failed attempts. Please try again in 5 minutes.'
          });
        } else {
          setErrors({
            general: `Invalid credentials. ${3 - newFailedAttempts} attempts remaining.`
          });
        }
      }
    } catch (error) {
      setErrors({
        general: 'Connection error. Please check your internet connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleForgotPassword = () => {
    // In real app, trigger password reset flow
    alert('Password reset instructions would be sent to your email.');
  };
  
  const formatLockTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 58, 138, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 elevation-2">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Trainee Management System
          </h1>
          <p className="text-muted-foreground">
            Secure access to your training portal
          </p>
        </div>
        
        {/* Login Form */}
        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-card-foreground mb-6 text-center">
              Sign In to Your Account
            </h2>
            
            <form onSubmit={handleLogin} className="space-y-6">
              {/* General Error */}
              {errors?.general && (
                <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <div>
                    <p className="text-sm text-destructive font-medium">
                      {errors?.general}
                    </p>
                    {isLocked && (
                      <p className="text-xs text-destructive/80 mt-1">
                        Time remaining: {formatLockTime(lockTimeRemaining)}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Role Selection */}
              <Select
                label="Select Your Role"
                required
                options={roleOptions}
                value={formData?.role}
                onChange={(value) => handleInputChange('role', value)}
                error={errors?.role}
                placeholder="Choose your access level"
                className="w-full"
              />
              
              {/* Email Field */}
              <div className="relative">
                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={formData?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  error={errors?.email}
                  placeholder="Enter your email address"
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-9 w-4 h-4 text-muted-foreground" />
              </div>
              
              {/* Trainee ID Field (conditional) */}
              {formData?.role === 'trainee' && (
                <div className="relative">
                  <Input
                    label="Trainee ID"
                    type="text"
                    required
                    value={formData?.traineeId}
                    onChange={(e) => handleInputChange('traineeId', e?.target?.value)}
                    error={errors?.traineeId}
                    placeholder="Enter your trainee ID"
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-9 w-4 h-4 text-muted-foreground" />
                </div>
              )}
              
              {/* Password Field */}
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData?.password}
                  onChange={(e) => handleInputChange('password', e?.target?.value)}
                  error={errors?.password}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                />
                <Lock className="absolute left-3 top-9 w-4 h-4 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={formData?.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e?.target?.checked)}
                  />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
                
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              
              {/* Login Button */}
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLocked}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            
            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">
                Demo Credentials
              </h3>
              <div className="space-y-2 text-xs">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="font-medium text-foreground mb-1">Manager Access:</p>
                  <p className="text-muted-foreground">Email: admin@traineesystem.com</p>
                  <p className="text-muted-foreground">Password: Manager123!</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="font-medium text-foreground mb-1">Trainee Access:</p>
                  <p className="text-muted-foreground">Email: john.doe@company.com</p>
                  <p className="text-muted-foreground">Trainee ID: TRN001</p>
                  <p className="text-muted-foreground">Password: Trainee123!</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Footer */}
          <div className="bg-muted/30 px-8 py-4">
            <div className="flex items-center justify-center text-xs text-muted-foreground">
              <Shield className="w-3 h-3 mr-1" />
              Secured with enterprise-grade encryption
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          <p>© 2025 Trainee Management System. All rights reserved.</p>
          <p className="mt-1">Session timeout: 30 minutes | Max login attempts: 3</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;