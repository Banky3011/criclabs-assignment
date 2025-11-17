import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from "./pages/Login";
import Home from './pages/Home';
import Footer from './components/Footer';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <div className="flex-1">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/home" element={<Home />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </BrowserRouter>
    )
}

export default App;