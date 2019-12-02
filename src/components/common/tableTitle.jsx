import React from "react";
import { Divider, Header, Icon } from "semantic-ui-react";

const TableTitle = ({ title, icon }) => {
  return (
    <Divider horizontal>
      <Header as="h4">
        <Icon name={icon} />
        {title}
      </Header>
    </Divider>
  );
};

export default TableTitle;
