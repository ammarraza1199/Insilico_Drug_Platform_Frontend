import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/common/ErrorBoundary'
import './index.css'

async function enableMocking() {
  if (import.meta.env.MODE !== 'development' || import.meta.env.VITE_API_MODE === 'live') {
    return
  }

  const { worker } = await import('./mocks/browser')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and running.
  return worker.start({
    onUnhandledRequest(request, print) {
      // Ignore HMR and internal vite requests
      if (request.url.includes('/@vite/') || request.url.includes('/node_modules/')) {
        return;
      }
      print.warning();
    },
    serviceWorker: {
      url: '/mockServiceWorker.js'
    },
    quiet: true,
    waitUntilReady: true
  })
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  )
})
