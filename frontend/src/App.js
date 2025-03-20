import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import Login from './components/userscreen/login';
import Register from './components/userscreen/register';
import Home from './components/userscreen/home';
import AdminHome from './components/userscreen/admin';

function App() {
  return (
    <Router>
    <div className="App">
     <Routes>
      <Route path='/' element={ <Login/>}/>
      <Route path='/register' element={ <Register/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/admin' element={<AdminHome/>}/>
     </Routes>
    </div>
    </Router>
  );
}

export default App;
