import { createRoot } from 'react-dom/client'
import { AppProviders } from './app/AppProviders'
import { AppRouter } from './router/AppRouter'
import './styles/global.css'
import './styles/layout.css'
import './styles/variables.css'

createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <AppRouter />
  </AppProviders>
)
