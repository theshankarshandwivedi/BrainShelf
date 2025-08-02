import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  function isLoggedIn(){
    let value = false;
    return value;
  }
  return (
    <div className="App">
      <div>
        <Routes>
          <Route path="/">
            <Route index element={<Home/>}></Route>
            <Route path='dashboard' element={isLoggedIn? (<Dashboard/>): (<Login/>)}></Route>
            <Route path='login' element={<Login/>}></Route>
            <Route path='register' element={<Register/>}></Route>
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
