import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveMenuItem } from "../../services/menuItemService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";
import { getMenuTypes } from "../../services/menuTypeService";

class MenuItemForm extends Form {
  state = {
    data: {
      menu_type_id: "",
      name: ""
    },
    menu_types: [],
    errors: {}
  };

  schema = {
    id: Joi.string(),
    menu_type_id: Joi.string()
      .required()
      .label("Menu type"),
    name: Joi.string()
      .required()
      .label("Menu item name")
  };

  async componentDidMount() {
    const { data } = await getMenuTypes();
    const menu_types = [{ id: "", name: "All Menu types" }, ...data];
    this.setState({ menu_types: menu_types });
  }

  doSubmit = async () => {
    try {
      this.setState({ blocking: true });
      await saveMenuItem(this.state.data);
      this.setState({ blocking: false });
      toast.success("Menu item has been added successfully.");
      this.props.history.push("/menu-items");
    } catch (ex) {
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
        <TableTitle title="Add menu item" icon="tag" />
        <form onSubmit={this.handleSubmit} className="ui error form">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colspan="2">Add menu item</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row width="8">
                <Table.Cell>
                  {this.renderSelect(
                    "menu_type_id",
                    "Menu type",
                    this.state.menu_types
                  )}
                </Table.Cell>
              </Table.Row>
              <Table.Row width="8">
                <Table.Cell>
                  {this.renderInput("name", "Menu item", "text")}
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

export default MenuItemForm;
