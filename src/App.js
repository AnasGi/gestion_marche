import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import AddMarche from './components/AddMarche';
import Todo from './components/Todo';
import WorkerInfo from './components/WorkerInfo';
import SignUp  from './components/SignUp'
import MarchesTable from './components/MarchesTable';
import { useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch()
  //prevent the change of reducer state when the page is refreshed
  const perfEntries = performance.getEntriesByType('navigation');
  if (perfEntries.length > 0) {
    const navigationEntry = perfEntries[0];
    if (navigationEntry.type === 'reload') {
      dispatch({type : "logedIn"})
    }
  }

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/Add' element={<AddMarche />} />
        <Route path='/home/:id/' element={<Home />} />
        <Route path='/InfosResponsable/:worker/' element={<WorkerInfo />} />
        <Route path='/AjouterMarché/:id/' element={<AddMarche />} />
        <Route path='/ListDesTache/:id/' element={<Todo/>} />
        <Route path='/AjouterResponsable/' element={<SignUp/>} />
        <Route path='/TousLesMarchés/' element={<MarchesTable/>} />
      </Routes>
    </div>
  );
}

export default App;
