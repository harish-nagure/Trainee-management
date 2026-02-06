// import React, { useState } from 'react';
// import Icon from '../../../components/AppIcon';
// import Button from '../../../components/ui/Button';
// import Input from '../../../components/ui/Input';
// import Select from '../../../components/ui/Select';

// const TraineeSelector = ({ 
//   selectedTrainee, 
//   onTraineeSelect, 
//   trainees = [],
//   className = '' 
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStep, setFilterStep] = useState('');

//   const stepOptions = [
//     { value: '', label: 'All Steps' },
//     { value: '1', label: 'Step 1: Foundation' },
//     { value: '2', label: 'Step 2: Intermediate' },
//     { value: '3', label: 'Step 3: Advanced' },
//     { value: '4', label: 'Step 4: Specialization' },
//     { value: '5', label: 'Step 5: Final Assessment' }
//   ];

//   const filteredTrainees = trainees?.filter(trainee => {
//     const matchesSearch = trainee?.username?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
//                          trainee?.empid?.toLowerCase()?.includes(searchTerm?.toLowerCase());
//     const matchesStep = !filterStep || trainee?.currentStep?.toString() === filterStep;
//     return matchesSearch && matchesStep;
//   });

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'active': return 'text-success bg-success/10';
//       case 'pending': return 'text-warning bg-warning/10';
//       case 'completed': return 'text-primary bg-primary/10';
//       default: return 'text-muted-foreground bg-muted';
//     }
//   };

//   const getProgressPercentage = (currentStep, totalSteps = 5) => {
//     return Math.round((currentStep / totalSteps) * 100);
//   };

//   return (
//     <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-lg font-semibold text-foreground">Select Trainee</h2>
//           <p className="text-sm text-muted-foreground">Choose a trainee to assess</p>
//         </div>
//         <div className="flex items-center space-x-2 text-sm text-muted-foreground">
//           <Icon name="Users" size={16} />
//           <span>{filteredTrainees?.length} trainees</span>
//         </div>
//       </div>
//       {/* Search and Filter Controls */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <Input
//           type="search"
//           placeholder="Search by name or employee ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e?.target?.value)}
//           className="w-full"
//         />
//         <Select
//           options={stepOptions}
//           value={filterStep}
//           onChange={setFilterStep}
//           placeholder="Filter by current step"
//         />
//       </div>
//       {/* Trainees List */}
//       <div className="space-y-3 max-h-96 overflow-y-auto">
//         {filteredTrainees?.length === 0 ? (
//           <div className="text-center py-8">
//             <Icon name="UserX" size={48} className="text-muted-foreground mx-auto mb-3" />
//             <p className="text-muted-foreground">No trainees found matching your criteria</p>
//           </div>
//         ) : (
//           filteredTrainees?.map((trainee) => (
//             <div
//               key={trainee?.empid}
//               className={`border border-border rounded-lg p-4 cursor-pointer transition-all duration-150 hover:elevation-1 ${
//                 selectedTrainee?.empid === trainee?.empid
//                   ? 'border-primary bg-primary/5' :'hover:border-primary/50'
//               }`}
//               onClick={() => onTraineeSelect(trainee)}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
//                     <Icon name="User" size={20} className="text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-foreground">{trainee?.username}</h3>
//                     <p className="text-sm text-muted-foreground">ID: {trainee?.empid}</p>
//                     <div className="flex items-center space-x-2 mt-1">
//                       <span className="text-xs text-muted-foreground">Step {trainee?.currentStep || 0}/5</span>
//                       <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
//                         <div 
//                           className="h-full bg-primary transition-all duration-300"
//                           style={{ width: `${getProgressPercentage(trainee?.currentStep || 0)}%` }}
//                         />
//                       </div>
//                       <span className="text-xs text-muted-foreground">
//                         {getProgressPercentage(trainee?.currentStep || 0)}%
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trainee?.status || 'active')}`}>
//                     {trainee?.status}
//                   </span>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     Last assessment: {trainee?.lastAssessment || 'N/A'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//       {/* Selected Trainee Summary */}
//       {selectedTrainee && (
//         <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <h4 className="font-medium text-foreground">Selected: {selectedTrainee?.name}</h4>
//               <p className="text-sm text-muted-foreground">
//                 Current Step: {selectedTrainee?.currentStep} | Status: {selectedTrainee?.status}
//               </p>
//             </div>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => onTraineeSelect(null)}
//               iconName="X"
//               iconSize={16}
//             >
//               Clear
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TraineeSelector;

// import React, { useState } from 'react';
// import Icon from '../../../components/AppIcon';
// import Button from '../../../components/ui/Button';
// import Input from '../../../components/ui/Input';

// const TraineeSelector = ({
//   selectedTrainee,
//   onTraineeSelect,
//   trainees = [],
//   className = ''
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredTrainees = trainees.filter(t => {
//     const search = searchTerm.toLowerCase();
//     return (
//       t?.name?.toLowerCase().includes(search) ||
//       t?.traineeId?.toLowerCase().includes(search) ||
//       t?.trngid?.toLowerCase().includes(search)
//     );
//   });

//   const getSubtopicInfo = (trainee) => {
//     // Defensive check for nested data
//     const syllabus = trainee?.syllabusProgress || [];
//     const allSubTopics = syllabus.flatMap(sp => sp.subTopics || []);

//     if (allSubTopics.length === 0) return 'No Progress';

//     // Find the subtopic with the highest stepNumber
//     const lastSubTopic = allSubTopics.reduce((prev, current) =>
//       (prev.stepNumber > current.stepNumber) ? prev : current
//       , allSubTopics[0]);

//     return lastSubTopic ? lastSubTopic.name : 'Started';
//   };

//   return (
//     <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-lg font-semibold text-foreground">Select Trainee</h2>
//           <p className="text-sm text-muted-foreground">Choose a trainee to assess</p>
//         </div>
//         <div className="flex items-center space-x-2 text-sm text-muted-foreground">
//           <Icon name="Users" size={16} />
//           <span>{filteredTrainees.length} trainees</span>
//         </div>
//       </div>

//       {/* Search */}
//       <Input
//         type="search"
//         placeholder="Search by name or ID..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="mb-6"
//       />

//       {/* Trainee List */}
//       <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
//         {filteredTrainees.length === 0 ? (
//           <div className="text-center py-8">
//             <Icon name="UserX" size={48} className="text-muted-foreground mx-auto mb-3" />
//             <p className="text-muted-foreground">No trainees found</p>
//           </div>
//         ) : (
//           filteredTrainees.map(trainee => {
//             // Standardize ID check: matching AssessmentEntry's use of trngid
//             const traineeId = trainee.trngid || trainee.traineeId;
//             const isSelected = selectedTrainee?.trngid === traineeId || selectedTrainee?.traineeId === traineeId;

//             return (
//               <div
//                 key={traineeId}
//                 onClick={() => onTraineeSelect(trainee)}
//                 className={`border rounded-lg p-4 cursor-pointer transition-all duration-200
//                   ${isSelected
//                     ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
//                     : 'border-border hover:border-primary/50 hover:bg-muted/30'
//                   }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
//                       <Icon name="User" size={20} />
//                     </div>

//                     <div>
//                       <h3 className={`font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
//                         {trainee.name}
//                       </h3>
//                       <p className="text-xs text-muted-foreground">
//                         ID: {traineeId}
//                       </p>

//                       {/* Progress Bar Area */}
//                       <div className="flex items-center space-x-2 mt-2">
//                         <span className="text-[10px] font-bold uppercase text-muted-foreground truncate max-w-[100px]">
//                           {getSubtopicInfo(trainee)}
//                         </span>
//                         <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
//                           <div
//                             className="h-full bg-primary transition-all duration-500"
//                             style={{ width: `${trainee.completionPercentage || 0}%` }}
//                           />
//                         </div>
//                         <span className="text-xs font-semibold">
//                           {Math.round(trainee.completionPercentage || 0)}%
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="text-right">
//                     <p className="text-[10px] uppercase font-bold text-muted-foreground">Last Assessment</p>
//                     <p className="text-xs font-medium">
//                       {trainee.lastAssessmentDate || 'Never'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Selected Trainee Active Footer */}
//       {selectedTrainee && (
//         <div className="mt-6 p-4 bg-primary text-white rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Icon name="CheckCircle" size={18} />
//               <div>
//                 <h4 className="text-sm font-bold">Currently Assessing</h4>
//                 <p className="text-xs opacity-90">{selectedTrainee.name}</p>
//               </div>
//             </div>
//             <Button
//               variant="secondary"
//               size="sm"
//               className="h-8 text-xs font-bold"
//               onClick={() => onTraineeSelect(null)}
//             >
//               Change
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TraineeSelector;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TraineeSelector = ({
  selectedTrainee,
  onTraineeSelect,
  trainees = [],
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrainees = trainees.filter(t => {
    const search = searchTerm.toLowerCase();
    return (
      t?.name?.toLowerCase().includes(search) ||
      t?.traineeId?.toLowerCase().includes(search)
    );
  });

  const getSubtopicInfo = (trainee, options = { type: 'last' }) => {
    const allSubTopics = trainee.syllabusProgress.flatMap(sp => sp.subTopics || []);
    if (!allSubTopics.length) return 'N/A';

    if (options.type === 'all') {
      // Return array of subtopic names
      return allSubTopics.map(st => st.name).join(', ');
    }
    // Default: last subtopic
    const lastSubTopic = allSubTopics.reduce((prev, current) =>
      prev.stepNumber > current.stepNumber ? prev : current
    );
    return lastSubTopic ? `Step  ${lastSubTopic.name}` : 'N/A';
    //  return lastSubTopic ? `Step ${lastSubTopic.stepNumber}: ${lastSubTopic.name}` : 'N/A';
  };


  const getInterviewStatusColor = (status) =>
    status ? 'text-success bg-success/10' : 'text-warning bg-warning/10';

  const extractStepNumber = (step) => {
    if (!step) return 0;
    const match = step.match(/\d+/);
    return match ? Number(match[0]) : 0;
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Select Trainee</h2>
          <p className="text-sm text-muted-foreground">Choose a trainee to assess</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Users" size={16} />
          <span>{filteredTrainees.length} trainees</span>
        </div>
      </div>

      {/* Search */}
      <Input
        type="search"
        placeholder="Search by name or trainee ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />

      {/* Trainee List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTrainees.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="UserX" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No trainees found</p>
          </div>
        ) : (
          filteredTrainees.map(trainee => {
            const stepNumber = extractStepNumber(trainee.currentStep);

            return (
              <div
                key={trainee.trngid || trainee.traineeId}
                onClick={() => onTraineeSelect(trainee)}
                className={`border rounded-lg p-4 cursor-pointer transition-all
                  ${selectedTrainee?.trngid === trainee?.trngid
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                  }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>

                    <div>
                      <h3 className="font-medium text-foreground">{trainee.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {trainee.traineeId}
                      </p>

                      {/* Progress */}
                      <div className="flex items-center space-x-2 mt-1">
                        {/* <span className="text-xs text-muted-foreground">
                          {trainee.currentStep}
                        </span> */}
                        <span className="text-xs text-muted-foreground">
                          {getSubtopicInfo(trainee)}
                        </span>

                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${trainee.completionPercentage || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {trainee.completionPercentage || 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="text-right">
                    {/* <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium
                      ${getInterviewStatusColor(trainee.interviewStatus)}`}
                    >
                      {trainee.interviewStatus ? 'Interview Done' : 'Interview Pending'}
                    </span> */}
                    <p className="text-xs text-muted-foreground mt-1">
                      Last Assessment: {trainee.lastAssessmentDate || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selected Trainee */}
      {selectedTrainee && (
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">
                Selected: {selectedTrainee.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {selectedTrainee.currentStep} • {selectedTrainee.completionPercentage}%
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => onTraineeSelect(null)}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraineeSelector;
