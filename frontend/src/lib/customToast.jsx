import toastLib from "react-hot-toast"
import React from "react"
import Toast from "../components/Toast.jsx"

export function ToastContainer({ children }) {
    return (
        <div
            aria-live="assertive"
            className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full"
        >
            {children}
        </div>
    )
}

const render = (type, message) =>
    toastLib.custom(
        (t) => (
            <Toast
                key={t.id}
                t={t}
                type={type}
                message={message}
                onClose={(id) => toastLib.remove(id)}
            />
        ),
        {
            duration: Infinity, // disable built-in timer, control with Toast.jsx progress
            position: "top-right",
        }
    )

export const customToast = {
    success: (msg) => render("success", msg),
    error: (msg) => render("error", msg),
    info: (msg) => render("info", msg),
    warning: (msg) => render("warning", msg),
}
