import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getMenuItem, updateMenuItem } from "../../services/menuItemService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";
import { getMenuTypes } from "../../services/menuTypeService";

class MenuItemEditForm extends Form {
  state = {
    data: {
      name: "",
      menu_type_id: ""
    },
    menu_types: [],
    errors: {}
  };

  schema = {
    menu_type_id: Joi.number()
      .required()
      .label("Menu type"),
    name: Joi.string()
      .required()
      .label("Menu Item")
  };

  async populateMenItem() {
    try {
      const menuItemId = this.props.match.params.id;
      this.setState({ blocking: true });
      const { data: menuItem } = await getMenuItem(menuItemId);
      console.log(menuItem);
      this.setState({
        data: this.mapToViewModel(menuItem),
        blocking: false
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    const { data } = await getMenuTypes();
    const menu_types = [{ id: "", name: "All Menu types" }, ...data];
    this.setState({ menu_types: menu_types });

    await this.populateMenItem();
  }

  mapToViewModel(menuItem) {
    return {
      name: menuItem.name,
      menu_type_id: menuItem.menu_type_id
    };
  }

  doSubmit = async () => {
    try {
      const menuItemId = this.props.match.params.id;
      const data = { ...this.state.data };
      data.id = parseInt(menuItemId);
      this.setState({ blocking: true });
      await updateMenuItem(data);
      this.setState({ blocking: false });
      toast.success("Menu item has been updated successfully.");
      this.props.history.push("/menu-items");
    } catch (ex) {
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        this.setState({ errors, blocking: false });
        // toast.warning("check validation errors.");
      }
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Update menu item" icon="tag" />
        <form onSubmit={this.handleSubmit} className="ui error form">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="2">Add menu item</Table.HeaderCell>
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

export default MenuItemEditForm;
