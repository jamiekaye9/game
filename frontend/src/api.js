import { BACKEND_URL } from "./config";

/**
 * Simple helper to call the Django backend API.
 * This version checks the health endpoint for connectivity.
 */
export async function fetchHealth() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/health/`)
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error fetching health status:", error)
        return { status: "error", message: error.message }
    }
}