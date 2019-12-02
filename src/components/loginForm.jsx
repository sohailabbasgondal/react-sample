import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";
import BlockUi from "react-block-ui";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  doSubmit = async () => {
    try {
      this.state.blocking = true;
      const { data } = this.state;
      await auth.login(data.username, data.password);
      this.state.blocking = false;

      const { state } = this.props.location;

      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      this.state.blocking = false;
      if (ex.response && ex.response.status === 401) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data.error;
        this.setState({ errors });
      }
    }
  };

  render() {
    const logoUrl = process.env.REACT_APP_URL + "/logo.png";
    if (auth.getCurrentUser()) return <Redirect to="/dashboard" />;
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <center>
          <form className="form-signin col-md-4" onSubmit={this.handleSubmit}>
            <img height="70" src={logoUrl} />
            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
            {this.renderInput("username", "Username", "text")}
            {this.renderInput("password", "Password", "password")}

            {this.renderButton("Login")}
            <p className="mt-5 mb-3 text-muted">©xoomics 2019-2020</p>
          </form>
        </center>
      </BlockUi>
    );
  }
}

export default LoginForm;
