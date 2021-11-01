import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MindPage from './mind-comp'

/**
 *
 * @module: index-mind 
 * @Created:  21-11-01 22:40 Monday
 * make state inject into react dom props
 *
 */
const mapStateToProps = (state) => {
  // global state contains skinState ... ed.
  const {
    skinState: { header },
  } = state

  return {
    header,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // doSomeThing:(arg1,arg2) => (dispatch) => {
    //   ...
    //   dispatch(action);
    // },
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MindPage)
