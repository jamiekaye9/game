import { useState } from "react"

const QuizSetupForm = ({ onSubmit }) => {
    const [mode, setMode] = useState("club")
    const [clubId, setClubId] = useState("1")
    const [seasonId, setSeasonId] = useState("1")
    const [category, setCategory] = useState("goals")
    const [limit, setLimit] = useState(10)

    const handlesubmit = (e) => {
        e.preventDefault()

        const config = {
            mode,
            category,
            limit: Number(limit),
        }

        if (mode === 'club') {
            config.club_id = Number(clubId)        
        } else if (mode === 'season') {
            config.season_id = Number(seasonId)
        }

        console.log('Quiz setup submitted:', config);
        if (onSubmit) onSubmit(config)
    }

    return (
        <form onSubmit={handlesubmit}>
            <div>
                <label>
                    Mode:
                    <select value={mode} onChange={(e) => setMode(e.target.value)}>
                        <option value="club">Club</option>
                        <option value="season">Season</option>
                        <option value="overall">Overall</option>
                    </select>
                </label>
            </div>
            {mode === 'club' && (
                <div>
                    <label>
                        Club:
                        <select value={clubId} onChange={(e) => setClubId(e.target.value)}>
                            <option value="1">Manchester United</option>
                            <option value="2">Chelsea</option>
                            <option value="3">Liverpool</option>
                        </select>
                    </label>
                </div>
            )}
            {mode === 'season' && (
                <div>
                    <label>
                        Season:
                        <select value={seasonId} onChange={(e) => setSeasonId(e.target.value)}>
                            <option value="1">2020/21</option>
                            <option value="2">2021/22</option>
                            <option value="3">2022/23</option>
                        </select>
                    </label>
                </div>
            )}
            <div>
                <label>
                    Quiz Type
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="goals">Top Goalscorers</option>
                        <option value="appearances">Most Appearances</option>
                        <option value="managers">Managers</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Number of answers:
                    <input 
                      type="number"
                      min="1"
                      max="100"
                      value={limit}
                      onChange={(e) => setLimit(e.target.value)}
                    />
                </label>
            </div>
            <button type="submit">Start Quiz</button>
        </form>
    )
}

export default QuizSetupForm