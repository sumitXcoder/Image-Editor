import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import App from './App.jsx'

const Theme = () => {
  const [myTheme, setMyTheme] = useState(true)
  const theme = extendTheme({
    styles: {
      global: {
        ":root": {
          "--outline-color": myTheme ? "rgba(255, 255, 255, 0.47)" : "rgba(0, 0, 0, 0.7)",
          "--outline-color-low": myTheme ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.2)",
          "--bg": myTheme ? "#414141" : "#cccccc",
          "--top-bg": myTheme ? "#282828" : "#e3e3e3",
          "--top-button-bg": myTheme ? "#444444" : "#d5d5d5",
          "--top-button-hover": myTheme ? "#dddddd" : "#888888",
          "--color": myTheme ? "#ffffff" : "#111111",
          "--panel-bg": myTheme ? "rgba(100,100,100,.3)" : "rgba(225,225,225,1)",
          "--slider-filled-track-color": myTheme ? "lightblue" : "#00c8ff",
          "--slider-track-color": myTheme ? "grey" : "#bbbbbb",
          "--slider-thumb-color": myTheme ? "#000000" : "#00c8ff",
          "--slider-thumb-border-color": myTheme ? "lightblue" : "#999",
          "--active-tab-color": myTheme ? "#5c809caa" : "#94d4e6",
          "--tab-hover":myTheme?"#666":"#c5c5c5",
          "--input-bg":myTheme?"#444":"#ccc"
        }
      }
    }
  })
  return (
    <ChakraProvider theme={theme}>
      <App theme={myTheme} setTheme={setMyTheme} />
    </ChakraProvider>
  )
}
ReactDOM.createRoot(document.getElementById('root')).render(<Theme />)
