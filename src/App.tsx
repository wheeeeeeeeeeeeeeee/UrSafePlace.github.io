import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Mindfulness } from './components/Mindfulness'
import { Community } from './pages/Community'
import { Events } from './pages/Events'
import { Home } from './pages/Home'
import { Journal } from './pages/Journal'
import { Moderation } from './pages/Moderation'
import { ResourceDetail, Resources } from './pages/Resources'
import { Support } from './pages/Support'

export function App() {
  return (
    <Routes>
      <Route path="/breathe" element={<Mindfulness />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/community" element={<Community />} />
        <Route path="/events" element={<Events />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:id" element={<ResourceDetail />} />
        <Route path="/support" element={<Support />} />
        <Route path="/moderation" element={<Moderation />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
