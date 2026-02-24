import { Toaster as Sonner, toast as originalToast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

// Wrap the original toast to defer invocations so they don't cause state updates
// during the render phase of other components (avoids React warning).
function toast(...args: any[]) {
  // defer to next microtask
  Promise.resolve().then(() => {
    try {
      (originalToast as any)(...args);
    } catch (e) {
      // swallow to avoid interrupting render; library will still log if needed
      console.error('Deferred toast error', e);
    }
  });
}

export { Toaster, toast };
