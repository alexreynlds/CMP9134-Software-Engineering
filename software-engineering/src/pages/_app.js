import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";

export default function App({ Component, pageProps, router }) {
  return (
    <Provider>
      <Toaster />
      <Component {...pageProps} key={router.route} />
    </Provider>
  );
}
