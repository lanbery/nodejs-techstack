/**
 * 21-10-21 22:25 Thursday
 * This file used define the module error/unfound-404 functions.
 */

import React from 'react';

import { useHistory } from 'react-router-dom';

export default function UnfoundPage(props) {
  let history = useHistory();

  return (
    <div >
      <h1>Test</h1>
    </div>
  );
}

