/**
 * Created by xm_chenli@huayun.com on 2019/09/01 16:49.
 */

import React from 'react'
import './App.css'
import {Button} from 'antd';
import FormModal, {FormModalComponent} from './components/FormModal';
import ShowTimer from './components/ShowTimer';

interface Props {

}

class State {

}

class App extends React.Component<Props, State> {

  formModalRef: React.RefObject<FormModalComponent> = React.createRef()

  constructor(props: Props) {
    super(props)

    this.state = new State()
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
          onClick={this.onFormModalButtonClick}
        >
          表单弹窗
        </Button>
        <FormModal
          wrappedComponentRef={this.formModalRef}
        />
      </div>
    )
  }

}

export default App
