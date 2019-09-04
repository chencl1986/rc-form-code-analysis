/**
 * Created by xm_chenli@huayun.com on 2019/09/01 16:49.
 */

import React from 'react'
import './App.css'
import {Button} from 'antd';
import FormModal, {FormModalComponent} from './components/FormModal';
import ShowTimer from './components/ShowTimer';
import ShowTimerModal, {ShowTimerModalComponent} from './components/ShowTimerModal';

interface Props {

}

class State {

}

class App extends React.Component<Props, State> {

  showTimerModalRef: React.RefObject<ShowTimerModalComponent> = React.createRef()

  formModalRef: React.RefObject<FormModalComponent> = React.createRef()

  constructor(props: Props) {
    super(props)

    this.state = new State()
  }

  // 打开显示时间弹窗
  private onTimerModalButtonClick = (): void => {
    const showTimerModal = this.showTimerModalRef.current
    showTimerModal && showTimerModal.show()
  }

  // 打开表单弹窗
  private onFormModalButtonClick = (): void => {
    const formModal = this.formModalRef.current
    formModal && formModal.show()
  }

  componentDidMount() {

  }

  render() {
    return (
      <div
        className={'app'}
      >
        <ShowTimer />
        <Button
          onClick={this.onTimerModalButtonClick}
        >
          时间弹窗
        </Button>
        <Button
          onClick={this.onFormModalButtonClick}
        >
          表单弹窗
        </Button>
        <ShowTimerModal
          wrappedComponentRef={this.showTimerModalRef}
        />
        <FormModal
          wrappedComponentRef={this.formModalRef}
        />
      </div>
    )
  }

}

export default App
