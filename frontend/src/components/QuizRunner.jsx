import { useState } from 'react'

const QuizRunner = ({ answers, category, onBackToSetup }) => {
  const [typedAnswer, setTypedAnswer] = useState("")
  const [foundIds, setFoundIds] = useState([])
  const [isEnded, setIsEnded] = useState(false)

  const normalise = (str) => str.trim().toLowerCase()

  const score = foundIds.length
  const total = answers.length

  const handleGuess = () => {
    if (isEnded) return  // once ended, ignore further guesses

    const guess = normalise(typedAnswer)
    setTypedAnswer("")

    if (!guess) return

    const match = answers.find((a) => {
      if (foundIds.includes(a.id)) {
        return false
      }
      const fullName = normalise(a.name)
      const lastName = a.last_name ? normalise(a.last_name) : ''

      return guess === fullName || guess === lastName
    })

    if (match) {
      setFoundIds((prev) => [...prev, match.id])
    }
  }

  const isManagerQuiz = category === 'managers'

  const handleEndQuiz = () => {
    setIsEnded(true)
  }

  return (
    <div className="mt-4">
      <h2>Quiz in progress</h2>
      <p>
        Score: <strong>{score}</strong> / {total}
      </p>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Type an answer..."
          value={typedAnswer}
          disabled={isEnded}  // disable input after ending
          onChange={(e) => setTypedAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleGuess()
            }
          }}
        />
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            {!isManagerQuiz && <th>Total</th>}
          </tr>
        </thead>
        <tbody>
          {answers.map((ans) => {
            const isFound = foundIds.includes(ans.id)

            // Build the 'total' text (goals/assists/appearances)
            let totalText = ""
            if (!isManagerQuiz) {
              if (ans.total_goals !== undefined) {
                totalText = `${ans.total_goals} goals`
              } else if (ans.total_assists !== undefined) {
                totalText = `${ans.total_assists} assists`
              } else if (ans.total_appearances !== undefined) {
                totalText = `${ans.total_appearances} appearances`
              }
            }

            // Decide what to show based on isEnded / isFound
            let displayName = ""
            let displayTotal = ""
            let rowClass = ""

            if (!isEnded) {
              // Quiz still running → only show guessed ones, in normal colour
              if (isFound) {
                displayName = ans.name
                displayTotal = totalText
              }
            } else {
              // Quiz ended → reveal everything
              displayName = ans.name
              displayTotal = totalText

              // Colour: green if they got it, red if they missed it
              rowClass = isFound ? "text-success" : "text-danger"
            }

            return (
              <tr key={ans.id} className={rowClass}>
                <td>{displayName}</td>
                {!isManagerQuiz && <td>{displayTotal}</td>}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="d-flex gap-2 mt-3">
        {!isEnded && (
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={handleEndQuiz}
          >
            End Quiz & Show Answers
          </button>
        )}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBackToSetup}
        >
          Back to Setup
        </button>
      </div>
    </div>
  )
}

export default QuizRunner
