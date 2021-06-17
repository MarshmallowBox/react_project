import React from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.js'
import PostListPage from './pages/PostListPage.js'
import PostPage from './pages/PostPage.js'
import RegisterPage from './pages/RegisterPage.js'
import WritePage from './pages/WritePage.js'
function App() {
  return (
    <>
      <Route component = { LoginPage } path="/login" />
 
      <Route component = { PostListPage } path= {[ "/post" ]} exact />
      <Route component = { PostPage } path="/post/:postId" />
      <Route component = { RegisterPage } path="/register" />
      <Route component = { WritePage } path="/write" />
    < />
  );
}
     // <Route component = { PostListPage } path= {[ '/@:username', '/']} exact />
export default App;
