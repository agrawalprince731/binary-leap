import axios from "axios"
import { useState } from "react"

const useBatches = () => {
    const [batches, setBatches] = useState([])

    const handleFetchAllBatches = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/batches`)
            setBatches(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleCreateNewBatch = async (newBatch) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/batches/create`, newBatch)
            setBatches([...batches, response.data])
        } catch (error) {
            console.error(error)
        }
    }

    return { batches, handleFetchAllBatches, handleCreateNewBatch }
}

export default useBatches
