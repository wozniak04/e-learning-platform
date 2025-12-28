import { Route, Routes } from "react-router-dom";
import LoginPage from "./login/LoginPage";
import MainPage from "./mainPage/mainpage";
import { AuthProvider } from "./auth/AuthContext";
import PrivateLayout from "./auth/Private";
import RegisterPage from "./login/RegisterPage";
import Course from "./course/CourseDetail";
import PathTracker from "./PathTracker";
import Create_Course from "./course/Create_Course";
import NotFoundPage from "./Not_Found";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
            <Route path="/course/:id" element={<Course />} />
            <Route path="/course/create" element={<Create_Course />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer position="top-center" autoClose={1700} />
      </AuthProvider>
    </>
  );
}

export default App;
