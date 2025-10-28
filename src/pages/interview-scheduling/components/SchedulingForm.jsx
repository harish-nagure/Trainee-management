import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SchedulingForm = ({ 
  selectedDate, 
  selectedTime, 
  selectedTrainees, 
  interviewers,
  onSchedule, 
  onCancel,
  conflicts = [],
  className = '' 
}) => {
  const [formData, setFormData] = useState({
    interviewer: '',
    interviewType: '',
    location: '',
    meetingLink: '',
    duration: '60',
    notes: '',
    emailTemplate: 'default'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interviewTypeOptions = [
    { value: 'technical', label: 'Technical Interview' },
    { value: 'behavioral', label: 'Behavioral Interview' },
    { value: 'progress', label: 'Progress Review' },
    { value: 'final', label: 'Final Assessment' }
  ];

  const durationOptions = [
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' }
  ];

  const emailTemplateOptions = [
    { value: 'default', label: 'Default Template' },
    { value: 'technical', label: 'Technical Interview Template' },
    { value: 'behavioral', label: 'Behavioral Interview Template' },
    { value: 'progress', label: 'Progress Review Template' }
  ];

  const interviewerOptions = interviewers?.map(interviewer => ({
    value: interviewer?.id,
    label: `${interviewer?.name} - ${interviewer?.title}`,
    description: `Available: ${interviewer?.availability}`
  }));

  useEffect(() => {
    // Reset form when selection changes
    setErrors({});
  }, [selectedDate, selectedTime, selectedTrainees]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.interviewer) {
      newErrors.interviewer = 'Please select an interviewer';
    }

    if (!formData?.interviewType) {
      newErrors.interviewType = 'Please select interview type';
    }

    if (!formData?.location && !formData?.meetingLink) {
      newErrors.location = 'Please provide either location or meeting link';
    }

    if (formData?.meetingLink && !isValidUrl(formData?.meetingLink)) {
      newErrors.meetingLink = 'Please provide a valid meeting link';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const scheduleData = {
        date: selectedDate,
        time: selectedTime,
        trainees: selectedTrainees,
        ...formData,
        duration: parseInt(formData?.duration)
      };
      
      await onSchedule(scheduleData);
    } catch (error) {
      console.error('Scheduling error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConflictWarning = () => {
    if (!selectedDate || !selectedTime) return null;
    
    const dateStr = selectedDate?.toDateString();
    const conflict = conflicts?.find(c => 
      new Date(c.date)?.toDateString() === dateStr && c?.time === selectedTime
    );
    
    if (conflict) {
      return (
        <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg mb-4">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning">Scheduling Conflict Detected</p>
              <p className="text-xs text-warning/80 mt-1">{conflict?.reason}</p>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  if (!selectedDate || !selectedTime || selectedTrainees?.length === 0) {
    return (
      <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
        <div className="text-center">
          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Schedule Interview</h3>
          <p className="text-muted-foreground">
            Select a date, time slot, and trainees to begin scheduling
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Schedule Interview</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {selectedDate?.toLocaleDateString()} at {selectedTime} • {selectedTrainees?.length} trainee{selectedTrainees?.length > 1 ? 's' : ''}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {getConflictWarning()}

        {/* Interviewer Selection */}
        <Select
          label="Select Interviewer"
          description="Choose the interviewer for this session"
          required
          options={interviewerOptions}
          value={formData?.interviewer}
          onChange={(value) => handleInputChange('interviewer', value)}
          error={errors?.interviewer}
          searchable
        />

        {/* Interview Type and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Interview Type"
            required
            options={interviewTypeOptions}
            value={formData?.interviewType}
            onChange={(value) => handleInputChange('interviewType', value)}
            error={errors?.interviewType}
          />

          <Select
            label="Duration"
            options={durationOptions}
            value={formData?.duration}
            onChange={(value) => handleInputChange('duration', value)}
          />
        </div>

        {/* Location and Meeting Link */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Location"
            type="text"
            placeholder="Conference Room A, Building 1"
            value={formData?.location}
            onChange={(e) => handleInputChange('location', e?.target?.value)}
            error={errors?.location}
            description="Physical meeting location"
          />

          <Input
            label="Meeting Link"
            type="url"
            placeholder="https://meet.google.com/abc-defg-hij"
            value={formData?.meetingLink}
            onChange={(e) => handleInputChange('meetingLink', e?.target?.value)}
            error={errors?.meetingLink}
            description="Virtual meeting link"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Interview Notes
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Additional notes or preparation instructions..."
            value={formData?.notes}
            onChange={(e) => handleInputChange('notes', e?.target?.value)}
          />
        </div>

        {/* Email Template */}
        <Select
          label="Email Template"
          description="Template for interview notification emails"
          options={emailTemplateOptions}
          value={formData?.emailTemplate}
          onChange={(value) => handleInputChange('emailTemplate', value)}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="default"
            loading={isSubmitting}
            iconName="Calendar"
            iconPosition="left"
          >
            {selectedTrainees?.length > 1 ? 'Schedule Interviews' : 'Schedule Interview'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SchedulingForm;