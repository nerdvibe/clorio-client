import { Redirect, Route } from "react-router";

interface IProps {
  Component: any;
  isAuthenticated: boolean;
  path: string;
  appProps?: any;
}

export const AuthenticatedRoute = ({
  Component,
  appProps,
  path,
  isAuthenticated,
  ...rest
}: IProps) => (
  <Route
    exact
    path={path}
    {...rest}
    render={(props) =>
      isAuthenticated ? (
        <Component {...props} {...appProps} />
      ) : (
        <Redirect to="/" />
      )
    }
  />
);
