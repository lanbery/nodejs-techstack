import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import LayoutPage from './layout-comp'

/**
 *
 * @module: layouts/resume-layout 
 * @Created:  21-10-21 22:37 Thursday
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
)(LayoutPage)
