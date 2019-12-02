import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveMenuType } from "../../services/menuTypeService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";

class MenuTypeForm extends Form {
  state = {
    data: {
      name: ""
    },
    errors: {}
  };

  schema = {
    id: Joi.string(),
    name: Joi.string()
      .required()
      .label("Menu type name")
  };

  doSubmit = async () => {
    try {
      this.setState({ blocking: true });
      await saveMenuType(this.state.data);
      this.setState({ blocking: false });
      toast.success("Menu type has been added successfully.");
      this.props.history.push("/menu-types");
    } catch (ex) {
      console.log(ex.response);
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        this.setState({ errors, blocking: false });
        //toast.warning("check validation errors.");
      }
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Add menu type" icon="tag" />
        <form onSubmit={this.handleSubmit} className="ui error form">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colspan="2">Add menu type</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row width="8">
                <Table.Cell>
                  {this.renderInput("name", "Menu type", "text")}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>{this.renderButton("Save")}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </form>
      </BlockUi>
    );
  }
}

export default MenuTypeForm;
