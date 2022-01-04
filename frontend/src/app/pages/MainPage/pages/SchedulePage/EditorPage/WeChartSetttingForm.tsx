import { Checkbox, Col, Form, Input, InputNumber, Row } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { FC } from 'react';
import { WECHART_FILE_TYPE_OPTIONS } from '../constants';

interface WeChartSetttingFormProps {}
export const WeChartSetttingForm: FC<WeChartSetttingFormProps> = ({}) => {
  const t = useI18NPrefix(
    'main.pages.schedulePage.sidebar.editorPage.weChartSetttingForm',
  );

  return (
    <>
      <Form.Item
        label={t('RobotWebhookAddress')}
        name="webHookUrl"
        rules={[
          { required: true, message: t('RobotWebhookAddressIsRequired') },
        ]}
      >
        <Input />
      </Form.Item>
      <Row>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 10 }}
            label={t('fileType')}
            name="type"
            rules={[{ required: true }]}
          >
            <Checkbox.Group options={WECHART_FILE_TYPE_OPTIONS} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <div className="image_width_form_item_wrapper">
            <Form.Item
              label={t('picWidth')}
              labelCol={{ span: 10 }}
              name="imageWidth"
              rules={[{ required: true }]}
            >
              <InputNumber min={100} />
            </Form.Item>
            <span className="image_width_unit">{t('px')}</span>
          </div>
        </Col>
      </Row>
    </>
  );
};
