import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { arrayMove } from 'react-sortable-hoc';

import Layout from './components/Layout';
import Toolbox from './components/Toolbox';
import Canvas from './components/Canvas';
import Properties from './components/Properties';
import Printable from './components/Printable';
import { renderLayers } from './Renderer';
import { modes, NULL } from './constants';
import { getTool } from './tools';
import { isPrintable } from './utils';

export default class Container extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      settings: {
        width: 40,
        height: 20,
      },
      layers: [
        {
          type: 'rect',
          width: 10,
          height: 5,
          x: 4,
          y: 2,
          fill: '░',
          stroke: '+',
        },
      ],
      currentLayer: 0,
      currentTool: 'move',
      mode: modes.SELECT,
      resizeAnchors: [],
    };

    this.setCurrentTool = this.setCurrentTool.bind(this);
    this.onCellOver = this.onCellOver.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.deleteLayer = this.deleteLayer.bind(this);
    this.handleOptionUpdate = this.handleOptionUpdate.bind(this);
    this.handleSettingUpdate = this.handleSettingUpdate.bind(this);
    this.exportAsPrintable = this.exportAsPrintable.bind(this);
    this.setCurrentLayer = this.setCurrentLayer.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeyDown);
    this.updateResizeAnchorPositions();
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    const { currentTool } = this.state;
    const { resetMode, resetTool, typable } = getTool(currentTool);

    if (!typable) {
      return;
    }

    if (event.key === 'Enter') {
      return this.setState({
        mode: resetMode,
        currentTool: resetTool,
        currentCell: null,
      });
    }

    const isBackspace = event.key === 'Backspace';
    const printable = isPrintable(event.keyCode);
    const { currentCell, layers, currentLayer } = this.state;
    const layer = layers[currentLayer];
    const offset = isBackspace ? -1 : printable ? + 1 : 0;
    
    let updates = {
      width: layer.width + offset,
      content: (
        isBackspace ?
          layer.content.slice(0, layer.content.length - 1) :
          layer.content + (
            isPrintable(event.keyCode) ?
              event.key :
              NULL
          )
      ),
    };

    this.setState({
      currentCell: {
        ...currentCell,
        x: currentCell.x + offset,
      },
      layers: this.updateCurrentLayer(updates),
    });
  }

  updateCurrentLayer(updates) {
    return this.state.layers.map(
      (layer, index) => (
        index === this.state.currentLayer
          ? { ...layer, ...updates }
          : layer
      )
    );
  }

  handleSort({ oldIndex, newIndex }) {
    if (oldIndex !== newIndex) {
      this.setState({
        layers: arrayMove(this.state.layers, oldIndex, newIndex),
        currentLayer: newIndex,
      });
    }
  }

  deleteLayer(layerIndex) {
    return event => {
      event.preventDefault();
      if (this.state.layers.length > 1) {
        this.setState({
          mode: modes.SELECT,
          currentTool: 'move',
          currentLayer: 0,
          layers: this.state.layers.filter(
            (layer, index) => index !== layerIndex
          )
        });
      }
    };
  }

  handleOptionUpdate(key, value) {
    this.setState({
      layers: this.updateCurrentLayer({
        [key]: value,
      }),
    });
  }

  handleSettingUpdate(key, isNumeric = false) {
    return event => {
      const { value } = event.target;
      const cast = parseInt(value);

      if (isNumeric && isNaN(cast)) {
        return;
      }

      this.setState({
        settings: {
          ...this.state.settings,
          [key]: isNumeric ? cast : value,
        },
      });
    };
  }

  setCurrentTool(type) {
    return event => {
      this.setState({
        currentTool: type,
        mode: getTool(type).mode,
      });
    }
  }

  setCurrentLayer(index) {
    return event => {
      if (index < this.state.layers.length) {
        this.setState({
          currentLayer: index,
        });
      }
    }
  }

  getResizeAnchor(x, y) {
    const { resizeAnchors } = this.state;
    const [ anchor ] = resizeAnchors.filter(
      anchor => (
        anchor.x === x && 
        anchor.y === y
      )
    );
    return anchor;
  }

  isResizeAnchor(x, y) {
    return Boolean(this.getResizeAnchor(x, y));
  }

  onCellOver(x, y) {
    return event => {
      const { currentTool, mode, layers, startPoint } = this.state;
      const { resetMode, resetTool, typable } = getTool(currentTool);

      if (mode === modes.TYPE) {
        return;
      }

      if (mode === modes.MOVE) {
        return this.setState({
          layers: this.updateCurrentLayer({
            x, y
          })
        });
      }
 
      const showResizeAnchor = (
        mode === modes.SELECT && this.isResizeAnchor(x, y)
      );

      this.setState({
        currentCell: { x, y },
        showResizeAnchor,
      }, () => {
        if (mode === modes.RESIZE) {
          this.resize(x, y);
        }
      });
    };
  }

  resize(x, y) {
    const { mode, currentLayer, startPoint } = this.state;
    const width = Math.abs(x - startPoint.x) + 1;
    const height = Math.abs(y - startPoint.y) + 1;

    this.setState({
      layers: this.updateCurrentLayer({ width, height }),
    });
  }

  updateResizeAnchorPositions() {
    const { layers } = this.state;
    const anchors = layers.map(
      (layer, index) => {
        const { currentTool } = this.state;
        const { resizable } = getTool(currentTool);

        if (resizable) {
          return {
            x: layer.x + layer.width - 1,
            y: layer.y + layer.height - 1,
            startPoint: {
              x: layer.x,
              y: layer.y,
            },
            layerIndex: index,
          };
        }
      }
    ).filter(
      Boolean
    );

    this.setState({
      resizeAnchors: anchors,
    });
  }

  onMouseDown(x, y) {
    return event => {
      const { layers, currentTool, mode } = this.state;
      const {
        nextMode, typable, content, width, height,
        xOffset, yOffset, defaults,
      } = getTool(currentTool);

      if (this.isResizeAnchor(x, y)) {
        const anchor = this.getResizeAnchor(x, y);
        const layer = layers[anchor.layerIndex];
        return this.setState({
          mode: modes.RESIZE,
          startPoint: anchor.startPoint,
          currentTool: layer.type,
          currentLayer: anchor.layerIndex,
        });
      }

      if (mode === modes.SELECT || mode === modes.MOVE) {
        return this.setState({
          mode: modes.MOVE,
          startPoint: { x, y },
        });
      }

      const newLayer = {
        ...defaults,
        type: currentTool,
        typable,
        content,
        x,
        y,
        width,
        height,
      };

      this.setState({
        startPoint: { x, y },
        currentCell: { x: x + xOffset, y: y + yOffset },
        currentLayer: 0,
        mode: nextMode,
        layers: [
          newLayer,
          ...layers,
        ],
      });
    };
  }

  onMouseUp(x, y) {
    return event => {
      const { currentTool } = this.state;
      const { lastMode, nextTool } = getTool(currentTool);
      this.setState({
        currentTool: nextTool,
        mode: lastMode,
      }, () => {
        this.updateResizeAnchorPositions();
      });
    };
  }

  exportAsPrintable(event) {
    const { settings, layers } = this.state;
    const dialog = window.open();
    const { body, createElement } = dialog.document;
    const container = document.createElement('div');

    body.appendChild(container);

    ReactDOM.render(
      <Printable
        settings={ settings }
        output={ renderLayers(settings, layers) }
      />,
      container
    );

    event.preventDefault();
  }

  render() {
    const {
      settings, layers, currentTool, mode, currentCell,
      currentLayer, showResizeAnchor,
    } = this.state;

    const tool = getTool(layers[currentLayer].type);

    return (
      <Layout>
        <Toolbox
          layers={ layers }
          currentTool={ currentTool }
          currentLayer={ currentLayer }
          deleteLayer={ this.deleteLayer }
          setCurrentTool={ this.setCurrentTool }
          setCurrentLayer={ this.setCurrentLayer }
          onSort={ this.handleSort }
        />
        <Canvas
          currentTool={ currentTool }
          mode={ mode }
          settings={ settings }
          currentCell={ currentCell }
          onCellOver={ this.onCellOver }
          onMouseDown={ this.onMouseDown }
          onMouseUp={ this.onMouseUp }
          rendered={ renderLayers(settings, layers) }
          showResizeAnchor={ showResizeAnchor }
        />
        <Properties
          settings={ settings }
          layer={ layers[currentLayer] }
          updateOption={ this.handleOptionUpdate }
          options={ tool.options }
          updateSetting={ this.handleSettingUpdate }
          exportAsPrintable={ this.exportAsPrintable }
        />
      </Layout>
    );
  }
}
