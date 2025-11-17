import { useEffect, useState } from "react"
import { fetchHealth, generateQuiz } from "./api"
import QuizSetupForm from "./components/QuizSetupForm"
import QuizRunner from "./components/QuizRunner"

const App = () => {
  const [quizResult, setQuizResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await fetchHealth()
        console.log("Backend health:", data)
      } catch (err) {
        console.error("Health check failed:", err)
      }
    }
    checkHealth()
  }, [])

  const handleQuizSetup = async (config) => {
    try {
      setError("")
      setLoading(true)
      console.log("Requesting quiz with config:", config)
      const result = await generateQuiz(config)
      console.log("Quiz result:", result)
      setQuizResult(result)   // ⬅️ Switch to quiz view
    } catch (err) {
      console.error(err)
      setError("Could not generate quiz. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToSetup = () => {
    // Clear quiz result and go back to form
    setQuizResult(null)
  }

  const category = quizResult?.config?.category

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">PL Quiz</h1>

      {loading && <p>Loading quiz...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* Show form when there is no quiz yet */}
      {!quizResult && (
        <div className="row">
          <div className="col-md-6 mx-auto">
            <QuizSetupForm onSubmit={handleQuizSetup} />
          </div>
        </div>
      )}

      {/* Show quiz when we have quizResult */}
      {quizResult && (
        <QuizRunner
          answers={quizResult.answers}
          category={category}
          onBackToSetup={handleBackToSetup}
        />
      )}
    </div>
  )
}

export default App