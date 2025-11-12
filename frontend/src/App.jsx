import { useEffect, useState } from "react";
import { fetchHealth, generateQuiz } from "./api";
import QuizSetupForm from "./components/QuizSetupForm";
import QuizRunner from "./components/QuizRunner";

const App = () => {
  const [quizResult, setQuizResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkHealth = async () => {
      const data = await fetchHealth();
      console.log("Backend health:", data);
    };
    checkHealth();
  }, []);

  const handleQuizSetup = async (config) => {
    try {
      setError("")
      setLoading(true)
      console.log("Requesting quiz with config:", config);
      const data = await generateQuiz(config)
      console.log("Quiz generated:", data);
      setQuizResult(data)
    } catch (error) {
      setError("Could not generate quiz. Check console for details")
      console.error(error)
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="container border text-center mt-5 pt-2 pb-2">
      <h1 className="row">PL Quiz</h1>
      
      <div className="row">
        <QuizSetupForm onSubmit={handleQuizSetup} />

        {loading && <p>Loading quiz...</p>}
        {error && <p>{error}</p>}

        {quizResult && quizResult.answers && (
        <QuizRunner answers={quizResult.answers} />
        )}
      </div>

    </div>
  );
};

export default App;

