import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import Register from './components/userscreen/register';
import Home from './components/userscreen/home';
import AdminHome from './components/adminscreen';
import Login from './components/userscreen/login';
import UserDetails from './components/adminscreen/user';
import Progress from './components/userscreen/progress';



function App() {
  return (
    <Router>
    <div className="App">
     <Routes>
     {/* user routes  */}
      <Route path='/' element={<Home/>}/>
      <Route path='/register' element={ <Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/progress' element={<Progress/>}/>


      {/* admin Routes  */}
      <Route path='/admin' element={ <AdminHome/>}/>
      <Route path='/user' element={ <UserDetails/>}/>
     </Routes>
    </div>
    </Router>
  );
}

export default App;
