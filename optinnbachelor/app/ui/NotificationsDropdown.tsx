"use client"

import { useState } from "react"
import { Bell, Check, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type Notification = {
  id: string
  title: string
  description?: string
  timestamp: Date
  read: boolean
  priority?: "low" | "medium" | "high"
}

// Sample notifications data
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "Flomvarsel i ditt område",
    description: "Det er meldt om økt vannstand i elver og bekker i nærheten av din lokasjon.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    priority: "high",
  },
  {
    id: "2",
    title: "Kraftig vind de neste 24 timene",
    description: "Meteorologisk institutt har sendt ut gult farevarsel for vind.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    priority: "medium",
  },
  {
    id: "3",
    title: "Høyt polleninnhold i lufta",
    description: "Pollenvarselet for i dag viser høye nivåer av bjørk og gress.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    priority: "low",
  },
]

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} sek siden`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min siden`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} timer siden`
    return `${Math.floor(diffInSeconds / 86400)} dager siden`
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const getPriorityColor = (priority?: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-amber-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-[#366249]"
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-[#366249] hover:text-white focus:bg-[#366249] focus:text-white"
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-none">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 border-[#366249] bg-white text-gray-800" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3 pt-4 px-4 bg-[#1E3528] text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Varsler</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-white hover:bg-[#366249] hover:text-white"
                  onClick={markAllAsRead}
                >
                  <Check className="mr-1 h-3 w-3" />
                  Marker alle som lest
                </Button>
              )}
            </div>
          </CardHeader>
          <Separator />
          {notifications.length > 0 ? (
            <>
              <ScrollArea className="h-[320px]">
                <CardContent className="p-0">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-b last:border-0 transition-colors hover:bg-gray-50",
                        !notification.read && "bg-gray-50",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                            getPriorityColor(notification.priority),
                          )}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn("text-sm", !notification.read && "font-medium")}>{notification.title}</p>
                            <div className="flex items-center text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              <span className="text-xs whitespace-nowrap">{formatTimeAgo(notification.timestamp)}</span>
                            </div>
                          </div>
                          {notification.description && (
                            <p className="text-xs text-gray-500">{notification.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </ScrollArea>
              <Separator />
              <CardFooter className="p-2 flex justify-center">
                <Button variant="link" size="sm" className="text-xs text-[#1E3528] hover:text-[#366249]">
                  Se alle varsler
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </CardFooter>
            </>
          ) : (
            <CardContent className="py-6 text-center">
              <p className="text-gray-500 text-sm">Ingen varsler å vise</p>
            </CardContent>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  )
}
