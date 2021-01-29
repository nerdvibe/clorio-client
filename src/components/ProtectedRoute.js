import React from "react";
import {
    Route,
    Redirect
} from "react-router-dom";
import { useCookies } from 'react-cookie';
import Authentication from "../tools/auth";

const ProtectedRoute = ({
    component: Component,
    ...rest
}) => {
    const [cookies, setCookie] = useCookies(['isAuthenticated']);

    return (
        <Route {...rest} render = { props => {
                if (cookies.isAuthenticated) {
                    return <Component {
                        ...props
                    }
                    />;
                } else {
                    return ( <
                        Redirect to = {
                            {
                                pathname: "/",
                                state: {
                                    from: props.location
                                }
                            }
                        }
                        />
                    );
                }
            }
        }
        />
    );
};

export default ProtectedRoute;