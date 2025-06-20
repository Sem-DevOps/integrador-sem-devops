import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Store from './pages/Store';
import Tutorials from './pages/Tutorials';
import Menu from './pages/Menu';
import Jobs from './pages/Jobs';
import Franchises from './pages/Franchises';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<Store />} />
          <Route path="/tutoriales" element={<Tutorials />} />
          <Route path="/menu-tienda" element={<Menu />} />
          <Route path="/trabaja" element={<Jobs />} />
          <Route path="/franquicias" element={<Franchises />} />
          <Route path="/contacto" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;