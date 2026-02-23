import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import ProtocolsPage from './pages/ProtocolsPage'
import ProtocolDetail from './pages/ProtocolDetail'
import ThreadsPage from './pages/ThreadsPage'
import ThreadDetail from './pages/ThreadDetail'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CreateProtocolPage from './pages/CreateProtocolPage'
import CreateThreadPage from './pages/CreateThreadPage'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="protocols" element={<ProtocolsPage />} />
          <Route path="protocols/:id" element={<ProtocolDetail />} />
          <Route path="threads" element={<ThreadsPage />} />
          <Route path="threads/:id" element={<ThreadDetail />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="protocols/create" element={<CreateProtocolPage />} />
            <Route path="threads/create" element={<CreateThreadPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}