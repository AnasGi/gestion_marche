import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './componenets/Login';
import Home from './componenets/Home';
import AddMarche from './componenets/AddMarche';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/Add' element={<AddMarche />} />
        <Route path='/home/:id/:securityKey' element={<Home />} />
        <Route path='/AddMarche/:id/:securityKey' element={<AddMarche />} />
      </Routes>
    </div>
  );
}

export default App;
