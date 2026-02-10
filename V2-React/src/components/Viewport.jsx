import { forwardRef } from 'react';

const Viewport = forwardRef(function Viewport(_props, ref) {
  return <div ref={ref} id="viewport" />;
});

export default Viewport;
