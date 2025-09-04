import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import AuthPage from './components/pages/authPage'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
