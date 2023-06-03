import logo from './logo.svg';
import './App.css';
import City from './Components/City';
import Zone from './Components/Zone';
import Map from './Components/pharamcyManagement'
import Footer from './Components/Footer';

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import NavbarCom from './Components/Navbar';
import Pharmacy from './Components/Pharmacy';
import Garde from './Components/Garde';
import Login from './Components/Login';

function App() {
  return (
    <div>
      <div style={{ backgroundColor: "white" }}>
      <BrowserRouter>
        <NavbarCom />

        <div>
          
            <Routes>
              <Route path="/*" element={<Map />}></Route>
              <Route path="/Zone/*" element={<Zone />}></Route>
              <Route path="/City/*" element={<City />}></Route>
              <Route path="/Pharmacy/*" element={<Pharmacy />}></Route>
              <Route path="/Garde/*" element={<Garde />}></Route>
              <Route path="/Login/*" element={<Login />}></Route>
            </Routes>
          
        </div>
        </BrowserRouter>

      </div>

      <Footer />
          </div>
  );
}

export default App;
