import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
// import Header from './components/userscreen/header';
import Login from './components/userscreen/login';
import Register from './components/userscreen/register';

function App() {
  return (
    <Router>
    <div className="App">
     <Routes>
      <Route path='/' element={ <Login/>}/>
      <Route path='/register' element={ <Register/>}/>

     </Routes>
    </div>
    </Router>
  );
}

export default App;
