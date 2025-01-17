import {Suspense} from 'react';
import {Routes, Route, HashRouter} from 'react-router-dom';
import {getTokenPayload} from './common/Jwt';
import Navbar from './components/Navbar';
import AboutUs from './pages/AboutUs';
import Literatures from './pages/admin/Literatures';
import Statistik from './pages/admin/Statistik';
import Topik from './pages/admin/Topik';
import Users from './pages/admin/Users';
import Landing from './pages/Landing';
import Landing2 from './pages/Landing2';
import Peta from './pages/Peta';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Scraper from './pages/Scraper';

const App = () => {
  return (
    <div>
      <HashRouter>
        <Navbar />
        <Suspense fallback={<h1>Loading...</h1>}>
          <Routes>
            {getTokenPayload()?.role === 'ADM' ? (
              <>
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/scraper" element={<Scraper />} />
                <Route path="/admin/topik" element={<Topik />} />
                <Route path="/admin/literatures" element={<Literatures />} />
              </>
            ) : null}
            <Route path="/statistik" element={<Statistik />} />
            <Route path="/peta" element={<Peta />} />
            <Route path="/" element={<Landing />} />
            <Route path="/landing2" element={<Landing2 />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </div>
  );
};

export default App;
