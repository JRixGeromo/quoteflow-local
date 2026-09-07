import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DataProvider } from './lib/DataContext'
import { Clients } from './pages/Clients'
import { Dashboard } from './pages/Dashboard'
import { QuoteDetails } from './pages/QuoteDetails'
import { QuoteForm } from './pages/QuoteForm'
import { Quotes } from './pages/Quotes'

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/quotes/new" element={<QuoteForm />} />
            <Route path="/quotes/:id" element={<QuoteDetails />} />
            <Route path="/quotes/:id/edit" element={<QuoteForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </DataProvider>
  )
}

export default App
