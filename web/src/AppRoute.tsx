import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from "./pages/Login";
import Home from './pages/Home';
import Footer from './components/Footer';

function App() {
    return (
        <BrowserRouter>
            <div className="relative min-h-screen">
                <div className="">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/home" element={<Home />} />
                    </Routes>
                </div>
                <div className="fixed bottom-0 left-0 right-0">
                    <Footer />
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App;