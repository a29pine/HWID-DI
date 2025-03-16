"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Activity,
  AlertTriangle,
  Bluetooth,
  Cpu,
  Globe,
  HardDrive,
  Info,
  Laptop,
  Lock,
  MapPin,
  Monitor,
  Mouse,
  Network,
  PlugZap,
  Server,
  Smartphone,
  Speaker,
  Wifi,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeviceData {
  browser: {
    name: string
    version: string
    userAgent: string
    language: string
    cookiesEnabled: boolean
    doNotTrack: string | null
    cache: string
    plugins: string[]
    extensions: string[]
    adBlocker: string
    contentFiltering: string
    fingerPrintingResistance: string
    lastKeyPressed: string
    capsLockState: boolean
  }
  screen: {
    width: number
    height: number
    colorDepth: number
    orientation: string
    pixelRatio: number
    touchScreen: boolean
  }
  system: {
    platform: string
    cores: number
    memory: string | null
    connection: string | null
    battery: string | null
    gpu: string
    speakers: string
    bluetooth: string
    direction: string
    deviceMotion: string
    mouse: string
    touchscreen: string
    speechSynthesis: string
  }
  network: {
    ip: string
    vpn: string
    tor: string
    proxy: string
    isp: string
    wan: string
    lan: string
    latitude: number | null
    longitude: number | null
    hostname: string | null
  }
  time: {
    local: string
    utc: string
  }
  storage: {
    localStorage: boolean
    sessionStorage: boolean
    indexedDB: boolean
  }
  performance: {
    pageLoadTime: string
    networkTime: string
    dnsLookupTime: string
    tcpConnectionTime: string
    serverResponseTime: string
    pageDownloadTime: string
    browserRenderTime: string
  }
  other: {
    canvasFingerprint: string
    audioContext: string
    webRTC: string
    webGL: string
    browserWindowSize: string
    httpVersion: string
    tlsVersion: string
    cipher: string
    pageReferrer: string
  }
}

export default function DeviceInfo() {
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastKeyPressed, setLastKeyPressed] = useState<string>("None")
  const [capsLockState, setCapsLockState] = useState<boolean>(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setLastKeyPressed(e.key)
      setCapsLockState(e.getModifierState("CapsLock"))
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const fetchDeviceInfo = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get browser information
      const browser = {
        name: getBrowserName(),
        version: getBrowserVersion(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        cache: await getCacheSize(),
        plugins: getPlugins(),
        extensions: await getExtensions(),
        adBlocker: await checkAdBlocker(),
        contentFiltering: await checkContentFiltering(),
        fingerPrintingResistance: await checkFingerPrintingResistance(),
        lastKeyPressed: lastKeyPressed,
        capsLockState: capsLockState,
      }

      // Get screen information
      const screen = {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth,
        orientation: window.screen.orientation ? window.screen.orientation.type : "unknown",
        pixelRatio: window.devicePixelRatio,
        touchScreen: "ontouchstart" in window,
      }

      // Get system information
      const system = {
        platform: navigator.platform,
        cores: navigator.hardwareConcurrency || 0,
        memory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : null,
        connection: getConnectionType(),
        battery: await getBatteryInfo(),
        gpu: await getGPUInfo(),
        speakers: await getSpeakerInfo(),
        bluetooth: await getBluetoothInfo(),
        direction: await getDeviceDirection(),
        deviceMotion: await getDeviceMotion(),
        mouse: "onmousemove" in window ? "Supported" : "Not supported",
        touchscreen: "ontouchstart" in window ? "Supported" : "Not supported",
        speechSynthesis: "speechSynthesis" in window ? "Supported" : "Not supported",
      }

      // Get network information
      const networkInfo = await getNetworkInfo()

      // Get time information
      const time = {
        local: new Date().toLocaleString(),
        utc: new Date().toUTCString(),
      }

      // Get storage information
      const storage = {
        localStorage: "localStorage" in window,
        sessionStorage: "sessionStorage" in window,
        indexedDB: "indexedDB" in window,
      }

      // Get performance information
      const performance = await getPerformanceInfo()

      // Get other information
      const other = {
        canvasFingerprint: await getCanvasFingerprint(),
        audioContext: await getAudioContext(),
        webRTC: await getWebRTCStatus(),
        webGL: await getWebGLInfo(),
        browserWindowSize: `${window.innerWidth}x${window.innerHeight}`,
        httpVersion: await getHTTPVersion(),
        tlsVersion: await getTLSVersion(),
        cipher: await getCipherInfo(),
        pageReferrer: document.referrer || "Not available",
      }

      setDeviceData({
        browser,
        screen,
        system,
        network: networkInfo,
        time,
        storage,
        performance,
        other,
      })
    } catch (err) {
      console.error("Error fetching device info:", err)
      setError("Failed to fetch device information. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeviceInfo()
  }, [])

  const getBrowserName = () => {
    const userAgent = navigator.userAgent
    let browserName

    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = "Chrome"
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = "Firefox"
    } else if (userAgent.match(/safari/i)) {
      browserName = "Safari"
    } else if (userAgent.match(/opr\//i)) {
      browserName = "Opera"
    } else if (userAgent.match(/edg/i)) {
      browserName = "Edge"
    } else {
      browserName = "Unknown"
    }

    return browserName
  }

  const getBrowserVersion = () => {
    const userAgent = navigator.userAgent
    let version = "Unknown"

    if (userAgent.match(/chrome|chromium|crios/i)) {
      version = userAgent.match(/(?:chrome|chromium|crios)\/([0-9.]+)/i)?.[1] || "Unknown"
    } else if (userAgent.match(/firefox|fxios/i)) {
      version = userAgent.match(/(?:firefox|fxios)\/([0-9.]+)/i)?.[1] || "Unknown"
    } else if (userAgent.match(/safari/i)) {
      version = userAgent.match(/version\/([0-9.]+)/i)?.[1] || "Unknown"
    } else if (userAgent.match(/opr\//i)) {
      version = userAgent.match(/opr\/([0-9.]+)/i)?.[1] || "Unknown"
    } else if (userAgent.match(/edg/i)) {
      version = userAgent.match(/edg\/([0-9.]+)/i)?.[1] || "Unknown"
    }

    return version
  }

  const getCacheSize = async () => {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return `${Math.round(estimate.usage! / 1024 / 1024)} MB used of ${Math.round(estimate.quota! / 1024 / 1024)} MB quota`
    }
    return "Not available"
  }

  const getPlugins = () => {
    return Array.from(navigator.plugins).map((plugin) => plugin.name)
  }

  const getExtensions = async () => {
    return ["Browser security restricts access to extension information"]
  }

  const checkAdBlocker = async () => {
    const testAd = document.createElement("div")
    testAd.innerHTML = "&nbsp;"
    testAd.className = "adsbox"
    document.body.appendChild(testAd)
    await new Promise((resolve) => setTimeout(resolve, 100))
    const isAdBlocker = testAd.offsetHeight === 0
    document.body.removeChild(testAd)
    return isAdBlocker ? "Detected" : "Not detected"
  }

  const checkContentFiltering = async () => {
    return "Detection requires server-side validation"
  }

  const checkFingerPrintingResistance = async () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return "Canvas not supported"

    // Draw something
    ctx.textBaseline = "top"
    ctx.font = "14px 'Arial'"
    ctx.textBaseline = "alphabetic"
    ctx.fillStyle = "#f60"
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = "#069"
    ctx.fillText("abcdefghijklmnopqrstuvwxyz", 2, 15)
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)"
    ctx.fillText("abcdefghijklmnopqrstuvwxyz", 4, 17)

    // Get the data URL
    const dataURL = canvas.toDataURL()

    // Check if the data URL is the default blank canvas
    return dataURL ===
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
      ? "High (Canvas Blocked)"
      : "Low"
  }

  const getConnectionType = () => {
    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (connection) {
      return `${connection.effectiveType} (${connection.downlink} Mbps)`
    }
    return "Not available"
  }

  const getBatteryInfo = async () => {
    try {
      // @ts-ignore
      if (navigator.getBattery) {
        // @ts-ignore
        const battery = await navigator.getBattery()
        const level = Math.round(battery.level * 100)
        const charging = battery.charging ? "charging" : "not charging"
        return `${level}% (${charging})`
      }
    } catch (e) {
      console.error("Battery API not supported", e)
    }
    return "Not available"
  }

  const getGPUInfo = async () => {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (!gl) return "WebGL not supported"

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
    if (debugInfo) {
      return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    }
    return "GPU information restricted"
  }

  const getSpeakerInfo = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const audioOutputs = devices.filter((device) => device.kind === "audiooutput")
      return `${audioOutputs.length} audio output device(s) detected`
    } catch (e) {
      console.error("Error getting audio devices", e)
      return "Access denied or not available"
    }
  }

  const getBluetoothInfo = async () => {
    if ("bluetooth" in navigator) {
      return "Supported"
    }
    return "Not supported"
  }

  const getDeviceDirection = async () => {
    if ("DeviceOrientationEvent" in window) {
      return "Supported"
    }
    return "Not supported"
  }

  const getDeviceMotion = async () => {
    if ("DeviceMotionEvent" in window) {
      return "Supported"
    }
    return "Not supported"
  }

  const getNetworkInfo = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json")
      const data = await response.json()
      const ip = data.ip

      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`)
      const geoData = await geoResponse.json()

      return {
        ip: ip,
        vpn: "Detection requires advanced techniques",
        tor: "Detection requires server-side checks",
        proxy: geoData.proxy ? "Detected" : "Not detected",
        isp: geoData.org || "Not available",
        wan: ip,
        lan: await getLANIP(),
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        hostname: window.location.hostname,
      }
    } catch (error) {
      console.error("Error fetching network info:", error)
      return {
        ip: "Not available",
        vpn: "Not available",
        tor: "Not available",
        proxy: "Not available",
        isp: "Not available",
        wan: "Not available",
        lan: "Not available",
        latitude: null,
        longitude: null,
        hostname: window.location.hostname,
      }
    }
  }

  const getLANIP = async () => {
    try {
      const peerConnection = new RTCPeerConnection({ iceServers: [] })
      peerConnection.createDataChannel("")
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)

      return new Promise<string>((resolve) => {
        peerConnection.onicecandidate = (ice) => {
          if (ice.candidate) {
            const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
            const match = ipRegex.exec(ice.candidate.candidate)
            if (match) {
              resolve(match[1])
            }
          }
        }
        setTimeout(() => resolve("Not detected"), 1000)
      })
    } catch (e) {
      console.error("Error getting LAN IP:", e)
      return "Not available"
    }
  }

  const getPerformanceInfo = async () => {
    if (!window.performance || !window.performance.timing) {
      return {
        pageLoadTime: "Not available",
        networkTime: "Not available",
        dnsLookupTime: "Not available",
        tcpConnectionTime: "Not available",
        serverResponseTime: "Not available",
        pageDownloadTime: "Not available",
        browserRenderTime: "Not available",
      }
    }

    const timing = window.performance.timing
    const now = Date.now()

    return {
      pageLoadTime: `${now - timing.navigationStart}ms`,
      networkTime: `${timing.responseEnd - timing.fetchStart}ms`,
      dnsLookupTime: `${timing.domainLookupEnd - timing.domainLookupStart}ms`,
      tcpConnectionTime: `${timing.connectEnd - timing.connectStart}ms`,
      serverResponseTime: `${timing.responseStart - timing.requestStart}ms`,
      pageDownloadTime: `${timing.responseEnd - timing.responseStart}ms`,
      browserRenderTime: `${now - timing.domLoading}ms`,
    }
  }

  const getCanvasFingerprint = async () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return "Canvas not supported"

    // Draw something unique
    ctx.textBaseline = "top"
    ctx.font = "14px 'Arial'"
    ctx.textBaseline = "alphabetic"
    ctx.fillStyle = "#f60"
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = "#069"
    ctx.fillText("Hello, World!", 2, 15)
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)"
    ctx.fillText("Hello, World!", 4, 17)

    return canvas.toDataURL()
  }

  const getAudioContext = async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      return "Supported"
    } catch (e) {
      return "Not supported"
    }
  }

  const getWebRTCStatus = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return "Supported"
    }
    return "Not supported"
  }

  const getWebGLInfo = async () => {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (!gl) return "WebGL not supported"

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
    if (debugInfo) {
      return `Vendor: ${gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)}, Renderer: ${gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)}`
    }
    return "WebGL supported, but detailed info restricted"
  }

  const getHTTPVersion = async () => {
    return "Detection requires server-side information"
  }

  const getTLSVersion = async () => {
    return "Detection requires server-side information"
  }

  const getCipherInfo = async () => {
    return "Detection requires server-side information"
  }

  const InfoItem = ({
    icon,
    label,
    value,
  }: { icon: React.ReactNode; label: string; value: string | number | null | boolean }) => (
    <div className="flex items-start space-x-3">
      <div className="mt-0.5 bg-muted rounded-md p-2">{icon}</div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground break-words">
          {value === null || value === undefined ? "Not available" : String(value)}
        </p>
      </div>
    </div>
  )

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Error
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchDeviceInfo}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  if (loading || !deviceData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-72" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-start space-x-3">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                ))}
              </div>
              {i < 7 && <Separator className="my-4" />}
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Comprehensive Device Information
        </CardTitle>
        <CardDescription>Detailed information about your device, browser, network, and more</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Laptop className="h-5 w-5" />
            Browser Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              icon={<Smartphone className="h-5 w-5" />}
              label="Browser"
              value={`${deviceData.browser.name} ${deviceData.browser.version}`}
            />
            <InfoItem icon={<Globe className="h-5 w-5" />} label="Language" value={deviceData.browser.language} />
            <InfoItem icon={<Info className="h-5 w-5" />} label="User Agent" value={deviceData.browser.userAgent} />
            <InfoItem
              icon={<Info className="h-5 w-5" />}
              label="Cookies Enabled"
              value={deviceData.browser.cookiesEnabled ? "Yes" : "No"}
            />
            <InfoItem
              icon={<Info className="h-5 w-5" />}
              label="Do Not Track"
              value={deviceData.browser.doNotTrack || "Not set"}
            />
            <InfoItem icon={<HardDrive className="h-5 w-5" />} label="Cache" value={deviceData.browser.cache} />
            <InfoItem
              icon={<PlugZap className="h-5 w-5" />}
              label="Plugins"
              value={deviceData.browser.plugins.join(", ") || "None detected"}
            />
            <InfoItem
              icon={<PlugZap className="h-5 w-5" />}
              label="Extensions"
              value={deviceData.browser.extensions.join(", ")}
            />
            <InfoItem
              icon={<AlertTriangle className="h-5 w-5" />}
              label="Ad Blocker"
              value={deviceData.browser.adBlocker}
            />
            <InfoItem
              icon={<Lock className="h-5 w-5" />}
              label="Content Filtering"
              value={deviceData.browser.contentFiltering}
            />
            <InfoItem
              icon={<Smartphone className="h-5 w-5" />}
              label="Fingerprinting Resistance"
              value={deviceData.browser.fingerPrintingResistance}
            />
            <InfoItem
              icon={<Activity className="h-5 w-5" />}
              label="Last Key Pressed"
              value={deviceData.browser.lastKeyPressed}
            />
            <InfoItem
              icon={<Info className="h-5 w-5" />}
              label="Caps Lock"
              value={deviceData.browser.capsLockState ? "On" : "Off"}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Display Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              icon={<Monitor className="h-5 w-5" />}
              label="Screen Resolution"
              value={`${deviceData.screen.width} × ${deviceData.screen.height}`}
            />
            <InfoItem
              icon={<Monitor className="h-5 w-5" />}
              label="Color Depth"
              value={`${deviceData.screen.colorDepth} bit`}
            />
            <InfoItem icon={<Monitor className="h-5 w-5" />} label="Pixel Ratio" value={deviceData.screen.pixelRatio} />
            <InfoItem
              icon={<Monitor className="h-5 w-5" />}
              label="Orientation"
              value={deviceData.screen.orientation}
            />
            <InfoItem
              icon={<Smartphone className="h-5 w-5" />}
              label="Touch Screen"
              value={deviceData.screen.touchScreen ? "Yes" : "No"}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem icon={<HardDrive className="h-5 w-5" />} label="Platform" value={deviceData.system.platform} />
            <InfoItem icon={<Cpu className="h-5 w-5" />} label="CPU Cores" value={deviceData.system.cores} />
            <InfoItem icon={<HardDrive className="h-5 w-5" />} label="Memory" value={deviceData.system.memory} />
            <InfoItem icon={<Network className="h-5 w-5" />} label="Connection" value={deviceData.system.connection} />
            <InfoItem icon={<HardDrive className="h-5 w-5" />} label="Battery" value={deviceData.system.battery} />
            <InfoItem icon={<Cpu className="h-5 w-5" />} label="GPU" value={deviceData.system.gpu} />
            <InfoItem icon={<Speaker className="h-5 w-5" />} label="Speakers" value={deviceData.system.speakers} />
            <InfoItem icon={<Bluetooth className="h-5 w-5" />} label="Bluetooth" value={deviceData.system.bluetooth} />
            <InfoItem
              icon={<Smartphone className="h-5 w-5" />}
              label="Device Direction"
              value={deviceData.system.direction}
            />
            <InfoItem
              icon={<Smartphone className="h-5 w-5" />}
              label="Device Motion"
              value={deviceData.system.deviceMotion}
            />
            <InfoItem icon={<Mouse className="h-5 w-5" />} label="Mouse" value={deviceData.system.mouse} />
            <InfoItem
              icon={<Smartphone className="h-5 w-5" />}
              label="Touchscreen"
              value={deviceData.system.touchscreen}
            />
            <InfoItem
              icon={<Info className="h-5 w-5" />}
              label="Speech Synthesis"
              value={deviceData.system.speechSynthesis}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Network className="h-5 w-5" />
            Network Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem icon={<Network className="h-5 w-5" />} label="IP Address" value={deviceData.network.ip} />
            <InfoItem icon={<Lock className="h-5 w-5" />} label="VPN" value={deviceData.network.vpn} />
            <InfoItem icon={<Globe className="h-5 w-5" />} label="Tor" value={deviceData.network.tor} />
            <InfoItem icon={<Server className="h-5 w-5" />} label="Proxy" value={deviceData.network.proxy} />
            <InfoItem icon={<Wifi className="h-5 w-5" />} label="ISP" value={deviceData.network.isp} />
            <InfoItem icon={<Network className="h-5 w-5" />} label="WAN" value={deviceData.network.wan} />
            <InfoItem icon={<Network className="h-5 w-5" />} label="LAN" value={deviceData.network.lan} />
            <InfoItem
              icon={<MapPin className="h-5 w-5" />}
              label="Location"
              value={
                deviceData.network.latitude && deviceData.network.longitude
                  ? `${deviceData.network.latitude}, ${deviceData.network.longitude}`
                  : "Not available"
              }
            />
            <InfoItem icon={<Server className="h-5 w-5" />} label="Hostname" value={deviceData.network.hostname} />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              icon={<HardDrive className="h-5 w-5" />}
              label="Local Storage"
              value={deviceData.storage.localStorage ? "Available" : "Not available"}
            />
            <InfoItem
              icon={<HardDrive className="h-5 w-5" />}
              label="Session Storage"
              value={deviceData.storage.sessionStorage ? "Available" : "Not available"}
            />
            <InfoItem
              icon={<HardDrive className="h-5 w-5" />}
              label="IndexedDB"
              value={deviceData.storage.indexedDB ? "Available" : "Not available"}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              icon={<Activity className="h-5 w-5" />}
              label="Page Load Time"
              value={deviceData.performance.pageLoadTime}
            />
            <InfoItem
              icon={<Activity className="h-5 w-5" />}
              label="Network Time"
              value={deviceData.performance.networkTime}
            />
            <InfoItem
              icon={<Activity className="h-5 w-5" />}
              label="DNS Lookup Time"
              value={deviceData.performance.dnsLookupTime}
            />
            <InfoItem
              icon={<Activity className="h-5 w-5" />}
              label="TCP Connection Time"
              value={deviceData.performance.tcpConnectionTime}
            />
            <InfoItem
              icon={<Activity className="h-5 w-5" />}
              label="Server Response Time"
              value={deviceData.performance.serverResponseTime}
            />
            <InfoItem
              icon={<Activity className="h-5 w-5" />}
              label="Page Download Time"
              value={deviceData.performance.pageDownloadTime}
            />
            <InfoItem
              icon={<Activity className="h-5 w-5" />}
              label="Browser Render Time"
              value={deviceData.performance.browserRenderTime}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Info className="h-5 w-5" />
            Other Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              icon={<Info className="h-5 w-5" />}
              label="Canvas Fingerprint"
              value={deviceData.other.canvasFingerprint.substring(0, 20) + "..."}
            />
            <InfoItem icon={<Info className="h-5 w-5" />} label="Audio Context" value={deviceData.other.audioContext} />
            <InfoItem icon={<Info className="h-5 w-5" />} label="WebRTC" value={deviceData.other.webRTC} />
            <InfoItem icon={<Info className="h-5 w-5" />} label="WebGL" value={deviceData.other.webGL} />
            <InfoItem
              icon={<Info className="h-5 w-5" />}
              label="Browser Window Size"
              value={deviceData.other.browserWindowSize}
            />
            <InfoItem icon={<Info className="h-5 w-5" />} label="HTTP Version" value={deviceData.other.httpVersion} />
            <InfoItem icon={<Info className="h-5 w-5" />} label="TLS Version" value={deviceData.other.tlsVersion} />
            <InfoItem icon={<Info className="h-5 w-5" />} label="Cipher" value={deviceData.other.cipher} />
            <InfoItem icon={<Info className="h-5 w-5" />} label="Page Referrer" value={deviceData.other.pageReferrer} />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button onClick={fetchDeviceInfo} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Information
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

