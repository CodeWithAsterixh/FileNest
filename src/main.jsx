import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './Redux/store.js'
import { BrowserRouter } from 'react-router-dom'
import { ProcessProvider } from './Functions/processReturn.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <ProcessProvider>
          <BrowserRouter >
            <App />
          </BrowserRouter>
        </ProcessProvider>
    </Provider>
  </StrictMode>,
)
