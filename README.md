### Archetype

Ascii prototyping tool for web interfaces.

### Known issues

Archetype is heavily work in progress. Pull-requests and feedbacks are welcome!

  - There should be an option on rectangle-like elements to make it transparent
  - Moving behaviour is kind of faulty. It should consider previous position to move it smoothly.
  - Make optimistic updates and implement shouldComponentUpdate methods for performance.

### Creating a new tool

The toolset are defined in `src/tools.js`. Here is an example preset:

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

```
export function checkbox(text, { content }) {
  return '[x] ' + (content || ' ');
}
```

Online demo:

<http://fatiherikli.github.io/archetype>
