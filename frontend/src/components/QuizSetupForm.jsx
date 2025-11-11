import { useEffect, useState } from "react"

const QuizSetupForm = ({ onSubmit }) => {
    const [mode, setMode] = useState("club")
    const [clubId, setClubId] = useState("1")
    const [seasonId, setSeasonId] = useState("1")
    const [category, setCategory] = useState("goals")
    const [limit, setLimit] = useState(10)
    const [clubs, setClubs] = useState([])
    const [seasons, setSeasons] = useState([])
    const [selectedClub, setSelectedClub] = useState("");
    const [selectedSeason, setSelectedSeason] = useState("");


    const categoryOptions =
        mode === "overall"
            ? [
                { value: "goals", label: "Top Goalscorers" },
                { value: "assists", label: "Most Assists" },
                { value: "appearances", label: "Most Appearances" },
              ]
            : [
                { value: "goals", label: "Top Goalscorers" },
                { value: "assists", label: "Most Assists" },
                { value: "appearances", label: "Most Appearances" },
                { value: "managers", label: "Managers" },
              ];
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clubsRes, seasonsRes] = await Promise.all([
                    // Will need to be changed for deployment
                    fetch("http://127.0.0.1:8000/api/clubs/"),
                    fetch("http://127.0.0.1:8000/api/seasons/"),
                ])

                const [clubsData, seasonsData] = await Promise.all([
                    clubsRes.json(),
                    seasonsRes.json(),
                ])

                setClubs(clubsData)
                setSeasons(seasonsData)
            } catch (error) {
                console.error('Error fetching clubs or seasons:', error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (mode === 'overall' && category === 'managers') {
            setCategory('goals')
        }
    }, [mode, category])


    const handlesubmit = (e) => {
        e.preventDefault()

        const config = {
            mode,
            category,
            limit: Number(limit),
        }

        if (mode === 'club') {
            config.club_id = Number(selectedClub)        
        } else if (mode === 'season') {
            config.season_id = Number(selectedSeason)
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
                        <select name="club" value={selectedClub} onChange={(e) => setSelectedClub(e.target.value)}>
                            <option value="">Select a club</option>
                            {clubs.map((club) => (
                                <option value={club.id} key={club.id}>
                                    {club.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            )}
            {mode === 'season' && (
                <div>
                    <label>
                        Season:
                        <select name='season' value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)}>
                            <option value="">Select a season</option>
                            {seasons.map((season) => (
                                <option value={season.id} key={season.id}>
                                    {season.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            )}
            <div>
                <label>
                    Quiz Type
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {categoryOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
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