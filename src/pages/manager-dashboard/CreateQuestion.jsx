
import React, { useState, useEffect } from "react";

import {
createAssessmentforTest,
getAllAssessmentsforTest,
updateAssessmentforTest,
deleteAssessmentApiforTest,
fetchAllDepartments
} from "../../api_service";

import Header from "../../components/ui/Header";
import { useNavigate } from "react-router-dom";

function CreateQuestion() {

const navigate = useNavigate();

const [departments,setDepartments] = useState([]);
const [title,setTitle] = useState("");
const [time,setTime] = useState("");
const [department,setDepartment] = useState([]);
const [isDeptDropdownOpen,setIsDeptDropdownOpen] = useState(false);

const [uploadedAssessments,setUploadedAssessments] = useState([]);
const [editIndex,setEditIndex] = useState(null);
const [previewAssessment,setPreviewAssessment] = useState(null);
const [errors, setErrors] = useState({});

const [questions,setQuestions] = useState([
{
question:"",
type:"MCQ",
options:["","","",""],
correctAnswer:"",
testCases:[{input:"",output:""}]
}
]);

/* ---------------- FETCH DATA ---------------- */

useEffect(()=>{

const fetchDepartments = async()=>{
try{
const res = await fetchAllDepartments();
console.log("Response",res);
setDepartments(res);
}catch(err){
console.log(err);
}
};

const fetchAssessments = async()=>{
try{
const res = await getAllAssessmentsforTest();
setUploadedAssessments(res);
}catch(err){
console.log(err);
}
};

fetchDepartments();
fetchAssessments();

},[]);

/* ---------------- HANDLERS ---------------- */

const handleQuestionChange=(value,index)=>{
const updated=[...questions];
updated[index].question=value;
setQuestions(updated);
};

const handleTypeChange=(value,index)=>{
const updated=[...questions];

updated[index].type=value;

if(value==="MCQ"){
updated[index].options=["","","",""];
updated[index].correctAnswer="";
}

if(value==="TEXT"){
updated[index].correctAnswer="";
updated[index].options=[];
updated[index].testCases=[];
}

if(value==="CODING"){
updated[index].testCases=[{input:"",output:""}];
updated[index].correctAnswer="";
updated[index].options=[];
}

setQuestions(updated);
};

const handleOptionChange=(value,qIndex,optIndex)=>{
const updated=[...questions];
updated[qIndex].options[optIndex]=value;
setQuestions(updated);
};

const handleCorrectAnswer=(value,index)=>{
const updated=[...questions];
updated[index].correctAnswer=value;
setQuestions(updated);
};

const addQuestion=()=>{
setQuestions([
...questions,
{
question:"",
type:"MCQ",
options:["","","",""],
correctAnswer:"",
testCases:[{input:"",output:""}]
}
]);
};

const removeQuestion=(index)=>{
const updated=[...questions];
updated.splice(index,1);
setQuestions(updated);
};

/* ---------------- TEST CASE ---------------- */

const addTestCase=(qIndex)=>{
const updated=[...questions];
updated[qIndex].testCases.push({input:"",output:""});
setQuestions(updated);
};

const handleTestCaseChange=(value,qIndex,tcIndex,field)=>{
const updated=[...questions];
updated[qIndex].testCases[tcIndex][field]=value;
setQuestions(updated);
};

/* ---------------- VALIDATION ---------------- */

const validateForm = () => {
let newErrors = {};

if (department.length === 0) newErrors.department = "Select at least one department";
if (!title.trim()) newErrors.title = "Title is required";
if (!time || time <= 0) newErrors.time = "Enter valid time";

questions.forEach((q, i) => {

if (!q.question.trim()) newErrors[`question_${i}`] = "Question required";

if (q.type === "MCQ") {
q.options.forEach((opt, j) => {
if (!opt.trim()) newErrors[`option_${i}_${j}`] = "Option required";
});
if (q.correctAnswer === "") newErrors[`correct_${i}`] = "Select correct answer";
}

if (q.type === "TEXT") {
if (!q.correctAnswer.trim()) newErrors[`text_${i}`] = "Answer required";
}

if (q.type === "CODING") {
q.testCases.forEach((tc, j) => {
if (!tc.input.trim()) newErrors[`input_${i}_${j}`] = "Input required";
if (!tc.output.trim()) newErrors[`output_${i}_${j}`] = "Output required";
});
}

});

setErrors(newErrors);
return Object.keys(newErrors).length === 0;
};

/* ---------------- SAVE ---------------- */

const saveQuestions = async () => {

if (!validateForm()) return;

const data = {
departmentIds: department,
title,
time,
questions
};

try{

if(editIndex !== null){
await updateAssessmentforTest(uploadedAssessments[editIndex].id,data);
}else{
await createAssessmentforTest(data);
}

alert("Assessment Saved Successfully");

const res = await getAllAssessmentsforTest();
setUploadedAssessments(res);

}catch(err){
console.log(err);
alert("Error saving assessment");
}

};

/* ---------------- DELETE ---------------- */

const deleteAssessment = async (index) => {

if(!window.confirm("Delete this assessment?")) return;

try{
const id = uploadedAssessments[index].id;
await deleteAssessmentApiforTest(id);

const res = await getAllAssessmentsforTest();
setUploadedAssessments(res);

}catch(err){
console.log(err);
}

};

/* ---------------- EDIT ---------------- */

const editAssessment=(assessment,index)=>{
setTitle(assessment.title);
setTime(assessment.time);
setDepartment(assessment.departmentIds);
setQuestions(assessment.questions);
setEditIndex(index);
};

/* ---------------- PREVIEW ---------------- */

const preview=(assessment)=>{
setPreviewAssessment(assessment);
};

/* ---------------- UI ---------------- */

return(

<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">

<Header
userName={sessionStorage.getItem("userName") || "User"}
userRole="manager"
/>

<div className="pt-24 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

{/* LEFT PANEL */}

<div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6">

<h2 className="text-2xl font-bold text-gray-800">Create Assessment</h2>

{/* DEPARTMENT */}

<div className="mt-6 relative">
<label className="text-gray-600">Department</label>

<div
onClick={()=>setIsDeptDropdownOpen(!isDeptDropdownOpen)}
className="mt-2 border rounded-xl px-4 py-3 flex justify-between cursor-pointer hover:border-blue-400"
>
<span>{department.length>0 ? `${department.length} selected` : "Select Department"}</span>
<span>▼</span>
</div>

{isDeptDropdownOpen &&(
<div className="absolute w-full bg-white border rounded-xl mt-2 shadow max-h-52 overflow-y-auto">

{departments.map((dept)=>(
<label key={dept.id} className="flex gap-2 p-2 hover:bg-blue-50">
<input
type="checkbox"
checked={department.includes(dept.id)}
onChange={(e)=>{
if(e.target.checked){
setDepartment([...department,dept.id])
}else{
setDepartment(department.filter(id=>id!==dept.id))
}
}}
/>
{dept.name}
</label>
))}

</div>
)}

</div>

{/* TITLE */}

<input
placeholder="Assessment Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
className="w-full mt-6 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
/>

{/* TIME */}

<input
type="number"
placeholder="Time (minutes)"
value={time}
onChange={(e)=>setTime(e.target.value)}
className="w-full mt-4 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
/>

{/* QUESTIONS */}

{questions.map((q,index)=>(

<div key={index} className="mt-6 bg-blue-50 p-5 rounded-2xl">

<input
value={q.question}
onChange={(e)=>handleQuestionChange(e.target.value,index)}
placeholder={`Question ${index+1}`}
className="w-full p-2 border rounded"
/>

<select
value={q.type}
onChange={(e)=>handleTypeChange(e.target.value,index)}
className="mt-3 p-2 border rounded"
>
<option value="MCQ">MCQ</option>
<option value="TEXT">Text</option>
<option value="CODING">Coding</option>
</select>

{q.type==="MCQ" && q.options.map((opt,i)=>(
<div key={i} className="flex gap-2 mt-2">
<input type="radio" checked={q.correctAnswer===String(i)}
onChange={()=>handleCorrectAnswer(String(i),index)}
/>
<input value={opt}
onChange={(e)=>handleOptionChange(e.target.value,index,i)}
className="flex-1 p-2 border rounded"
/>
</div>
))}

{q.type==="TEXT" &&(
<input
value={q.correctAnswer}
onChange={(e)=>handleCorrectAnswer(e.target.value,index)}
placeholder="Correct Answer"
className="w-full mt-2 p-2 border rounded"
/>
)}

{q.type==="CODING" &&(
<div>
{q.testCases.map((tc,tcIndex)=>(
<div key={tcIndex} className="mt-2">
<textarea
value={tc.input}
onChange={(e)=>handleTestCaseChange(e.target.value,index,tcIndex,"input")}
className="w-full p-2 border rounded"
/>
<textarea
value={tc.output}
onChange={(e)=>handleTestCaseChange(e.target.value,index,tcIndex,"output")}
className="w-full p-2 border rounded mt-1"
/>
</div>
))}
<button onClick={()=>addTestCase(index)} className="mt-2 text-blue-600">
+ Add Test Case
</button>
</div>
)}

<button onClick={()=>removeQuestion(index)} className="mt-3 text-red-500">
Remove Question
</button>

</div>

))}

<div className="mt-6 flex gap-3">
<button onClick={addQuestion} className="bg-blue-500 text-white px-4 py-2 rounded-xl">
+ Add Question
</button>

<button onClick={saveQuestions} className="bg-green-500 text-white px-4 py-2 rounded-xl">
Save
</button>
</div>

</div>

{/* RIGHT PANEL */}

<div className="bg-white rounded-3xl shadow-lg p-5">

<h3 className="font-semibold mb-4">Uploaded</h3>

{uploadedAssessments.map((a,index)=>(
<div key={index} className="border p-3 rounded-xl mb-3">

<strong>{a.title}</strong>

<p className="text-sm">Time: {a.time}</p>

<div className="flex gap-2 mt-2">
<button onClick={()=>preview(a)} className="text-blue-600">Preview</button>
<button onClick={()=>editAssessment(a,index)} className="text-green-600">Edit</button>
<button onClick={()=>deleteAssessment(index)} className="text-red-500">Delete</button>
</div>

</div>
))}

</div>

</div>

{/* PREVIEW */}

{previewAssessment &&(
<div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

<div className="bg-white p-6 rounded-xl w-[600px] max-h-[80vh] overflow-y-auto">

<h2>{previewAssessment.title}</h2>
<p>Time: {previewAssessment.time}</p>

{previewAssessment.questions.map((q,i)=>(
<div key={i} className="mt-3">
<b>Q{i+1}. {q.question}</b>
</div>
))}

<button onClick={()=>setPreviewAssessment(null)} className="mt-4 bg-gray-200 px-4 py-2 rounded">
Close
</button>

</div>

</div>
)}

</div>
);

}

export default CreateQuestion;