import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";
import BlockUi from "react-block-ui";
import { Table, Grid } from "semantic-ui-react";

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

      window.location = "/dashboard";
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
    const logoUrl = process.env.REACT_APP_URL + "/logo.jpg";
    if (auth.getCurrentUser()) return <Redirect to="/dashboard" />;
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <center>
          <form className="ui form" onSubmit={this.handleSubmit}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={5}></Grid.Column>
                <Grid.Column width={6}>
                  <img height="70" src={logoUrl} />
                </Grid.Column>
                <Grid.Column width={5}></Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={5}></Grid.Column>
                <Grid.Column width={6}>
                  <Table size="small">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell colspan="2">Login</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row width="8">
                        <Table.Cell>
                          {this.renderInput("username", "Username", "text")}
                        </Table.Cell>
                      </Table.Row>

                      <Table.Row width="8">
                        <Table.Cell>
                          {this.renderInput("password", "Password", "password")}
                        </Table.Cell>
                      </Table.Row>

                      <Table.Row>
                        <Table.Cell>{this.renderButton("Login")}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Grid.Column>
                <Grid.Column width={5}></Grid.Column>
              </Grid.Row>
            </Grid>
          </form>
        </center>
      </BlockUi>
    );
  }
}

export default LoginForm;
