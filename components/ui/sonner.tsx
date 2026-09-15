"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-2 group-[.toaster]:border-black group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-[.toaster]:rounded-none group-[.toaster]:font-bold text-base p-4",
          description: "group-[.toast]:text-black/80 font-medium text-sm mt-1",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-black group-[.toast]:border-2 group-[.toast]:border-black group-[.toast]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
          cancelButton:
            "group-[.toast]:bg-accent group-[.toast]:text-black group-[.toast]:border-2 group-[.toast]:border-black",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
