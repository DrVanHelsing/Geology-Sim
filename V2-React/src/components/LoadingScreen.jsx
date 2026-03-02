import useStore from '../store/useStore';

export default function LoadingScreen() {
  const progress  = useStore((s) => s.loadingProgress);
  const message   = useStore((s) => s.loadingMessage);
  const isLoaded  = useStore((s) => s.isLoaded);
  const menuOpen  = useStore((s) => s.menuOpen);

  // Don't mount at all while the menu is showing — this way when the menu
  // disappears the loading screen mounts fresh at opacity 1 (no fade-in lag).
  if (menuOpen) return null;

  return (
    <div id="loading-screen" className={isLoaded ? 'done' : ''}>
      <div className="loading-title">Structural Geology Simulator</div>
      <div className="loading-sub">{message}</div>
      <div className="loading-bar">
        <div className="loading-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
