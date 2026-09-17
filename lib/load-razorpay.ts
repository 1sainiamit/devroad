declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      on: (event: string, handler: () => void) => void;
      open: () => void;
    };
  }
}

export function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    
    if ("Razorpay" in window) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}
