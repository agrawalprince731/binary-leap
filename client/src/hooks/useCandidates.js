import axios from "axios"
import { useState } from "react"


const useCandidates = () => {
    const [name, setName] = useState('')
    const [candidates, setCandidates] = useState([])
    const [candidateAnalytics, setCandidateAnalytics] = useState({
        experience_analysis: {},
        sentimental_analysis: {}
    })
    const [ transcript, setTranscript ] = useState('')
    const [loading,setLoading]=useState(false)


    const handleFetchAllCandidates = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/candidates`)
            setCandidates(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleFetchCandidateAnalytics = async (candidateId) => {
        setLoading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/candidates/analytics`,{params:{candidateId}})
            const { experience_analysis, sentimental_analysis, transcript, name } = response.data
            setCandidateAnalytics({ experience_analysis, sentimental_analysis })
            setTranscript(transcript)
            setName(name)
        } catch (error) {
            console.error(error)
        }
        finally{
            setLoading(false)
        }
    }

    return {
        candidates,candidateAnalytics, transcript, name, handleFetchAllCandidates,
        handleFetchCandidateAnalytics, loading
    }
}

export default useCandidates
