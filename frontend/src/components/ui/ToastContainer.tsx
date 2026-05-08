import { Toast, type ToastItem } from "./Toast";

type ToastContainerProps = {
  toasts: ToastItem[];
  onClose: (id: string) => void;
};

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed right-5 top-5 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}