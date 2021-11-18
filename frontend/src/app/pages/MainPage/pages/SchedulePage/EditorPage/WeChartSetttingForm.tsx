import { Checkbox, Col, Form, Input, InputNumber, Row } from 'antd';
import { FC } from 'react';
import { WECHART_FILE_TYPE_OPTIONS } from '../constants';
interface WeChartSetttingFormProps {}
export const WeChartSetttingForm: FC<WeChartSetttingFormProps> = ({}) => {
  return (
    <>
      <Form.Item
        label="机器人webhook地址"
        name="webHookUrl"
        rules={[{ required: true, message: '机器人webhook地址为必填项' }]}
      >
        <Input />
      </Form.Item>
      <Row>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 10 }}
            label="文件类型"
            name="type"
            rules={[{ required: true }]}
          >
            <Checkbox.Group options={WECHART_FILE_TYPE_OPTIONS} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <div className="image_width_form_item_wrapper">
            <Form.Item
              label="图片宽度"
              labelCol={{ span: 10 }}
              name="imageWidth"
              rules={[{ required: true }]}
            >
              <InputNumber min={100} />
            </Form.Item>
            <span className="image_width_unit">像素</span>
          </div>
        </Col>
      </Row>
    </>
  );
};
