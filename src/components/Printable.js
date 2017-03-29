import React, { Component } from 'react';

export default function Printable({
  settings, output
}) {
  const rendered = Array.prototype.map.call(output, (
    (char, index) => {
      if (index % settings.width === 0) {
        return char + '\n';
      }

      return char;
    }
  ));
  return (
    <pre>
      { rendered }
    </pre>
  );
}
