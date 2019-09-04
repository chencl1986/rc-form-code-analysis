import React from 'react'

export interface Props {
  wrappedComponentRef?: React.RefObject<any>
}

export class State {
  time: Date = new Date()
}

export interface TimerProps {
  time: Date
}

function createTimer(WrappedComponent: React.ComponentClass<TimerProps>): React.ComponentClass<Props> {

  class Timer extends React.Component<Props, State> {

    timer: number = 0

    constructor(props: Props) {
      super(props)

      this.state = new State()
    }

    componentDidMount() {
      this.timer = window.setInterval(() => {
        this.setState({
          time: new Date()
        })
      }, 1000)
    }

    componentWillUnmount() {
      clearInterval(this.timer)
    }

    render() {
      return (
        <WrappedComponent
          ref={this.props.wrappedComponentRef}
          time={this.state.time}
        />
      )
    }

  }

  return Timer

}

export default createTimer
