import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons';
import { Checkbox, Col, Form, Input, InputNumber, Row } from 'antd';
import { FC, useMemo, useState } from 'react';
import { FileTypes, FILE_TYPE_OPTIONS } from '../../constants';
import { CommonRichText } from './CommonRichText';
import { MailTagFormItem } from './MailTagFormItem';

interface EmailSettingFormProps {
  fileType?: FileTypes[];
  onFileTypeChange: (v: FileTypes[]) => void;
}
export const EmailSettingForm: FC<EmailSettingFormProps> = ({
  fileType,
  onFileTypeChange,
}) => {
  const [showBcc, setShowBcc] = useState(false);

  const hasImgeWidth = useMemo(() => {
    return fileType && fileType?.length > 0
      ? fileType?.includes(FileTypes.Image)
      : false;
  }, [fileType]);
  const ccLabel = useMemo(() => {
    return (
      <>
        抄送{' '}
        <span onClick={() => setShowBcc(!showBcc)}>
          {' '}
          {showBcc ? <UpCircleOutlined /> : <DownCircleOutlined />}
        </span>
      </>
    );
  }, [showBcc]);

  return (
    <>
      <Form.Item
        label="主题"
        name="subject"
        rules={[{ required: true, message: '主题为必填项' }]}
      >
        <Input />
      </Form.Item>
      <Row>
        <Col span={15}>
          <Form.Item
            labelCol={{ span: 8 }}
            label="文件类型"
            name="type"
            rules={[{ required: true }]}
          >
            <Checkbox.Group
              options={FILE_TYPE_OPTIONS}
              onChange={v => onFileTypeChange(v as FileTypes[])}
            />
          </Form.Item>
        </Col>
        <Col span={9}>
          {hasImgeWidth ? (
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
          ) : null}
        </Col>
      </Row>
      <Form.Item
        label="收件人"
        name="to"
        rules={[{ required: true, message: '收件人为必填项' }]}
      >
        <MailTagFormItem />
      </Form.Item>
      <Form.Item label={ccLabel} name="cc">
        <MailTagFormItem />
      </Form.Item>
      {showBcc ? (
        <Form.Item label="密送" name="bcc">
          <MailTagFormItem />
        </Form.Item>
      ) : null}
      <Form.Item label="邮件内容" validateFirst name="textContent">
        <CommonRichText placeholder="This email comes from cron job on the datart." />
      </Form.Item>
    </>
  );
};
