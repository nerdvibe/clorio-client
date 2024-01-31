import { Redirect, Route } from "react-router";

interface IProps {
  Component: any;
  isAuthenticated: boolean;
  path: string;
  appProps?: any;
}

export const UnauthenticatedRoute = ({
  Component,
  isAuthenticated,
  path,
  appProps,
  ...rest
}: IProps) => (
  <Route
    path={path}
    exact
    {...rest}
    render={(props) =>
      !isAuthenticated ? (
        <Component {...props} {...appProps} />
      ) : (
        <Redirect to="/overview" />
      )
    }
  />
);
