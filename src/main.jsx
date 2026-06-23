import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// This is where React "takes over" the empty <div id="root"> in index.html.
// createRoot is the React 18 API. StrictMode adds dev-time checks (it double-
// invokes some functions to surface bugs — harmless, dev only).
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
