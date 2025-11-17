import { useState } from 'react'

const QuizRunner = ({ answers, category, onBackToSetup }) => {
  const [typedAnswer, setTypedAnswer] = useState("")
  const [foundIds, setFoundIds] = useState([])
  const [isEnded, setIsEnded] = useState(false)

  const normalise = (str) => str.trim().toLowerCase()

  const score = foundIds.length
  const total = answers.length

  // True if the player has found every answer
  const isComplete = total > 0 && foundIds.length === total

  const handleGuess = () => {
    if (isEnded) return  // ignore guesses once quiz is ended (by user or complete)

    const guess = normalise(typedAnswer)
    setTypedAnswer("")

    if (!guess) return

    const match = answers.find((a) => {
      if (foundIds.includes(a.id)) return false
      const fullName = normalise(a.name)
      const lastName = a.last_name ? normalise(a.last_name) : ''
      return guess === fullName || guess === lastName
    })

    if (match) {
      setFoundIds((prev) => {
        const next = [...prev, match.id]
        // If we've just found the final answer, end the quiz automatically
        if (next.length === total) {
          setIsEnded(true)
        }
        return next
      })
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

      {/* Messages & input zone */}
      {isComplete ? (
        // All answers found
        <div className="alert alert-success mb-3">
          Well done! You found all {total} answers.
        </div>
      ) : isEnded ? (
        // Player ended the quiz early
        <div className="alert alert-warning mb-3">
          Game ended. You scored {score} out of {total}.
        </div>
      ) : (
        // Quiz still running: show input
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Type an answer..."
            value={typedAnswer}
            disabled={isEnded}
            onChange={(e) => setTypedAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleGuess()
              }
            }}
          />
        </div>
      )}

      <table
        className="table table-bordered"
        style={{ tableLayout: 'fixed' }}  // keep column widths stable
      >
        <thead>
          <tr>
            <th style={{ width: isManagerQuiz ? '100%' : '60%' }}>Name</th>
            {!isManagerQuiz && <th style={{ width: '40%' }}>Total</th>}
          </tr>
        </thead>
        <tbody>
          {answers.map((ans) => {
            const isFound = foundIds.includes(ans.id)

            // Build the "total" text (goals/assists/appearances)
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

            // We ALWAYS render the text, but use visibility to hide/show it.
            // That way, the cell size stays the same even when it's "blank".
            const nameVisible = isFound || isEnded
            const totalVisible = (!isManagerQuiz) && (isFound || isEnded)

            // Decide the text colour
            // - While playing: found answers = green, others default.
            // - After ending: found answers = green, missed answers = red.
            let textColor = undefined

            if (isEnded) {
              textColor = isFound ? 'green' : 'red'
            } else if (isFound) {
              textColor = 'green'
            }

            return (
              <tr key={ans.id}>
                <td>
                  <span
                    style={{
                      visibility: nameVisible ? 'visible' : 'hidden',
                      color: textColor,
                    }}
                  >
                    {ans.name}
                  </span>
                </td>
                {!isManagerQuiz && (
                  <td>
                    <span
                      style={{
                        visibility: totalVisible ? 'visible' : 'hidden',
                        color: textColor,
                      }}
                    >
                      {totalText}
                    </span>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="d-flex gap-2 mt-3">
        {/* Only show End Quiz button while quiz is running and not complete */}
        {!isEnded && !isComplete && (
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
