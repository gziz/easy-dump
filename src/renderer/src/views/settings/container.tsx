import { useState, useEffect } from 'react'
import { Form, Input, Switch, Button, message, Typography, Card, Space, Row, Col, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

const SettingsContainer: React.FC = () => {
  const [form] = Form.useForm()
  const [recordingShortcut, setRecordingShortcut] = useState(false)
  const [currentShortcut, setCurrentShortcut] = useState('')
  const [showNoTagsModal, setShowNoTagsModal] = useState(true)

  useEffect(() => {
    window.context.getSettings().then(savedSettings => {
      setCurrentShortcut(savedSettings.quickNoteShortcut)
      setShowNoTagsModal(savedSettings.showNoTagsModal)
      form.setFieldsValue(savedSettings)
    })
  }, [form])

  const onFinish = (values: any) => {
    const updatedValues = {
      ...values,
      quickNoteShortcut: currentShortcut,
      showNoTagsModal: showNoTagsModal
    }
    window.context.setSettings(updatedValues)
    window.context.setQuickNoteShortcut(currentShortcut)
    message.success('Settings saved successfully')
  }

  const handleShortcutKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (recordingShortcut) {
      const keys: string[] = []
      if (e.metaKey) keys.push('Cmd')
      if (e.ctrlKey) keys.push('Ctrl')
      if (e.altKey) keys.push('Alt')
      if (e.shiftKey) keys.push('Shift')
      if (e.key !== 'Meta' && e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Shift') {
        keys.push(e.key.toUpperCase())
      }
      const shortcut = keys.join('+')
      setCurrentShortcut(shortcut)
      form.setFieldsValue({ quickNoteShortcut: shortcut })
    }
  }

  const handleShowNoTagsModalChange = (checked: boolean) => {
    setShowNoTagsModal(checked)
  }

  const handleShortcutKeyUp = () => {
    if (recordingShortcut) {
      setRecordingShortcut(false)
    }
  }

  return (
    <Card style={{ maxWidth: 600, margin: '0 auto' }}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card size="small">
            <Row align="middle" justify="space-between">
              <Col>
                <Text strong>Quick Note Shortcut</Text>
                <Tooltip title="Set a keyboard shortcut to quickly create a new note.">
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </Col>
              <Col>
                <Input
                  value={currentShortcut}
                  onFocus={() => setRecordingShortcut(true)}
                  onBlur={() => setRecordingShortcut(false)}
                  onKeyDown={handleShortcutKeyDown}
                  onKeyUp={handleShortcutKeyUp}
                  placeholder="Click to record shortcut"
                  readOnly
                  style={{ width: '200px' }}
                />
              </Col>
            </Row>
          </Card>

          <Card size="small">
            <Row align="middle" justify="space-between">
              <Col>
                <Text strong>Show 'No Tags' Window</Text>
                <Tooltip title="Enable or disable the modal that appears when creating a note without tags.">
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </Col>
              <Col>
                <Switch
                  checked={showNoTagsModal}
                  onChange={handleShowNoTagsModalChange}
                />
              </Col>
            </Row>
          </Card>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save Settings
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Card>
  )
}

export default SettingsContainer