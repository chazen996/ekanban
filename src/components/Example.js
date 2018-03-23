import React from 'react';
import {withRouter} from 'react-router-dom';

const Example = (props) => {
  console.log(props.location);
  return (
    <div>
      Example
    </div>
  );
};

Example.propTypes = {
};

export default withRouter(Example);
