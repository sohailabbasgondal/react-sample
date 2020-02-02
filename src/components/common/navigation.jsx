import React from "react";
import { NavLink } from "react-router-dom";
import { Container, Image, Menu, Dropdown } from "semantic-ui-react";

const Navigation = ({ user }) => {
  const logoUrl = process.env.REACT_APP_URL + "/logo.png";
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
          <Image
            src={logoUrl}
            style={{ marginRight: "1.5em", height: "30px" }}
          />
        </Menu.Item>
        <Menu.Item>
          <NavLink className="nav-item nav-link" to="/dashboard">
            Dashboard
          </NavLink>
        </Menu.Item>

        {user && (
          <Menu.Menu position="right">
            <Menu.Item>
              <NavLink to="#">{`Welcome, ${user.name}`}</NavLink>
            </Menu.Item>
            <Menu.Item>
              <NavLink to="/logout">Logout</NavLink>
            </Menu.Item>
          </Menu.Menu>
        )}
      </Container>
    </Menu>
  );
};

export default Navigation;
