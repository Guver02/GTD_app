import { useRef } from 'react';

export function useRenderLogger() {
  const renderCount = useRef(1);

  // Extraer nombre del componente desde el stack trace
  const error = new Error();
  const stackLines = error.stack?.split('\n') || [];
  const callerLine = stackLines[2] || ''; // El tercer renglón es el componente que llama
  const match = callerLine.match(/at (\w+)/);
  const componentName = match?.[1] || 'UnknownComponent';

  console.log(`🔄 ${componentName} render #${renderCount.current}`);

  renderCount.current += 1;
}
