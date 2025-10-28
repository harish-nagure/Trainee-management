import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssessmentDetailsModal = ({ 
  assessment, 
  trainee,
  isOpen, 
  onClose,
  onEdit,
  className = '' 
}) => {
  if (!isOpen || !assessment) return null;

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-success bg-success/10 border-success/20';
    if (percentage >= 80) return 'text-primary bg-primary/10 border-primary/20';
    if (percentage >= 70) return 'text-warning bg-warning/10 border-warning/20';
    return 'text-error bg-error/10 border-error/20';
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return 'Excellent Performance';
    if (percentage >= 80) return 'Good Performance';
    if (percentage >= 70) return 'Satisfactory Performance';
    if (percentage >= 60) return 'Needs Improvement';
    return 'Poor Performance';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      {/* Modal */}
      <div className={`relative bg-card border border-border rounded-lg elevation-3 w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Assessment Details</h2>
            <p className="text-sm text-muted-foreground">
              {trainee?.name} • {formatDate(assessment?.date)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          >
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`text-center p-6 rounded-lg border ${getGradeColor(assessment?.percentage)}`}>
              <div className="text-4xl font-bold mb-2">{getGradeLetter(assessment?.percentage)}</div>
              <div className="text-lg font-semibold mb-1">{assessment?.percentage}%</div>
              <div className="text-sm opacity-80">{getPerformanceMessage(assessment?.percentage)}</div>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{assessment?.marks}</div>
                <div className="text-sm text-muted-foreground">Marks Obtained</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{assessment?.maxMarks}</div>
                <div className="text-sm text-muted-foreground">Maximum Marks</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground capitalize">
                  {assessment?.type?.replace('_', ' ')}
                </div>
                <div className="text-sm text-muted-foreground">Assessment Type</div>
              </div>
              {assessment?.isDraft && (
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning/10 text-warning">
                    <Icon name="Edit" size={14} className="mr-1" />
                    Draft
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* General Remarks */}
          {assessment?.remarks && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                <Icon name="MessageSquare" size={20} className="mr-2" />
                General Remarks
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-foreground leading-relaxed">{assessment?.remarks}</p>
              </div>
            </div>
          )}

          {/* Detailed Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {assessment?.strengths && (
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center">
                  <Icon name="TrendingUp" size={16} className="mr-2 text-success" />
                  Strengths
                </h4>
                <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                  <p className="text-sm text-foreground">{assessment?.strengths}</p>
                </div>
              </div>
            )}
            
            {assessment?.improvements && (
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center">
                  <Icon name="Target" size={16} className="mr-2 text-warning" />
                  Areas for Improvement
                </h4>
                <div className="bg-warning/5 border border-warning/20 rounded-lg p-3">
                  <p className="text-sm text-foreground">{assessment?.improvements}</p>
                </div>
              </div>
            )}
            
            {assessment?.recommendations && (
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center">
                  <Icon name="Lightbulb" size={16} className="mr-2 text-primary" />
                  Recommendations
                </h4>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <p className="text-sm text-foreground">{assessment?.recommendations}</p>
                </div>
              </div>
            )}
          </div>

          {/* Assessment Metadata */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3">Assessment Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assessment ID:</span>
                <span className="text-foreground font-medium">{assessment?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trainee Step:</span>
                <span className="text-foreground font-medium">Step {assessment?.currentStep || trainee?.currentStep}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted:</span>
                <span className="text-foreground font-medium">
                  {assessment?.submittedAt ? new Date(assessment.submittedAt)?.toLocaleString() : 'Not submitted'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className={`font-medium ${assessment?.isDraft ? 'text-warning' : 'text-success'}`}>
                  {assessment?.isDraft ? 'Draft' : 'Submitted'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-border">
          {assessment?.isDraft && onEdit && (
            <Button
              variant="default"
              onClick={() => onEdit(assessment)}
              iconName="Edit"
              iconPosition="left"
            >
              Edit Assessment
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onClose}
            iconName="X"
            iconPosition="left"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetailsModal;