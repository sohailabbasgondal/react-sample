import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getItem, updateItem } from "../../services/itemService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";
import { getCategories } from "../../services/categoryService";
import { getSuppliers } from "../../services/supplierService";
import { getStorageAreas } from "../../services/storageAreaService";
import { getUnits } from "../../services/unitService";

class SupplierEditForm extends Form {
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
    name: Joi.string()
      .required()
      .label("Item name"),
    code: Joi.string().label("Code"),
    category_id: Joi.number()
      .required()
      .label("Category"),
    supplier_id: Joi.number()
      .required()
      .label("Category"),
    stock: Joi.number().label("Supplier"),
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

  async populateItem() {
    try {
      this.setState({ blocking: true });
      const itemId = this.props.match.params.id;
      const { data: item } = await getItem(itemId);
      this.setState({ blocking: false });
      this.setState({ data: this.mapToViewModel(item) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

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

    await this.populateItem();
  }

  mapToViewModel(item) {
    return {
      name: item.name,
      code: item.code,
      category_id: item.category.id,
      supplier_id: item.supplier.id,
      stock: item.stock,
      unit_id: item.unit.id,
      price: item.price,
      discount: item.discount,
      storage_area_id: item.storage_area.id,
      threshold: item.threshold,
      ideal_stock: item.ideal_stock
    };
  }

  doSubmit = async () => {
    try {
      const itemId = this.props.match.params.id;

      const data = { ...this.state.data };
      data.id = parseInt(itemId);
      this.setState({ blocking: true });
      await updateItem(data);
      toast.success("Item has been updated successfully.");
      this.setState({ blocking: false });
      this.props.history.push("/items");
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
        <TableTitle title="Update item" icon="tag" />
        <form onSubmit={this.handleSubmit} className="ui error form">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colspan="2">Add item</Table.HeaderCell>
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

export default SupplierEditForm;
