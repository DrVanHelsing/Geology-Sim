import useStore from '../store/useStore';

export default function StatusBar() {
  const hover = useStore((s) => s.hoverInfo);
  const tool  = useStore((s) => s.activeTool);
  const label = tool.charAt(0).toUpperCase() + tool.slice(1);

  return (
    <div id="status-bar">
      <div className="status-group">
        <span className="status-label">X</span>
        <span className="status-value">{hover ? hover.x.toFixed(1) + 'm' : '--'}</span>
      </div>
      <div className="status-group">
        <span className="status-label">Z</span>
        <span className="status-value">{hover ? hover.z.toFixed(1) + 'm' : '--'}</span>
      </div>
      <div className="status-sep" />
      <div className="status-group">
        <span className="status-label">Elev</span>
        <span className="status-value">{hover ? hover.elevation.toFixed(1) + 'm' : '--'}</span>
      </div>
      <div className="status-sep" />
      <div className="status-group">
        <span className="status-rock">{hover ? hover.rockName : '--'}</span>
      </div>
      <div style={{ flex: 1 }} />
      <div className="status-group">
        <span className="status-label">Tool</span>
        <span className="status-value" style={{ color: 'var(--accent)' }}>{label}</span>
      </div>
    </div>
  );
}
