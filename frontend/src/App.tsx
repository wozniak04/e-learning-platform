import { Route, Routes } from "react-router-dom";
import LoginPage from "./login/LoginPage";
import MainPage from "./mainPage/mainpage";
import { AuthProvider } from "./auth/AuthContext";
import PrivateLayout from "./auth/Private";
import RegisterPage from "./login/RegisterPage";
import Course from "./course/Course";
import PathTracker from "./PathTracker";
import Create_Course from "./course/Create_Course";
function App() {
  return (
    <>
      <AuthProvider>
        <PathTracker />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route element={<PrivateLayout />}>
            <Route path="/course/:url" element={<Course />} />
            <Route path="/course/create" element={<Create_Course />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
