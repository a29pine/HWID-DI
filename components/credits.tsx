import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Github, Heart, Info, Twitter } from "lucide-react"
import Link from "next/link"

export default function Credits() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          About This Service
        </CardTitle>
        <CardDescription>Information about the device information service and its creators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">About</h3>
          <p className="text-sm text-muted-foreground">
            This device information service provides detailed information about your device, browser, and network
            connection. It also includes a WiFi speed test to measure your connection speed and latency.
          </p>
          <p className="text-sm text-muted-foreground">
            All processing is done client-side in your browser. No personal information is stored or transmitted to any
            server except for the IP geolocation lookup which uses a third-party service.
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Features</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
            <li>Comprehensive device information including browser, screen, and system details</li>
            <li>Network information with IP address and geolocation</li>
            <li>WiFi speed test with download, upload, ping, and jitter measurements</li>
            <li>Fully responsive design that works on all devices</li>
            <li>Privacy-focused with client-side processing</li>
          </ul>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Technologies Used</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "Next.js", description: "React framework" },
              { name: "React", description: "UI library" },
              { name: "TypeScript", description: "Type-safe JavaScript" },
              { name: "Tailwind CSS", description: "Utility-first CSS" },
              { name: "shadcn/ui", description: "UI component library" },
              { name: "Lucide Icons", description: "Beautiful icons" },
            ].map((tech) => (
              <div key={tech.name} className="p-4 border rounded-lg">
                <h4 className="font-medium">{tech.name}</h4>
                <p className="text-xs text-muted-foreground">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Created By</h3>
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h4 className="font-medium">a29_pine</h4>
            <p className="text-sm text-muted-foreground">
              Developer passionate about creating useful web tools
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Link
                href="https://github.com/a29pine"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://twitter.com/a29pine"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground mt-8">
          <p>© {new Date().getFullYear()} a29pine. All rights reserved.</p>
          <p className="mt-1">Version 1.0.0</p>
          <p className="mt-1">
            Visit my website: 
            <Link
              href="https://a29pine.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              a29pine.xyz
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

