// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MySpace from './pages/MySpace';
import Navbar from './components/Navbar';
import Search from './pages/Search';
import MovieDetail from './pages/MovieDetail';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/my-space" element={
          <ProtectedRoute>
            <MySpace />
          </ProtectedRoute>
        } />

        <Route path="/search" element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        } />

        <Route path="/movie/:id" element={
          <ProtectedRoute>
            <MovieDetail />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App