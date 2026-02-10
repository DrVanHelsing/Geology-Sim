import { useRef } from 'react';
import { SceneProvider } from './context/SceneContext';
import useSceneEngine from './hooks/useSceneEngine';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import Viewport from './components/Viewport';
import Sidebar from './components/Sidebar';
import Panel from './components/Panel';
import HelpModal from './components/HelpModal';
import StatusBar from './components/StatusBar';
import Compass from './components/Compass';
import HUD from './components/HUD';
import LoadingScreen from './components/LoadingScreen';
import RockPopup from './components/RockPopup';

export default function App() {
  const containerRef = useRef(null);
  const engineRef = useSceneEngine(containerRef);

  useKeyboardShortcuts();

  return (
    <SceneProvider engineRef={engineRef}>
      <Viewport ref={containerRef} />
      <LoadingScreen />
      <Sidebar />
      <Panel />
      <HelpModal />
      <StatusBar />
      <Compass />
      <HUD />
      <RockPopup />
    </SceneProvider>
  );
}
