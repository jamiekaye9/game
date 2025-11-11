import { useEffect } from "react"
import { fetchHealth } from './api'

function App() {
  useEffect(() => {
    async function checkHealth() {
      const data = await fetchHealth()
      console.log(("Backend health:", data));
    }
    checkHealth()
  }, [])

  return (
    <div>
      <h1>Football Quiz</h1>
    </div>
  )
}

export default App
