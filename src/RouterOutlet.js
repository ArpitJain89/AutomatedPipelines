import React, { Suspense, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useRouteMatch
} from "react-router-dom";

class AsyncRouteComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { canActivate: false };
  }

  componentDidMount() {
    if (this.props.route.canActivate) {
      this.props.route
        .canActivate()
        .then(() => {
          this.setState({ canActivate: true });
        })
        .catch(() => {
          this.setState({ canActivate: false });
        });
    } else {
      this.setState({ canActivate: true });
    }
  }

  render() {
    return this.state.canActivate ? (
      <this.props.route.component
        {...this.props}
        data={this.props.route.data}
        routeConfig={this.props.route.routeConfig}
      />
    ) : (
      <div></div>
    );
  }
}

const RouterOutletSwitch = ({ routeConfig }) => {
  
  let { path, url } = useRouteMatch();

  return (
    <Switch>
      {routeConfig.routes &&
        routeConfig.routes.map((route, i) => {
       console.log("path", route);

          return (
            <Route
              key={path + i}
              path={(path + route.path).replace(/\/\//g, "/")}
              exact={route.exact}
              render={props => 
                <AsyncRouteComponent {...props} route={route} />}
            />
          );
        })}
    </Switch>
  );
};

export const RouterOutlet = ({ routeConfig }) => (
  <div>
    {routeConfig.fallback && (
      <Suspense fallback={routeConfig.fallback}>
        <RouterOutletSwitch routeConfig={routeConfig} />
      </Suspense>
    )}

    {!routeConfig.fallback && <RouterOutletSwitch routeConfig={routeConfig} />}
  </div>
);

export default RouterOutlet;
