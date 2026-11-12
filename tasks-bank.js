// ==========================================================================
// DAILY IELTS ACADEMIC 15 — CURATED SEED BANK & SVG CHART RENDERER
// ==========================================================================

/**
 * Renders an IELTS Academic Writing Task 1 SVG chart or table from a structured spec.
 * Works for both built-in seed tasks and Gemini-generated Task 1 chart specs.
 */
export function renderTask1ChartSVG(spec) {
  if (!spec) return '';
  const title = spec.title || 'Academic Data Figure';
  const unit = spec.unit || '%';
  const categories = spec.categories || ['2010', '2015', '2020', '2025'];
  const series = spec.series || [];
  const palette = ['#1B4332', '#B45309', '#1E3A8A', '#7C2D12'];

  if (spec.chartType === 'table') {
    const headers = ['Category / Series', ...categories]
      .map((h) => `<th style="padding:8px 12px;border:1px solid #C9C2B2;background:#EFECE4;text-align:left;font-size:13px;">${h}</th>`)
      .join('');
    const rows = series
      .map(
        (s) =>
          `<tr><td style="padding:8px 12px;border:1px solid #E4DFD3;font-weight:600;font-size:13px;">${s.name}</td>` +
          s.values
            .map((v) => `<td style="padding:8px 12px;border:1px solid #E4DFD3;font-family:monospace;font-size:13px;">${v}${unit}</td>`)
            .join('') +
          `</tr>`
      )
      .join('');
    return `
      <div style="overflow-x:auto;text-align:left;">
        <div style="font-weight:700;font-size:14px;margin-bottom:8px;text-align:center;">${title} (${unit})</div>
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr>${headers}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  // Compute max value for Y axis
  const allVals = series.flatMap((s) => s.values.map((v) => Number(v) || 0));
  const rawMax = Math.max(...allVals, 10);
  const yMax = Math.ceil(rawMax / 10) * 10;

  const width = 560;
  const height = 300;
  const padL = 54;
  const padR = 24;
  const padT = 38;
  const padB = 58;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  let gridLines = '';
  for (let i = 0; i <= 5; i++) {
    const val = Math.round((yMax / 5) * i);
    const y = padT + plotH - (i / 5) * plotH;
    gridLines += `
      <line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="#E4DFD3" stroke-dasharray="3,3" />
      <text x="${padL - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#4A4F55" font-family="monospace">${val}${unit}</text>
    `;
  }

  let dataShapes = '';
  if (spec.chartType === 'line') {
    const stepX = categories.length > 1 ? plotW / (categories.length - 1) : plotW;
    categories.forEach((cat, idx) => {
      const x = padL + idx * stepX;
      gridLines += `<text x="${x}" y="${padT + plotH + 20}" text-anchor="middle" font-size="11" fill="#16181A" font-weight="600">${cat}</text>`;
    });

    series.forEach((s, sIdx) => {
      const color = palette[sIdx % palette.length];
      const pts = s.values.map((v, i) => {
        const x = padL + i * stepX;
        const y = padT + plotH - ((Number(v) || 0) / yMax) * plotH;
        return `${x},${y}`;
      });
      dataShapes += `<polyline fill="none" stroke="${color}" stroke-width="2.6" points="${pts.join(' ')}" />`;
      s.values.forEach((v, i) => {
        const x = padL + i * stepX;
        const y = padT + plotH - ((Number(v) || 0) / yMax) * plotH;
        dataShapes += `
          <circle cx="${x}" cy="${y}" r="4" fill="${color}" />
          <text x="${x}" y="${y - 8}" text-anchor="middle" font-size="10" fill="${color}" font-family="monospace" font-weight="700">${v}</text>
        `;
      });
    });
  } else {
    // Default: Grouped Bar Chart
    const groupW = plotW / categories.length;
    const barW = Math.min(28, (groupW * 0.72) / Math.max(series.length, 1));
    categories.forEach((cat, cIdx) => {
      const groupStart = padL + cIdx * groupW + (groupW - barW * series.length) / 2;
      const centerX = padL + cIdx * groupW + groupW / 2;
      gridLines += `<text x="${centerX}" y="${padT + plotH + 20}" text-anchor="middle" font-size="11" fill="#16181A" font-weight="600">${cat}</text>`;

      series.forEach((s, sIdx) => {
        const color = palette[sIdx % palette.length];
        const val = Number(s.values[cIdx]) || 0;
        const h = (val / yMax) * plotH;
        const x = groupStart + sIdx * barW;
        const y = padT + plotH - h;
        dataShapes += `
          <rect x="${x}" y="${y}" width="${barW - 3}" height="${h}" fill="${color}" rx="2" />
          <text x="${x + (barW - 3) / 2}" y="${y - 5}" text-anchor="middle" font-size="9.5" fill="${color}" font-family="monospace" font-weight="700">${val}</text>
        `;
      });
    });
  }

  // Legend
  const legendItems = series
    .map((s, idx) => {
      const color = palette[idx % palette.length];
      const lx = padL + idx * 155;
      return `
        <rect x="${lx}" y="${height - 18}" width="10" height="10" fill="${color}" rx="2" />
        <text x="${lx + 15}" y="${height - 9}" font-size="11" fill="#16181A" font-weight="600">${s.name}</text>
      `;
    })
    .join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
      <rect width="${width}" height="${height}" fill="#FAF8F3" rx="8" />
      <text x="${width / 2}" y="22" text-anchor="middle" font-size="13" font-weight="700" fill="#16181A">${title}</text>
      ${gridLines}
      <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#767C84" stroke-width="1.2" />
      <line x1="${padL}" y1="${padT + plotH}" x2="${width - padR}" y2="${padT + plotH}" stroke="#767C84" stroke-width="1.2" />
      ${dataShapes}
      ${legendItems}
    </svg>
  `;
}

export const SEED_TASKS = [
  // ========================================================================
  // READING TASKS (Academic Mini-Passages + 2 Task Types per 15-min Session)
  // ========================================================================
  {
    id: 'read-urban-mycorrhizal-networks',
    section: 'reading',
    taskType: 'Academic Passage + T/F/NG & Summary Completion',
    topic: 'Urban Ecology & Mycorrhizal Fungi',
    title: 'Subterranean Resilience: Mycorrhizal Networks in Urban Soils',
    instructions:
      'Read the academic passage below (recommended time: 15 minutes) and complete BOTH Task A (Questions 1–4) and Task B (Questions 5–7). Tip: Select any text in the passage to highlight key evidence.',
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

  // ========================================================================
  // WRITING TASKS (Academic Task 1 Data Sprint + Task 2 Essay Core)
  // ========================================================================
  {
    id: 'write-t1-nordic-heating-transition',
    section: 'writing',
    subMode: 'task1',
    taskType: 'Academic Writing Task 1 — Data Report (15-Min Sprint)',
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

  // ========================================================================
  // LISTENING TASKS (Academic Dialogues & Lectures + 2 Sub-Tasks)
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

  // ========================================================================
  // SPEAKING TASKS (Full 3-Part 15-Minute Workout)
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
  }
];
