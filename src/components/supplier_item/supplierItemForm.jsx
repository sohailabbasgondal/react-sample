import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveItem } from "../../services/itemService";
import { getCategories } from "../../services/categoryService";

import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";
import { getSuppliers } from "../../services/supplierService";
import { getStorageAreas } from "../../services/storageAreaService";

import { getUnits } from "../../services/unitService";

class SupplierItemForm extends Form {
  state = {
    data: {
      name: "",
      code: "",
      category_id: "",
      supplier_id: "",
      stock: "",
      unit_id: "",
      price: "",
      discount: "",
      storage_area_id: "",
      threshold: "",
      ideal_stock: ""
    },
    categories: [],
    suppliers: [],
    storage_areas: [],
    units: [],
    errors: {}
  };

  schema = {
    id: Joi.string(),
    name: Joi.string()
      .required()
      .label("Item name"),
    code: Joi.string().label("Code"),
    category_id: Joi.string()
      .required()
      .label("Category"),
    supplier_id: Joi.string()
      .required()
      .label("Supplier"),
    stock: Joi.number().label("Stock"),
    unit_id: Joi.number()
      .required()
      .label("Unit"),
    price: Joi.number()
      .required()
      .label("Price"),
    discount: Joi.number().label("Price"),
    storage_area_id: Joi.number()
      .required()
      .label("Storage area"),
    threshold: Joi.number().label("Threshold"),
    ideal_stock: Joi.number().label("Ideal stock")
  };

  async componentDidMount() {
    const { data: cats } = await getCategories();
    const categories = [{ id: "", name: "All Categories" }, ...cats];

    const { data: supps } = await getSuppliers();
    const suppliers = [{ id: "", name: "All Suppliers" }, ...supps];

    const { data: areas } = await getStorageAreas();
    const storage_areas = [{ id: "", name: "All Storage Areas" }, ...areas];

    const { data: unts } = await getUnits();
    const units = [{ id: "", name: "All Units" }, ...unts];

    this.setState({ categories, suppliers, storage_areas, units });
  }

  doSubmit = async () => {
    try {
      this.setState({ blocking: true });
      await saveItem(this.state.data);
      toast.success("Item has been added successfully.");
      this.setState({ blocking: false });
      this.props.history.push("/items");
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
        <TableTitle title="Add item" icon="tag" />
        <form onSubmit={this.handleSubmit} className="ui error form">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="2">Add item</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row width="8">
                <Table.Cell>
                  {this.renderInput("name", "Item name", "text")}
                </Table.Cell>
                <Table.Cell width="8">
                  {this.renderInput("code", "Code", "text")}
                </Table.Cell>
              </Table.Row>
              <Table.Row width="8">
                <Table.Cell>
                  {this.renderSelect(
                    "category_id",
                    "Category",
                    this.state.categories
                  )}
                </Table.Cell>
                <Table.Cell width="8">
                  {this.renderSelect(
                    "supplier_id",
                    "Supplier",
                    this.state.suppliers
                  )}
                </Table.Cell>
              </Table.Row>
              <Table.Row width="8">
                <Table.Cell>
                  {this.renderInput("stock", "Stock", "text")}
                </Table.Cell>
                <Table.Cell width="8">
                  {this.renderSelect("unit_id", "Unit", this.state.units)}
                </Table.Cell>
              </Table.Row>
              <Table.Row width="8">
                <Table.Cell>
                  {this.renderInput("price", "Price", "text")}
                </Table.Cell>
                <Table.Cell width="8">
                  {this.renderInput("discount", "Discount", "text")}
                </Table.Cell>
              </Table.Row>
              <Table.Row width="8">
                <Table.Cell>
                  {this.renderSelect(
                    "storage_area_id",
                    "Storage area",
                    this.state.storage_areas
                  )}
                </Table.Cell>
                <Table.Cell width="8">
                  {this.renderInput("threshold", "Threshold", "text")}
                </Table.Cell>
              </Table.Row>
              <Table.Row width="8">
                <Table.Cell>
                  {this.renderInput("ideal_stock", "Ideal stock", "text")}
                </Table.Cell>
                <Table.Cell width="8"></Table.Cell>
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

export default SupplierItemForm;
