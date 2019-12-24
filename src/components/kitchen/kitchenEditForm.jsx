import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getUser, updateUser } from "../../services/userService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";

class KitchenEditForm extends Form {
  state = {
    data: {
      name: "",
      email: "",
      password: ""
    },
    errors: {}
  };

  schema = {
    name: Joi.string()
      .required()
      .label("Name"),
    email: Joi.string()
      .required()
      .label("Email"),
    password: Joi.string().label("Email")
  };

  async populateUser() {
    try {
      const userId = this.props.match.params.id;
      this.setState({ blocking: true });
      const { data: user } = await getUser(userId);

      this.setState({ blocking: false });
      this.setState({ data: this.mapToViewModel(user) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateUser();
  }

  mapToViewModel(user) {
    return {
      name: user.user.name,
      email: user.user.email
    };
  }

  doSubmit = async () => {
    try {
      const userId = this.props.match.params.id;

      const data = { ...this.state.data };
      data.id = parseInt(userId);
      this.setState({ blocking: true });
      await updateUser(data);
      this.setState({ blocking: false });
      toast.success("Kitchen user has been updated successfully.");
      this.props.history.push("/kitchens");
    } catch (ex) {
      console.log(ex.response);
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        if (ex.response.data.errors.email)
          errors.email = ex.response.data.errors.email;

        // if (ex.response.data.errors.password)
        //   errors.password = ex.response.data.errors.password;

        this.setState({ errors, blocking: false });
        // toast.warning("check validation errors.");
      }
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Update kitchen user" icon="tag" />
        <form onSubmit={this.handleSubmit} className="ui error form">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="2">
                  Update kitchen user
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row width="8">
                <Table.Cell>
                  {this.renderInput("name", "Name", "text")}
                </Table.Cell>
                <Table.Cell width="8">
                  {this.renderInput("email", "Email", "text")}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  {this.renderInput("password", "Password", "password")}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>{this.renderButton("Update")}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </form>
      </BlockUi>
    );
  }
}

export default KitchenEditForm;
