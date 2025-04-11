import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import Register from './components/userscreen/register';
import Home from './components/userscreen/home';
import AdminHome from './components/adminscreen';
import Login from './components/userscreen/login';
import UserDetails from './components/adminscreen/user';
import Progress from './components/userscreen/progress';
import Nutrition from './components/userscreen/nutrition';
import Workout from './components/userscreen/workout';
import WorkoutAnalytics from './components/userscreen/workoutanalytics';
import FeedbackForm from './components/userscreen/FeedbackForm';
import FeedbackTable from './components/adminscreen/FeedbackTable';
import NutritionAnalytics from './components/userscreen/nutritionanalytics';
import ProgressAnalytics from './components/userscreen/progressanalytics';
import UserProfile from './components/userscreen/profile';

function App() {
  return (
    <Router>
    <div className="App">
     <Routes>
     {/* user routes  */}
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={ <Register/>}/>
      <Route path='/userdashboard' element={<Home/>}/>
      <Route path='/progress' element={<Progress/>}/>
      <Route path='/nutritions' element={<Nutrition/>}/>
      <Route path='/workout' element={<Workout/>}/>
      <Route path='/FeedbackForm' element={<FeedbackForm/>} />
      <Route path='/workoutanalytics' element={<WorkoutAnalytics/>}/>
      <Route path='/nutritionanalytics' element={<NutritionAnalytics/>}/>
      <Route path='/progressanalytics' element={<ProgressAnalytics/>}/>
      <Route path='/workoutanalytics' element={<WorkoutAnalytics/>}/>
      <Route path='/profile' element={<UserProfile/>}/>

      {/* admin Routes  */}
      <Route path='/admin' element={ <AdminHome/>}/>
      <Route path='/user' element={ <UserDetails/>}/>
      <Route path='/FeedbackTable' element={<FeedbackTable/>}/>
     </Routes>
    </div>
    </Router>
  );
}

export default App;
