import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Visualizations } from './pages/Visualizations';
import { Predictions } from './pages/Predictions';
import { Analytics } from './pages/Analytics';
import { Export } from './pages/Export';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/visualizations" element={<Visualizations />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/export" element={<Export/>} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Layout>
  );
}

export default App;