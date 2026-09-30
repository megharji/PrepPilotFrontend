import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "./components/RouteGuards";
import AppLayout from "./layout/AppLayout";
import Snackbar from "./components/Snackbar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import InterviewSetupPage from "./pages/InterviewSetupPage";
import InterviewRoomPage from "./pages/InterviewRoomPage";
import InterviewReportPage from "./pages/InterviewReportPage";
import DemoPage from "./pages/demo/DemoPage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Demo sabke liye khula hai, login ki zaroorat nahi */}
      <Route path="/demo" element={<DemoPage />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
      </Route>

      {/* Login ke baad: sab pages pe same header (AppLayout) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<InterviewReportPage />} />
          <Route path="/interview" element={<InterviewSetupPage />} />
          <Route path="/interview/live" element={<InterviewRoomPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    {/* Success/error messages (sagas se) har page pe */}
    <Snackbar />
  </BrowserRouter>
);

export default App;
