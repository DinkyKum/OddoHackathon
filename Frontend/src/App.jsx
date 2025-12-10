import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./Components/Body"
import Login from "./Components/Login"
import Profile from "./Components/Profile"
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./Components/Feed"
import Connections from "./Components/Connections";
import Requests from "./Components/Requests";
import CourseRequests from "./Components/CourseRequests";
import CoursePage from "./Components/CoursePage";
import MyCourses from "./Components/MyCourses";

function App() {
  return (
    <Provider store={appStore}>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Body/>}>
        <Route path="/" element={<Feed/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/connections" element={<Connections/>} />
        <Route path="/requests" element={<Requests/>} />
        <Route path="/course-requests" element={<CourseRequests/>} />
        <Route path="/my-courses" element={<MyCourses/>} />
        <Route path="/course/:courseId" element={<CoursePage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
