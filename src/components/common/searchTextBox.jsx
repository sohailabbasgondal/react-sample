import React from "react";
import { Table, Input } from "semantic-ui-react";
const SearchTextBox = props => {
  const { onSearchButtonClick } = props;

  return (
    <Table
      style={{
        border: "0px",
        marginBottom: "6px",
        marginLeft: "-4px",
        marginRight: "-4px"
      }}
    >
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <Input
              id="keyword"
              style={{ width: "100%" }}
              placeholder="Search by keyword"
            />
          </Table.Cell>
          <Table.Cell>
            <button
              onClick={() =>
                onSearchButtonClick(document.getElementById("keyword").value)
              }
              id="searcBtn"
              className="ui primary button"
              type="button"
            >
              Search
            </button>
            &nbsp;
            <button
              onClick={function() {
                document.getElementById("keyword").value = "";
                document.getElementById("searcBtn").click();
              }}
              className="ui secondary button"
              type="button"
            >
              Reset
            </button>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default SearchTextBox;
