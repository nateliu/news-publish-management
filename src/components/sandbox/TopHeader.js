import React from 'react'

import { Avatar, Dropdown, Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { connect } from 'react-redux';

const { Header } = Layout;

function TopHeader(props) {
  // NOTE: changed to redux, state is not neccessary.
  // const [collapsed, setCollapsed] = useState(false)

  const navigate = useNavigate();

  const changeCollapsed = () => {
    // NOTE: changed to redux, state is not neccessary.
    // setCollapsed(!collapsed);
    props.changeCollapsed();
  }

  const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'));

  const menu = (
    <Menu>
      <Menu.Item key='adminMenu'>
        {roleName}
      </Menu.Item>
      <Menu.Item danger key='loginOutMenu' onClick={() => {
        localStorage.removeItem('token');
        navigate('/login');
      }}>Login out</Menu.Item>
    </Menu>
  );

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {/* NOTE: changed to redux, below collapsed should to use Props's property. */}
      {props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />}
      <div style={{ float: "right" }} >
        <span>Welcome <span style={{ color: '#1890ff' }}> {username}</span></span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed",
      // payload:''
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TopHeader);