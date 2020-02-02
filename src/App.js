import React, { Component } from "react";
import Dashboard from "./components/dashboard";
import { Route, Redirect, Switch } from "react-router-dom";
import NotFound from "./components/notfound";

import Navigation from "./components/common/navigation";
import LoginForm from "./components/loginForm";

import RoomTypes from "./components/room_ledger_type/types";
import RoomTypeForm from "./components/room_ledger_type/typeForm";
import RoomTypeEditForm from "./components/room_ledger_type/typeEditForm";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "react-block-ui/style.css";
import "./App.css";
import Logout from "./components/logout";
import auth from "./services/authService";
import ProtectedRoute from "./components/common/protectedRoute";
import { Container } from "semantic-ui-react";

class App extends Component {
  state = {};
  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }
  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        {user && <Navigation user={user} />}
        <ToastContainer />

        <Container style={{ marginTop: "6em", width: "96%" }}>
          <Switch>
            <ProtectedRoute
              path="/dashboard/:outlet"
              exact
              component={Dashboard}
            />
            <ProtectedRoute path="/dashboard" component={Dashboard} />

            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
