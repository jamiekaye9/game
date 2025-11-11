import { useEffect } from "react";
import { fetchHealth } from "./api";
import QuizSetupForm from "./components/QuizSetupForm";

const App = () => {
  useEffect(() => {
    const checkHealth = async () => {
      const data = await fetchHealth();
      console.log("Backend health:", data);
    };
    checkHealth();
  }, []);

  const handleQuizSetup = (config) => {
    console.log("App received quiz config:", config);
  };

  return (
    <div>
      <h1>PL Quiz</h1>
      <QuizSetupForm onSubmit={handleQuizSetup} />
    </div>
  );
};

export default App;

