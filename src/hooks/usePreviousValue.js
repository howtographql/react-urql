import React from 'react';

const usePreviousValue = track => {
  const trackedValue = React.useRef(track);
  React.useEffect(() => {
    trackedValue.current = track;
  });
  return trackedValue.current;
};

export default usePreviousValue;
