import { Route, Routes } from "react-router-dom";
import LoginPage from "./login/LoginPage";
import MainPage from "./mainPage/mainpage";
import { AuthProvider } from "./auth/AuthContext";
import PrivateLayout from "./auth/Private";
import RegisterPage from "./login/RegisterPage";
import CourseDetail from "./course/CourseDetail";
import PathTracker from "./PathTracker";
import Create_Course from "./course/edit/Create_Course";
import NotFoundPage from "./Not_Found";
import { ToastContainer } from "react-toastify";
import EditCourse from "./course/edit/EditCourse";
import CourseMaterialEditor from "./course/materials/CourseMaterialEditor";
import Learn from "./course/materials/Learn";
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
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/course/:id/edit" element={<EditCourse />} />
            <Route path="/course/create" element={<Create_Course />} />
            <Route
              path="/course/:id/materials"
              element={<CourseMaterialEditor />}
            />
            <Route path="/course/:id/learn" element={<Learn />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer position="top-center" autoClose={1700} />
      </AuthProvider>
    </>
  );
}

export default App;
