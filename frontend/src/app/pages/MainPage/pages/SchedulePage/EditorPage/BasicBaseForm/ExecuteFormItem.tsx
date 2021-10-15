import { Checkbox, Form, Input, Select, Space } from 'antd';
import { FC, useMemo } from 'react';
import { TimeModes } from '../../constants';

const timeModeOptions = [
  { label: '分钟', value: TimeModes.Minute },
  { label: '小时', value: TimeModes.Hour },
  { label: '天', value: TimeModes.Day },
  { label: '月', value: TimeModes.Month },
  { label: '年', value: TimeModes.Year },
];
const minutePeriodOptions = Array.from({ length: 50 }, (_, i) => {
  const n = i + 10;
  return { label: n, value: n };
});

const minuteOptions = Array.from({ length: 60 }, (_, i) => {
  const n = `${`0${i}`.slice(-2)} 分`;
  return { label: n, value: i };
});

const hourOptions = Array.from({ length: 24 }, (_, i) => {
  const n = `${`0${i}`.slice(-2)} 时`;
  return { label: n, value: i };
});

const dayOptions = Array.from({ length: 31 }, (_, i) => {
  const n = `${`0${i + 1}`.slice(-2)} 日`;
  return { label: n, value: i + 1 };
});
const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const n = `${`0${i + 1}`.slice(-2)} 月`;
  return { label: n, value: i + 1 };
});

const weekOptions = [
  { label: '星期天', value: 1 },
  { label: '星期一', value: 2 },
  { label: '星期二', value: 3 },
  { label: '星期三', value: 4 },
  { label: '星期四', value: 5 },
  { label: '星期五', value: 6 },
  { label: '星期六', value: 7 },
];

export interface ExecuteFormItemProps {
  periodInput?: boolean;
  periodUnit: TimeModes;
  onPeriodUnitChange: (v: TimeModes) => void;
  onPeriodInputChange: (v: boolean) => void;
}
export const ExecuteFormItem: FC<ExecuteFormItemProps> = ({
  periodUnit: timeMode,
  onPeriodUnitChange,
  periodInput: isInput,
  onPeriodInputChange,
}) => {
  const modeSelect = useMemo(() => {
    return (
      <Form.Item name="periodUnit">
        <Select
          options={timeModeOptions}
          style={{ width: 80 }}
          onChange={v => onPeriodUnitChange(v as TimeModes)}
        />
      </Form.Item>
    );
  }, [onPeriodUnitChange]);
  const daySelect = useMemo(() => {
    return (
      <Form.Item name="day">
        <Select options={dayOptions} style={{ width: 80 }} />
      </Form.Item>
    );
  }, []);
  const hourSelect = useMemo(() => {
    return (
      <Form.Item name="hour">
        <Select options={hourOptions} style={{ width: 80 }} />
      </Form.Item>
    );
  }, []);
  const minuteSelect = useMemo(() => {
    return (
      <Form.Item name="minute">
        <Select options={minuteOptions} style={{ width: 80 }} />
      </Form.Item>
    );
  }, []);
  const timeContent = useMemo(() => {
    switch (timeMode) {
      case TimeModes.Minute:
        return (
          <>
            每
            <Form.Item name="minute">
              <Select options={minutePeriodOptions} style={{ width: 80 }} />
            </Form.Item>
            {modeSelect}
          </>
        );
      case TimeModes.Hour:
        return (
          <>
            每 {modeSelect} 的{minuteSelect}
          </>
        );
      case TimeModes.Day:
        return (
          <>
            每 {modeSelect} 的{hourSelect}
            {minuteSelect}
          </>
        );
      case TimeModes.Week:
        return (
          <>
            每 {modeSelect} 的{' '}
            <Form.Item name="weekDay">
              <Select options={weekOptions} style={{ width: 80 }} />
            </Form.Item>
          </>
        );
      case TimeModes.Month:
        return (
          <>
            每 {modeSelect} 的 {daySelect}
            {hourSelect}
            {minuteSelect}
          </>
        );
      case TimeModes.Year:
        return (
          <>
            每 {modeSelect}的
            <Form.Item name="month">
              <Select options={monthOptions} style={{ width: 80 }} />
            </Form.Item>
            {daySelect}
            {hourSelect}
            {minuteSelect}
          </>
        );
      default:
        return;
    }
  }, [timeMode, modeSelect, daySelect, minuteSelect, hourSelect]);
  return (
    <Form.Item label="执行时间设置" required>
      <Space align="baseline">
        {isInput ? (
          <Form.Item
            name="cronExpression"
            rules={[{ required: true, message: '表达式为必填项' }]}
          >
            <Input placeholder="请输入cron表达式" style={{ width: 300 }} />
          </Form.Item>
        ) : (
          timeContent
        )}
        <Form.Item name="setCronExpressionManually" valuePropName="checked">
          <Checkbox onChange={e => onPeriodInputChange(e.target.checked)}>
            手动输入
          </Checkbox>
        </Form.Item>
      </Space>
    </Form.Item>
  );
};
