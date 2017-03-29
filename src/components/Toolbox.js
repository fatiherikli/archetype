import React, { Component } from 'react';
import classNames from 'classnames';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import styles from './Toolbox.module.css';
import Layer from './Layer';
import { tools } from '../tools';

const SortableLayer = SortableElement(Layer);

const Layers = SortableContainer(({
  layers, currentLayer, deleteLayer,
  setCurrentLayer,
}) => {
  return (
    <ul className={ styles.layers }>
      { layers.map((layer, index) => (
        <SortableLayer
          { ...layer }
          isCurrent={ currentLayer === index }
          key={ index }
          index={ index }
          deleteLayer={ deleteLayer(index) }
          activate={ setCurrentLayer(index) }
        />
        )) }
    </ul>
  );
})

function Tool({ label, type, icon, onClick, isCurrent }) {
  return (
    <li
      className={ classNames(styles.tool, styles[type], {
        [styles.currentTool]: isCurrent,
      }) }
      onClick={ onClick }
    >
      <span>{ icon }</span>
      <strong>{ label }</strong>
    </li>
  );
}

export default function Toolbox({
  layers,
  setCurrentTool,
  currentTool,
  currentLayer,
  deleteLayer,
  setCurrentLayer,
  onSort
}) {
  const toolKeys = Object.keys(tools);
  return (
    <div className={ styles.toolbox }>
    <h3>Toolbox</h3>
    <ul className={ styles.tools }>
      { toolKeys.map((key, index) => {
        const tool = tools[key];
        return (
          <Tool
            { ...tool }
            key={ index }
            isCurrent={ currentTool === key }
            onClick={ setCurrentTool(key) }
          />
        );
      }) }
    </ul>
    <h3>Layers</h3>
    <Layers
      layers={ layers }
      helperClass={ styles.ghost }
      onSortEnd={ onSort }
      currentLayer={ currentLayer }
      deleteLayer={ deleteLayer }
      setCurrentLayer={ setCurrentLayer }
    />
    </div>
  );
}
