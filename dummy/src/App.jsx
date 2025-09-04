import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import ProtectedRoute from './components/routes/protectedRoutes'
import AuthPage from './components/pages/authPage'
import MiscellaneousPage from './components/pages/miscellaneousPage'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route
              path="/"
              element={
               
                  <AuthPage />
                
              }
            />
            <Route
              path="/start_page"
              element={
                <ProtectedRoute>
                  <MiscellaneousPage />
                </ProtectedRoute>
              }
            />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
