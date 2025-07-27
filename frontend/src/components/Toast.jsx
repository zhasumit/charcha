import React, { useEffect, useState } from "react"
import {
    CheckCircle,
    Siren,
    BadgeInfo,
    FlameKindling,
    X,
} from "lucide-react"

const toastStyles = {
    success: {
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
        progress: "bg-green-600/50",
        closeIconColor: "text-green-600",
    },
    error: {
        icon: <Siren className="w-5 h-5 text-red-600" />,
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-300",
        progress: "bg-red-600/50",
        closeIconColor: "text-red-600",
    },
    info: {
        icon: <BadgeInfo className="w-5 h-5 text-blue-600" />,
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-300",
        progress: "bg-blue-600/50",
        closeIconColor: "text-blue-600",
    },
    warning: {
        icon: <FlameKindling className="w-5 h-5 text-yellow-700" />,
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-300",
        progress: "bg-yellow-600/70",
        closeIconColor: "text-yellow-600",
    },
}

function Toast({ message, type = "info", t, onClose }) {
    const style = toastStyles[type]
    const [progress, setProgress] = useState(0)

    // Dynamic duration calculation
    const baseDuration = 2500 // ms for messages up to 20 chars
    const extraPerChar = 50 // ms added per char after 20
    const minDuration = 2000
    const maxDuration = 6000

    const duration = Math.min(
        maxDuration,
        Math.max(minDuration, baseDuration + (message.length - 20) * extraPerChar)
    )

    useEffect(() => {
        const interval = 50
        const step = (interval / duration) * 100

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer)
                    if (onClose && t) onClose(t.id)
                    return 100
                }
                return prev + step
            })
        }, interval)

        return () => clearInterval(timer)
    }, [onClose, t, duration])

    return (
        <div
            className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-lg border shadow-md ${style.bg} ${style.text} ${style.border} max-w-sm`}
        >
            {style.icon}
            <span className="text-sm font-medium">{message}</span>

            <button
                onClick={() => onClose && t && onClose(t.id)}
                className={`ml-2 p-1 rounded hover:bg-black/10 ${style.closeIconColor}`}
                aria-label="Close Toast"
            >
                <X className="w-3.5 h-3.5" />
            </button>

            {/* Timer bar */}
            <div className="absolute bottom-0 left-0 h-0.5 w-full rounded-b-lg overflow-hidden bg-black/10">
                <div
                    className={`${style.progress} h-full transition-all duration-75`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    )
}

export default Toast
