import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarView = ({ 
  selectedDate, 
  onDateSelect, 
  interviews, 
  onTimeSlotSelect,
  conflicts = [],
  className = '' 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getInterviewsForDate = (date) => {
    if (!date) return [];
    return interviews?.filter(interview => {
      const interviewDate = new Date(interview.scheduledDate);
      return interviewDate?.toDateString() === date?.toDateString();
    });
  };

  const hasConflict = (date, time) => {
    if (!date) return false;
    return conflicts?.some(conflict => {
      const conflictDate = new Date(conflict.date);
      return conflictDate?.toDateString() === date?.toDateString() && 
             conflict?.time === time;
    });
  };

  const isTimeSlotBooked = (date, time) => {
    const dayInterviews = getInterviewsForDate(date);
    return dayInterviews?.some(interview => interview?.time === time);
  };

  const handleTimeSlotClick = (time) => {
    if (!selectedDate) return;
    
    const isBooked = isTimeSlotBooked(selectedDate, time);
    const hasConflictAtTime = hasConflict(selectedDate, time);
    
    if (isBooked || hasConflictAtTime) return;
    
    setSelectedTimeSlot(time);
    onTimeSlotSelect(selectedDate, time);
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth?.setMonth(currentMonth?.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date?.toDateString() === selectedDate?.toDateString();
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {monthNames?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(-1)}
            iconName="ChevronLeft"
            iconSize={16}
          >
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(1)}
            iconName="ChevronRight"
            iconSize={16}
          >
          </Button>
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']?.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {days?.map((date, index) => {
          const dayInterviews = getInterviewsForDate(date);
          const interviewCount = dayInterviews?.length;
          
          return (
            <button
              key={index}
              onClick={() => date && onDateSelect(date)}
              disabled={!date}
              className={`
                p-2 h-12 text-sm rounded-lg transition-colors duration-150 relative
                ${!date ? 'invisible' : ''}
                ${isToday(date) ? 'bg-primary/10 border border-primary' : ''}
                ${isSelected(date) ? 'bg-primary text-primary-foreground' : ''}
                ${!isSelected(date) && !isToday(date) ? 'hover:bg-muted' : ''}
                ${interviewCount > 0 ? 'font-medium' : ''}
              `}
            >
              {date && (
                <>
                  <span>{date?.getDate()}</span>
                  {interviewCount > 0 && (
                    <div className="absolute bottom-1 right-1 w-2 h-2 bg-accent rounded-full"></div>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
      {/* Time Slots for Selected Date */}
      {selectedDate && (
        <div>
          <h4 className="text-md font-medium text-foreground mb-4">
            Available Time Slots - {selectedDate?.toLocaleDateString()}
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {timeSlots?.map(time => {
              const isBooked = isTimeSlotBooked(selectedDate, time);
              const hasConflictAtTime = hasConflict(selectedDate, time);
              const isSelectedTime = selectedTimeSlot === time;
              
              return (
                <button
                  key={time}
                  onClick={() => handleTimeSlotClick(time)}
                  disabled={isBooked || hasConflictAtTime}
                  className={`
                    p-2 text-sm rounded-lg border transition-colors duration-150
                    ${isSelectedTime ? 'bg-primary text-primary-foreground border-primary' : ''}
                    ${isBooked ? 'bg-muted text-muted-foreground border-border cursor-not-allowed' : ''}
                    ${hasConflictAtTime ? 'bg-error/10 text-error border-error cursor-not-allowed' : ''}
                    ${!isBooked && !hasConflictAtTime && !isSelectedTime ? 'bg-background border-border hover:bg-muted' : ''}
                  `}
                >
                  <div className="flex flex-col items-center">
                    <span>{time}</span>
                    {isBooked && <Icon name="Users" size={12} className="mt-1" />}
                    {hasConflictAtTime && <Icon name="AlertTriangle" size={12} className="mt-1" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-muted-foreground">Has Interviews</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-muted rounded-full"></div>
            <span className="text-muted-foreground">Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error/20 rounded-full"></div>
            <span className="text-muted-foreground">Conflict</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;