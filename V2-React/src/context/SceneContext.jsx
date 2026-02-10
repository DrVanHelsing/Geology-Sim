// ================================================================
//  SCENE CONTEXT — shares the engine ref with any component tree
// ================================================================
import { createContext, useContext } from 'react';

const SceneContext = createContext(null);

export function SceneProvider({ children, engineRef }) {
  return (
    <SceneContext.Provider value={engineRef}>
      {children}
    </SceneContext.Provider>
  );
}

/**
 * Access the SceneManager ref from any component.
 * Returns a React ref — read `.current` for the engine instance.
 */
export function useEngine() {
  return useContext(SceneContext);
}
