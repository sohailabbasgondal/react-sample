import React, { Component } from "react";
import auth from "../services/authService";
import { Confirm } from "semantic-ui-react";

class Logout extends Component {
  state = {
    open: false
  };

  componentDidMount() {
    this.setState({ open: true });
  }

  handleCancel = () => {
    this.setState({ open: false });
    window.location = "/dashboard";
  };

  logout() {
    auth.logout();
    window.location = "/login";
  }

  render() {
    return (
      <Confirm
        open={this.state.open}
        header="Confirmation"
        content="Are you sure, you want to logout."
        onCancel={this.handleCancel}
        onConfirm={this.logout}
        size="mini"
      />
    );
  }
}

export default Logout;
