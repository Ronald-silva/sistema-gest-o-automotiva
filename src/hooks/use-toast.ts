import { toast } from "sonner"

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  id?: string;
}

export const useToast = () => {
  const toasts: ToastProps[] = [];
  
  return {
    toast,
    toasts,
    dismiss: () => {},
  }
}

export { toast }