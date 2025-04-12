import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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
    <AuthProvider>
      <Router>
      <div className="App">
      <Routes>
      {/* user routes  */}
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={ <Register/>}/>

        
        <Route path='/userdashboard' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }/>
        <Route path='/progress' element={
          <ProtectedRoute>
            <Progress/>
          </ProtectedRoute>
        }/>
        <Route path='/nutritions' element={
          <ProtectedRoute>
            <Nutrition/>
          </ProtectedRoute>
        }/>
        <Route path='/workout' element={
          <ProtectedRoute>
            <Workout/>
          </ProtectedRoute>
        }/>
        <Route path='/FeedbackForm' element={
          <ProtectedRoute>
            <FeedbackForm/>
          </ProtectedRoute>
        }/>
        <Route path='/workoutanalytics' element={
          <ProtectedRoute>
            <WorkoutAnalytics/>
          </ProtectedRoute>
        }/>
        <Route path='/nutritionanalytics' element={
          <ProtectedRoute>
            <NutritionAnalytics/>
          </ProtectedRoute>
        }/>
        <Route path='/progressanalytics' element={
          <ProtectedRoute>
            <ProgressAnalytics/>
          </ProtectedRoute>
        }/>
        <Route path='/workoutanalytics' element={
          <ProtectedRoute>
            <WorkoutAnalytics/>
          </ProtectedRoute>
        }/>
        <Route path='/profile' element={
          <ProtectedRoute>
            <UserProfile/>
          </ProtectedRoute>
        }/>

        {/* admin Routes  */}
        <Route path='/admin' element={
          <ProtectedRoute requiredRole="admin">
            <AdminHome/>
          </ProtectedRoute>
        }/>
        <Route path='/user' element={
          <ProtectedRoute requiredRole="admin">
            <UserDetails/>
          </ProtectedRoute>
        }/>
        <Route path='/FeedbackTable' element={
          <ProtectedRoute requiredRole="admin">
            <FeedbackTable/>
          </ProtectedRoute>
        }/>
      </Routes>
      </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
