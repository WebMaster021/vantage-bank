import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Register from "./pages/Register.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Navigate to="/dashboard" replace /> } />
            </Routes>
        </BrowserRouter>
    )
}

export default App