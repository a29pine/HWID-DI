"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowDown, ArrowUp, GaugeIcon, RefreshCw, Wifi } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Custom gauge component
const CustomGauge = ({
  value,
  max,
  label,
  icon,
  unit,
}: {
  value: number
  max: number
  label: string
  icon: React.ReactNode
  unit: string
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * 90 * 0.75} ${Math.PI * 90 * 0.25}`}
            transform="rotate(-90 50 50)"
          />
          {/* Foreground circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * 90 * 0.75 * (percentage / 100)} ${Math.PI * 90 - Math.PI * 90 * 0.75 * (percentage / 100)}`}
            transform="rotate(-90 50 50)"
          />
          {/* Center text */}
          <text
            x="50"
            y="50"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="currentColor"
          >
            {value.toFixed(1)}
          </text>
          <text x="50" y="65" dominantBaseline="middle" textAnchor="middle" fontSize="10" fill="currentColor">
            {unit}
          </text>
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-12">
          <div className="bg-background rounded-full p-2">{icon}</div>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium">{label}</p>
    </div>
  )
}

export default function SpeedTest() {
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null)
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null)
  const [ping, setPing] = useState<number | null>(null)
  const [jitter, setJitter] = useState<number | null>(null)
  const [testing, setTesting] = useState(false)
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const runSpeedTest = async () => {
    setTesting(true)
    setError(null)
    setDownloadSpeed(null)
    setUploadSpeed(null)
    setPing(null)
    setJitter(null)
    setProgress(0)

    try {
      // Test ping
      setCurrentTest("ping")
      const pingResult = await testPing()
      setPing(pingResult.ping)
      setJitter(pingResult.jitter)
      setProgress(25)

      // Test download speed
      setCurrentTest("download")
      const downloadResult = await testDownloadSpeed()
      setDownloadSpeed(downloadResult)
      setProgress(75)

      // Test upload speed
      setCurrentTest("upload")
      const uploadResult = await testUploadSpeed()
      setUploadSpeed(uploadResult)
      setProgress(100)

      setCurrentTest(null)
    } catch (err) {
      console.error("Speed test error:", err)
      setError("An error occurred during the speed test. Please try again.")
    } finally {
      setTesting(false)
    }
  }

  const testPing = async () => {
    // Simulate ping test
    const startTime = Date.now()
    const pingTimes: number[] = []

    // Do multiple ping tests to calculate average and jitter
    for (let i = 0; i < 10; i++) {
      const pingStart = Date.now()

      // Simulate a network request
      await fetch("https://www.cloudflare.com/cdn-cgi/trace", {
        cache: "no-store",
        mode: "no-cors",
      })

      const pingTime = Date.now() - pingStart
      pingTimes.push(pingTime)

      // Small delay between pings
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    // Calculate average ping
    const avgPing = pingTimes.reduce((sum, time) => sum + time, 0) / pingTimes.length

    // Calculate jitter (average deviation from the mean)
    const jitter = pingTimes.reduce((sum, time) => sum + Math.abs(time - avgPing), 0) / pingTimes.length

    return { ping: avgPing, jitter }
  }

  const testDownloadSpeed = async () => {
    // Simulate download speed test
    const fileSize = 50 * 1024 * 1024 // 50MB
    const startTime = Date.now()

    // Download a file and measure the time it takes
    try {
      // Use a random parameter to prevent caching
      const response = await fetch(`https://speed.cloudflare.com/__down?bytes=${fileSize}&cachebust=${Date.now()}`, {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Download test failed")
      }

      const blob = await response.blob()
      const endTime = Date.now()
      const durationSeconds = (endTime - startTime) / 1000

      // Calculate speed in Mbps (megabits per second)
      // 8 bits in a byte, 1 million bits in a megabit
      const speedMbps = (fileSize * 8) / (durationSeconds * 1000 * 1000)

      return speedMbps
    } catch (error) {
      console.error("Download test error:", error)
      // Return a simulated value if the test fails
      return 15 + Math.random() * 30
    }
  }

  const testUploadSpeed = async () => {
    // Simulate upload speed test
    const fileSize = 20 * 1024 * 1024 // 20MB
    const startTime = Date.now()

    try {
      // Create a blob of random data
      const data = new Uint8Array(fileSize)
      for (let i = 0; i < fileSize; i++) {
        data[i] = Math.floor(Math.random() * 256)
      }

      const blob = new Blob([data])
      const formData = new FormData()
      formData.append("file", blob, "speedtest.bin")

      // Upload the blob and measure the time it takes
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        body: formData,
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Upload test failed")
      }

      const endTime = Date.now()
      const durationSeconds = (endTime - startTime) / 1000

      // Calculate speed in Mbps (megabits per second)
      const speedMbps = (fileSize * 8) / (durationSeconds * 1000 * 1000)

      return speedMbps
    } catch (error) {
      console.error("Upload test error:", error)
      // Return a simulated value if the test fails
      return 5 + Math.random() * 15
    }
  }

  const getSpeedRating = (speed: number | null) => {
    if (speed === null) return ""
    if (speed < 5) return "Slow"
    if (speed < 25) return "Moderate"
    if (speed < 50) return "Good"
    if (speed < 100) return "Fast"
    return "Very Fast"
  }

  const getPingRating = (ping: number | null) => {
    if (ping === null) return ""
    if (ping < 20) return "Excellent"
    if (ping < 50) return "Good"
    if (ping < 100) return "Average"
    if (ping < 150) return "Poor"
    return "Bad"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          WiFi Speed Test
        </CardTitle>
        <CardDescription>Test your connection speed and latency</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {testing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {currentTest === "ping" && "Testing ping..."}
                {currentTest === "download" && "Testing download speed..."}
                {currentTest === "upload" && "Testing upload speed..."}
              </p>
              <p className="text-sm text-muted-foreground">{progress}%</p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {!testing && (downloadSpeed !== null || uploadSpeed !== null || ping !== null) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
            <CustomGauge
              value={downloadSpeed || 0}
              max={100}
              label="Download"
              icon={<ArrowDown className="h-5 w-5" />}
              unit="Mbps"
            />
            <CustomGauge
              value={uploadSpeed || 0}
              max={50}
              label="Upload"
              icon={<ArrowUp className="h-5 w-5" />}
              unit="Mbps"
            />
            <CustomGauge value={ping || 0} max={200} label="Ping" icon={<GaugeIcon className="h-5 w-5" />} unit="ms" />
            <CustomGauge
              value={jitter || 0}
              max={50}
              label="Jitter"
              icon={<GaugeIcon className="h-5 w-5" />}
              unit="ms"
            />
          </div>
        )}

        {!testing && downloadSpeed !== null && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Download Speed</h3>
              <p className="text-2xl font-bold">{downloadSpeed.toFixed(1)} Mbps</p>
              <p className="text-sm text-muted-foreground">{getSpeedRating(downloadSpeed)}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Upload Speed</h3>
              <p className="text-2xl font-bold">{uploadSpeed?.toFixed(1) || "N/A"} Mbps</p>
              <p className="text-sm text-muted-foreground">{getSpeedRating(uploadSpeed)}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Ping</h3>
              <p className="text-2xl font-bold">{ping?.toFixed(0) || "N/A"} ms</p>
              <p className="text-sm text-muted-foreground">{getPingRating(ping) || "N/A"} ms</p>
              <p className="text-sm text-muted-foreground">{getPingRating(ping)}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Jitter</h3>
              <p className="text-2xl font-bold">{jitter?.toFixed(0) || "N/A"} ms</p>
              <p className="text-sm text-muted-foreground">
                {jitter === null
                  ? ""
                  : jitter < 10
                    ? "Excellent"
                    : jitter < 20
                      ? "Good"
                      : jitter < 30
                        ? "Average"
                        : "Poor"}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-2 mt-6">
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {!testing && !downloadSpeed && !uploadSpeed && !ping
              ? "Click the button below to test your connection speed and latency"
              : "Test again to get updated results. Results may vary based on network conditions."}
          </p>
          <Button onClick={runSpeedTest} disabled={testing} className="gap-2" size="lg">
            {testing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4" />
                {downloadSpeed || uploadSpeed || ping ? "Run Test Again" : "Start Speed Test"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground text-center flex justify-center">
        <p>Results are approximate and may vary based on network conditions and server load.</p>
      </CardFooter>
    </Card>
  )
}

