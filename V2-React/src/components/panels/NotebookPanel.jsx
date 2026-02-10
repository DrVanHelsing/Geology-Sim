import { useState } from 'react';
import { useEngine } from '../../context/SceneContext';
import { NotebookIcon } from '../icons/Icons';

export default function NotebookPanel() {
  const engineRef = useEngine();
  const [text, setText] = useState('');

  const addLocationStamp = () => {
    const engine = engineRef?.current;
    if (!engine) return;
    const pos = engine.getCameraPosition();
    const dir = engine.getCameraDirection();
    const bearing = ((Math.atan2(dir.x, dir.z) * 180 / Math.PI) + 360) % 360;
    const stamp = `\n📍 [${pos.x.toFixed(0)}, ${pos.y.toFixed(0)}, ${pos.z.toFixed(0)}] Bearing: ${bearing.toFixed(0)}°\n`;
    setText((prev) => prev + stamp);
  };

  const addTimestamp = () => {
    setText((prev) => prev + `\n🕐 ${new Date().toLocaleString()}\n`);
  };

  const exportPDF = async () => {
    if (!text.trim()) { alert('Notebook is empty.'); return; }
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Field Geology Notes', 15, 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(new Date().toLocaleString(), 15, 28);
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 15, 38);
    doc.save(`FieldNotes_${Date.now()}.pdf`);
  };

  return (
    <>
      <div className="panel-header">
        <NotebookIcon />
        Field Notebook
      </div>

      <div className="field-group">
        <div className="field-label">Observations</div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={'Record your field observations here...\n\nTip: Click "Location Stamp" to record your current position.'}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={addLocationStamp}>
          📍 Location Stamp
        </button>
        <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={addTimestamp}>
          🕐 Timestamp
        </button>
      </div>

      <button className="btn btn-success btn-block" onClick={exportPDF}>
        Export as PDF
      </button>
    </>
  );
}
