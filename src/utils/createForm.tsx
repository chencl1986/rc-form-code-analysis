import React from 'react'
import {observer} from 'mobx-react';
import {observable, runInAction, toJS} from 'mobx';
import hoistStatics from 'hoist-non-react-statics';
import AsyncValidator, {Rules, ValidateError, ErrorList, RuleItem} from 'async-validator';

// 
export class Values {
  [propName: string]: Field
}

// 
export class FieldOption {
  initialValue?: any
  rules: RuleItem[] = []
}

// 
export class Field {
  value: any
  errors: ErrorList = []
}

// 
export class Fields {
  [propName: string]: Field
}

// 
export class FieldMeta {
  name: string = ''
  fieldOption: FieldOption = new FieldOption()
}

// 
export class FieldsMeta {
  [propName: string]: FieldMeta
}

export interface Props {
  wrappedComponentRef: React.RefObject<React.ReactNode>
}

// 
export interface FormProps {
  getFieldDecorator: (name: string, fieldOption: FieldOption) => (fieldElem: React.ReactElement) => React.ReactElement
  getFieldValue: (name: string) => any
  setFieldsValue: (values: {[propName: string]: any}) => void
  getFieldsValue: () => Fields
  validateFields: (callback?: (errors: any, values: any) => void) => void
  resetFields: () => void
  getFieldError: (name: string) => ErrorList
}

// 
export interface FormComponentProps {
  form: FormProps
}

export class State {

}

function createForm(WrappedComponent: React.ComponentType<any>): React.ComponentClass<Props> {

  @observer
  class Form extends React.Component<Props, State> {

    @observable
    private fields: Fields = new Fields()

    @observable
    private fieldsMeta: FieldsMeta = new FieldsMeta()

    constructor(props: Props) {
      super(props)

      this.state = new State()
    }

    // 创建表单项的props，提供给getFieldDecorator绑定事件
    private getFieldProps = (
      name: string,
      fieldOption: FieldOption = new FieldOption()
    ): any => {
      const initialValue = fieldOption.initialValue

      runInAction(() => {
        if (!this.fields[name]) {
          this.fields[name] = new Field()
          if (initialValue) {
            this.fields[name].value = initialValue
          }
        }

        if (!this.fieldsMeta[name]) {
          this.fieldsMeta[name] = {
            name,
            fieldOption
          }
        }
      })

      return {
        value: toJS(this.fields)[name].value,
        onChange: (event: React.ChangeEvent<HTMLInputElement> | string): void => {
          if (typeof event === 'string') {
            this.fields[name].value = event
          } else {
            this.fields[name].value = event.target.value
          }
          this.forceUpdate()
          this.validateField(name)
        }
      }
    }

    // 获取表单元素
    private getFieldDecorator = (
      name: string,
      fieldOption: FieldOption = new FieldOption()
    ): (fieldElem: React.ReactElement) => React.ReactElement => {
      const props = this.getFieldProps(name, fieldOption)

      return (fieldElem: React.ReactElement): React.ReactElement => {
        return React.cloneElement(
          fieldElem,
          props
        )
      }
    }

    // 
    private getFieldValue = (name: string): any => {
      const field = toJS(this.fields)[name]
      return field && field.value
    }

    // 
    private getFieldsValue = (): Fields => {
      return toJS(this.fields)
    }

    // 
    private setFieldsValue = (values: Values): void => {
      const fields = toJS(this.fields)
      Object.keys(values).forEach((name: string): void => {
        fields[name].value = values[name]
      })
      this.fields = fields
    }

    // 
    private getRulesValues = (name?: string): {rules: Rules, values: Values} => {
      const fields = toJS(this.fields)
      const fieldsMeta = toJS(this.fieldsMeta)
      const fieldMetaArr: FieldMeta[] = name ? [fieldsMeta[name]] : Object.values(fieldsMeta)
      const values: Fields = new Fields()
      const rules: Rules = fieldMetaArr.reduce((rules: Rules, item: FieldMeta): Rules => {
        if (item.fieldOption.rules.length) {
          values[item.name] = fields[item.name].value
          return {
            ...rules,
            [item.name]: item.fieldOption.rules
          }
        }
        return rules
      }, {})

      return {rules, values}
    }

    // 
    private validateField = (name: string): void => {
      const {rules, values} = this.getRulesValues(name)
      const validator = new AsyncValidator(rules)

      validator.validate(values, {}, (errors: ErrorList): void => {
        if (errors) {
          errors.forEach((error: ValidateError): void => {
            this.fields[name].errors.push(error)
          })
        } else {
          this.fields[name].errors = []
        }
      })
    }

    // 
    private validateFields = (callback?: (errors: ErrorList | null, values: Fields) => void): void => {
      const {rules, values} = this.getRulesValues()
      const validator = new AsyncValidator(rules)

      validator.validate(values, {}, (errors: ErrorList): void => {
        if (errors) {
          errors.forEach((error: ValidateError): void => {
            this.fields[error.field].errors.push(error)
          })
        } else {
          Object.keys(values).forEach((name: string): void => {
            this.fields[name].errors = []
          })
        }
        callback && callback(errors, values)
      })
      this.forceUpdate()
    }

    // 
    private resetFields = (): void => {
      this.fields = Object.values(toJS(this.fieldsMeta)).reduce((fields: Fields, item: FieldMeta): Fields => {
        fields[item.name] = new Field()
        fields[item.name].value = item.fieldOption.initialValue
        return fields
      }, new Fields())
    }

    // 
    private getFieldError = (name: string): ErrorList => {
      return this.fields[name] ? this.fields[name].errors : []
    }

    render() {
      let props: FormComponentProps = {
        form: {
          getFieldDecorator: this.getFieldDecorator,
          getFieldValue: this.getFieldValue,
          getFieldsValue: this.getFieldsValue,
          setFieldsValue: this.setFieldsValue,
          validateFields: this.validateFields,
          resetFields: this.resetFields,
          getFieldError: this.getFieldError,
        }
      }

      return (
        <WrappedComponent
          ref={this.props.wrappedComponentRef}
          {...props}
        />
      )
    }

  }

  // 使用hoist-non-react-statics库，复制所有静态方法，请查看：
  // https://github.com/mridgway/hoist-non-react-statics
  // https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over
  return hoistStatics(Form, WrappedComponent)
}

export default createForm
