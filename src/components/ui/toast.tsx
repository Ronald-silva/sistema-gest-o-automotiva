import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"

export interface ToastProps extends Omit<React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>, 'title'> {
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export type ToastActionElement = React.ReactElement<typeof ToastPrimitives.Action>

const ToastProvider = ToastPrimitives.Provider
const ToastViewport = ToastPrimitives.Viewport
const Toast = ToastPrimitives.Root
const ToastTitle = ToastPrimitives.Title
const ToastDescription = ToastPrimitives.Description
const ToastClose = ToastPrimitives.Close
const ToastAction = ToastPrimitives.Action

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}