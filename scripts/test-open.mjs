import PptxGenJS from 'pptxgenjs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prs = new PptxGenJS();
prs.layout = 'LAYOUT_WIDE';

// Slide 1
const s1 = prs.addSlide();
s1.background = { color: '080808' };
s1.addText('SLIDE 1 TEST', { x: 2, y: 2, w: 8, h: 3, fontSize: 48, color: 'FFFFFF', fontFace: 'Arial', align: 'center', valign: 'middle' });

// Slide 2
const s2 = prs.addSlide();
s2.background = { color: '080808' };
s2.addText('SLIDE 2 TEST', { x: 2, y: 2, w: 8, h: 3, fontSize: 48, color: 'FFFFFF', fontFace: 'Arial', align: 'center', valign: 'middle' });
s2.addShape(prs.ShapeType.rect, { x: 1, y: 1, w: 3, h: 1, fill: { color: 'C9A84C' } });

const out = path.join(__dirname, '..', 'public', 'test-open.pptx');
prs.writeFile({ fileName: out }).then(() => {
  console.log('Saved: ' + out);
});
