import dayjs from 'dayjs'
import React from 'react'

import 'dayjs/locale/zh-cn'

import { Calendar, Col, Row, Select } from 'antd'
import type { Dayjs } from 'dayjs'
import dayLocaleData from 'dayjs/plugin/localeData'

dayjs.extend(dayLocaleData)

const CompactCalendar: React.FC<{ onSelect: (date: Dayjs) => void }> = ({ onSelect }) => {
  return (
    <Calendar
      fullscreen={false}
      headerRender={({ value, onChange }) => {
        const start = 0
        const end = 12
        const monthOptions: React.ReactNode[] = []

        let current = value.clone()
        const localeData = value.localeData()
        const months: React.ReactNode[] = []
        for (let i = 0; i < 12; i++) {
          current = current.month(i)
          months.push(localeData.monthsShort(current))
        }

        for (let i = start; i < end; i++) {
          monthOptions.push(
            <Select.Option key={i} value={i} className="month-item">
              {months[i]}
            </Select.Option>
          )
        }

        const year = value.year()
        const month = value.month()
        const options: React.ReactNode[] = []
        for (let i = year - 10; i < year + 10; i += 1) {
          options.push(
            <Select.Option key={i} value={i} className="year-item">
              {i}
            </Select.Option>
          )
        }
        return (
          <div style={{ padding: 8 }}>
            <Row gutter={8}>
              <Col>
                <Select
                  size="small"
                  popupMatchSelectWidth={false}
                  value={month}
                  onChange={(newMonth) => {
                    const now = value.clone().month(newMonth)
                    onChange(now)
                  }}
                >
                  {monthOptions}
                </Select>
              </Col>
              <Col>
                <Select
                  size="small"
                  popupMatchSelectWidth={false}
                  className="my-year-select"
                  value={year}
                  onChange={(newYear) => {
                    const now = value.clone().year(newYear)
                    onChange(now)
                  }}
                >
                  {options}
                </Select>
              </Col>
            </Row>
          </div>
        )
      }}
      onSelect={onSelect}
    />
  )
}

export default CompactCalendar
