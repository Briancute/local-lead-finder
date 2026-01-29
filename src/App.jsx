import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import DashboardOverview from './pages/DashboardOverview';
import LeadSearch from './pages/LeadSearch';
import MyLeads from './pages/MyLeads';
import EmailTemplates from './pages/EmailTemplates';
import Outreach from './pages/Outreach';
import Settings from './pages/Settings';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="search" element={<LeadSearch />} />
          <Route path="leads" element={<MyLeads />} />
          <Route path="templates" element={<EmailTemplates />} />
          <Route path="outreach" element={<Outreach />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
