 import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/ui/Header";
import NavigationBreadcrumb from "../../../components/ui/NavigationBreadcrumb";
import Icon from "../../../components/ui/../AppIcon";
import axios from "axios";
import {submitAssessment} from "../../../api_service";

function TraineeTestPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const traineeId = sessionStorage.getItem("empid");
  const trainerIds = JSON.parse(sessionStorage.getItem("trainerIds") || "[]");

  // ✅ add this helper
const forceSubmitAndExit = () => {
  if (!submitted) {
    setTimeUp(true);
    handleSubmit();
    navigate("/trainee-assessment-list");
  }
};
  // Handle answer change
  const handleAnswer = (questionId, value) => {
    if (timeUp || submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Fetch assessment
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/assessment/test/${assessmentId}`
        );
        setAssessment(res.data);
        setTimeLeft(res.data.time * 60);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAssessment();
  }, [assessmentId]);

  // Timer
  // useEffect(() => {
  //   if (timeLeft <= 0 && assessment && !submitted) {
  //     setTimeUp(true);
  //     handleSubmit();
  //     return;
  //   }
  //   const timer = setInterval(() => {
  //     setTimeLeft((prev) => prev - 1);
  //   }, 1000);
  //   return () => clearInterval(timer);
  // }, [timeLeft, assessment, submitted]);

  useEffect(() => {
  if (timeLeft <= 0 && assessment && !submitted) {
    setTimeUp(true);
    handleSubmit();
    return;
  }

  const timer = setInterval(() => {
    setTimeLeft((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [timeLeft, assessment, submitted]);

  // Tab switch / Blur / Right click / Refresh prevention
  // useEffect(() => {
  //   const handleVisibility = () => {
  //     if (document.hidden && !submitted) {
  //       alert("Tab switch detected! Test will be auto submitted.");
  //       setTimeUp(true);
  //       handleSubmit();
  //     }
  //   };
  //   const handleBlur = () => {
  //     if (!submitted) {
  //       alert("You moved away from exam window. Test will be submitted.");
  //       setTimeUp(true);
  //       handleSubmit();
  //     }
  //   };
  //   const preventRightClick = (e) => e.preventDefault();
  //   const handleBeforeUnload = (e) => {
  //     e.preventDefault();
  //     e.returnValue = "";
  //   };
  //   const preventCopyPaste = (e) => e.preventDefault();

  //   document.addEventListener("visibilitychange", handleVisibility);
  //   window.addEventListener("blur", handleBlur);
  //   document.addEventListener("contextmenu", preventRightClick);
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   document.addEventListener("copy", preventCopyPaste);
  //   //document.addEventListener("paste", preventCopyPaste);
  //   document.addEventListener("cut", preventCopyPaste);

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibility);
  //     window.removeEventListener("blur", handleBlur);
  //     document.removeEventListener("contextmenu", preventRightClick);
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     document.removeEventListener("copy", preventCopyPaste);
  //    // document.removeEventListener("paste", preventCopyPaste);
  //     document.removeEventListener("cut", preventCopyPaste);
  //   };
  // }, [submitted]);

  useEffect(() => {

  const handleVisibility = () => {
    if (document.hidden && !submitted) {
      alert("Tab switch detected! Test submitted.");
      forceSubmitAndExit();
    }
  };

  const handleBlur = () => {
    if (!submitted) {
      alert("You left the exam. Test submitted.");
      forceSubmitAndExit();
    }
  };

  const preventRightClick = (e) => e.preventDefault();

  const handleBeforeUnload = (e) => {
    if (!submitted) {
      handleSubmit(); // ✅ auto submit on refresh
      e.preventDefault();
      e.returnValue = "";
    }
  };

  const preventCopyPaste = (e) => e.preventDefault();

  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("blur", handleBlur);
  document.addEventListener("contextmenu", preventRightClick);
  window.addEventListener("beforeunload", handleBeforeUnload);
  document.addEventListener("copy", preventCopyPaste);
  document.addEventListener("cut", preventCopyPaste);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("blur", handleBlur);
    document.removeEventListener("contextmenu", preventRightClick);
    window.removeEventListener("beforeunload", handleBeforeUnload);
    document.removeEventListener("copy", preventCopyPaste);
    document.removeEventListener("cut", preventCopyPaste);
  };

}, [submitted]); 

  // Submit assessment
//   const handleSubmit = async () => {
//     if (submitted) return;
//     setSubmitted(true);

//     try {
//       // Auto-evaluate coding answers before sending
//       const evaluatedAnswers = { ...answers };
//       assessment.questions.forEach((q) => {
//         if (q.type === "CODING" && q.testCases) {
//           let allPass = true;
//           q.testCases.forEach((tc) => {
//             const userOutput = evaluatedAnswers[q.id] || "";
//             if (userOutput.trim() !== tc.output.trim()) {
//               allPass = false;
//             }
//           });
//           evaluatedAnswers[q.id] = {
//             code: evaluatedAnswers[q.id] || "",
//             passed: allPass,
//           };
//         }
//       });

//      await axios.post(
// `http://localhost:8080/api/assessment/submit/${assessmentId}`,
// {
// traineeId,
// trainerIds,
// answers
// }
// );

//       alert("Test Submitted Successfully!");
//       navigate("/trainee-assessment-list");
//     } catch (err) {
//       console.log(err);
//     }
//   };

// const handleSubmit = async () => {
//   if (submitted) return;

//   setSubmitted(true);

//   // ✅ store submitted in session
//   sessionStorage.setItem(`submitted_${assessmentId}`, "true");

//   try {
//     await axios.post(
//       `http://localhost:8080/api/assessment/submit/${assessmentId}`,
//       {
//         traineeId,
//         trainerIds,
//         answers
//       }
//     );

//     alert("Test Submitted Successfully!");
//     navigate("/trainee-assessment-list");

//   } catch (err) {
//     console.log(err);
//   }
// };


const handleSubmit = async () => {
  if (submitted) return;

  setSubmitted(true);

  // store submitted in session
  sessionStorage.setItem(`submitted_${assessmentId}`, "true");

  try {
    await submitAssessment(assessmentId, {
      traineeId,
      trainerIds,
      answers
    });

    alert("Test Submitted Successfully!");
    navigate("/trainee-assessment-list");

  } catch (err) {
    console.log(err);

    // agar error aaye toh submitted wapas false kar do
    setSubmitted(false);
    sessionStorage.removeItem(`submitted_${assessmentId}`);
  }
};

useEffect(() => {
  window.history.pushState(null, "", window.location.href);

  const handlePopState = () => {
    alert("You cannot go back during test!");
    window.history.pushState(null, "", window.location.href);
  };

  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, []);

useEffect(() => {
  if (submitted) {
    document.body.style.pointerEvents = "none";
    document.body.style.userSelect = "none";
  }
}, [submitted]);

useEffect(() => {
  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  };

  enterFullScreen();

  const handleFullScreenChange = () => {
    if (!document.fullscreenElement && !submitted) {
      alert("Exited fullscreen! Test submitted.");
      forceSubmitAndExit();
    }
  };

  document.addEventListener("fullscreenchange", handleFullScreenChange);

  return () => {
    document.removeEventListener("fullscreenchange", handleFullScreenChange);
  };
}, []);

useEffect(() => {
  const handleKeyDown = (e) => {

    // ALT + TAB, CTRL + T, CTRL + W etc
    if (
      e.altKey ||
      (e.ctrlKey && ["t", "w", "r", "c", "v"].includes(e.key.toLowerCase())) ||
      e.key === "F12"
    ) {
      e.preventDefault();
      alert("Restricted action! Test submitted.");
      forceSubmitAndExit();
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [submitted]);

useEffect(() => {
  const alreadySubmitted = sessionStorage.getItem(`submitted_${assessmentId}`);

  if (alreadySubmitted === "true") {
    alert("You already submitted this test!");
    navigate("/trainee-assessment-list");
  }
}, []);

  const handleLogout = () => navigate("/");

  if (!assessment) return <p className="p-10">Loading...</p>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-blue-50">
      <Header
        userName={sessionStorage.getItem("userName") || "Trainee"}
        userRole="trainee"
        onLogout={handleLogout}
      />

      <main className="pt-20 max-w-6xl mx-auto px-4">
        <NavigationBreadcrumb userRole="trainee" />

        <div className="mt-10 bg-white shadow-xl rounded-2xl border border-blue-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
              <Icon name="ClipboardList" size={28} />
              {assessment.title}
            </h2>
            <div className="text-red-600 font-bold text-xl">
              Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </div>
          </div>

          {timeUp && (
            <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6 text-center">
              Time is over. Test submitted automatically.
            </div>
          )}

          {assessment.questions.map((q, i) => (
            <div
              key={q.id}
              className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100"
            >
              <h4 className="font-semibold text-lg mb-4">
                {i + 1}. {q.question}
              </h4>
{q.type === "MCQ" &&
q.options.map((opt, index) => (
<label key={index} className="block mb-2">
<input
type="radio"
name={q.id}
className="mr-2"
disabled={timeUp || submitted}
onChange={() => handleAnswer(q.id, index)}
/>
{opt}
</label>
))}
              {q.type === "TEXT" && (
                <input
                  type="text"
                  placeholder="Enter your answer"
                  disabled={timeUp || submitted}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              )}

              {q.type === "CODING" && (
                <div>
                  {q.testCases && q.testCases.length > 0 && (
                    <div className="mb-4 bg-gray-100 p-4 rounded-lg">
                      <h5 className="font-semibold mb-2">Sample Test Cases</h5>
                      {q.testCases.map((tc, index) => (
                        <div
                          key={index}
                          className="text-sm bg-white border rounded p-2 mb-2"
                        >
                          <p>
                            <b>Input :</b> {tc.input}
                          </p>
                          <p>
                            <b>Output :</b> {tc.output}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <textarea
                    placeholder="Write your code here..."
                    disabled={timeUp || submitted}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    className="w-full h-40 border border-gray-300 rounded-lg p-3 font-mono"
                  />
                </div>
              )}
            </div>
          ))}

          <div className="text-center mt-6">
            <button
              onClick={handleSubmit}
              disabled={timeUp || submitted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              Submit Test
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TraineeTestPage;