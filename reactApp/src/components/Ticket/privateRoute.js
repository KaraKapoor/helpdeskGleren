// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { baseURL } from '../../http-common';

const PrivateRoute = ({ component: Component, ...rest }) => {

    // Add your own authentication on the below line.
    const isLoggedIn = sessionStorage.getItem("userId");
    console.log("Pawan" + isLoggedIn);

    if (isLoggedIn !== null) {
        return (
            isLoggedIn !== null &&
            <Route
                {...rest}
                render={props => (<Component {...props} />)
                }
            />
        )
    } else if (window.location.hostname.includes("nspirahelpdesk.smaera.com")) {
        window.location.href = baseURL + '/api/auth'
    } else {
        window.location.href = baseURL + '/login'
    }

}

export default PrivateRoute