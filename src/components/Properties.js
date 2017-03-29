import React, { Component } from 'react';

import styles from './Properties.module.css';

function fill({ layer, updateOption }) {
  const chars = [' ', '░', '▒', '▓', '█'];
  return (
    <div className={ styles.properties }>
      <div className={ styles.row }>
        <label>Fill</label>
        <ul className={ styles.charList }>
          { chars.map((chr, index) => (
            <li
              onClick={ () => updateOption('fill', chr) }
              className={ chr === layer.fill && styles.selected }
              key={ index }
            >{ chr }</li>
          )) }
        </ul>
      </div>
    </div>
  );
}

function tabs({ layer, updateOption }) {
  return (
    <div className={ styles.properties }>
      <label>Tabs</label>
      <textarea
        className={ styles.textarea }
        onChange={ ({ target }) => updateOption('tabs', target.value) }
        value={ layer.tabs }
      />
    </div>
  );
}

function anchor({ layer, updateOption }, key, label) {
  const chars = ['-', '<', '>', '○', '•'];
  return (
    <div className={ styles.properties }>
      <div className={ styles.row }>
        <label>{ label }</label>
        <ul className={ styles.charList }>
          { chars.map((chr, index) => (
            <li
              onClick={ () => updateOption(key, chr) }
              className={ chr === layer[key] && styles.selected }
              key={ index }
            >{ chr }</li>
          )) }
        </ul>
      </div>
    </div>
  );
}

function startAnchor(props) {
  return anchor(props, 'startAnchor', 'Start Anchor');
}

function endAnchor(props) {
  return anchor(props, 'endAnchor', 'Closing Anchor');
}

function stroke({ layer, updateOption }) {
  const chars = ['-', '.', '+'];
  return (
    <div className={ styles.properties }>
      <div className={ styles.row }>
        <label>Stroke</label>
        <ul className={ styles.charList }>
          { chars.map((chr, index) => (
            <li
              onClick={ () => updateOption('stroke', chr) }
              className={ chr === layer.stroke && styles.selected }
              key={ index }
            >{ chr }</li>
          )) }
        </ul>
      </div>
    </div>
  );
}

export default function Properties({
  settings, options, updateOption, layer, updateSetting,
  exportAsPrintable
}) {
  const mapping = { fill, stroke, startAnchor, endAnchor, tabs };
  const panels = options.map(option => mapping[option]);
  return (
    <div className={ styles.container }>
      <h3>Document</h3>
      <div className={ styles.properties }>
        <div className={ styles.row }>
          <label>Rows</label>
          <input
            className={ styles.input }
            onChange={ updateSetting('height', true) }
            value={ settings.height }
          />
        </div>
        <div className={ styles.row }>
          <label>Columns</label>
          <input
            value={ settings.width }
            onChange={ updateSetting('width', true) }
            className={ styles.input }
          />
        </div>
        <ul className={ styles.documentActions }>
          <li>
            <a onClick={ exportAsPrintable } href="#">Export</a>
          </li>
        </ul>
      </div>
      { panels.length > 0 && (
        <div>
          <h3>Current Layer</h3>
          { panels.map((Panel, index) => (
            <div
              key={ index }
              className={ styles.panel }
            >
              <Panel
                layer={ layer }
                updateOption={ updateOption }
              />
            </div>
          )) }
        </div>
      )}
    </div>
  );
}
