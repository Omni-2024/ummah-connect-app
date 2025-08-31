// Simple toast implementation - replace with your preferred toast library
export const Toast = {
  error: (message: string) => {
    console.error("Toast Error:", message)
    // In a real app, you'd show a toast notification here
    alert(`Error: ${message}`)
  },
  success: (message: string) => {
    console.log("Toast Success:", message)
    // In a real app, you'd show a toast notification here
    alert(`Success: ${message}`)
  },
}
