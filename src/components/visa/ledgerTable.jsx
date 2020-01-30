import React, { Component } from "react";
import RenderTable from "../common/table";
import { Icon, Label } from "semantic-ui-react";
import auth from "../../services/authService";

class VisaLedgerTable extends Component {
  columns = [
    {
      path: "visa_ledger_type.name",
      label: "Ledger Type",
      width: "4"
    },
    {
      path: "payment",
      label: "Payment",
      width: "4"
    },
    {
      path: "payment_date",
      label: "Payment Date",
      width: "4"
    },
    {
      path: "entry_date",
      label: "Entry Date",
      width: "2"
    },

    {
      key: "actions",
      width: "2",
      content: type =>
        auth.getCurrentUser().role === "company" && (
          <div>
            <Icon
              name="trash"
              color="red"
              className="clickable"
              onClick={() => this.props.onDelete(type)}
            />

            <Icon
              name="edit"
              color="blue"
              className="clickable"
              onClick={() => this.props.onUpdate(type)}
            />
          </div>
        )
    }
  ];

  render() {
    const { payments, onSort, sortColumn } = this.props;

    return (
      <RenderTable
        columns={this.columns}
        data={payments}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default VisaLedgerTable;
