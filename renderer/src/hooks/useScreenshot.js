/**
 * useScreenshot.js
 * Captures screenshots via Electron every N seconds while recording.
 */
import { useEffect, useRef } from 'react'

export default function useScreenshot(recording, intervalMs = 8000) {
  const timerRef = useRef(null)

  useEffect(() => {
    if (!window.electronAPI) return
    if (recording) {
      timerRef.current = setInterval(async () => {
        await window.electronAPI.captureScreenshot()
      }, intervalMs)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [recording, intervalMs])
}
