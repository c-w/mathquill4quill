import "../styles/globals.css";
import "katex/dist/katex.min.css";
import "mathquill/build/mathquill.css";
import "mathquill4quill/mathquill4quill.css";
import "react-quill/dist/quill.snow.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
