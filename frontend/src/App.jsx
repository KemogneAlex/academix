import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Courses from './components/pages/Courses';
import Detail from './components/pages/Detail';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import MyCourses from './components/pages/account/MyCourses';
import MyLearning from './components/pages/account/MyLearning';
import WatchCourse from './components/pages/account/WatchCourse';
import ChangePassword from './components/pages/account/ChangePassword';
import Dashboard from './components/pages/account/Dashboard';
import { RequireAuth, RequireInstructor } from './components/common/RequireAuth';
import CreateCourse from './components/pages/account/courses/CreateCourse';
import EditCourse from './components/pages/account/courses/EditCourse';
import EditLesson from './components/pages/account/courses/EditLesson';
import LeaveRating from './components/pages/account/courses/LeaveRating';
import Profile from './components/pages/account/courses/Profile';
import Certificates from './components/pages/account/Certificates';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* ── Pages publiques ── */}
          <Route path='/' element={<Home />} />
          <Route path='/courses' element={<Courses />} />
          <Route path='/detail/:slug' element={<Detail />} />
          <Route path='/account/login' element={<Login />} />
          <Route path='/account/register' element={<Register />} />

          {/* ── Pages authentifiées (tous rôles) ── */}
          <Route path='/account/dashboard' element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path='/account/profile' element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path='/account/change-password' element={<RequireAuth><ChangePassword /></RequireAuth>} />
          <Route path='/account/my-learning' element={<RequireAuth><MyLearning /></RequireAuth>} />
          <Route path='/account/certificates' element={<RequireAuth><Certificates /></RequireAuth>} />
          <Route path='/account/watch-course/:id' element={<RequireAuth><WatchCourse /></RequireAuth>} />
          <Route path='/account/leave-rating/:id' element={<RequireAuth><LeaveRating /></RequireAuth>} />

          {/* ── Pages formateur uniquement ── */}
          <Route path='/account/my-courses' element={<RequireInstructor><MyCourses /></RequireInstructor>} />
          <Route path='/account/courses/create' element={<RequireInstructor><CreateCourse /></RequireInstructor>} />
          <Route path='/account/courses/edit/:id' element={<RequireInstructor><EditCourse /></RequireInstructor>} />
          <Route path='/account/courses/edit-lesson/:id/:courseId' element={<RequireInstructor><EditLesson /></RequireInstructor>} />
        </Routes>
      </BrowserRouter>
      <Toaster position='top-center' reverseOrder={false} />
    </>
  );
}

export default App;
