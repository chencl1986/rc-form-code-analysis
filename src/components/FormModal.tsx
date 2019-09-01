/**
 * Created by xm_chenli@huayun.com on 2019/09/01 16:17.
 */

import React from 'react'
import {Form, Input, Select} from 'antd'
import {FormComponentProps} from 'antd/lib/form'
import FormItem, {FormItemProps} from 'antd/lib/form/FormItem'
import Modal, {ModalProps} from 'antd/lib/modal'

const Option = Select.Option

// FormItem宽度兼容
export const formItemLayout: FormItemProps = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 6}
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16}
  }
}
// 性别枚举
enum SexEnum {
  male = 'male',
  female = 'female'
}

enum SexNameEnum {
  male = '男',
  female = '女'
}

// 表单字段类型
export class FormModalValues {
  username: string = ''
  sex: SexEnum = SexEnum.male
}

export interface Props extends ModalProps, FormComponentProps {

}

export class State {
  visible: boolean = false
}

export class FormModalComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = new State()
  }

  // 打开弹窗
  public show = (): void => {
    this.setState({
      visible: true
    })
  }

  // 关闭弹窗
  public hide = (): void => {
    this.setState({
      visible: false
    })
  }

  public onOk = () => {
    this.props.form.validateFields(async (errors: any, {username, sex}: FormModalValues) => {
      if (!errors) {
        Modal.success({
          title: '表单输入结果',
          content: `用户名：${username}，性别：${SexNameEnum[sex]}。`
        })
        this.hide()
      }
    })
  }

  // 关闭弹窗后初始化弹窗参数
  public afterClose = (): void => {
    this.props.form.resetFields()
    this.setState(new State())
  }

  render() {
    const visible = this.state.visible
    const form = this.props.form
    const username = this.props.form.getFieldValue('username')
    const sex: SexEnum = form.getFieldValue('sex')

    return (
      <Modal
        visible={visible}
        title={'新建用户'}
        onCancel={this.hide}
        onOk={this.onOk}
        afterClose={this.afterClose}
      >
        <FormItem
          label={'请输入用户名'}
          required={true}
          {...formItemLayout}
        >
          {
            form.getFieldDecorator<FormModalValues>(
              'username',
              {
                initialValue: '',
                rules: [
                  {
                    required: true,
                  }
                ]
              }
            )(
              <Input />
            )
          }
        </FormItem>
        <FormItem
          label={'请选择性别'}
          required={true}
          {...formItemLayout}
        >
          {
            form.getFieldDecorator<FormModalValues>(
              'sex',
              {
                initialValue: SexEnum.male,
                rules: [
                  {
                    required: true,
                  }
                ]
              }
            )(
              <Select
                style={{width: '60px'}}
              >
                <Option
                  value={'male'}
                >
                  男
                </Option>
                <Option
                  value={'female'}
                >
                  女
                </Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem
          label={'输入的用户名'}
          {...formItemLayout}
        >
          {username}
        </FormItem>
        <FormItem
          label={'选择的性别'}
          {...formItemLayout}
        >
          {
            SexNameEnum[sex]
          }
        </FormItem>
      </Modal>
    )
  }

}

const FormModal = Form.create()(FormModalComponent)

export default FormModal
