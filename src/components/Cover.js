import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell';
import { MINE, WIN, LOSE, STILL_PLAYING } from '../constants';

function Cover({ gameboard, length, width }) {
  const [display, setDisplay] = useState(
    Array.from(Array(length), () => Array.from(Array(width), () => false))
  );
  const [flagged, setFlagged] = useState(
    Array.from(Array(length), () => Array.from(Array(width), () => false))
  );
  const [highlightMove, setHighlightMove] = useState(null);
  const [gamestatus, setGameStatus] = useState(STILL_PLAYING);

  useEffect(() => {
    setDisplay(
      Array.from(Array(length), () => Array.from(Array(width), () => false))
    );
    setFlagged(
      Array.from(Array(length), () => Array.from(Array(width), () => false))
    );
    setHighlightMove(null);
    setGameStatus(STILL_PLAYING);
  }, [gameboard, length, width]);

  const handleFlagging = (h, v) => {
    const newFlagged = flagged.slice(0);
    newFlagged[h][v] = !newFlagged[h][v];
    setFlagged(newFlagged);
  };

  const handleOpenPropagation = (h, v) => {
    if (h >= length || h < 0 || v >= width || v < 0) return false;

    const newDisplay = display.slice(0);

    // cell opened is a mine..... GAME OVER
    if (gameboard[h][v] === MINE) {
      setGameStatus(LOSE);
      setHighlightMove({ h, v });
      setDisplay(
        Array.from(Array(length), () => Array.from(Array(width), () => true))
      );
      return true;
    }

    // cell opened is one that doesnt have any bombs so propagate
    if (gameboard[h][v] === 0) {
      propagate(newDisplay, h, v);
    } else {
      newDisplay[h][v] = true;
    }

    setDisplay(newDisplay);

    // WIN if number of opened cells === number of cells that aren't mines
    if (
      newDisplay.every((r, x) =>
        r.every((c, y) => (gameboard[x][y] === MINE && !c) || c)
      )
    ) {
      setGameStatus(WIN);
      return true;
    } else {
      setGameStatus(STILL_PLAYING);
      return false;
    }
  };

  const propagate = (d, h, v) => {
    if (h >= length || h < 0 || v >= width || v < 0) return;
    if (d[h][v] === true) return;
    d[h][v] = true;
    if (gameboard[h][v] === 0) {
      propagate(d, h + 1, v);
      propagate(d, h - 1, v);
      propagate(d, h, v + 1);
      propagate(d, h, v - 1);
    }
  };

  const handleQuickOpen = (h, v) => {
    // open all adajacent cells that are not flagged
    if (display[h][v] === true) {
      const nBombs = gameboard[h][v];
      const neighbours = [
        [h + 1, v],
        [h - 1, v],
        [h, v + 1],
        [h, v - 1],
        [h + 1, v + 1],
        [h - 1, v + 1],
        [h + 1, v - 1],
        [h - 1, v - 1]
      ];

      // count the amount of nonflagged neighbours (inc. 'not valid' ones)
      const nonFlaggedNeighbours = neighbours.filter(
        ([nH, nV]) =>
          nH < 0 ||
          nH >= length ||
          nV < 0 ||
          nV >= width ||
          flagged[nH][nV] === false
      );

      // allowed to quick open only if nBombs === the number of flagged neighbours
      if (nBombs !== 8 - nonFlaggedNeighbours.length) {
        return;
      }

      // 'click' on non flagged neighbours
      for (let i = 0; i < nonFlaggedNeighbours.length; i++) {
        const [nH, nV] = nonFlaggedNeighbours[i];
        try {
          if (flagged[nH][nV] === false) {
            if (handleOpenPropagation(nH, nV) === true) return;
          }
        } catch (error) {
          continue;
        }
      }
    }
  };

  return (
    <React.Fragment>
      <h2
        style={{ minHeight: '2rem', textAlign: 'center', margin: '5px auto' }}
      >
        {gamestatus === STILL_PLAYING
          ? ''
          : gamestatus === WIN
          ? 'GAME WON!!'
          : 'GAME LOST :('}
      </h2>
      {gameboard.map((r, h) => (
        <div style={{ display: 'flex' }} key={h}>
          {r.map((c, v) => (
            <Cell
              value={c}
              key={`${h},${v}`}
              h={h}
              v={v}
              isOpened={display[h][v]}
              isFlagged={flagged[h][v]}
              handleOpenPropagation={handleOpenPropagation}
              handleFlagging={handleFlagging}
              handleQuickOpen={handleQuickOpen}
              highlight={
                highlightMove
                  ? highlightMove.h === h && highlightMove.v === v
                  : false
              }
            />
          ))}
        </div>
      ))}
    </React.Fragment>
  );
}

Cover.propTypes = {
  gameboard: PropTypes.array.isRequired,
  length: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default Cover;
