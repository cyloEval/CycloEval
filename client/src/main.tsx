import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="871049579850-goq7ehncdun5u7g6antk7p29g763d3hr.apps.googleusercontent.com"> 
      {/* 871049579850-goq7ehncdun5u7g6antk7p29g763d3hr.apps.googleusercontent.com */}
    <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
