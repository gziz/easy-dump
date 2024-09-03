import { HomeOutlined, SettingOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { DraggableTopBar } from './components/DraggableTopBar'

const { Sider, Content } = Layout

const App = () => {
  const navigate = useNavigate()
  const [selectedKey, setSelectedKey] = useState('1')

  useEffect(() => {
    window.context.onQuickNote(() => {
      navigate('/quick-note')
      setSelectedKey('2')
    })
  }, [navigate])

  const SideMenu = () => (
    <Sider width={60}>
      <Menu
        mode="vertical"
        selectedKeys={[selectedKey]}
        style={{ height: '100%', border: 'none', backgroundColor: '#000' }}
        onClick={({ key }) => {
          setSelectedKey(key)
          if (key === '1') navigate('/')
          if (key === '2') navigate('/settings')
        }}
      >
        <Menu.Item key="1">
          <HomeOutlined />
        </Menu.Item>
        <Menu.Item key="2">
          <SettingOutlined />
        </Menu.Item>
      </Menu>
    </Sider>
  )

  return (
    <>
      <DraggableTopBar />
      <Layout style={{ height: '100vh', paddingTop: 30 }}>
        <SideMenu />
        <Layout>
          <Content style={{ padding: '12px 24px 24px 24px' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default App
