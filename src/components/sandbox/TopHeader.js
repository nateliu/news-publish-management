import React from 'react'

import { Avatar, Dropdown, Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const { Header } = Layout;

function TopHeader(props) {
  // NOTE: changed to redux, state is not neccessary.
  // const [collapsed, setCollapsed] = useState(false)

  const navigate = useNavigate();

  const { t } = useTranslation();

  const changeCollapsed = () => {
    // NOTE: changed to redux, state is not neccessary.
    // setCollapsed(!collapsed);
    props.changeCollapsed();
  }

  const handleLanguageClick = value => {
    i18n.changeLanguage(value);
  }

  const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'));

  const menu = (
    <Menu>
      <Menu.Item key='adminMenu'>
        {roleName}
      </Menu.Item>
      <Menu.SubMenu key="lngMenu" icon={<GlobalOutlined />} title={t('TopHeader.languageTitle')}>
        <Menu.Item key="lngMenuZH" onClick={() => handleLanguageClick('zh')}>中文</Menu.Item>
        <Menu.Item key="lngMenuEN" onClick={() => handleLanguageClick('en')}>English</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item danger key='loginOutMenu' onClick={() => {
        localStorage.removeItem('token');
        navigate('/login');
      }}>{t('TopHeader.signout')}</Menu.Item>
    </Menu>
  );

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {/* NOTE: changed to redux, below collapsed should to use Props's property. */}
      {props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />}
      <div style={{ float: "right" }} >
        <span>{t('TopHeader.welcomeMessage')} <span style={{ color: '#1890ff' }}> {username}</span></span>
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

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader);