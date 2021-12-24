import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import CommonContext from '../../contexts/CommonContext';

export default function PrivateRoute({ path, component: Component }) {

    const { isLoggedIn } = useContext(CommonContext);

    return (<Route
        path={path}
        exact
        render={() => {
            return isLoggedIn ? <Component /> : <Redirect to="/login" />
        }}
    ></Route>);

}
