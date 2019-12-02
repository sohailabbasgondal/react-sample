import React, { Component } from "react";
import _ from "lodash";
import { Table } from "semantic-ui-react";

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) return column.content(item);
    return _.get(item, column.path);
  };

  createKey = (item, column) => {
    return item.id + (column.path || column.key);
  };

  render() {
    const { data, columns } = this.props;
    return (
      <Table.Body>
        {data.map(item => (
          <Table.Row key={item.id}>
            {columns.map(column => (
              <Table.Cell
                width={column.width}
                key={this.createKey(item, column)}
              >
                {this.renderCell(item, column)}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    );
  }
}

export default TableBody;
