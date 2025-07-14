import { Route, Routes } from "react-router-dom";
import LoginPage from "./login/login";
import MainPage from "./mainPage/mainpage";
import { AuthProvider } from "./auth/AuthContext";
import PrivateLayout from "./auth/Private";
function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateLayout />}>
            <Route path="/main" element={<MainPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
