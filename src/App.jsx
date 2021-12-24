import React from 'react'
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from './components/Home/Home';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import VerifyEmail from './components/VerifyEmail/VerifyEmail';
import NotFound from './components/NotFound/NotFound';
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Header from "./components/Header/Header";
import axios from 'axios';
import { useState } from 'react';
import CommonContext from './contexts/CommonContext';
import RedirectPage from './components/RedirectPage';

axios.defaults.baseURL = process.env.REACT_APP_API;

export default function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token"));

    return <CommonContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <BrowserRouter>
            <Header />
            <Switch>

                <PrivateRoute exact path="/" component={Home} />
                <Route exact path="/verify-id/:jwt" component={VerifyEmail} />

                <Route path="/home" exact component={Home}><Redirect to="/" /></Route>


                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/forgot-password" component={ForgotPassword} />
                <Route exact path="/reset-password/:jwt" component={ResetPassword} />
                <Route exact path="/:url" component={RedirectPage} />


                <Route path="*" component={NotFound}></Route>

            </Switch>
        </BrowserRouter>
    </CommonContext.Provider>
}
