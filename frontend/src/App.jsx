import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import { NAV_SECTIONS } from './components/navSections.js';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {/* Each nav section has its own URL that scrolls the home page to it */}
        {NAV_SECTIONS.map(({ id }) => (
          <Route key={id} path={id} element={<Home />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
