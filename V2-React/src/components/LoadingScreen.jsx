import useStore from '../store/useStore';

export default function LoadingScreen() {
  const progress = useStore((s) => s.loadingProgress);
  const message  = useStore((s) => s.loadingMessage);
  const isLoaded = useStore((s) => s.isLoaded);

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
