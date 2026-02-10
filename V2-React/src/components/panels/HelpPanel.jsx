import { useState } from 'react';
import { HelpIcon } from '../icons/Icons';

const SECTIONS = [
  {
    title: 'Camera Controls',
    content: [
      { label: 'Orbit / Rotate', desc: 'Left-click and drag to orbit around the terrain.' },
      { label: 'Pan', desc: 'Right-click drag or middle-click drag to pan the view.' },
      { label: 'Zoom', desc: 'Scroll wheel or touchpad pinch to zoom in and out.' },
      { label: 'Arrow Keys', desc: 'Move the camera focus point: ↑ forward, ↓ back, ← left, → right.' },
      { label: 'WASD', desc: 'Alternative to arrow keys for moving the camera focus.' },
      { label: 'Q / E', desc: 'Lower / raise the camera focus point vertically.' },
      { label: 'Shift + Move', desc: 'Hold Shift with any movement key for 2.5× faster speed.' },
      { label: 'Escape', desc: 'Close the currently open panel.' },
    ],
  },
  {
    title: 'Tools Overview',
    content: [
      {
        label: 'Navigate (1)',
        desc: 'Default mode. Orbit, pan, and zoom freely. Click on markers to view their data.',
        realWorld: 'In the field, this is simply looking around and walking to different outcrops.',
      },
      {
        label: 'Identify Rock (2)',
        desc: 'Click any point on the terrain to identify the geological layer at that location. Shows rock type, age, composition, and description.',
        realWorld: 'Equivalent to examining an outcrop with a hand lens — identifying lithology, mineral content, and stratigraphic position from visible characteristics.',
      },
      {
        label: 'Drill Core (3)',
        desc: 'Click to simulate drilling a borehole at that location. Produces a vertical core log showing all subsurface layers with their thicknesses and descriptions.',
        realWorld: 'Real geological drilling extracts cylindrical rock cores for subsurface investigation. Core logs are essential for understanding stratigraphy beneath the surface, finding resources, and planning construction.',
      },
      {
        label: 'Measure (4)',
        desc: 'Click two points on the terrain to measure the straight-line distance and elevation difference between them. The measurement appears as a dashed line with a label.',
        realWorld: 'Field geologists use measuring tapes, rangefinders, or GPS to measure distances between features. Elevation differences help calculate bed thickness, slope angles, and structural offsets.',
      },
      {
        label: 'Strike & Dip (5)',
        desc: 'Click on an outcrop to calculate the strike and dip of the bedding plane at that point. Strike is the compass bearing of the horizontal line on the bed surface; dip is the angle of maximum slope.',
        realWorld: 'Strike and dip are the most fundamental structural measurements in geology. They record the 3D orientation of rock layers, faults, and foliations using a compass clinometer (Brunton compass). Every geological map relies on these measurements.',
      },
      {
        label: 'Cross-Section (6)',
        desc: 'Click two points to define a line across the terrain. A vertical cross-section is generated showing the subsurface layer structure along that transect.',
        realWorld: 'Geological cross-sections are interpretive diagrams showing the structure beneath the surface along a chosen line. Geologists construct them by projecting surface data downward using measured strikes, dips, and borehole data.',
      },
    ],
  },
  {
    title: 'Keyboard Shortcuts',
    content: [
      { label: '1', desc: 'Navigate tool' },
      { label: '2', desc: 'Identify Rock tool' },
      { label: '3', desc: 'Drill Core tool' },
      { label: '4', desc: 'Measure tool' },
      { label: '5', desc: 'Strike & Dip tool' },
      { label: '6', desc: 'Cross-Section tool' },
      { label: 'L', desc: 'Toggle Layer Legend panel' },
      { label: 'N', desc: 'Toggle Field Notebook panel' },
      { label: 'H', desc: 'Toggle this Help panel' },
      { label: 'Esc', desc: 'Close current panel' },
    ],
  },
  {
    title: 'Panel Buttons',
    content: [
      { label: 'Layer Legend (L)', desc: 'View the complete stratigraphic column — all geological layers with their colours, names, elevation ranges, and rock types.' },
      { label: 'Field Notebook (N)', desc: 'A running log of all your observations, measurements, and drill results. Export as PDF for a field report.' },
      { label: 'Settings', desc: 'Adjust water level, fog density, and sun elevation.' },
    ],
  },
  {
    title: 'Tips',
    content: [
      { label: 'Pin panels', desc: 'Click the pin icon on any panel to keep it open while using tools.' },
      { label: 'Delete markers', desc: 'In Navigate mode, click on any placed marker to view or remove it.' },
      { label: 'Underwater view', desc: 'Zoom the camera below the water surface to see subsurface stratigraphy through the water.' },
      { label: 'Reading the terrain', desc: 'Colour bands on hillsides are outcrop patterns of different rock layers. Where they form V-shapes in valleys, the V points in the direction of dip.' },
    ],
  },
];

export default function HelpPanel() {
  const [expanded, setExpanded] = useState({ 0: true, 1: true });

  const toggle = (i) => setExpanded((e) => ({ ...e, [i]: !e[i] }));

  return (
    <>
      <div className="panel-header"><HelpIcon /> Help & Instructions</div>

      <div className="help-panel-content">
        {SECTIONS.map((sec, i) => (
          <div key={i} className="help-section">
            <button className="help-section-header" onClick={() => toggle(i)}>
              <span>{sec.title}</span>
              <span className="help-chevron">{expanded[i] ? '▾' : '▸'}</span>
            </button>
            {expanded[i] && (
              <div className="help-section-body">
                {sec.content.map((item, j) => (
                  <div key={j} className="help-item">
                    <div className="help-item-label">{item.label}</div>
                    <div className="help-item-desc">{item.desc}</div>
                    {item.realWorld && (
                      <div className="help-item-real">
                        <span className="help-real-tag">Real-world:</span> {item.realWorld}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
