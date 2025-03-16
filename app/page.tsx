"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DeviceInfo from "@/components/device-info"
import SpeedTest from "@/components/speed-test"
import Credits from "@/components/credits"

export default function Home() {
  const [activeTab, setActiveTab] = useState("device-info")

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Device Information Service</h1>
          <p className="text-muted-foreground">Check your device details, test your connection speed, and more</p>
        </div>

        <Tabs defaultValue="device-info" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="device-info">Device Info</TabsTrigger>
            <TabsTrigger value="speed-test">Speed Test</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
          </TabsList>
          <TabsContent value="device-info">
            <DeviceInfo />
          </TabsContent>
          <TabsContent value="speed-test">
            <SpeedTest />
          </TabsContent>
          <TabsContent value="credits">
            <Credits />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

