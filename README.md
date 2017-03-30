### Archetype

Ascii prototyping tool for web interfaces.

### Known issues

Archetype is heavily work in progress. Pull-requests and feedbacks are welcome!

  - There should be an option on rectangle-like elements to make it transparent
  - Moving behaviour is kind of faulty. It should consider previous position to move it smoothly.
  - Make optimistic updates and implement shouldComponentUpdate methods for performance.
  - Type tool is not working on Safari. Something is wrong with `key` property of React's SyntheticEvent.

### Creating a new tool

The toolset is defined on `src/tools.js`. Here is an example preset:

```javascript
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
```

The rendering behaviour of tools are defined on `src/Renderer.js`.

```javascript
export function checkbox(text, { content }) {
  return '[x] ' + (content || ' ');
}
```

Online demo:

<http://fatiherikli.github.io/archetype>
