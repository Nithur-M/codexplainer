import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const root = ReactDOM.createRoot(document.getElementById('root'));
const config = {
  useSystemColorMode: false,
  initialColorMode: "light",
}

const customTheme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        h: 'auto',
        w: '320px',
        p: '5'
      }
    }
  }
  ,config });

root.render(
  <React.StrictMode>
    <ChakraProvider theme={customTheme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
