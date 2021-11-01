import React, { Component } from 'react'

export default class MindComp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // a: 1,
    }
  }

  componentDidMount() {
    // there regist something handle.
  }

  componentWillUnmount() {
    // there unregist something handle.
  }

  renderHeader() {
    return (
      <div className='mind__header'>
        <div className='diambox'>
          <span>Nodejs 技术栈学习</span>
        </div>
      </div>
    )
  }

  renderContent() {
    return <div className='mind__content'>Mind Content</div>
  }

  renderFooter() {
    return <div className='mind__footer'>Mind Footer</div>
  }

  render() {
    // const { xxx } = this.props

    return (
      <div className='mind-container'>
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderFooter()}
      </div>
    )
  }
}
