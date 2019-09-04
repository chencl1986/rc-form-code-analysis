import React from 'react'

export interface Props {

}

export class State {
  time: Date = new Date()
}

export interface TimerProps {
  time: Date
}

function createTimer(WrappedComponent: React.ComponentClass<TimerProps>): React.ComponentClass {
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
          time={this.state.time}
        />
      )
    }

  }

  return Timer
}

export default createTimer
