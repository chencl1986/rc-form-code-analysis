import React from 'react'


export interface Props {

}

export class State {

}

function decorate(WrappedComponent: React.ComponentClass): React.ReactNode {
  class Form extends React.Component<Props, State> {

    constructor(props: Props) {
      super(props)

      this.state = new State()
    }

    componentDidMount() {

    }

    render() {
      return (
        <WrappedComponent />
      )
    }

  }

  return Form
}

export default decorate
