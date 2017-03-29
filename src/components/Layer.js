import React, { Component } from 'react';
import classNames from 'classnames';

import styles from './Layer.module.css';
import { getTool } from '../tools';

export default function Layer({
  content, type, isCurrent, deleteLayer,
  activate
}) {
  return (
    <li className={ classNames({
      [styles.layer]: true,
      [styles.currentLayer]: isCurrent,
    }) }>
      <div
        className={ styles.layerContent }
        onMouseDown={ activate }
      >
        { type || 'rasterized' }
        { getTool(type).typable && (
          <div className={ styles.layerPreview }>
            { content || '- no text - ' }
          </div>
        ) }
      </div>
      <a
        className={ styles.removeLayer }
        onMouseDown={ deleteLayer }
        href="#"
      >delete</a>
    </li>
  );
}
