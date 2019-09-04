import React from 'react'


export interface Props {
  wrappedComponentRef: React.RefObject<React.ReactNode>
}

// 
export class FieldOption {
  initialValue?: any
}

export class State {

}

function decorate(WrappedComponent: React.ComponentClass): React.ReactNode {
  class Form extends React.Component<Props, State> {

    constructor(props: Props) {
      super(props)

      this.state = new State()
    }

    // 
    private getFieldProps = (
      name: string,
      fieldOption: FieldOption = new FieldOption()
    ): any => {
      const initialValue = fieldOption.initialValue

      return {
        value: initialValue,
        onChange: (event: React.ChangeEvent<HTMLInputElement>): void => {
          
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

    componentDidMount() {

    }

    render() {
      let props = {
        getFieldDecorator: this.getFieldDecorator
      }

      return (
        <WrappedComponent {...props} />
      )
    }

  }

  return Form
}

export default decorate
