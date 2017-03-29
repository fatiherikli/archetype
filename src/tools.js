import { modes } from './constants';

export const defaultTool = {
  typable: false,
  nextMode: modes.SELECT,
  lastMode: modes.SELECT,
  resetMode: modes.SELECT,
  nextTool: 'move',
  resetTool: 'move',
  resizable: true,
  content: '',
  width: 5,
  height: 1,
  xOffset: 0,
  yOffset: 0,
  options: [],
  defaults: {},
};

export const tools = {
  'move': {
    'label': '',
    'icon': 'Select',
    'mode': modes.SELECT,
  },
  'rect': {
    'label': 'Rectangle',
    'icon': '+ rectangle +',
    'mode': modes.DRAW,
    'nextMode': modes.RESIZE,
    'options': ['fill', 'stroke'],
    'defaults': {
      'fill': ' ',
      'stroke': '-',
    },
  },
  'text': {
    'label': 'Text',
    'typable': true,
    'icon': '- custom text  -',
    'mode': modes.DRAW,
    'nextMode': modes.TYPE,
    'lastMode': modes.TYPE,
    'nextTool': 'text',
    'width': 1,
    'height': 1,
  },
  'button': {
    'label': 'Button',
    'icon': '[ button ]',
    'typable': true,
    'mode': modes.DRAW,
    'nextMode': modes.TYPE,
    'lastMode': modes.TYPE,
    'nextTool': 'text',
    'xOffset': 2,
  },
  'checkbox': {
    'label': 'Checkbox',
    'icon': '[x] checkbox',
    'typable': true,
    'mode': modes.DRAW,
    'nextMode': modes.TYPE,
    'lastMode': modes.TYPE,
    'nextTool': 'checkbox',
    'xOffset': 3,
  },
  'radio': {
    'label': 'Radio',
    'icon': '(x) radio-option',
    'typable': true,
    'mode': modes.DRAW,
    'nextMode': modes.TYPE,
    'lastMode': modes.TYPE,
    'nextTool': 'radio',
    'xOffset': 3,
  },
  'line': {
    'label': 'Line',
    'icon': '---(line)--',
    'mode': modes.DRAW,
    'nextMode': modes.RESIZE,
    'defaults': {
      'startAnchor': '-',
      'endAnchor': '-',
    },
    'options': ['startAnchor', 'endAnchor'],
  },
  'input': {
    'label': 'Input',
    'icon': '[_________]',
    'mode': modes.DRAW,
    'nextMode': modes.RESIZE,
    'options': [],
    'width': 3,
  },
  'select': {
    'label': 'Select',
    'icon': '[_______|v]',
    'mode': modes.DRAW,
    'nextMode': modes.RESIZE,
    'options': [],
    'width': 3,
  },
  'scroll': {
    'label': 'Scrollable',
    'icon': '<----####-->',
    'mode': modes.DRAW,
    'nextMode': modes.RESIZE,
    'options': [],
    'width': 3,
  },
  'tabs': {
    'label': 'Tabs',
    'icon': 'Tab1 | Tab2',
    'typable': true,
    'mode': modes.DRAW,
    'nextMode': modes.RESIZE,
    'options': ['tabs'],
    'defaults': {
      'tabs': 'Tab 1\nTab 2'
    },
    'width': 3,
  },
};

export function getTool(key) {
  return {
    ...defaultTool,
    ...tools[key],
  };
}
