import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import CalendarView from './components/CalendarView';
import TraineeSelectionPanel from './components/TraineeSelectionPanel';
import SchedulingForm from './components/SchedulingForm';
import ConflictDetection from './components/ConflictDetection';
import EmailNotificationPreview from './components/EmailNotificationPreview';
import InterviewStatusTracker from './components/InterviewStatusTracker';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const InterviewScheduling = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [activeView, setActiveView] = useState('calendar');
  const [conflicts, setConflicts] = useState([]);
  const [showNotificationPreview, setShowNotificationPreview] = useState(false);

  // Mock data
  const mockTrainees = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      progressPercentage: 85,
      lastInterviewDate: "2024-09-15",
      interviewStatus: "due",
      priority: "high"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      progressPercentage: 72,
      lastInterviewDate: "2024-09-20",
      interviewStatus: "overdue",
      priority: "high"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      progressPercentage: 90,
      lastInterviewDate: "2024-10-01",
      interviewStatus: "scheduled",
      priority: "medium"
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@company.com",
      progressPercentage: 65,
      lastInterviewDate: "2024-08-30",
      interviewStatus: "due",
      priority: "medium"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      email: "lisa.thompson@company.com",
      progressPercentage: 95,
      lastInterviewDate: "2024-10-10",
      interviewStatus: "completed",
      priority: "low"
    }
  ];

  const mockInterviewers = [
    {
      id: 1,
      name: "Dr. Robert Smith",
      title: "Senior Technical Lead",
      email: "robert.smith@company.com",
      availability: "Mon-Fri 9AM-5PM"
    },
    {
      id: 2,
      name: "Jennifer Davis",
      title: "HR Manager",
      email: "jennifer.davis@company.com",
      availability: "Mon-Thu 10AM-4PM"
    },
    {
      id: 3,
      name: "Mark Wilson",
      title: "Project Manager",
      email: "mark.wilson@company.com",
      availability: "Tue-Fri 9AM-6PM"
    }
  ];

  const mockInterviews = [
    {
      id: 1,
      traineeName: "Emily Rodriguez",
      interviewerName: "Dr. Robert Smith",
      scheduledDate: "2024-10-25",
      time: "10:00",
      duration: 60,
      type: "Technical Interview",
      location: "Conference Room A",
      status: "confirmed",
      notes: "Focus on React and JavaScript fundamentals"
    },
    {
      id: 2,
      traineeName: "Sarah Johnson",
      interviewerName: "Jennifer Davis",
      scheduledDate: "2024-10-26",
      time: "14:00",
      duration: 45,
      type: "Behavioral Interview",
      location: "Virtual Meeting",
      status: "pending",
      notes: "Assess communication and teamwork skills"
    },
    {
      id: 3,
      traineeName: "Michael Chen",
      interviewerName: "Mark Wilson",
      scheduledDate: "2024-10-24",
      time: "11:00",
      duration: 90,
      type: "Progress Review",
      location: "Conference Room B",
      status: "completed",
      notes: "Monthly progress assessment completed"
    }
  ];

  const mockConflicts = [
    {
      id: 1,
      type: "interviewer-busy",
      severity: "high",
      title: "Interviewer Unavailable",
      description: "Dr. Robert Smith has a conflicting meeting at this time",
      date: "2024-10-25",
      time: "15:00",
      affectedResources: ["Dr. Robert Smith"],
      alternatives: [
        { date: "2024-10-25", time: "16:00" },
        { date: "2024-10-26", time: "10:00" }
      ],
      canOverride: false
    },
    {
      id: 2,
      type: "room-booked",
      severity: "medium",
      title: "Room Already Booked",
      description: "Conference Room A is reserved for another meeting",
      date: "2024-10-26",
      time: "09:00",
      affectedResources: ["Conference Room A"],
      alternatives: [
        { date: "2024-10-26", time: "09:00", room: "Conference Room B" },
        { date: "2024-10-26", time: "10:00", room: "Conference Room A" }
      ],
      canOverride: true
    }
  ];

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    checkForConflicts(date, null);
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    checkForConflicts(date, time);
  };

  // Handle trainee selection
  const handleTraineeSelect = (traineeId) => {
    setSelectedTrainees(prev => {
      if (prev?.includes(traineeId)) {
        return prev?.filter(id => id !== traineeId);
      } else {
        return [...prev, traineeId];
      }
    });
  };

  // Handle bulk trainee selection
  const handleBulkTraineeSelect = (traineeIds) => {
    setSelectedTrainees(traineeIds);
  };

  // Check for scheduling conflicts
  const checkForConflicts = (date, time) => {
    if (!date || !time) {
      setConflicts([]);
      return;
    }

    // Simulate conflict detection
    const dateStr = date?.toDateString();
    const foundConflicts = mockConflicts?.filter(conflict => {
      const conflictDate = new Date(conflict.date);
      return conflictDate?.toDateString() === dateStr && conflict?.time === time;
    });

    setConflicts(foundConflicts);
  };

  // Handle interview scheduling
  const handleScheduleInterview = async (scheduleData) => {
    try {
      console.log('Scheduling interview:', scheduleData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show notification preview
      setShowNotificationPreview(true);
      
      // Reset form
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedTrainees([]);
      setConflicts([]);
      
      alert('Interview scheduled successfully!');
    } catch (error) {
      console.error('Scheduling error:', error);
      alert('Failed to schedule interview. Please try again.');
    }
  };

  // Handle conflict resolution
  const handleResolveConflict = (conflictId, resolution) => {
    console.log('Resolving conflict:', conflictId, resolution);
    
    if (conflictId === 'all') {
      setConflicts([]);
    } else {
      setConflicts(prev => prev?.filter(c => c?.id !== conflictId));
    }
  };

  // Handle view alternatives
  const handleViewAlternatives = (conflict) => {
    console.log('Viewing alternatives for:', conflict);
    // This would typically open a modal or navigate to alternatives view
  };

  // Handle status update
  const handleStatusUpdate = (interviewId, newStatus) => {
    console.log('Updating interview status:', interviewId, newStatus);
    // This would update the interview status in the backend
  };

  // Handle interview details view
  const handleViewInterviewDetails = (interviewId, section = null) => {
    console.log('Viewing interview details:', interviewId, section);
    // This would navigate to interview details page or open modal
  };

  // Handle interview reschedule
  const handleRescheduleInterview = (interview) => {
    console.log('Rescheduling interview:', interview);
    // This would populate the scheduling form with existing interview data
    setSelectedDate(new Date(interview.scheduledDate));
    setSelectedTime(interview?.time);
    setSelectedTrainees([interview?.traineeId]);
    setActiveView('calendar');
  };

  // Handle email notifications
  const handleSendNotifications = (emailData) => {
    console.log('Sending notifications:', emailData);
    setShowNotificationPreview(false);
    alert('Notifications sent successfully!');
  };

  // Handle template update
  const handleUpdateTemplate = (templateId) => {
    console.log('Updating template:', templateId);
    // This would open template editor
  };

  // Handle logout
  const handleLogout = () => {
    navigate('/');
  };

  const getSelectedTraineeData = () => {
    return mockTrainees?.filter(trainee => selectedTrainees?.includes(trainee?.id));
  };

  const getSelectedInterviewer = () => {
    return mockInterviewers?.[0]; // Default to first interviewer for demo
  };

  const viewTabs = [
    { id: 'calendar', label: 'Calendar View', icon: 'Calendar' },
    { id: 'tracker', label: 'Status Tracker', icon: 'List' },
    { id: 'conflicts', label: 'Conflicts', icon: 'AlertTriangle', badge: conflicts?.length }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="manager" 
        userName="Training Manager" 
        onLogout={handleLogout}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <NavigationBreadcrumb userRole="manager" className="mb-6" />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Interview Scheduling</h1>
              <p className="text-muted-foreground mt-2">
                Automate monthly interview coordination with conflict detection and notification management
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={() => console.log('Export schedule')}
              >
                Export Schedule
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setActiveView('calendar')}
              >
                New Interview
              </Button>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex items-center space-x-1 mb-6 border-b border-border">
            {viewTabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveView(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-150 ${
                  activeView === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
                {tab?.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-error text-error-foreground rounded-full">
                    {tab?.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Main Content */}
          {activeView === 'calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar and Scheduling Form */}
              <div className="lg:col-span-2 space-y-6">
                <CalendarView
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  interviews={mockInterviews}
                  onTimeSlotSelect={handleTimeSlotSelect}
                  conflicts={conflicts}
                />
                
                <SchedulingForm
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  selectedTrainees={selectedTrainees}
                  interviewers={mockInterviewers}
                  onSchedule={handleScheduleInterview}
                  onCancel={() => {
                    setSelectedDate(null);
                    setSelectedTime(null);
                    setSelectedTrainees([]);
                  }}
                  conflicts={conflicts}
                />
              </div>

              {/* Trainee Selection Panel */}
              <div className="space-y-6">
                <TraineeSelectionPanel
                  trainees={mockTrainees}
                  selectedTrainees={selectedTrainees}
                  onTraineeSelect={handleTraineeSelect}
                  onBulkSelect={handleBulkTraineeSelect}
                />
                
                {conflicts?.length > 0 && (
                  <ConflictDetection
                    conflicts={conflicts}
                    onResolveConflict={handleResolveConflict}
                    onViewAlternatives={handleViewAlternatives}
                  />
                )}
              </div>
            </div>
          )}

          {activeView === 'tracker' && (
            <InterviewStatusTracker
              interviews={mockInterviews}
              onStatusUpdate={handleStatusUpdate}
              onViewDetails={handleViewInterviewDetails}
              onReschedule={handleRescheduleInterview}
            />
          )}

          {activeView === 'conflicts' && (
            <div className="max-w-4xl">
              <ConflictDetection
                conflicts={conflicts}
                onResolveConflict={handleResolveConflict}
                onViewAlternatives={handleViewAlternatives}
              />
              
              {conflicts?.length === 0 && (
                <div className="bg-card rounded-lg border border-border p-8 text-center">
                  <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Conflicts Detected</h3>
                  <p className="text-muted-foreground">
                    All scheduled interviews are conflict-free and ready to proceed.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Email Notification Preview Modal */}
          {showNotificationPreview && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Email Notification Preview</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNotificationPreview(false)}
                    iconName="X"
                    iconSize={20}
                  >
                  </Button>
                </div>
                
                <EmailNotificationPreview
                  interviewDetails={{
                    date: selectedDate,
                    time: selectedTime,
                    interviewType: 'Technical Interview',
                    duration: 60,
                    location: 'Conference Room A',
                    meetingLink: 'https://meet.google.com/abc-defg-hij',
                    notes: 'Please prepare for technical assessment'
                  }}
                  trainees={getSelectedTraineeData()}
                  interviewer={getSelectedInterviewer()}
                  onSendNotifications={handleSendNotifications}
                  onUpdateTemplate={handleUpdateTemplate}
                  className="border-0"
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewScheduling;