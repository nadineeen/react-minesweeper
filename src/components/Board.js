import React from 'react';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Cover from './Cover';
import { MINE } from '../constants';

const DEFAULT = 0;

const constructBoard = (length, width) => {
  return Array.from(Array(length), () =>
    Array.from(Array(width), () => DEFAULT)
  );
};

export default function Board() {
  const [length, setLength] = React.useState(10);
  const [width, setWidth] = React.useState(10);
  const [minMines, setMinMines] = React.useState(9);
  const [boardSize, setBoardSize] = React.useState('small');
  const [noMines, setNoMines] = React.useState(0);
  const [gameboard, setGameboard] = React.useState(null);

  React.useEffect(() => {
    setGameboard(null);
    setNoMines(0);
  }, [length, width]);

  const handleBoardSize = e => {
    setBoardSize(e.target.value);
    switch (e.target.value) {
      case 'medium':
        setLength(10);
        setWidth(20);
        setMinMines(30);
        return;
      case 'large':
        setLength(20);
        setWidth(25);
        setMinMines(68);
        return;
      default:
        setLength(10);
        setWidth(10);
        setMinMines(9);
        return;
    }
  };

  const resetBoard = () => {
    const n = Math.floor(Math.random() * 4) + minMines;
    const board = constructBoard(length, width);

    let i = 0;
    while (i < n) {
      let h = Math.floor(Math.random() * length);
      let v = Math.floor(Math.random() * width);
      if (board[h][v] === DEFAULT) {
        board[h][v] = MINE;
        i++;
      }
    }

    for (let x = 0; x < length; x++) {
      for (let y = 0; y < width; y++) {
        if (board[x][y] === MINE) continue;
        let surround = 0;
        const neighbours = [
          [-1, 0],
          [-1, 1],
          [0, 1],
          [1, 1],
          [1, 0],
          [1, -1],
          [0, -1],
          [-1, -1]
        ];
        neighbours.forEach(([nX, nY]) => {
          if (x + nX >= 0 && y + nY >= 0 && x + nX < length && y + nY < width) {
            if (board[x + nX][y + nY] === MINE) surround++;
          }
        });
        board[x][y] = surround;
      }
    }

    setGameboard(board);
    setNoMines(n);
  };

  return (
    <React.Fragment>
      <div style={{ maxWidth: '600px', margin: '40px auto 0px auto' }}>
        <div style={{ display: 'flex', margin: '40px 0' }}>
          <FormControl style={{ width: '100px', marginRight: '30px' }}>
            <InputLabel id="board-size-select-label">Board Size</InputLabel>
            <Select
              labelId="board-size-select-label"
              id="board-size-select"
              value={boardSize}
              onChange={handleBoardSize}
            >
              <MenuItem value={'small'}>Small</MenuItem>
              <MenuItem value={'medium'}>Medium</MenuItem>
              <MenuItem value={'large'}>Large</MenuItem>
            </Select>
          </FormControl>
          <Button onClick={resetBoard} variant="outlined">
            Generate New Board
          </Button>
        </div>
        {gameboard && <p>Total of mines: {noMines}</p>}
      </div>

      {gameboard && (
        <div style={{ width: 'max-content', margin: 'auto auto 40px auto' }}>
          <Cover gameboard={gameboard} length={length} width={width} />
        </div>
      )}
    </React.Fragment>
  );
}
