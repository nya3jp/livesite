import React from 'react';

const DARK_STYLES = (
  'body { color: #fff !important; background-color: #303030 !important; }' +
  '.navbar { background-color: #212121 !important; }' +
  '.panel { background-color: #424242 !important; }'
);

const Theme = ({ settings }) => {
  if (settings.invertColor) {
    return (
      <style>{DARK_STYLES}</style>
    );
  }
  return <div />;
};

export default Theme;
