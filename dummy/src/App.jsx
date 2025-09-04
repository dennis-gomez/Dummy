import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import AuthPage from './components/pages/authPage'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AuthPage />} />
          <ProtectedRoute>
            <Route path='/start_page' element={<MiscellaneousPage />} />
          </ProtectedRoute>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
