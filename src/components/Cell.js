import React from 'react';
import PropTypes from 'prop-types';
import FlagIcon from '@material-ui/icons/Flag';
import AdbIcon from '@material-ui/icons/Adb';
import { MINE } from '../constants';
import '../styles/Cell.css';

function Cell({
  value,
  handleOpenPropagation,
  handleFlagging,
  handleQuickOpen,
  h,
  v,
  isOpened,
  isFlagged,
  highlight
}) {
  const handleLClick = e => {
    if (isOpened === false) {
      e.preventDefault();
      handleOpenPropagation(h, v);
    }
  };

  const handleRClick = e => {
    if (isOpened === false) {
      e.preventDefault();
      handleFlagging(h, v);
    }
  };

  const handleMiddleClick = e => {
    if (e.button === 1) {
      e.preventDefault();
      handleQuickOpen(h, v);
    }
  };

  return (
    <div
      onClick={handleLClick}
      onContextMenu={handleRClick}
      onMouseDown={handleMiddleClick}
      className={
        'cell' +
        (highlight ? ' highlight' : '') +
        (isOpened ? ' opened' : '') +
        (isOpened && value === MINE ? ' mine' : '') +
        (isFlagged && !isOpened ? ' flagged' : '')
      }
    >
      {isOpened ? (
        value === 0 ? (
          ' '
        ) : value === MINE ? (
          <AdbIcon />
        ) : (
          value
        )
      ) : isFlagged ? (
        <FlagIcon />
      ) : (
        ' '
      )}
    </div>
  );
}

Cell.propTypes = {
  h: PropTypes.number.isRequired,
  v: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  handleOpenPropagation: PropTypes.func.isRequired,
  handleFlagging: PropTypes.func.isRequired,
  isOpened: PropTypes.bool.isRequired,
  isFlagged: PropTypes.bool.isRequired,
  highlight: PropTypes.bool.isRequired
};

export default Cell;
