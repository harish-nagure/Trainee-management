import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ContentDisplay = ({ 
  currentStep, 
  traineeInfo,
  onStepComplete,
  onNextStep,
  onPreviousStep,
  canGoNext,
  canGoPrevious 
}) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Timer for tracking time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const handleCompleteStep = () => {
    if (currentStep?.requiresValidation) {
      setShowCompletionModal(true);
    } else {
      onStepComplete(currentStep?.id);
    }
  };

  const confirmCompletion = () => {
    setShowCompletionModal(false);
    onStepComplete(currentStep?.id);
  };

  const renderContent = () => {
    if (!currentStep?.content) return null;

    return currentStep?.content?.map((item, index) => {
      switch (item?.type) {
        case 'text':
          return (
            <div key={index} className="prose prose-sm max-w-none mb-6">
              <div 
                className="text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item?.data }}
              />
            </div>
          );
        
        case 'image':
          return (
            <div key={index} className="mb-6">
              <div className="relative overflow-hidden rounded-lg border border-border">
                <Image
                  src={item?.data?.url}
                  alt={item?.data?.alt}
                  className="w-full h-auto object-cover"
                />
                {item?.data?.caption && (
                  <div className="p-3 bg-muted border-t border-border">
                    <p className="text-sm text-muted-foreground text-center">
                      {item?.data?.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        
        case 'video':
          return (
            <div key={index} className="mb-6">
              <div className="relative overflow-hidden rounded-lg border border-border bg-black">
                <video
                  controls
                  className="w-full h-auto"
                  poster={item?.data?.poster}
                  onContextMenu={(e) => e?.preventDefault()}
                  controlsList="nodownload"
                >
                  <source src={item?.data?.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {item?.data?.caption && (
                  <div className="p-3 bg-muted border-t border-border">
                    <p className="text-sm text-muted-foreground text-center">
                      {item?.data?.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        
        case 'interactive':
          return (
            <div key={index} className="mb-6">
              <div className="p-6 bg-muted rounded-lg border border-border">
                <h4 className="text-lg font-semibold text-foreground mb-4">
                  {item?.data?.title}
                </h4>
                <p className="text-muted-foreground mb-4">
                  {item?.data?.description}
                </p>
                <Button
                  variant="outline"
                  iconName="ExternalLink"
                  iconPosition="right"
                  onClick={() => window.open(item?.data?.url, '_blank')}
                >
                  Launch Interactive Content
                </Button>
              </div>
            </div>
          );
        
        default:
          return null;
      }
    });
  };

  if (!currentStep) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Icon name="BookOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Content Selected</h3>
          <p className="text-muted-foreground">Select a step from the sidebar to begin learning.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Content Header */}
      <div className="flex-shrink-0 bg-surface border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Step {currentStep?.stepNumber}: {currentStep?.title}
            </h1>
            <p className="text-muted-foreground">
              {currentStep?.description}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} />
              <span>Time: {formatTime(timeSpent)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Target" size={16} />
              <span>Est: {currentStep?.estimatedTime}</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step Progress</span>
            <span>{currentStep?.progress || 0}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${currentStep?.progress || 0}%` }}
            />
          </div>
        </div>
      </div>
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </div>
      {/* Content Footer */}
      <div className="flex-shrink-0 bg-surface border-t border-border p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onPreviousStep}
            disabled={!canGoPrevious}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Previous Step
          </Button>
          
          <div className="flex items-center space-x-3">
            {!currentStep?.isCompleted && (
              <Button
                variant="success"
                onClick={handleCompleteStep}
                iconName="CheckCircle"
                iconPosition="left"
              >
                Mark as Complete
              </Button>
            )}
            
            <Button
              variant="default"
              onClick={onNextStep}
              disabled={!canGoNext}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Next Step
            </Button>
          </div>
        </div>
      </div>
      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg elevation-3 max-w-md mx-4">
            <div className="text-center">
              <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Complete This Step?
              </h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you have finished reviewing all the content in this step? 
                This action will unlock the next step in your learning path.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1"
                >
                  Review More
                </Button>
                <Button
                  variant="success"
                  onClick={confirmCompletion}
                  className="flex-1"
                >
                  Complete Step
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDisplay;