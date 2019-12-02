import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getOutlet, updateOutletManager } from "../../services/outletService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import { Table } from "semantic-ui-react";
import TableTitle from "../common/tableTitle";

class OutletManagerEditForm extends Form {
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
      .label("Manager Name"),
    email: Joi.string()
      .required()
      .label("Manager Email"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  async populateOutlet() {
    try {
      this.setState({ blocking: true });
      const outletId = this.props.match.params.id;
      const { data: outlet } = await getOutlet(outletId);
      this.setState({ blocking: false });
      this.setState({ data: this.mapToViewModel(outlet) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateOutlet();
  }

  mapToViewModel(outlet) {
    return {
      name: outlet.user.name,
      email: outlet.user.email,
      password: ""
    };
  }

  doSubmit = async () => {
    try {
      const outletId = this.props.match.params.id;
      const managerId = this.props.match.params.uid;

      const data = { ...this.state.data };
      data.manager_id = parseInt(managerId);
      this.setState({ blocking: true });
      await updateOutletManager(data);
      toast.success("Manager has been updated successfully.");
      this.setState({ blocking: false });
      this.props.history.push("/outlets");
    } catch (ex) {
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.email)
          errors.email = ex.response.data.errors.email;

        this.setState({ errors, blocking: false });
        // toast.warning("check validation errors.");
      }
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Update manager" icon="tag" />
        <form onSubmit={this.handleSubmit} className="ui error form">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colspan="2">Update manager</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row width="8">
                <Table.Cell>
                  {this.renderInput("name", "Manager Name", "text")}
                </Table.Cell>
                <Table.Cell width="8">
                  {this.renderInput("email", "Email", "text")}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  {this.renderInput("password", "Password", "password")}
                </Table.Cell>
                <Table.Cell></Table.Cell>
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

export default OutletManagerEditForm;
