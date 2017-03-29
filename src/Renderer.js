import { EMPTY_CHAR, NULL } from './constants';

function line(text, { width, height, startAnchor, endAnchor }) {
  return new Array(
    height
  ).fill(
    EMPTY_CHAR
  ).map(
    (line, index) => {
      const middle = Math.floor(width / 2);
      if (index === 0) {
        return (
          startAnchor +
          Array(middle + 1).join('-') +
          (
            height === 1 
              ? Array(width - middle - 1).join('-') + endAnchor
              : Array(width - middle).join(EMPTY_CHAR)
          )
        );
      };

      if (index === height - 1) {
        return (
          Array(middle + 1).join(EMPTY_CHAR) + 
          Array(width - middle).join('-') +
          endAnchor
        );
      }

      if (index > 0) {
        return (
          Array(middle + 1).join(EMPTY_CHAR) + 
          '|' +
          Array(width - middle).join(EMPTY_CHAR)
        );
      }

      return line;
    }
  ).join(NULL);
}

export function scroll(text, { width, height }) {
  const rendered = new Array(
    height
  ).fill(
    EMPTY_CHAR
  ).map(
    (line, index) => {
      if (index === 0) {
        return '+' + Array(width - 1).join('-') + '^';
      }

      if (index < height - 1) {
        return '|' + Array(width - 1).join(' ') + (
          index > 2 && index < 6 ?
            '#' :
            '|'
        )
      }

      return '<' + (
        new Array(width - 2).fill('-').map(
          (chr, index) => index > width - 7 && index < width - 3 ?
            '#' : chr
        ).join(NULL)
      ) + '>';
    }
  ).join(NULL);
  return rendered;
};

export function rect(text, { width, height, fill, stroke }) {
  const rendered = new Array(
    height
  ).fill(
    EMPTY_CHAR
  ).map(
    (line, index) => {
      if (index === 0 || index === height - 1) {
        return Array(width + 1).join(stroke);
      }
      return (
        '|' +
        Array(width + 1 - 2).join(fill) +
        '|'
      );
    }
  ).join(NULL);
  return rendered;
};

export function input(text, { width }) {
  return (
    '[' + 
    Array(width - 2).join('_') +
    ']'
  );
};

export function text(text, { content }) {
  return content;
}

export function checkbox(text, { content }) {
  return '[x] ' + (content || ' ');
}

export function radio(text, { content }) {
  return '(o) ' + (content || ' ');
}

export function tabs(text, { width, height, tabs: tabTitles }) {
  const titles = tabTitles.split('\n');
  const rendered = new Array(
    height
  ).fill(
    EMPTY_CHAR
  ).map(
    (line, index) => {
      if (index === 0) {
        return (
          EMPTY_CHAR + 
          titles.map(
            title => '+-' + new Array(title.length + 1).join('-') + '-+'
          ).join(EMPTY_CHAR) +
          new Array(width).join(EMPTY_CHAR)
        );
      }

      if (index === 1) {
        return (
          EMPTY_CHAR + 
          titles.map(
            title => '| ' + title + ' |'
          ).join(EMPTY_CHAR) +
          new Array(width).join(EMPTY_CHAR)
        );
      }

      if (index === 2) {
        return (
          '-' + 
          titles.map(
            (title, tabIndex) => {
              const delimiter = tabIndex === 0 ? EMPTY_CHAR : '-';
              return (
                '+'
                + delimiter
                + new Array(title.length + 1).join(delimiter)
                + delimiter
                + '+'
              );
            }
          ).join('-') +
          new Array(width).join('-')
        );
      }

      if (index === height - 1) {
        return '+' + new Array(width - 1).join('-') + '+';
      }

      return '|' + new Array(width - 1).join(EMPTY_CHAR) + '|';
    }
  ).map(
    line => line.slice(0, width)
  ).join(NULL);

  return rendered;
}

export function button(text, { content }) {
  return '[ ' + (content || ' ') + ' ]';
}

export function select(text, { width }) {
  return '[' + (new Array(Math.max(width - 3, 1)).join('_')) + '|v]';
}

export const shapes = {
  rect, input, text, button, checkbox, radio, line, select,
  scroll, tabs,
};

export function renderLayers({ width, height }, layers) {
  const blank = new Array(width * height).fill(EMPTY_CHAR);
  const rendered = layers
    .reduce(
      (prev, layer) => [layer, ...prev],
      []
    ).reduce(
      (prev, layer) => {
        let content;
        if (layer.type) {
          content = shapes[layer.type](prev, layer);
        } else {
          content = layer.content;
        }

        return Array.prototype.map.call(prev, (chr, index) => {
          const x = (index % width);
          const y = Math.floor(index / width);
          if (
            x >= layer.x && x < layer.x + layer.width &&
            y >= layer.y && y < layer.y + layer.height
          ) {
            return content[
              x - layer.x
                + layer.width * (y - layer.y)
            ] || chr;
          }

          return chr;
        }).join(NULL);
      },
      blank
    );

  return rendered;
}
