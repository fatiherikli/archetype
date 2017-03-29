import React, { Component } from 'react';
import classNames from 'classnames';

import styles from './Canvas.module.css';

import { EMPTY_CHAR, modes } from '../constants';

function charAt({ width, height }, rendered, row, col) {
  return rendered[(width * row) + col] || EMPTY_CHAR;
}

export default function Canvas({
  settings, rendered, onCellOver,
  onMouseDown, onMouseUp, mode,
  currentCell, currentTool,
  showResizeAnchor,
}) {
  const { width, height } = settings;
  const rows = new Array(height).fill(EMPTY_CHAR);
  const cols = new Array(width).fill(EMPTY_CHAR);
  return (
    <div className={ styles.canvas }>
      <div className={ classNames(styles.page, styles[mode], {
        [styles.showResizeAnchor]: showResizeAnchor,
      }) }>
        {
          rows.map((_, row) => (
            <div key={ row }>
              {
                cols.map((_, col) => (
                  <span
                    className={ classNames({
                      [styles.cell]: true,
                      [styles.current]: (
                        currentCell && currentCell.y === row && currentCell.x === col
                      )
                    }) }
                    onMouseDown={ onMouseDown(col, row) }
                    onMouseUp={ onMouseUp(col, row) }
                    key={ col }
                    onMouseOver={ onCellOver(col, row) }
                  >{ charAt(settings, rendered, row, col) }</span>
                ))
              }
            </div>
          )) 
        }
      </div>
    </div>
  );
}
