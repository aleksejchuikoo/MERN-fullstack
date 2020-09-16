import React from 'react';

const useMessage = () => {
  return React.useCallback((text) => {
    if (window.M && text) {
      window.M.toast({ html: text });
    }
  }, []);
};

export default useMessage;
