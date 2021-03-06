import {CssBaseline} from "@material-ui/core";

function MyApp({Component, pageProps}) {
  return (
    <>
      <CssBaseline/>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
