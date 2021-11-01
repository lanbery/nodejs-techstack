import React, { Component } from 'react'

export default class HeadComp extends Component {
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

  render() {
    // const { xxx } = this.props

    return (
      <div className='head-layout'>
        <h2>Nodejs Technology Stack</h2>
      </div>
    )
  }
}
