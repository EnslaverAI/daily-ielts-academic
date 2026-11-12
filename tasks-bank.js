// ==========================================================================
// DAILY IELTS ACADEMIC 15 — CURATED 68-TASK SEED BANK & SVG CHART RENDERER
// ==========================================================================

import { EXPANDED_SEED_TASKS } from './tasks-bank-expanded.js';
import { COMPLETE_MODES_TASKS } from './tasks-bank-complete-modes.js';

function escapeXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Renders an IELTS Listening Part 2 Floor Plan / Site Map (Locations A–G) with Compass Rose.
 */
export function renderListeningMapSVG(mapSpec) {
  if (!mapSpec || typeof mapSpec !== 'object') return '';
  const title = escapeXml(mapSpec.title || 'Site Orientation Plan (Locations A–G)');
  const landmarks = Array.isArray(mapSpec.landmarks) ? mapSpec.landmarks : [];

  const cellsHtml = landmarks
    .map((lm) => {
      const isEntrance = lm.code === 'ENTRANCE';
      const isLandmark = lm.code === 'LANDMARK';
      const bg = isEntrance
        ? 'var(--amber-soft)'
        : isLandmark
        ? 'var(--accent-soft)'
        : 'var(--bg-surface)';
      const border = isEntrance
        ? '2px solid var(--amber-warn)'
        : isLandmark
        ? '2px dashed var(--accent-primary)'
        : '1.5px solid var(--border-strong)';
      const badge =
        !isEntrance && !isLandmark
          ? `<div style="display:inline-block;background:var(--accent-primary);color:#fff;font-family:var(--font-mono);font-size:13px;font-weight:800;padding:2px 9px;border-radius:4px;margin-bottom:4px;">Location [ ${escapeXml(lm.code)} ]</div>`
          : '';
      return `
        <div class="ielts-map-cell" style="background:${bg};border:${border};border-radius:6px;padding:10px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:74px;">
          <span style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);font-weight:700;">${escapeXml(lm.pos || '')}</span>
          ${badge}
          <strong style="font-size:11.5px;color:var(--text-primary);line-height:1.3;">${escapeXml(lm.label || '')}</strong>
        </div>
      `;
    })
    .join('');

  return `
    <div style="background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:8px;padding:12px;margin:10px 0;">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
        <div style="font-weight:700;font-size:13.5px;color:var(--text-primary);">${title}</div>
        <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;background:var(--bg-surface);border:1px solid var(--border-subtle);padding:3px 8px;border-radius:99px;color:var(--accent-primary);">
          &#129517; Compass: N &uarr; | W &larr; &rarr; E | S &darr;
        </div>
      </div>
      <div class="ielts-map-grid" style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;">
        ${cellsHtml}
      </div>
    </div>
  `;
}

/**
 * Renders an IELTS Academic Writing Task 1 SVG chart, table, map, mixed combo, or process diagram.
 * Supports: 'bar', 'line', 'table', 'process', 'stacked', 'map' (Before/After), and 'mixed' (Pie + Bar).
 */
export function renderTask1ChartSVG(spec) {
  if (!spec || typeof spec !== 'object') return '';
  const title = escapeXml(spec.title || 'Academic Data Figure');
  const unit = escapeXml(spec.unit ?? '%');
  const categories = Array.isArray(spec.categories) && spec.categories.length > 0
    ? spec.categories.map((c) => escapeXml(c))
    : ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
  const series = Array.isArray(spec.series) ? spec.series : [];
  const palette = ['#1B4332', '#B45309', '#1E3A8A', '#7C2D12', '#0F766E'];

  // 0A. Before vs. After Map / Floor Plan Comparison
  if (spec.chartType === 'map' && Array.isArray(spec.beforeZones) && Array.isArray(spec.afterZones)) {
    const statusStyle = (status) => {
      if (status === 'demolished')
        return 'background:var(--crimson-soft);border:1px dashed var(--crimson-err);';
      if (status === 'new')
        return 'background:var(--accent-soft);border:1.5px solid var(--accent-primary);';
      if (status === 'green')
        return 'background:var(--emerald-soft);border:1.5px solid var(--emerald-ok);';
      if (status === 'expanded')
        return 'background:var(--amber-soft);border:1.5px solid var(--amber-warn);';
      return 'background:var(--bg-surface);border:1px solid var(--border-strong);';
    };

    const renderGrid = (zones) =>
      zones
        .map(
          (z) => `
        <div class="ielts-map-cell" style="${statusStyle(z.status)}border-radius:5px;padding:7px 6px;min-height:60px;display:flex;flex-direction:column;justify-content:center;text-align:center;">
          <span style="font-family:var(--font-mono);font-size:9.5px;font-weight:700;color:var(--text-muted);">${escapeXml(z.pos)}</span>
          <span style="font-size:11px;font-weight:600;color:var(--text-primary);line-height:1.25;">${escapeXml(z.label)}</span>
        </div>`
        )
        .join('');

    return `
      <div style="padding:6px;text-align:left;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:8px;">
          <strong style="font-size:13.5px;color:var(--text-primary);">${title}</strong>
          <span style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--accent-primary);">&#129517; N &uarr; | W &larr; &rarr; E | S &darr;</span>
        </div>
        ${
          spec.waterFeature
            ? `<div style="background:var(--navy-soft);color:var(--navy-info);font-size:11px;font-weight:700;text-align:center;padding:4px;border-radius:4px;margin-bottom:8px;">&#127754; Northern Boundary: ${escapeXml(spec.waterFeature)}</div>`
            : ''
        }
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(230px, 1fr));gap:12px;">
          <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:6px;padding:8px;">
            <div style="font-size:12px;font-weight:700;text-align:center;margin-bottom:6px;color:var(--text-primary);">${escapeXml(spec.beforeTitle || 'Map A — Past Layout')}</div>
            <div class="ielts-map-grid" style="display:grid;grid-template-columns:repeat(3, 1fr);gap:5px;">
              ${renderGrid(spec.beforeZones)}
            </div>
          </div>
          <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:6px;padding:8px;">
            <div style="font-size:12px;font-weight:700;text-align:center;margin-bottom:6px;color:var(--text-primary);">${escapeXml(spec.afterTitle || 'Map B — Present / Planned Layout')}</div>
            <div class="ielts-map-grid" style="display:grid;grid-template-columns:repeat(3, 1fr);gap:5px;">
              ${renderGrid(spec.afterZones)}
            </div>
          </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:8px;font-size:10.5px;color:var(--text-secondary);">
          <span>&#9632; <strong>Unchanged</strong></span>
          <span style="color:var(--crimson-err);">&#9632; <strong>Demolished/Removed</strong></span>
          <span style="color:var(--accent-primary);">&#9632; <strong>New Construction</strong></span>
          <span style="color:var(--emerald-ok);">&#9632; <strong>Green/Pedestrian Zone</strong></span>
          <span style="color:var(--amber-warn);">&#9632; <strong>Converted/Expanded</strong></span>
        </div>
      </div>
    `;
  }

  // 0B. Mixed / Combo Chart (Pie Breakdown + Comparative Horizontal Bar Chart)
  if (spec.chartType === 'mixed' && Array.isArray(spec.pieSlices) && Array.isArray(spec.barItems)) {
    const pieRows = spec.pieSlices
      .map((sl, idx) => {
        const col = palette[idx % palette.length];
        const val = Number(sl.value) || 0;
        return `
          <div style="margin-bottom:7px;">
            <div style="display:flex;justify-content:space-between;font-size:11.5px;font-weight:600;color:var(--text-primary);margin-bottom:2px;">
              <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${col};margin-right:5px;"></span>${escapeXml(sl.name)}</span>
              <span style="font-family:var(--font-mono);font-weight:700;">${val}%</span>
            </div>
            <div style="height:8px;background:var(--bg-subtle);border-radius:99px;overflow:hidden;">
              <div style="width:${Math.min(100, val)}%;height:100%;background:${col};"></div>
            </div>
          </div>
        `;
      })
      .join('');

    const barRows = spec.barItems
      .map((bi) => {
        const v1 = Number(bi.v1) || 0;
        const v2 = Number(bi.v2) || 0;
        const bUnit = escapeXml(spec.barUnit || '%');
        return `
          <div style="margin-bottom:8px;">
            <div style="font-size:11.5px;font-weight:600;color:var(--text-primary);margin-bottom:2px;">${escapeXml(bi.label)}</div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
              <span style="font-family:var(--font-mono);font-size:10px;width:34px;color:var(--text-muted);">${escapeXml(bi.s1Name || '2010')}</span>
              <div style="flex:1;height:10px;background:var(--bg-subtle);border-radius:3px;overflow:hidden;">
                <div style="width:${Math.min(100, v1)}%;height:100%;background:${palette[1]};"></div>
              </div>
              <span style="font-family:var(--font-mono);font-size:10.5px;font-weight:700;width:34px;text-align:right;">${v1}${bUnit}</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-family:var(--font-mono);font-size:10px;width:34px;color:var(--text-muted);">${escapeXml(bi.s2Name || '2025')}</span>
              <div style="flex:1;height:10px;background:var(--bg-subtle);border-radius:3px;overflow:hidden;">
                <div style="width:${Math.min(100, v2)}%;height:100%;background:${palette[0]};"></div>
              </div>
              <span style="font-family:var(--font-mono);font-size:10.5px;font-weight:700;width:34px;text-align:right;">${v2}${bUnit}</span>
            </div>
          </div>
        `;
      })
      .join('');

    return `
      <div style="padding:6px;text-align:left;">
        <div style="font-weight:700;font-size:13.5px;margin-bottom:10px;text-align:center;color:var(--text-primary);">${title}</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:12px;">
          <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:6px;padding:10px;">
            <div style="font-size:12px;font-weight:700;margin-bottom:8px;color:var(--accent-primary);">Chart A: ${escapeXml(spec.pieTitle || 'Proportional Breakdown (%)')}</div>
            ${pieRows}
          </div>
          <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:6px;padding:10px;">
            <div style="font-size:12px;font-weight:700;margin-bottom:8px;color:var(--accent-primary);">Chart B: ${escapeXml(spec.barTitle || 'Comparative Indicator')}</div>
            ${barRows}
          </div>
        </div>
      </div>
    `;
  }

  // 1. Academic Process / Lifecycle Flow Diagram
  if (spec.chartType === 'process' && Array.isArray(spec.steps)) {
    const stepsHtml = spec.steps
      .map((st, idx) => {
        const isLast = idx === spec.steps.length - 1;
        const arrow = !isLast
          ? `<div style="display:flex;align-items:center;justify-content:center;color:var(--accent-primary);font-weight:800;font-size:18px;padding:2px 0;">&darr;</div>`
          : spec.isCyclical
          ? `<div style="margin-top:6px;font-size:11px;font-weight:700;color:var(--accent-primary);text-align:center;">&#8635; Closed-Loop Recirculation to Stage 1</div>`
          : '';
        return `
          <div style="background:var(--bg-elevated);border:1px solid var(--border-strong);border-left:4px solid ${palette[idx % palette.length]};border-radius:6px;padding:8px 12px;text-align:left;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <span style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--accent-primary);text-transform:uppercase;">${escapeXml(st.stage || `Stage ${idx + 1}`)}</span>
              <strong style="font-size:13px;color:var(--text-primary);">${escapeXml(st.label || '')}</strong>
            </div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:3px;">${escapeXml(st.detail || '')}</div>
          </div>
          ${arrow}
        `;
      })
      .join('');

    return `
      <div style="padding:6px;text-align:left;">
        <div style="font-weight:700;font-size:14px;margin-bottom:10px;text-align:center;color:var(--text-primary);">${title}</div>
        <div style="display:flex;flex-direction:column;gap:2px;">
          ${stepsHtml}
        </div>
      </div>
    `;
  }

  // 2. Proportional 100% Stacked Horizontal Comparison Chart
  if (spec.chartType === 'stacked') {
    const rowsHtml = categories
      .map((cat, cIdx) => {
        const total = series.reduce((acc, s) => acc + (Number(s.values?.[cIdx]) || 0), 0) || 100;
        const segments = series
          .map((s, sIdx) => {
            const val = Number(s.values?.[cIdx]) || 0;
            const pct = Math.max(0, (val / total) * 100);
            const color = palette[sIdx % palette.length];
            return `<div title="${escapeXml(s.name)}: ${val}${unit}" style="width:${pct.toFixed(1)}%;background:${color};color:#fff;font-family:var(--font-mono);font-size:10.5px;font-weight:700;display:flex;align-items:center;justify-content:center;overflow:hidden;white-space:nowrap;padding:4px 0;">${pct >= 8 ? `${val}${unit}` : ''}</div>`;
          })
          .join('');
        return `
          <div style="margin-bottom:10px;">
            <div style="font-size:12px;font-weight:700;color:var(--text-primary);margin-bottom:3px;text-align:left;">${cat}</div>
            <div style="display:flex;width:100%;height:26px;border-radius:5px;overflow:hidden;border:1px solid var(--border-subtle);">
              ${segments}
            </div>
          </div>
        `;
      })
      .join('');

    const legendHtml = series
      .map((s, idx) => {
        const color = palette[idx % palette.length];
        return `<span style="display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;color:var(--text-primary);margin-right:14px;"><span style="width:11px;height:11px;border-radius:2px;background:${color};display:inline-block;"></span>${escapeXml(s.name)}</span>`;
      })
      .join('');

    return `
      <div style="padding:8px;">
        <div style="font-weight:700;font-size:14px;margin-bottom:12px;text-align:center;color:var(--text-primary);">${title}</div>
        ${rowsHtml}
        <div style="margin-top:10px;text-align:center;display:flex;flex-wrap:wrap;justify-content:center;gap:6px;">
          ${legendHtml}
        </div>
      </div>
    `;
  }

  // 3. Academic Data Table
  if (spec.chartType === 'table') {
    const headers = ['Category / Indicator', ...categories]
      .map(
        (h) =>
          `<th style="padding:9px 12px;border:1px solid var(--border-strong);background:var(--bg-subtle);color:var(--text-primary);text-align:left;font-size:13px;font-weight:700;">${h}</th>`
      )
      .join('');
    const rows = series
      .map((s) => {
        const sName = escapeXml(s.name || 'Series');
        const cells = categories
          .map((_, idx) => {
            const v = Array.isArray(s.values) && s.values[idx] !== undefined ? escapeXml(s.values[idx]) : '—';
            return `<td style="padding:8px 12px;border:1px solid var(--border-subtle);color:var(--text-primary);font-family:var(--font-mono);font-size:13px;">${v}${unit}</td>`;
          })
          .join('');
        return `<tr><td style="padding:8px 12px;border:1px solid var(--border-subtle);color:var(--text-primary);font-weight:600;font-size:13px;background:var(--bg-elevated);">${sName}</td>${cells}</tr>`;
      })
      .join('');

    return `
      <div style="overflow-x:auto;text-align:left;padding:4px;">
        <div style="font-weight:700;font-size:14px;margin-bottom:10px;text-align:center;color:var(--text-primary);">${title} (${unit})</div>
        <table style="width:100%;border-collapse:collapse;border-radius:6px;overflow:hidden;">
          <thead><tr>${headers}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  // Compute safe min/max value for Y axis
  const allVals = series.flatMap((s) =>
    (Array.isArray(s.values) ? s.values : []).map((v) => Number(v) || 0)
  );
  const rawMax = Math.max(...allVals, 10);
  const yMax = Math.ceil(rawMax / 10) * 10 || 100;

  const width = 580;
  const legendRows = Math.ceil(series.length / 2);
  const height = 290 + legendRows * 22;
  const padL = 58;
  const padR = 26;
  const padT = 40;
  const padB = 46 + legendRows * 22;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  let gridLines = '';
  for (let i = 0; i <= 5; i++) {
    const val = Math.round((yMax / 5) * i);
    const y = (padT + plotH - (i / 5) * plotH).toFixed(1);
    gridLines += `
      <line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="var(--border-subtle)" stroke-dasharray="3,3" />
      <text x="${padL - 8}" y="${Number(y) + 4}" text-anchor="end" font-size="11" fill="var(--text-secondary)" font-family="monospace">${val}${unit}</text>
    `;
  }

  let dataShapes = '';
  if (spec.chartType === 'line') {
    const stepX = categories.length > 1 ? plotW / (categories.length - 1) : plotW / 2;
    categories.forEach((cat, idx) => {
      const x = (padL + idx * stepX).toFixed(1);
      gridLines += `<text x="${x}" y="${padT + plotH + 20}" text-anchor="middle" font-size="11" fill="var(--text-primary)" font-weight="600">${cat}</text>`;
    });

    series.forEach((s, sIdx) => {
      const color = palette[sIdx % palette.length];
      const vals = Array.isArray(s.values) ? s.values : [];
      const pts = categories.map((_, i) => {
        const v = Math.max(0, Number(vals[i]) || 0);
        const x = (padL + i * stepX).toFixed(1);
        const y = (padT + plotH - (v / yMax) * plotH).toFixed(1);
        return `${x},${y}`;
      });
      dataShapes += `<polyline fill="none" stroke="${color}" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round" points="${pts.join(' ')}" />`;
      categories.forEach((_, i) => {
        const v = Math.max(0, Number(vals[i]) || 0);
        const x = (padL + i * stepX).toFixed(1);
        const y = (padT + plotH - (v / yMax) * plotH).toFixed(1);
        const labelOffset = sIdx % 2 === 0 ? -8 : 14;
        dataShapes += `
          <circle cx="${x}" cy="${y}" r="4" fill="${color}" stroke="var(--bg-surface)" stroke-width="1.5" />
          <text x="${x}" y="${Number(y) + labelOffset}" text-anchor="middle" font-size="10" fill="${color}" font-family="monospace" font-weight="700">${v}</text>
        `;
      });
    });
  } else {
    // Grouped Bar Chart (default)
    const groupW = plotW / categories.length;
    const sCount = Math.max(series.length, 1);
    const barW = Math.min(30, (groupW * 0.74) / sCount);

    categories.forEach((cat, cIdx) => {
      const groupStart = padL + cIdx * groupW + (groupW - barW * sCount) / 2;
      const centerX = (padL + cIdx * groupW + groupW / 2).toFixed(1);
      gridLines += `<text x="${centerX}" y="${padT + plotH + 20}" text-anchor="middle" font-size="11" fill="var(--text-primary)" font-weight="600">${cat}</text>`;

      series.forEach((s, sIdx) => {
        const color = palette[sIdx % palette.length];
        const vals = Array.isArray(s.values) ? s.values : [];
        const val = Math.max(0, Number(vals[cIdx]) || 0);
        const h = Math.max(2, (val / yMax) * plotH);
        const x = (groupStart + sIdx * barW).toFixed(1);
        const y = (padT + plotH - h).toFixed(1);
        dataShapes += `
          <rect x="${x}" y="${y}" width="${Math.max(4, barW - 3).toFixed(1)}" height="${h.toFixed(1)}" fill="${color}" rx="2" />
          <text x="${(Number(x) + (barW - 3) / 2).toFixed(1)}" y="${(Number(y) - 5).toFixed(1)}" text-anchor="middle" font-size="9.5" fill="${color}" font-family="monospace" font-weight="700">${val}</text>
        `;
      });
    });
  }

  // Multi-row Legend (2 items per row so long series labels never overlap)
  const legendItems = series
    .map((s, idx) => {
      const color = palette[idx % palette.length];
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const lx = padL + col * 250;
      const ly = padT + plotH + 36 + row * 20;
      const sName = escapeXml(s.name || `Series ${idx + 1}`);
      return `
        <rect x="${lx}" y="${ly}" width="11" height="11" fill="${color}" rx="2" />
        <text x="${lx + 16}" y="${ly + 9.5}" font-size="11" fill="var(--text-primary)" font-weight="600">${sName}</text>
      `;
    })
    .join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
      <rect width="${width}" height="${height}" fill="var(--bg-elevated)" rx="8" />
      <text x="${width / 2}" y="23" text-anchor="middle" font-size="13" font-weight="700" fill="var(--text-primary)">${title}</text>
      ${gridLines}
      <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="var(--text-muted)" stroke-width="1.2" />
      <line x1="${padL}" y1="${padT + plotH}" x2="${width - padR}" y2="${padT + plotH}" stroke="var(--text-muted)" stroke-width="1.2" />
      ${dataShapes}
      ${legendItems}
    </svg>
  `;
}

export const SEED_TASKS = [
  // ========================================================================
  // READING TASKS (6 Complete Workouts = 42 Questions)
  // ========================================================================
  {
    id: 'read-urban-mycorrhizal-networks',
    section: 'reading',
    taskType: 'Academic Passage + T/F/NG & Summary Completion',
    topic: 'Urban Ecology & Mycorrhizal Fungi',
    title: 'Subterranean Resilience: Mycorrhizal Networks in Urban Soils',
    instructions:
      'Read the academic passage below (recommended time: 15 minutes) and complete BOTH Task A (Questions 1–4) and Task B (Questions 5–7). Tip: Select any text in the passage and click "Highlight Selection" to mark key evidence.',
    paragraphs: [
      {
        label: 'A',
        text: 'Beneath undisturbed temperate forests, arbuscular and ectomycorrhizal fungi form intricate symbiotic associations with the roots of over ninety percent of vascular plant species. Through microscopic hyphal filaments, these fungi trade soil-derived phosphorus and nitrogen for photosynthesized carbon from host trees. In modern metropolitan environments, however, civil engineering practices routinely strip topsoil, compact sub-layers to support heavy infrastructure, and introduce alkaline runoff from concrete degradation.'
      },
      {
        label: 'B',
        text: 'For decades, municipal arborists assumed that street trees planted in isolated sidewalk pits thrived primarily according to irrigation frequency and chemical fertilizer application. Yet a longitudinal study conducted across twelve European capitals by Dr. Clara Lindqvist and colleagues revealed that newly transplanted oaks in sterilized, fertilized pits suffered a 42 percent mortality rate within five years, whereas oaks inoculated with native ectomycorrhizal spores extracted from peri-urban woodlands experienced less than 11 percent mortality under identical watering regimes.'
      },
      {
        label: 'C',
        text: 'Crucially, Lindqvist’s team demonstrated that not all fungal inoculants confer equal benefits. Commercial bio-fertilizers dominated by a single fast-growing generalist species often failed to persist beyond the second winter when exposed to road-deicing salts. Conversely, multispecies inocula harvested from mature urban parklands exhibited remarkable osmotic tolerance, actively sequestering heavy metals such as cadmium and lead within fungal cell walls before those toxins could enter the tree’s vascular system.'
      },
      {
        label: 'D',
        text: 'Despite these findings, large-scale municipal adoption remains sporadic. Procurement guidelines in most city planning departments classify soil amendments strictly by macronutrient ratios rather than biological diversity. Furthermore, because mycorrhizal colonization produces little visible canopy expansion during the first eighteen months—investing energy instead into deep root architecture—contractors operating under two-year maintenance warranties rarely have a financial incentive to prioritize fungal inoculation.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Concrete runoff in cities tends to lower the pH of surrounding urban soil, making it highly acidic.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        explanation: 'Paragraph A states that concrete degradation introduces "alkaline runoff" (which raises pH), contradicting the claim that it makes soil acidic.'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'In Dr. Lindqvist’s study, both groups of transplanted oak trees received the same amount of water.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        explanation: 'Paragraph B explicitly notes that the two groups were compared "under identical watering regimes."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Dr. Lindqvist’s study cost less to conduct than conventional municipal fertilization programs.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'NOT GIVEN',
        explanation: 'The passage discusses tree mortality rates and contractor warranties, but never compares the cost of conducting Dr. Lindqvist’s study.'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Commercial single-species fungal products proved highly resilient against winter road salts.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        explanation: 'Paragraph C states that commercial single-species bio-fertilizers "often failed to persist beyond the second winter when exposed to road-deicing salts."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Sentence Completion & Multiple Choice (ONE WORD ONLY for Q5–Q6)',
        type: 'fill',
        prompt: 'Fungi taken from older city parks protected trees by trapping heavy metals inside their ________ walls. (Write ONE WORD from Passage C)',
        answer: 'cell',
        acceptableAnswers: ['cell', 'fungal cell'],
        explanation: 'Paragraph C states: "...actively sequestering heavy metals such as cadmium and lead within fungal cell walls."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Sentence Completion & Multiple Choice (ONE WORD ONLY for Q5–Q6)',
        type: 'fill',
        prompt: 'During the initial 18 months, inoculated trees focus growth on deep root structure rather than visible ________ expansion. (Write ONE WORD from Passage D)',
        answer: 'canopy',
        acceptableAnswers: ['canopy'],
        explanation: 'Paragraph D states: "...because mycorrhizal colonization produces little visible canopy expansion during the first eighteen months..."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Sentence Completion & Multiple Choice (ONE WORD ONLY for Q5–Q6)',
        type: 'mcq',
        prompt: 'According to Paragraph D, why do landscape contractors seldom use fungal inoculants?',
        options: [
          'A) Native woodland spores are legally protected across European capitals.',
          'B) The structural benefits take longer to appear than the duration of their maintenance contracts.',
          'C) Mycorrhizal fungi compete with grass for surface nitrogen.',
          'D) City residents prefer ornamental species that do not form root symbioses.'
        ],
        answer: 'B) The structural benefits take longer to appear than the duration of their maintenance contracts.',
        explanation: 'Paragraph D explains that visible canopy growth takes over 18 months while contractors operate under short two-year maintenance warranties.'
      }
    ]
  },

  {
    id: 'read-chronobiology-adolescent-sleep',
    section: 'reading',
    taskType: 'Academic Passage + T/F/NG & Multiple Choice',
    topic: 'Chronobiology & Educational Policy',
    title: 'Circadian Phase Delay and the Architecture of Adolescent Sleep',
    instructions:
      'Read the passage below (recommended time: 15 minutes) and answer Questions 1–7 across both sub-tasks.',
    paragraphs: [
      {
        label: 'A',
        text: 'During the transition into puberty, human circadian rhythms undergo a biologically programmed shift known as phase delay. Driven by alterations in the suprachiasmatic nucleus and a slower accumulation of homeostatic sleep pressure during waking hours, adolescents experience a two-hour postponement in the nocturnal secretion of melatonin compared with pre-pubescent children and adults.'
      },
      {
        label: 'B',
        text: 'When secondary schools mandate start times prior to 08:00, students must wake during their biological night, disproportionately truncating rapid eye movement (REM) sleep, which concentrates in the final third of the sleep cycle. Because REM sleep is integral to emotional regulation and synaptic consolidation of procedural memory, chronic early waking mimics the cognitive deficits of jet lag.'
      },
      {
        label: 'C',
        text: 'Opponents of delayed school schedules frequently contend that teenagers will simply stay awake correspondingly later if morning bells are pushed back. However, empirical data from a three-year natural experiment in Seattle public high schools—where start times shifted from 07:50 to 08:45—refuted this hypothesis. Actigraphy wrist-monitors worn by students showed that median sleep onset shifted later by only eleven minutes, yielding a net gain of thirty-four minutes of nocturnal sleep per school night.'
      },
      {
        label: 'D',
        text: 'Nevertheless, logistical barriers complicate reform. Municipal bus fleets frequently operate on tiered routing systems in which identical vehicles transport high school students at dawn before collecting elementary pupils an hour later. Reversing these tiers without expanding fleet capacity risks placing younger children at roadside bus stops prior to sunrise, raising safety concerns among municipal transport boards.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Adolescents build up the biological urge to sleep more slowly while awake than younger children do.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        explanation: 'Paragraph A states that phase delay is driven by "a slower accumulation of homeostatic sleep pressure during waking hours."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'REM sleep occurs evenly across all stages of the night.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        explanation: 'Paragraph B states that REM sleep "concentrates in the final third of the sleep cycle."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'In the Seattle study, students self-reported their bedtimes using written daily diaries.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        explanation: 'Paragraph C states that sleep was measured objectively via "Actigraphy wrist-monitors worn by students."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Seattle teachers reported higher job satisfaction after the schedule change.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'NOT GIVEN',
        explanation: 'Teacher job satisfaction is not mentioned anywhere in the text.'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: One-Word Completion & Multiple Choice',
        type: 'fill',
        prompt: 'In adolescents, the nightly release of ________ is delayed by roughly two hours. (Write ONE WORD from Passage A)',
        answer: 'melatonin',
        acceptableAnswers: ['melatonin'],
        explanation: 'Paragraph A mentions "a two-hour postponement in the nocturnal secretion of melatonin."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: One-Word Completion & Multiple Choice',
        type: 'fill',
        prompt: 'In Seattle, shifting school start times by 55 minutes resulted in a net increase of thirty-four ________ of sleep per school night. (Write ONE WORD from Passage C)',
        answer: 'minutes',
        acceptableAnswers: ['minutes'],
        explanation: 'Paragraph C notes "a net gain of thirty-four minutes of nocturnal sleep."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: One-Word Completion & Multiple Choice',
        type: 'mcq',
        prompt: 'What is the primary obstacle to delaying high school start times discussed in Paragraph D?',
        options: [
          'A) High school athletic coaches oppose afternoon training in darkness.',
          'B) Shared school bus schedules would force elementary students to wait in the dark.',
          'C) Parents rely on older teenagers to babysit younger siblings in the morning.',
          'D) Academic test scores did not improve enough to justify extra electricity costs.'
        ],
        answer: 'B) Shared school bus schedules would force elementary students to wait in the dark.',
        explanation: 'Paragraph D explains that tiered bus fleets reuse buses, and swapping tiers would place younger elementary children at bus stops before sunrise.'
      }
    ]
  },

  {
    id: 'read-desalination-brine-mining',
    section: 'reading',
    taskType: 'Academic Passage + T/F/NG & Completion',
    topic: 'Chemical Engineering & Resource Recovery',
    title: 'From Effluent to Resource: Circular Brine Valorization in Seawater Desalination',
    instructions:
      'Read the passage below (recommended time: 15 minutes) and complete Questions 1–7.',
    paragraphs: [
      {
        label: 'A',
        text: 'Reverse osmosis desalination plants currently supply potable water to over 300 million people globally, yet for every liter of freshwater produced, approximately 1.5 liters of hypersaline concentrate—commonly termed brine—is discharged back into marine ecosystems. Because this dense effluent sinks to the benthic zone and often contains residual anti-scaling chemicals, poorly diffused outfalls can suffocate seagrass meadows and coral assemblages.'
      },
      {
        label: 'B',
        text: 'Recent advances in electrodialysis and membrane crystallization have reframed hypersaline brine from an environmental liability into a concentrated polymetallic ore. Seawater brine contains dissolved lithium, magnesium, rubidium, and potassium at nearly double their ambient oceanic concentrations. Extracting these minerals sequentially not only reduces the volume of waste discharge but also offsets the high electricity expenditure of reverse osmosis.'
      },
      {
        label: 'C',
        text: 'Furthermore, chemical engineers at the Polytechnic University of Valencia have demonstrated that reacting magnesium-rich brine with captured industrial flue gas precipitates stable magnesium carbonates, which can be blended into low-carbon cement while simultaneously generating sodium hydroxide (caustic soda). Desalination operators already purchase large quantities of caustic soda to adjust water pH and clean fouled membranes, enabling plants to establish a closed-loop chemical supply.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Reverse osmosis plants generate a greater volume of hypersaline brine than freshwater.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        explanation: 'Paragraph A states that for every 1 liter of freshwater, approximately 1.5 liters of brine is produced.'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Discharged brine floats on the ocean surface due to its warm temperature.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        explanation: 'Paragraph A states that "this dense effluent sinks to the benthic zone" (seafloor).'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Rubidium is more profitable to extract from brine than lithium.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'NOT GIVEN',
        explanation: 'Paragraph B lists both lithium and rubidium in brine, but never compares their commercial profitability.'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Desalination plants can use the sodium hydroxide produced from brine treatment within their own operations.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        explanation: 'Paragraph C explains that desalination operators use caustic soda (sodium hydroxide) to adjust pH and clean fouled membranes, creating a closed-loop supply.'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice',
        type: 'fill',
        prompt: 'Minerals in desalination brine exist at roughly ________ their normal ocean concentration. (Write ONE WORD from Passage B)',
        answer: 'double',
        acceptableAnswers: ['double', 'twice'],
        explanation: 'Paragraph B states: "...at nearly double their ambient oceanic concentrations."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice',
        type: 'fill',
        prompt: 'Reacting brine with industrial flue gas yields magnesium carbonates that can be used in low-carbon ________. (Write ONE WORD from Passage C)',
        answer: 'cement',
        acceptableAnswers: ['cement'],
        explanation: 'Paragraph C states: "...which can be blended into low-carbon cement."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice',
        type: 'mcq',
        prompt: 'What is the main purpose of the processes described in Paragraphs B and C?',
        options: [
          'A) To replace reverse osmosis with thermal distillation.',
          'B) To turn desalination waste into valuable minerals and industrial reagents.',
          'C) To dilute hypersaline brine with river water before ocean disposal.',
          'D) To cultivate salt-tolerant seagrass varieties near coastal outfalls.'
        ],
        answer: 'B) To turn desalination waste into valuable minerals and industrial reagents.',
        explanation: 'Both paragraphs focus on recovering metals, carbonates, and caustic soda from waste brine.'
      }
    ]
  },

  {
    id: 'read-cryptotephra-paleoclimate-dating',
    section: 'reading',
    taskType: 'Academic Passage + T/F/NG & Completion',
    topic: 'Paleoclimatology & Volcanic Geochronology',
    title: 'Invisible Horizons: Cryptotephra Isochrons in Polar Ice Cores',
    instructions:
      'Read the passage below (recommended time: 15 minutes) and complete Questions 1–7.',
    paragraphs: [
      {
        label: 'A',
        text: 'Reconstructing abrupt climatic oscillations during the Last Glacial Termination requires synchronizing paleoclimate archives—such as Greenland ice cores, marine sediment drills, and terrestrial peat bogs—to within a decade. Traditional radiocarbon dating of organic macrofossils, however, suffers from calibration plateaus and marine reservoir uncertainties that can introduce chronological errors of several centuries.'
      },
      {
        label: 'B',
        text: 'Over the past two decades, tephrochronology has overcome this barrier through the detection of cryptotephra: microscopic volcanic glass shards, measuring less than 80 micrometers in diameter, that were ejected into the stratosphere and deposited across entire hemispheres within weeks of an eruption. Even when invisible to the naked eye, these shards can be isolated from sediment or ice matrices using high-density heavy liquid flotation.'
      },
      {
        label: 'C',
        text: 'Once extracted, individual glass shards are bombarded with an electron microprobe to determine their major-element geochemical fingerprint—specifically the ratios of silica, potassium, and iron oxides. When an identical geochemical signature is identified in both a Greenland ice layer and a Scottish lakebed, researchers establish an absolute time-parallel marker, or isochron, allowing them to test whether regional temperature shifts occurred simultaneously or involved a multi-decadal oceanic lag.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Radiocarbon dating can sometimes be inaccurate by hundreds of years when dating marine and organic samples.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        explanation: 'Paragraph A states that radiocarbon dating suffers from uncertainties that "can introduce chronological errors of several centuries."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Cryptotephra layers are easily visible as dark bands in sediment cores without laboratory equipment.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        explanation: 'Paragraph B defines cryptotephra as microscopic glass shards that are "invisible to the naked eye."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Volcanic glass shards take several decades to settle out of the stratosphere after an eruption.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        explanation: 'Paragraph B states that the shards are "deposited across entire hemispheres within weeks of an eruption."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Icelandic volcanoes produced the majority of cryptotephra found in Scottish lakebeds.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'NOT GIVEN',
        explanation: 'The passage mentions Greenland ice layers and Scottish lakebeds, but never states which country’s volcanoes produced the majority of the shards.'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice (ONE WORD ONLY for Q5–Q6)',
        type: 'fill',
        prompt: 'Researchers separate microscopic glass shards from mud or ice using heavy liquid ________. (Write ONE WORD from Passage B)',
        answer: 'flotation',
        acceptableAnswers: ['flotation'],
        explanation: 'Paragraph B states: "...isolated from sediment or ice matrices using high-density heavy liquid flotation."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice (ONE WORD ONLY for Q5–Q6)',
        type: 'fill',
        prompt: 'Matching volcanic shards across two distant sites creates a time-parallel marker known as an ________. (Write ONE WORD from Passage C)',
        answer: 'isochron',
        acceptableAnswers: ['isochron'],
        explanation: 'Paragraph C states: "...establish an absolute time-parallel marker, or isochron..."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice (ONE WORD ONLY for Q5–Q6)',
        type: 'mcq',
        prompt: 'How do scientists match a cryptotephra shard to a specific volcanic eruption?',
        options: [
          'A) By measuring the radioactive decay of carbon trapped inside the glass.',
          'B) By analyzing its chemical oxide ratios with an electron microprobe.',
          'C) By counting the fossilized pollen grains attached to the shard.',
          'D) By weighing the total mass of ash per cubic meter of ice.'
        ],
        answer: 'B) By analyzing its chemical oxide ratios with an electron microprobe.',
        explanation: 'Paragraph C explains that shards are analyzed with an electron microprobe to determine their geochemical fingerprint (ratios of silica, potassium, and iron oxides).'
      }
    ]
  },

  {
    id: 'read-neuromorphic-spiking-chips',
    section: 'reading',
    taskType: 'Academic Passage + T/F/NG & Completion',
    topic: 'Computer Architecture & Neuromorphic Engineering',
    title: 'Beyond Von Neumann: Event-Driven Neuromorphic Processors',
    instructions:
      'Read the passage below (recommended time: 15 minutes) and complete Questions 1–7.',
    paragraphs: [
      {
        label: 'A',
        text: 'For over seventy years, digital computing has relied on the von Neumann architecture, in which arithmetic logic units and memory banks reside in physically separate compartments. Training large artificial intelligence models on such hardware requires shuttling billions of synaptic weights back and forth across a narrow data bus every millisecond—a phenomenon known as the von Neumann bottleneck, which consumes more electrical energy in data movement than in actual mathematical computation.'
      },
      {
        label: 'B',
        text: 'Neuromorphic engineers draw inspiration from the mammalian cerebral cortex, which performs complex sensory pattern recognition on roughly twenty watts of metabolic power. Unlike synchronous graphics processing units (GPUs) that update every transistor in lockstep with a global clock signal, neuromorphic chips employ spiking neural networks (SNNs). Artificial neurons on an SNN chip remain electrically dormant until accumulated input voltage crosses a threshold, firing a sparse, asynchronous pulse—or spike—only when new information arrives.'
      },
      {
        label: 'C',
        text: 'By co-locating non-volatile memristive memory directly alongside processing nodes, neuromorphic architectures eliminate off-chip data transfer entirely. While conventional GPUs remain superior for batch-training massive language models on static datasets, event-driven neuromorphic sensors excel in edge robotics, such as autonomous drones navigating cluttered forests or prosthetic retinas processing high-speed visual changes in real time on milliwatt batteries.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'In traditional von Neumann computers, transferring data between memory and the processor uses more energy than performing calculations.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        explanation: 'Paragraph A states that the von Neumann bottleneck "consumes more electrical energy in data movement than in actual mathematical computation."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Neuromorphic spiking neural networks rely on a central clock to update all neurons simultaneously.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        explanation: 'Paragraph B contrasts GPUs (which use a global clock signal) with neuromorphic SNNs, where neurons remain dormant and fire "asynchronous" spikes only when threshold voltage is reached.'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Neuromorphic chips have already replaced conventional GPUs for training large language models in commercial data centers.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        explanation: 'Paragraph C notes that "conventional GPUs remain superior for batch-training massive language models on static datasets."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Manufacturing memristive memory is currently more expensive per square millimeter than silicon DRAM.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'NOT GIVEN',
        explanation: 'Manufacturing cost per square millimeter is not mentioned in the passage.'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice (ONE WORD ONLY for Q5–Q6)',
        type: 'fill',
        prompt: 'The human cerebral cortex operates on approximately twenty ________ of metabolic power. (Write ONE WORD from Passage B)',
        answer: 'watts',
        acceptableAnswers: ['watts'],
        explanation: 'Paragraph B states: "...operates on roughly twenty watts of metabolic power."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice (ONE WORD ONLY for Q5–Q6)',
        type: 'fill',
        prompt: 'Artificial neurons on a neuromorphic chip stay ________ until their input voltage exceeds a threshold. (Write ONE WORD from Passage B)',
        answer: 'dormant',
        acceptableAnswers: ['dormant'],
        explanation: 'Paragraph B states: "Artificial neurons on an SNN chip remain electrically dormant until accumulated input voltage crosses a threshold..."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice (ONE WORD ONLY for Q5–Q6)',
        type: 'mcq',
        prompt: 'Which application is best suited for neuromorphic processors according to Paragraph C?',
        options: [
          'A) Archiving historical banking records on magnetic tape.',
          'B) Batch-training static text models in cloud server farms.',
          'C) Low-power, real-time sensory processing in autonomous drones and medical prosthetics.',
          'D) Rendering photorealistic cinema animations.'
        ],
        answer: 'C) Low-power, real-time sensory processing in autonomous drones and medical prosthetics.',
        explanation: 'Paragraph C highlights edge robotics such as autonomous drones and prosthetic retinas operating on milliwatt batteries.'
      }
    ]
  },

  {
    id: 'read-congestion-pricing-behavioral-economics',
    section: 'reading',
    taskType: 'Academic Passage + T/F/NG & Completion',
    topic: 'Transport Economics & Urban Psychology',
    title: 'Loss Aversion and the Political Economy of Cordon Congestion Pricing',
    instructions:
      'Read the passage below (recommended time: 15 minutes) and complete Questions 1–7.',
    paragraphs: [
      {
        label: 'A',
        text: 'Transport economists have long advocated cordon congestion pricing—charging motorists a variable fee to enter a city center during peak hours—as the most rational mechanism to internalize the social costs of traffic delays and tailpipe emissions. In theory, when road space is treated as a scarce utility rather than an unpriced commons, marginal commuters shift toward public transit or off-peak travel, restoring free-flowing traffic.'
      },
      {
        label: 'B',
        text: 'Yet cordon pricing proposals routinely fail at the ballot box prior to implementation, only to achieve durable popular support once enacted—a trajectory documented in Stockholm, Singapore, and London. Behavioral economists attribute this pre-implementation resistance to status quo bias and loss aversion: drivers perceive a new road toll as an immediate, tangible financial loss, whereas the promised time savings remain an uncertain future gain.'
      },
      {
        label: 'C',
        text: 'Stockholm’s 2006 congestion tax trial illustrates how experiential learning dissolves status quo bias. When the municipality introduced a seven-month temporary toll alongside expanded bus frequency, public approval stood at just 36 percent. During the trial, however, peak traffic volumes across the bridges dropped by 22 percent and commute times fell by one-third. When the toll was suspended prior to a binding public referendum, voters—having personally experienced congestion-free mornings—voted to reinstate the charge permanently.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Cordon congestion pricing charges motorists the same flat fee regardless of the time of day.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        explanation: 'Paragraph A defines it as "charging motorists a variable fee to enter a city center during peak hours."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Motorists tend to weigh the immediate cost of a new toll more heavily than potential future time savings.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        explanation: 'Paragraph B explains that due to loss aversion, "drivers perceive a new road toll as an immediate, tangible financial loss, whereas the promised time savings remain an uncertain future gain."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Delivery trucks were exempt from the 2006 Stockholm congestion tax trial.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'NOT GIVEN',
        explanation: 'The passage discusses commuters and bus frequency in Stockholm, but never mentions whether delivery trucks were exempt.'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'A majority of Stockholm residents already supported the congestion tax before the seven-month trial began.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        explanation: 'Paragraph C states that when the trial was introduced, "public approval stood at just 36 percent."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'During Stockholm’s seven-month trial, peak bridge traffic decreased by ________ percent. (Write A NUMBER from Passage C)',
        answer: '22',
        acceptableAnswers: ['22', '22%', 'twenty-two'],
        explanation: 'Paragraph C states: "...peak traffic volumes across the bridges dropped by 22 percent."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Stockholm residents decided to make the congestion charge permanent through a binding public ________. (Write ONE WORD from Passage C)',
        answer: 'referendum',
        acceptableAnswers: ['referendum', 'vote'],
        explanation: 'Paragraph C states: "When the toll was suspended prior to a binding public referendum, voters... voted to reinstate the charge permanently."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice (ONE WORD AND/OR A NUMBER)',
        type: 'mcq',
        prompt: 'Why did public opinion in Stockholm shift in favor of the congestion charge?',
        options: [
          'A) Gasoline prices fell sharply during 2006.',
          'B) Drivers experienced the tangible benefit of shorter commute times during the trial period.',
          'C) The government promised to abolish income taxes for commuters.',
          'D) Fines for unpaid tolls were cancelled.'
        ],
        answer: 'B) Drivers experienced the tangible benefit of shorter commute times during the trial period.',
        explanation: 'Paragraph C explains that experiential learning during the 7-month trial let voters personally experience congestion-free mornings with commute times cut by one-third.'
      }
    ]
  },

  // ========================================================================
  // WRITING TASKS (6 Complete Workouts: 3 Task 1 Charts/Tables + 3 Task 2 Essays)
  // ========================================================================
  {
    id: 'write-t1-nordic-heating-transition',
    section: 'writing',
    subMode: 'task1',
    taskType: 'Academic Writing Task 1 — Bar Chart Report (15-Min Sprint)',
    topic: 'Energy Transition & Residential Heating',
    title: 'Task 1: Residential Heating Energy Sources in Three Nordic Cities',
    targetWords: 150,
    instructions:
      'Spend about 15 minutes on this task. Summarize the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    prompt:
      'The bar chart below shows the percentage of residential buildings heated by three primary energy sources (District Geothermal/Heat Networks, Electric Heat Pumps, and Fossil Oil/Gas Boilers) across Reykjavik, Stockholm, and Helsinki in 2024.',
    chartSpec: {
      chartType: 'bar',
      title: 'Share of Residential Heating by Energy Source (2024)',
      unit: '%',
      categories: ['Reykjavik', 'Stockholm', 'Helsinki'],
      series: [
        { name: 'District Heat / Geothermal', values: [92, 64, 58] },
        { name: 'Electric Heat Pumps', values: [7, 29, 24] },
        { name: 'Fossil Oil / Gas Boilers', values: [1, 7, 18] }
      ]
    },
    modelAnswer:
      'The grouped bar chart compares the proportion of residential dwellings heated via district heating networks, electric heat pumps, and fossil-fuel boilers across three Nordic capitals—Reykjavik, Stockholm, and Helsinki—in 2024.\n\nOverall, centralized district and geothermal networks constituted the dominant heating mechanism in all three cities, whereas fossil fuels accounted for the smallest share everywhere. Reykjavik relied almost exclusively on district geothermal energy, while Helsinki retained the highest residual dependence on fossil fuels.\n\nIn detail, Reykjavik recorded an overwhelming 92% share for district geothermal heating, leaving electric heat pumps at a modest 7% and fossil boilers at a negligible 1%. By contrast, Stockholm and Helsinki displayed more diversified profiles. In Stockholm, 64% of homes utilized district networks, supplemented by 29% using electric heat pumps and only 7% burning oil or gas.\n\nHelsinki followed a broadly similar pattern to Stockholm in heat pump adoption (24%) and district heating (58%); however, its reliance on fossil boilers stood at 18%, more than double Stockholm’s figure and eighteen times that of Reykjavik.'
  },

  {
    id: 'write-t1-global-semiconductor-water',
    section: 'writing',
    subMode: 'task1',
    taskType: 'Academic Writing Task 1 — Line Graph Report (15-Min Sprint)',
    topic: 'Industrial Manufacturing & Water Recycling',
    title: 'Task 1: Ultrapure Water Recycling Rates in Semiconductor Fabrication (2012–2024)',
    targetWords: 150,
    instructions:
      'Spend about 15 minutes on this task. Summarize the main trends and make comparisons where relevant. Write at least 150 words.',
    prompt:
      'The line graph illustrates the average percentage of ultrapure water recycled and reused within semiconductor fabrication plants in Taiwan, South Korea, and the European Union between 2012 and 2024.',
    chartSpec: {
      chartType: 'line',
      title: 'Ultrapure Water Reclamation Rate in Semiconductor Fabs (%)',
      unit: '%',
      categories: ['2012', '2016', '2020', '2024'],
      series: [
        { name: 'Taiwan', values: [68, 76, 84, 89] },
        { name: 'South Korea', values: [54, 63, 75, 83] },
        { name: 'European Union', values: [61, 65, 70, 74] }
      ]
    },
    modelAnswer:
      'The line graph tracks the proportion of ultrapure water reclaimed across semiconductor manufacturing facilities in Taiwan, South Korea, and the European Union over a twelve-year period from 2012 to 2024.\n\nOverall, water recycling rates rose steadily in all three jurisdictions throughout the period. Taiwan consistently maintained the highest reclamation efficiency, whereas South Korea achieved the most rapid upward trajectory, overtaking the European Union after 2016.\n\nIn 2012, Taiwan already recycled 68% of its fabrication water, compared with 61% in the European Union and 54% in South Korea. Over the subsequent twelve years, Taiwan’s rate climbed by 21 percentage points to reach a peak of 89% in 2024.\n\nMeanwhile, South Korean plants expanded their reclamation capacity dramatically, rising from 54% in 2012 to 63% in 2016, surpassing the European Union (75% versus 70%) by 2020, and finishing at 83% in 2024. Conversely, the European Union exhibited a more gradual, linear increase of 13 percentage points overall, ending the period in third place at 74%.'
  },

  {
    id: 'write-t1-university-research-funding-table',
    section: 'writing',
    subMode: 'task1',
    taskType: 'Academic Writing Task 1 — Data Table Report (15-Min Sprint)',
    topic: 'Higher Education & R&D Expenditure',
    title: 'Task 1: Sources of University Research Funding in Four Countries (2023)',
    targetWords: 150,
    instructions:
      'Spend about 15 minutes on this task. Summarize the information in the table by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    prompt:
      'The table below gives information about the percentage of university research funding derived from three sources (Government Grants, Private Industry Partnerships, and Philanthropic Endowments/Foundations) across four countries in 2023.',
    chartSpec: {
      chartType: 'table',
      title: 'Composition of University Research Funding by Source (2023)',
      unit: '%',
      categories: ['Germany', 'Japan', 'United Kingdom', 'United States'],
      series: [
        { name: 'Government Grants', values: [72, 64, 59, 55] },
        { name: 'Private Industry Partnerships', values: [21, 31, 18, 22] },
        { name: 'Philanthropic & Foundations', values: [7, 5, 23, 23] }
      ]
    },
    modelAnswer:
      'The table compares the proportional breakdown of university research expenditure across three funding streams—government grants, corporate partnerships, and philanthropic foundations—in Germany, Japan, the United Kingdom, and the United States in 2023.\n\nOverall, public government grants represented the primary source of academic research financing in all four nations, accounting for well over half of total funding everywhere. However, whereas Germany and Japan relied heavily on state and industrial sponsorship, the United Kingdom and the United States drew a substantially larger share from philanthropic endowments.\n\nSpecifically, Germany recorded the highest proportion of state-funded university research at 72%, followed by Japan at 64%. In the United Kingdom and the United States, government grants contributed slightly lower shares of 59% and 55%, respectively.\n\nRegarding non-governmental funding, Japan stood out for its strong corporate integration, with private industry partnerships supplying 31% of university research capital—nearly double the UK figure (18%) and roughly ten percentage points higher than Germany (21%) and the US (22%). Conversely, philanthropic foundations provided 23% of academic research funds in both the UK and the US, compared with just 7% in Germany and 5% in Japan.'
  },

  {
    id: 'write-t2-algorithmic-hiring-ethics',
    section: 'writing',
    subMode: 'task2',
    taskType: 'Academic Writing Task 2 — Essay Core / Full Essay',
    topic: 'Automated Recruitment & Labor Markets',
    title: 'Task 2: Algorithmic Screening in University Admissions and Corporate Hiring',
    targetWords: 180,
    instructions:
      'Spend about 15 minutes crafting a high-impact Academic Task 2 response (Introduction + 2 Analytical Body Paragraphs + Concise Conclusion, target 180–250 words). Remember: the timer will not cut you off if you wish to write a full 250+ word essay.',
    prompt:
      'Increasingly, large corporations and universities use automated algorithms to screen initial applications before a human reviewer sees them.\n\nTo what extent do the efficiency benefits of automated screening outweigh the risks of overlooking unconventional talent?',
    chartSpec: null,
    modelAnswer:
      'The proliferation of algorithmic filtering in university admissions and corporate recruitment has transformed how institutions manage vast applicant pools. While automated systems undeniably accelerate administrative workflows, I contend that their over-reliance on historical templates poses a grave threat to meritocracy by systematically excluding unconventional talent.\n\nAdmittedly, the operational case for algorithmic triage is compelling. Elite universities and multinational firms routinely receive tens of thousands of dossiers for a handful of openings, making exhaustive human evaluation logistically unfeasible. Automated parsers can instantaneously verify objective prerequisites—such as technical certifications, grade thresholds, or language proficiency—while eliminating the fatigue-induced inconsistency that plagues human committees.\n\nNevertheless, these efficiency gains are eclipsed by the epistemic rigidity of predictive models. Because screening algorithms are trained on past cohorts of successful candidates, they inherently penalize non-linear career trajectories, interdisciplinary thinkers, and applicants from under-represented educational backgrounds. A brilliant self-taught programmer or a mature student returning to academia after caregiving responsibilities may lack conventional keyword density on a curriculum vitae, resulting in immediate algorithmic rejection before their substantive potential is ever assessed.\n\nIn conclusion, although automated screening offers undeniable speed, its tendency to homogenize intellectual capital is a disproportionate price to pay. Institutions should restrict algorithms to verifying basic eligibility while preserving human judgment for holistic evaluation.'
  },

  {
    id: 'write-t2-scientific-open-access',
    section: 'writing',
    subMode: 'task2',
    taskType: 'Academic Writing Task 2 — Essay Core / Full Essay',
    topic: 'Scientific Publishing & Public Funding',
    title: 'Task 2: Mandatory Open Access for Publicly Funded Research',
    targetWords: 180,
    instructions:
      'Spend about 15 minutes crafting an Academic Task 2 response (target 180–250 words). Support your argument with formal academic register and clear topic sentences.',
    prompt:
      'Some policymakers argue that all scientific research funded by taxpayers should be published immediately in free, open-access journals, while commercial publishers argue that subscription fees are essential to fund rigorous peer review.\n\nDiscuss both views and give your own opinion.',
    chartSpec: null,
    modelAnswer:
      'The debate over whether taxpayer-funded research should be freely accessible immediately upon publication pits the democratic dissemination of knowledge against the commercial economics of academic publishing. While subscription-based journals have historically organized editorial quality control, I firmly believe that publicly financed discoveries belong in the public domain without paywalls.\n\nProponents of subscription models emphasize that curating reliable science entails substantial overhead. Commercial publishers coordinate double-blind peer review, maintain digital archival infrastructure, and employ technical editors to detect plagiarism and data fabrication. Without subscription revenues from university libraries, critics warn that journals may shift costs onto researchers via exorbitant article-processing charges, inadvertently disadvantaging scholars from developing nations.\n\nHowever, the argument that subscription paywalls are necessary to sustain peer review is increasingly untenable. In practice, academic peer reviewers and editorial board members—who are predominantly salaried university professors—evaluate manuscripts free of charge as a professional service. Charging taxpayers a second time to read medical or climate research they have already funded restricts clinical practitioners, independent engineers, and policy analysts from applying cutting-edge evidence.\n\nIn conclusion, while editorial infrastructure requires sustainable funding, this cost should be borne directly by national research councils through non-profit publishing platforms, ensuring that publicly funded science remains universally accessible.'
  },

  {
    id: 'write-t2-urban-megaprojects-vs-maintenance',
    section: 'writing',
    subMode: 'task2',
    taskType: 'Academic Writing Task 2 — Essay Core / Full Essay',
    topic: 'Public Infrastructure & Fiscal Policy',
    title: 'Task 2: Iconic Urban Megaprojects versus Routine Infrastructure Maintenance',
    targetWords: 180,
    instructions:
      'Spend about 15 minutes crafting an Academic Task 2 response (target 180–250 words). Present a clear thesis and develop cohesive analytical paragraphs.',
    prompt:
      'Many national and municipal governments allocate billions of dollars to constructing prestigious new megaprojects (such as high-speed rail terminals, stadiums, and landmark museums) while existing local infrastructure (such as water pipes, commuter buses, and regional bridges) deteriorates.\n\nWhy do governments prefer funding new megaprojects, and how can policy be reformed to ensure adequate maintenance of existing infrastructure?',
    chartSpec: null,
    modelAnswer:
      'Across both advanced and emerging economies, fiscal authorities frequently favor ribbon-cutting ceremonies for monumental megaprojects over the unglamorous upkeep of aging municipal utilities. This distortion stems primarily from electoral incentives and media visibility, and it can only be rectified through legally ring-fenced maintenance endowments and lifecycle accounting.\n\nThe political allure of megaprojects is rooted in short-term electoral psychology. A gleaming high-speed rail terminus or architectural museum serves as a tangible symbol of modernization that elected officials can showcase to voters within a single political cycle. Conversely, rehabilitating subterranean water mains or resurfacing regional bus corridors yields invisible preventative benefits; citizens rarely reward politicians for a bridge that did not collapse or a pipe that did not burst.\n\nTo counteract this bias, governments must reform capital budgeting rules in two ways. First, legislation should mandate that no new capital project can be approved without a fully funded, ring-fenced thirty-year maintenance trust incorporated into its initial appropriation. Second, national auditing bodies should publish annual infrastructure health scorecards for every municipality, tying federal transport grants directly to verified reductions in deferred maintenance backlogs.\n\nIn conclusion, politicians gravitate toward prestigious megaprojects because visibility is rewarded at the ballot box. Binding lifecycle trusts and transparent auditing are essential to safeguard the foundational infrastructure upon which daily civic life depends.'
  },

  // ========================================================================
  // LISTENING TASKS (6 Complete Workouts = 42 Questions)
  // ========================================================================
  {
    id: 'listen-p3-kelp-forest-restoration',
    section: 'listening',
    taskType: 'Part 3 Academic Tutorial + Note Completion & MCQ',
    topic: 'Marine Biology Fieldwork',
    title: 'Section 3: Tutorial on Tasmanian Giant Kelp Restoration',
    instructions:
      'Click "Play Academic Audio" to listen to the tutorial dialogue between Dr. Mercer and two marine biology students (Liam and Priya). Complete Questions 1–7 while listening. Write NO MORE THAN ONE WORD AND/OR A NUMBER for Questions 1–4.',
    script: [
      {
        speaker: 'Dr. Mercer',
        pitch: 0.92,
        rate: 0.98,
        text: 'Come in, Liam and Priya. Let’s review the methodology for your dissertation project on giant kelp restoration off the eastern coast of Tasmania.'
      },
      {
        speaker: 'Priya',
        pitch: 1.12,
        rate: 1.0,
        text: 'Thanks, Dr. Mercer. We’ve compiled the historical satellite imagery first. Since the 1980s, over 95 percent of the surface kelp canopy has vanished because the East Australian Current has pushed warmer, nutrient-poor water southward.'
      },
      {
        speaker: 'Liam',
        pitch: 0.98,
        rate: 1.0,
        text: 'And that thermal stress was compounded by an explosion in long-spined sea urchins, which migrated down from New South Wales and grazed the remaining reefs into bare rock—what ecologists call urchin barrens.'
      },
      {
        speaker: 'Dr. Mercer',
        pitch: 0.92,
        rate: 0.98,
        text: 'Precisely. Now, in Section Two of your proposal, you’re testing thermally tolerant kelp strains. How are you anchoring the juvenile sporophytes to the seabed?'
      },
      {
        speaker: 'Priya',
        pitch: 1.12,
        rate: 1.0,
        text: 'Initially we considered drilling stainless steel bolts into the basalt, but that’s far too slow for divers. Instead, we are seeding the microscopic spores onto biodegradable gravel tiles made of compressed limestone, which we can scatter directly from a research vessel.'
      },
      {
        speaker: 'Dr. Mercer',
        pitch: 0.92,
        rate: 0.98,
        text: 'Clever. What depth range have you selected for the trial plots?'
      },
      {
        speaker: 'Liam',
        pitch: 0.98,
        rate: 1.0,
        text: 'We settled on a uniform depth of 14 meters. Shallower reefs suffer too much wave turbulence during winter swells, while anything below 18 meters doesn’t receive enough photosynthetically active light.'
      },
      {
        speaker: 'Dr. Mercer',
        pitch: 0.92,
        rate: 0.98,
        text: 'Make sure you monitor dissolved nitrate levels every fortnight. One last thing: before the tiles go into the water in April, verify that your acoustic telemetry tags are calibrated to track rock lobster predation on the urchins.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Research Notes Completion (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Over ________% of Tasmania’s giant kelp canopy has disappeared since the 1980s.',
        answer: '95',
        acceptableAnswers: ['95', '95%', 'ninety-five'],
        explanation: 'Priya states: "Since the 1980s, over 95 percent of the surface kelp canopy has vanished..."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Research Notes Completion (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Migrating sea ________ have overgrazed the reefs, creating bare rock barrens.',
        answer: 'urchins',
        acceptableAnswers: ['urchins', 'urchin'],
        explanation: 'Liam explains that "long-spined sea urchins... grazed the remaining reefs into bare rock."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Research Notes Completion (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Spores are seeded onto biodegradable gravel tiles composed of compressed ________.',
        answer: 'limestone',
        acceptableAnswers: ['limestone'],
        explanation: 'Priya says: "...biodegradable gravel tiles made of compressed limestone."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Research Notes Completion (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Trial plots will be positioned at a depth of ________ meters.',
        answer: '14',
        acceptableAnswers: ['14', 'fourteen'],
        explanation: 'Liam states: "We settled on a uniform depth of 14 meters."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Why did Priya and Liam reject using stainless steel bolts?',
        options: [
          'A) They corrode rapidly in warm currents.',
          'B) Installing them underwater takes divers too much time.',
          'C) The marine park authority prohibited metal fixtures.',
          'D) Kelp holdfasts cannot grip smooth steel surfaces.'
        ],
        answer: 'B) Installing them underwater takes divers too much time.',
        explanation: 'Priya notes: "Initially we considered drilling stainless steel bolts into the basalt, but that’s far too slow for divers."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Why did the students avoid planting kelp at depths greater than 18 meters?',
        options: [
          'A) Water temperatures are too cold.',
          'B) Acoustic tags lose signal strength.',
          'C) Insufficient light reaches the seabed for photosynthesis.',
          'D) Strong winter swells uproot young kelp.'
        ],
        answer: 'C) Insufficient light reaches the seabed for photosynthesis.',
        explanation: 'Liam states: "...anything below 18 meters doesn’t receive enough photosynthetically active light."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Which chemical parameter does Dr. Mercer instruct the students to measure every two weeks?',
        options: [
          'A) Dissolved nitrate levels',
          'B) Salinity gradients',
          'C) Dissolved oxygen saturation',
          'D) Calcium carbonate acidity'
        ],
        answer: 'A) Dissolved nitrate levels',
        explanation: 'Dr. Mercer says: "Make sure you monitor dissolved nitrate levels every fortnight."'
      }
    ]
  },

  {
    id: 'listen-p4-roman-marine-concrete',
    section: 'listening',
    taskType: 'Part 4 University Lecture + Note Completion & MCQ',
    topic: 'Materials Science & Archaeology',
    title: 'Section 4: Lecture on Self-Healing Roman Marine Concrete',
    instructions:
      'Listen to the university lecture on ancient Roman harbor engineering and answer Questions 1–7. Write ONE WORD ONLY for Questions 1–4.',
    script: [
      {
        speaker: 'Professor Vance',
        pitch: 0.9,
        rate: 0.96,
        text: 'Good morning. Today in our civil engineering history series, we examine why Roman maritime breakwaters—built over two millennia ago along the Italian coast—have grown stronger under constant wave impact, whereas modern Portland cement structures often deteriorate within fifty years.'
      },
      {
        speaker: 'Professor Vance',
        pitch: 0.9,
        rate: 0.96,
        text: 'According to writings by the first-century architect Vitruvius, Roman builders mixed volcanic ash from the Bay of Naples, known as pozzolana, with quicklime and seawater, then packed this mortar into wooden molds filled with chunks of volcanic rock called tuff.'
      },
      {
        speaker: 'Professor Vance',
        pitch: 0.9,
        rate: 0.96,
        text: 'When seawater percolates through microscopic fissures in the cured concrete, it dissolves the volcanic ash and reacts with residual lime pockets to crystallize a rare interlocking mineral called aluminous tobermorite. These plate-like crystals reinforce the matrix and prevent cracks from propagating.'
      },
      {
        speaker: 'Professor Vance',
        pitch: 0.9,
        rate: 0.96,
        text: 'By contrast, modern marine concrete relies on internal steel reinforcement bars, or rebar. Once chloride ions from seawater penetrate the porous cement paste, the steel oxidizes and expands, cracking the surrounding concrete from the inside out.'
      },
      {
        speaker: 'Professor Vance',
        pitch: 0.9,
        rate: 0.96,
        text: 'Moreover, roasting limestone for modern Portland cement requires kiln temperatures of 1,450 degrees Celsius, whereas Roman lime calcination operated at roughly 900 degrees, offering valuable lessons for decarbonizing contemporary coastal infrastructure.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'Roman builders combined volcanic ash (pozzolana) with quicklime and ________ to create hydraulic mortar.',
        answer: 'seawater',
        acceptableAnswers: ['seawater', 'water'],
        explanation: 'The lecturer states: "...mixed volcanic ash from the Bay of Naples, known as pozzolana, with quicklime and seawater."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'The mortar was poured into timber molds containing coarse volcanic rock known as ________.',
        answer: 'tuff',
        acceptableAnswers: ['tuff'],
        explanation: 'The lecturer states: "...packed this mortar into wooden molds filled with chunks of volcanic rock called tuff."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'In modern marine structures, seawater chlorides cause internal ________ reinforcement bars to rust and expand.',
        answer: 'steel',
        acceptableAnswers: ['steel'],
        explanation: 'The lecturer notes: "modern marine concrete relies on internal steel reinforcement bars... the steel oxidizes and expands."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'Roman kilns operated at around 900°C, significantly lower than the 1,450°C required for modern ________ cement.',
        answer: 'Portland',
        acceptableAnswers: ['portland', 'Portland'],
        explanation: 'The lecturer states: "roasting limestone for modern Portland cement requires kiln temperatures of 1,450 degrees Celsius."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'What happens when seawater enters tiny cracks in Roman marine concrete?',
        options: [
          'A) It washes away the quicklime and weakens the breakwater.',
          'B) It triggers the growth of plate-like tobermorite crystals that seal the cracks.',
          'C) It corrodes the wooden molds surrounding the pier.',
          'D) It lowers the temperature of the volcanic rock.'
        ],
        answer: 'B) It triggers the growth of plate-like tobermorite crystals that seal the cracks.',
        explanation: 'Seawater dissolves volcanic ash and reacts with lime pockets to crystallize aluminous tobermorite, reinforcing the matrix.'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Which historical source documented the recipe for Roman harbor mortar?',
        options: [
          'A) Pliny the Younger',
          'B) Emperor Trajan',
          'C) The first-century architect Vitruvius',
          'D) Medieval Venetian shipbuilders'
        ],
        answer: 'C) The first-century architect Vitruvius',
        explanation: 'The lecturer cites "writings by the first-century architect Vitruvius."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Why is Roman concrete technology attracting interest from modern climate engineers?',
        options: [
          'A) It can be 3D-printed without water.',
          'B) It requires lower kiln temperatures and lasts longer without steel.',
          'C) It absorbs microplastics from harbor water.',
          'D) It sets in less than ten minutes.'
        ],
        answer: 'B) It requires lower kiln temperatures and lasts longer without steel.',
        explanation: 'The lecture highlights its multi-century durability without rusting steel and its lower 900°C calcination temperature.'
      }
    ]
  },

  {
    id: 'listen-p3-hospital-acoustic-ecology',
    section: 'listening',
    taskType: 'Part 3 Academic Tutorial + Note Completion & MCQ',
    topic: 'Healthcare Architecture & Psychoacoustics',
    title: 'Section 3: Research Seminar on Acoustic Design in Intensive Care Units',
    instructions:
      'Listen to the seminar discussion between Dr. Aris Thorne and two architectural acoustics students (Hannah and Marcus). Complete Questions 1–7. Write ONE WORD AND/OR A NUMBER for Questions 1–4.',
    script: [
      {
        speaker: 'Dr. Thorne',
        pitch: 0.9,
        rate: 0.97,
        text: 'Hannah, Marcus—let’s look at the acoustic monitoring data you collected from the neonatal and adult intensive care wards at St. Jude’s Hospital.'
      },
      {
        speaker: 'Hannah',
        pitch: 1.12,
        rate: 1.0,
        text: 'Right, Dr. Thorne. Although the World Health Organization recommends that nocturnal hospital ward sound levels remain below 35 decibels, our dosimeters recorded an average nighttime level of 58 decibels, with impulse peaks reaching 82 decibels.'
      },
      {
        speaker: 'Marcus',
        pitch: 0.98,
        rate: 1.0,
        text: 'And when we categorized the audio spectrum, 67 percent of the high-frequency spikes came from false-positive infusion pump and telemetry alarms, which also trigger severe alarm fatigue among nursing staff.'
      },
      {
        speaker: 'Dr. Thorne',
        pitch: 0.9,
        rate: 0.97,
        text: 'How did the physical materials of the ward contribute to that reverberation time?'
      },
      {
        speaker: 'Hannah',
        pitch: 1.12,
        rate: 1.0,
        text: 'Infection-control protocols previously led the hospital to install non-porous vinyl flooring and hard plasterboard ceilings. Sound waves simply bounce down the central corridor. We’re proposing antibacterial micro-perforated ceiling baffles made of recycled fiberglass.'
      },
      {
        speaker: 'Marcus',
        pitch: 0.98,
        rate: 1.0,
        text: 'We also tested replacing audible corridor pagers with vibrating wristbands for nurses during the midnight-to-six-a.m. shift, which cut sleep-disrupting awakenings among recovering cardiac patients by 40 percent.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Seminar Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'The World Health Organization advises that nighttime hospital ward noise should not exceed ________ decibels.',
        answer: '35',
        acceptableAnswers: ['35', 'thirty-five'],
        explanation: 'Hannah notes that the WHO recommends nocturnal ward sound levels "remain below 35 decibels."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Seminar Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Frequent non-urgent equipment alerts cause alarm ________ in nursing staff.',
        answer: 'fatigue',
        acceptableAnswers: ['fatigue'],
        explanation: 'Marcus states that false-positive alarms "trigger severe alarm fatigue among nursing staff."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Seminar Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'To absorb sound while meeting hygiene standards, the students propose installing micro-perforated ceiling baffles made of ________.',
        answer: 'fiberglass',
        acceptableAnswers: ['fiberglass', 'recycled fiberglass', 'fibreglass'],
        explanation: 'Hannah proposes "antibacterial micro-perforated ceiling baffles made of recycled fiberglass."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Seminar Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Giving nurses vibrating ________ on night shifts reduced patient sleep disruptions by 40%.',
        answer: 'wristbands',
        acceptableAnswers: ['wristbands', 'wristband'],
        explanation: 'Marcus explains they tested "replacing audible corridor pagers with vibrating wristbands for nurses."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'What was the average nighttime noise level measured by the students at St. Jude’s Hospital?',
        options: [
          'A) 35 decibels',
          'B) 40 decibels',
          'C) 58 decibels',
          'D) 82 decibels'
        ],
        answer: 'C) 58 decibels',
        explanation: 'Hannah reports: "our dosimeters recorded an average nighttime level of 58 decibels" (82 dB was the impulse peak).'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Why did St. Jude’s Hospital originally install hard plasterboard ceilings and vinyl floors?',
        options: [
          'A) To reduce construction insurance premiums.',
          'B) To comply with infection-control and cleaning protocols.',
          'C) To help nurses hear patient calls from further away.',
          'D) To brighten the ward with reflective surfaces.'
        ],
        answer: 'B) To comply with infection-control and cleaning protocols.',
        explanation: 'Hannah states: "Infection-control protocols previously led the hospital to install non-porous vinyl flooring and hard plasterboard ceilings."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Which patient group experienced a 40% reduction in nighttime awakenings during the wristband trial?',
        options: [
          'A) Recovering cardiac patients',
          'B) Orthopedic surgery patients',
          'C) Outpatient clinic visitors',
          'D) Pediatric dental patients'
        ],
        answer: 'A) Recovering cardiac patients',
        explanation: 'Marcus notes that vibrating wristbands "cut sleep-disrupting awakenings among recovering cardiac patients by 40 percent."'
      }
    ]
  },

  {
    id: 'listen-p4-amazonian-lidar-archaeology',
    section: 'listening',
    taskType: 'Part 4 University Lecture + Note Completion & MCQ',
    topic: 'Archaeology & Remote Sensing',
    title: 'Section 4: Airborne LiDAR and Pre-Columbian Urbanism in the Amazon',
    instructions:
      'Listen to the archaeology lecture on airborne laser scanning in the Amazon basin and complete Questions 1–7. Write ONE WORD AND/OR A NUMBER for Questions 1–4.',
    script: [
      {
        speaker: 'Dr. Elena Rostova',
        pitch: 1.05,
        rate: 0.96,
        text: 'Welcome back. For most of the twentieth century, anthropologists viewed the pre-Columbian Amazon basin as a counterfeit paradise—arguing that nutrient-poor tropical soils could only sustain small, nomadic foraging bands.'
      },
      {
        speaker: 'Dr. Elena Rostova',
        pitch: 1.05,
        rate: 0.96,
        text: 'That paradigm has been overturned by airborne LiDAR—Light Detection and Ranging. By mounting a laser scanner beneath a small aircraft and firing 400,000 infrared pulses per second toward the forest floor, researchers can digitally strip away the dense triple-tier tree canopy.'
      },
      {
        speaker: 'Dr. Elena Rostova',
        pitch: 1.05,
        rate: 0.96,
        text: 'In the Upano Valley of eastern Ecuador, LiDAR terrain models recently revealed a networked landscape of over 6,000 rectangular earthen platforms, ceremonial plazas, and straight sunken causeways stretching for 25 kilometers, inhabited as early as 500 BCE.'
      },
      {
        speaker: 'Dr. Elena Rostova',
        pitch: 1.05,
        rate: 0.96,
        text: 'Crucially, these low-density garden cities sustained large populations without deforestation by cultivating fertile anthropogenic dark earths—known locally in Brazil as terra preta—enriched with charcoal, bone fragments, and composted pottery.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Twentieth-century scholars believed poor Amazonian soils could only support small ________ bands.',
        answer: 'nomadic',
        acceptableAnswers: ['nomadic', 'foraging'],
        explanation: 'The lecturer states: "...arguing that nutrient-poor tropical soils could only sustain small, nomadic foraging bands."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Airborne LiDAR allows archaeologists to digitally remove the forest ________ to see earthworks underneath.',
        answer: 'canopy',
        acceptableAnswers: ['canopy'],
        explanation: 'The lecturer explains that LiDAR can "digitally strip away the dense triple-tier tree canopy."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'In Ecuador’s Upano Valley, straight sunken ________ connected settlements over 25 kilometers.',
        answer: 'causeways',
        acceptableAnswers: ['causeways', 'roads'],
        explanation: 'The lecturer mentions "ceremonial plazas, and straight sunken causeways stretching for 25 kilometers."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Indigenous farmers improved soil fertility by adding bone fragments, compost, and ________.',
        answer: 'charcoal',
        acceptableAnswers: ['charcoal', 'pottery'],
        explanation: 'The lecturer states that dark earths (terra preta) were "enriched with charcoal, bone fragments, and composted pottery."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'How many laser pulses per second were fired by the aircraft scanner described in the lecture?',
        options: [
          'A) 6,000',
          'B) 25,000',
          'C) 400,000',
          'D) 1,000,000'
        ],
        answer: 'C) 400,000',
        explanation: 'The lecturer specifies "firing 400,000 infrared pulses per second toward the forest floor."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'When were the Upano Valley settlements first inhabited according to the lecture?',
        options: [
          'A) Around 500 BCE',
          'B) Around 500 CE',
          'C) Around 1492 CE',
          'D) Around 1920 CE'
        ],
        answer: 'A) Around 500 BCE',
        explanation: 'The lecturer notes the Upano Valley network was "inhabited as early as 500 BCE."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'What term does the lecturer use to describe the layout of these ancient Amazonian settlements?',
        options: [
          'A) Walled stone fortresses',
          'B) Low-density garden cities',
          'C) Floating river villages',
          'D) Subterranean cave networks'
        ],
        answer: 'B) Low-density garden cities',
        explanation: 'The lecturer states: "Crucially, these low-density garden cities sustained large populations without deforestation..."'
      }
    ]
  },

  {
    id: 'listen-p3-andean-quinoa-frost-tolerance',
    section: 'listening',
    taskType: 'Part 3 Academic Tutorial + Note Completion & MCQ',
    topic: 'Agronomy & Plant Genetics',
    title: 'Section 3: Tutorial on High-Altitude Quinoa Frost Resistance',
    instructions:
      'Listen to the agronomy tutorial between Professor Alvarez and two graduate researchers (Chloe and Tariq). Complete Questions 1–7. Write ONE WORD AND/OR A NUMBER for Questions 1–4.',
    script: [
      {
        speaker: 'Prof. Alvarez',
        pitch: 0.93,
        rate: 0.97,
        text: 'Chloe, Tariq—how are the greenhouse trials progressing on the Bolivian Altiplano quinoa cultivars?'
      },
      {
        speaker: 'Chloe',
        pitch: 1.1,
        rate: 1.0,
        text: 'Very well, Professor. We tested four highland varieties grown at elevations above 3,800 meters. While lowland cereal crops suffer cellular ice damage at minus 2 degrees Celsius, the Real Blanca cultivar survived radiative night frosts down to minus 8 degrees.'
      },
      {
        speaker: 'Tariq',
        pitch: 0.98,
        rate: 1.0,
        text: 'We found that the plant’s primary defense mechanism is accumulating soluble sugars—specifically raffinose—together with proline inside the leaf vacuoles, which acts as a natural antifreeze and prevents ice crystals from puncturing cell membranes.'
      },
      {
        speaker: 'Prof. Alvarez',
        pitch: 0.93,
        rate: 0.97,
        text: 'And what about the epidermal bladder cells on the surface of the leaves?'
      },
      {
        speaker: 'Chloe',
        pitch: 1.1,
        rate: 1.0,
        text: 'Those salt-filled vesicles reflect intense ultraviolet radiation during the day and buffer thermal loss at night. However, when we mechanically brushed the bladder cells off a control group, stomatal water loss increased by 32 percent.'
      },
      {
        speaker: 'Prof. Alvarez',
        pitch: 0.93,
        rate: 0.97,
        text: 'Fascinating. Before you submit the manuscript to the Journal of Arid Agriculture, make sure you include the seed saponin measurements, since bitter saponins deter bird predation in open fields.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Agronomy Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Highland quinoa varieties were collected from altitudes above ________ meters.',
        answer: '3,800',
        acceptableAnswers: ['3,800', '3800'],
        explanation: 'Chloe states: "We tested four highland varieties grown at elevations above 3,800 meters."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Agronomy Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'The Real Blanca cultivar tolerated night frosts as cold as minus ________ degrees Celsius.',
        answer: '8',
        acceptableAnswers: ['8', 'eight', '-8'],
        explanation: 'Chloe states: "...the Real Blanca cultivar survived radiative night frosts down to minus 8 degrees."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Agronomy Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Quinoa leaves accumulate soluble ________ and proline to prevent internal ice crystal damage.',
        answer: 'sugars',
        acceptableAnswers: ['sugars', 'sugar', 'raffinose'],
        explanation: 'Tariq explains that the defense mechanism is "accumulating soluble sugars—specifically raffinose—together with proline."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Agronomy Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Bitter compounds called saponins in the seed coat protect crops from ________ predation.',
        answer: 'bird',
        acceptableAnswers: ['bird', 'birds'],
        explanation: 'Prof. Alvarez notes that "bitter saponins deter bird predation in open fields."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'What happened when researchers brushed the epidermal bladder cells off quinoa leaves?',
        options: [
          'A) The plants flowered two weeks earlier.',
          'B) Water loss through the stomata rose by 32 percent.',
          'C) Root nitrogen uptake doubled.',
          'D) Leaf chlorophyll turned purple.'
        ],
        answer: 'B) Water loss through the stomata rose by 32 percent.',
        explanation: 'Chloe reports: "when we mechanically brushed the bladder cells off a control group, stomatal water loss increased by 32 percent."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Besides buffering night temperatures, what daytime function do epidermal bladder cells serve?',
        options: [
          'A) Capturing insects for nitrogen.',
          'B) Reflecting intense ultraviolet radiation.',
          'C) Absorbing atmospheric carbon monoxide.',
          'D) Attracting pollinating moths.'
        ],
        answer: 'B) Reflecting intense ultraviolet radiation.',
        explanation: 'Chloe states: "Those salt-filled vesicles reflect intense ultraviolet radiation during the day..."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Where do the soluble sugars and proline concentrate inside the quinoa leaf?',
        options: [
          'A) Inside the leaf vacuoles',
          'B) On the outer bark',
          'C) In the pollen grains',
          'D) Inside root nodules'
        ],
        answer: 'A) Inside the leaf vacuoles',
        explanation: 'Tariq mentions accumulating raffinose and proline "inside the leaf vacuoles."'
      }
    ]
  },

  {
    id: 'listen-p4-sodium-ion-grid-batteries',
    section: 'listening',
    taskType: 'Part 4 University Lecture + Note Completion & MCQ',
    topic: 'Electrochemistry & Grid Energy Storage',
    title: 'Section 4: Sodium-Ion Batteries and Prussian White Cathodes',
    instructions:
      'Listen to the chemical engineering lecture on stationary grid storage and answer Questions 1–7. Write ONE WORD ONLY for Questions 1–4.',
    script: [
      {
        speaker: 'Prof. Lin',
        pitch: 0.95,
        rate: 0.96,
        text: 'Good afternoon. While lithium-ion batteries dominate electric vehicles due to their high gravimetric energy density, stationary power grids—which store solar and wind energy in shipping-container arrays—do not need to be lightweight; they need abundant, inexpensive raw materials.'
      },
      {
        speaker: 'Prof. Lin',
        pitch: 0.95,
        rate: 0.96,
        text: 'Sodium is over 1,000 times more abundant in the Earth’s crust than lithium and can be refined from ordinary soda ash or seawater. Furthermore, because sodium does not alloy with aluminum at low voltages, sodium-ion cells can use aluminum current collectors on both the cathode and anode, replacing the heavy, expensive copper foils required in lithium cells.'
      },
      {
        speaker: 'Prof. Lin',
        pitch: 0.95,
        rate: 0.96,
        text: 'However, because the sodium ion has a larger ionic radius than lithium, it cannot intercalate into standard graphite anodes. Instead, engineers synthesize disordered hard carbon from agricultural biomass waste, such as coconut shells and corn cobs.'
      },
      {
        speaker: 'Prof. Lin',
        pitch: 0.95,
        rate: 0.96,
        text: 'Paired with a cobalt-free cathode pigment known as Prussian White, modern sodium-ion grid banks retain 85 percent capacity even at minus 20 degrees Celsius and can be shipped completely discharged at zero volts without fire risk.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'Sodium-ion cells use lightweight aluminum collectors instead of costly ________ foils on the anode.',
        answer: 'copper',
        acceptableAnswers: ['copper'],
        explanation: 'The lecturer states: "...replacing the heavy, expensive copper foils required in lithium cells."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'Because sodium ions are larger than lithium ions, they cannot fit into conventional ________ anodes.',
        answer: 'graphite',
        acceptableAnswers: ['graphite'],
        explanation: 'The lecturer explains: "because the sodium ion has a larger ionic radius than lithium, it cannot intercalate into standard graphite anodes."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'Anode hard carbon can be manufactured from agricultural waste such as ________ shells.',
        answer: 'coconut',
        acceptableAnswers: ['coconut'],
        explanation: 'The lecturer mentions "agricultural biomass waste, such as coconut shells and corn cobs."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'Unlike lithium cells, sodium-ion batteries can be transported safely at zero ________.',
        answer: 'volts',
        acceptableAnswers: ['volts', 'voltage'],
        explanation: 'The lecturer notes they "can be shipped completely discharged at zero volts without fire risk."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Why is weight less important for stationary power grid batteries than for electric cars?',
        options: [
          'A) Grid batteries are housed in fixed containers on the ground.',
          'B) Grid batteries only operate during summer months.',
          'C) Sodium-ion cells float in water tanks.',
          'D) Stationary grids do not require inverters.'
        ],
        answer: 'A) Grid batteries are housed in fixed containers on the ground.',
        explanation: 'The lecturer contrasts mobile vehicles with stationary power grids housed in fixed shipping-container arrays.'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'How much more abundant is sodium than lithium in the Earth’s crust?',
        options: [
          'A) Roughly 10 times more abundant',
          'B) Roughly 85 times more abundant',
          'C) Over 1,000 times more abundant',
          'D) Over 1,000,000 times more abundant'
        ],
        answer: 'C) Over 1,000 times more abundant',
        explanation: 'The lecturer states: "Sodium is over 1,000 times more abundant in the Earth’s crust than lithium."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'What is a key advantage of the Prussian White cathode discussed at the end of the lecture?',
        options: [
          'A) It requires no electrolyte liquid.',
          'B) It is completely free of cobalt and performs well in sub-zero temperatures.',
          'C) It turns bright blue when fully charged.',
          'D) It doubles the weight of the battery.'
        ],
        answer: 'B) It is completely free of cobalt and performs well in sub-zero temperatures.',
        explanation: 'The lecturer notes it is a "cobalt-free cathode pigment" that retains 85% capacity at minus 20°C.'
      }
    ]
  },

  // ========================================================================
  // SPEAKING TASKS (6 Complete 3-Part Workouts)
  // ========================================================================
  {
    id: 'speak-urban-architecture-spaces',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Part 1 + Cue Card + Part 3)',
    topic: 'Architecture, Public Spaces & Acoustic Environment',
    title: 'Speaking Workout: Built Environments & Urban Quietude',
    instructions:
      'Complete all 3 parts of the IELTS Speaking workout within ~15 minutes. Use the Microphone Recorder (or type/edit your transcript) so the AI Examiner can evaluate your Fluency, Lexical Resource, Grammatical Range, and Pronunciation.',
    part1: [
      'Do you prefer studying or working in absolute silence, or with background ambient sound?',
      'Has the neighborhood where you live become noisier or quieter over the past few years?',
      'What kinds of public buildings in your city have the most impressive architectural design?'
    ],
    part2: {
      topic: 'Describe a well-designed public space or building (such as a library, museum, or park pavilion) that you enjoyed visiting.',
      bullets: [
        'Where this place is located and when you visited it',
        'What architectural or design features stood out to you',
        'How people were using the space while you were there',
        'And explain why you found the design of this place particularly effective or memorable.'
      ]
    },
    part3: [
      'To what extent does the physical layout of a city influence social cohesion among residents?',
      'Should municipal governments prioritize preserving historic architecture or building high-density affordable housing?',
      'How might climate change reshape the way architects design urban public buildings over the next fifty years?'
    ]
  },

  {
    id: 'speak-scientific-curiosity-innovation',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Part 1 + Cue Card + Part 3)',
    topic: 'Scientific Discovery & Technological Literacy',
    title: 'Speaking Workout: Scientific Curiosity & Problem Solving',
    instructions:
      'Record or transcribe your responses across Part 1, the Part 2 Cue Card (use the 1-minute prep timer if needed), and the Part 3 abstract discussion questions.',
    part1: [
      'Which science subject did you find most engaging when you were at school?',
      'How do you usually verify whether a piece of scientific or health news online is reliable?',
      'Is there a particular piece of everyday technology you would find difficult to live without?'
    ],
    part2: {
      topic: 'Describe a practical problem you solved using a systematic or analytical approach.',
      bullets: [
        'What the problem was and why it needed to be solved',
        'What steps or research you undertook to diagnose the issue',
        'Whether anyone else assisted you or challenged your approach',
        'And explain what you learned from resolving this problem.'
      ]
    },
    part3: [
      'Why do some major scientific breakthroughs take decades to be accepted by the general public?',
      'Should university science departments focus primarily on pure theoretical research or immediate commercial applications?',
      'In what ways can over-reliance on artificial intelligence affect human critical-thinking skills?'
    ]
  },

  {
    id: 'speak-cultural-heritage-museums',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Part 1 + Cue Card + Part 3)',
    topic: 'Cultural Heritage, Museums & Historical Memory',
    title: 'Speaking Workout: Historical Artifacts & Living Heritage',
    instructions:
      'Speak or transcribe your answers across Part 1, Part 2, and Part 3. Aim to use idiomatic C1/C2 academic discourse markers (e.g., "From a historical standpoint...", "Notwithstanding...").',
    part1: [
      'Did you enjoy learning about history when you were in primary or secondary school?',
      'How often do you visit museums, art galleries, or historical monuments?',
      'Do you think historical documentaries and films are an accurate way to learn about the past?'
    ],
    part2: {
      topic: 'Describe a historical period, event, or ancient civilization that you would like to know more about.',
      bullets: [
        'Which historical period or civilization it is',
        'How you first became interested in it',
        'What specific aspects of daily life or technology from that era intrigue you',
        'And explain why studying this period is relevant to people today.'
      ]
    },
    part3: [
      'Should national museums always be free of charge for both local citizens and international tourists?',
      'What are the ethical arguments surrounding the repatriation of ancient artifacts to their countries of origin?',
      'Can digital virtual-reality reconstructions ever fully replace visiting physical historical sites?'
    ]
  },

  {
    id: 'speak-repair-culture-circular-economy',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Part 1 + Cue Card + Part 3)',
    topic: 'Consumerism, Craftsmanship & Circular Economy',
    title: 'Speaking Workout: Repair Culture & Planned Obsolescence',
    instructions:
      'Complete Part 1, the Part 2 Cue Card, and Part 3. Focus on developing extended, well-structured reasons and concrete examples.',
    part1: [
      'When an electronic device or household item breaks, do you usually try to repair it or replace it?',
      'Have you ever learned a traditional craft or practical repair skill from a family member?',
      'Do you prefer buying handmade items or mass-produced products?'
    ],
    part2: {
      topic: 'Describe an object you own that has lasted a long time and that you value highly.',
      bullets: [
        'What the object is and how long you have had it',
        'How you acquired it and what it is made of',
        'How you have maintained or cared for it over the years',
        'And explain why you have kept this item instead of replacing it with a newer version.'
      ]
    },
    part3: [
      'Why have consumer goods become more difficult for ordinary owners to repair over the past twenty years?',
      'Should governments pass "Right to Repair" laws forcing manufacturers to sell spare parts and repair manuals?',
      'How would a transition from a throwaway economy to a circular economy affect global employment patterns?'
    ]
  },

  {
    id: 'speak-time-perception-attention',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Part 1 + Cue Card + Part 3)',
    topic: 'Cognitive Attention, Deep Work & Time Management',
    title: 'Speaking Workout: Deep Focus in an Age of Distraction',
    instructions:
      'Complete all 3 parts of the speaking workout. Use varied complex grammatical structures (conditionals, cleft sentences, and passive constructions).',
    part1: [
      'At what time of day do you feel most mentally alert and productive?',
      'Do you use paper planners, digital calendars, or memory to organize your daily tasks?',
      'How do you usually recover after a week of intense study or work?'
    ],
    part2: {
      topic: 'Describe a complex project or skill that required your undivided concentration over a long period.',
      bullets: [
        'What the project or skill was and why you undertook it',
        'What distractions or obstacles you had to overcome',
        'What strategies you used to sustain your focus',
        'And explain how completing this challenge affected your confidence.'
      ]
    },
    part3: [
      'Has the rise of short-form digital media permanently shortened people’s attention spans?',
      'In modern knowledge professions, is working fewer hours with higher intensity more effective than traditional forty-hour weeks?',
      'Why do many societies equate constant busyness with personal virtue or social status?'
    ]
  },

  {
    id: 'speak-linguistic-diversity-communication',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Part 1 + Cue Card + Part 3)',
    topic: 'Sociolinguistics, Translation & Cross-Cultural Nuance',
    title: 'Speaking Workout: Language, Identity & Global Communication',
    instructions:
      'Complete all 3 parts of the speaking workout. Record your voice or type your full response below.',
    part1: [
      'What methods have you found most effective when learning a foreign language?',
      'Do you change the way you speak or write depending on who you are communicating with?',
      'Have you ever experienced a humorous or interesting misunderstanding across languages?'
    ],
    part2: {
      topic: 'Describe a conversation, lecture, or speech in another language (or your own) that left a strong impression on you.',
      bullets: [
        'Who was speaking and what the occasion was',
        'What the central message or argument of the talk was',
        'How the speaker used tone, examples, or rhetoric to persuade the audience',
        'And explain why this particular talk stayed in your memory.'
      ]
    },
    part3: [
      'When a minority or regional language disappears, what kinds of cultural or ecological knowledge are lost with it?',
      'Will real-time AI translation earbuds eventually make learning foreign languages unnecessary for international professionals?',
      'To what extent does having a single global lingua franca in science and aviation benefit or disadvantage non-native speakers?'
    ]
  },
  ...EXPANDED_SEED_TASKS,
  ...COMPLETE_MODES_TASKS
];


