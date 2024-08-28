import { Layout, Menu } from 'antd';
import { HomeOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import Home from './home';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const { Sider, Content } = Layout;

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.electronAPI.onQuickNote(() => {
      console.log('quick-note');
      navigate('/quick-note');
    });
  }, [navigate]);

  return (
    <Layout style={{ minHeight: '90vh' }}>
      <Sider width={80} style={{ background: '#f5f5f5' }}>
        <Menu
          mode="vertical"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', background: '#f5f5f5', border: 'none' }}
        >
          <Menu.Item key="1"><HomeOutlined /></Menu.Item>
          <Menu.Item key="2"><FileTextOutlined /></Menu.Item>
          <Menu.Item key="3"><SettingOutlined /></Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Content style={{ padding: '24px', display: 'flex', justifyContent: 'space-between' }}>
          <Home/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
