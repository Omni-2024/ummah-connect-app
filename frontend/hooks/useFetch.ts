"use client"

import { useState, useEffect } from "react"
import apiClient from "@/lib/axios"

interface UseFetchOptions {
  immediate?: boolean
}

interface UseFetchReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useFetch = <T = any>(url: string, options: UseFetchOptions = {}): UseFetchReturn<T> => {
  const { immediate = true } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(url)
      setData(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (immediate) {
      fetchData()
    }
  }, [url, immediate])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}
