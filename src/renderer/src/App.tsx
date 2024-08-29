import { Layout, Menu } from 'antd';
import { HomeOutlined, FileTextOutlined, SettingOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

const { Sider, Content } = Layout;

const App = () => {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState('1');

  useEffect(() => {
    window.electronAPI.onQuickNote(() => {
      navigate('/quick-note');
      setSelectedKey('2');
    });
  }, [navigate]);

  const SideMenu = () => (
    <Sider width={80} style={{ background: '#f5f5f5' }}>
      <Menu
        mode="vertical"
        selectedKeys={[selectedKey]}
        style={{ height: '100%', background: '#f5f5f5', border: 'none' }}
        onClick={({ key }) => {
          setSelectedKey(key);
          if (key === '1') navigate('/');
          if (key === '2') navigate('/quick-note');
        }}
      >
        <Menu.Item key="1"><HomeOutlined /></Menu.Item>
        <Menu.Item key="2"><EditOutlined /></Menu.Item>
        <Menu.Item key="3"><FileTextOutlined /></Menu.Item>
        <Menu.Item key="4"><SettingOutlined /></Menu.Item>
      </Menu>
    </Sider>
  );

  return (
    <Layout style={{ minHeight: '97vh' }}>
      <SideMenu />
      <Layout>
        <Content style={{ padding: '24px', display: 'flex', justifyContent: 'space-between' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App; 
