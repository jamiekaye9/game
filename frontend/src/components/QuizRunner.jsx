import { useState } from 'react'

const QuizRunner = ({ answers }) => {
    const [typedAnswer, setTypedAnswer] = useState("")
    const [foundIds, setFoundIds] = useState([])

    const normalise = (str) => str.trim().toLowerCase()

    const score = foundIds.length
    const total = answers.length

    const handleGuess = () => {
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

    return (
        <div>
            <h2>Quiz in progress</h2>
            <p>
                Score: {score} / {total}
            </p>

            <input
              type="text"
              placeholder='Type an answer...'
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleGuess()
                }
              }}
            />

            <ul>
                {answers.map((ans) => {
                    const isFound = foundIds.includes(ans.id)

                    return (
                        <li
                          key={ans.id}
                          style={{color: isFound ? 'green' : 'gray'}}
                        >
                            {isFound ? ans.name : "-"}
                        </li>
                    )
                })}
            </ul>
        </div>
    )

}

export default QuizRunner