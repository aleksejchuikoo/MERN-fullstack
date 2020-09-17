import React from 'react';

function Loader() {
  return (
    <div className="progress" style={{ marginTop: '3rem' }}>
      <div className="indeterminate" />
    </div>
  );
}

export default Loader;
