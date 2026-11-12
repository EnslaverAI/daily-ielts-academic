// ==========================================================================
// DAILY IELTS ACADEMIC 15 — COMPLETE OFFICIAL TASK & RESPONSE MODES EXPANSION
// Adds:
// - Reading: Matching Headings (i–vi), Matching Researchers (A–D),
//            Summary Completion with Word Bank (A–H), Matching Sentence Endings (A–F),
//            and Multiple Choice "Choose TWO" (A–E).
// - Writing: Task 1 Before/After SVG Maps ('map'), Task 1 Mixed Pie+Bar Charts ('mixed'),
//            and Task 2 Direct Two-Part Question Essays.
// - Listening: Part 1 Transactional Dialogue with Self-Correction Distractors,
//              Part 2 Campus/Site Orientation with SVG Map Labeling (A–G),
//              Part 3 Classification/Matching & "Choose TWO" (A–E).
// - Speaking: 4 Additional Full 3-Part Workouts for Blind Turn-by-Turn Exam Mode.
// ==========================================================================

export const COMPLETE_MODES_TASKS = [
  // ========================================================================
  // READING (4 NEW WORKOUTS COVERING ALL REMAINING OFFICIAL QUESTION MODES)
  // ========================================================================
  {
    id: 'read-headings-match-epigenetics',
    section: 'reading',
    taskType: 'Matching Headings (i–vi) + Choose TWO (A–E) + Completion',
    topic: 'Molecular Biology & Transgenerational Epigenetics',
    title: 'Beyond the DNA Sequence: Epigenetic Memory Across Generations',
    instructions:
      'Read the academic passage below (recommended time: 15 minutes) and complete Task A (Matching Headings to Paragraphs A–D) and Task B (Multiple-Select "Choose TWO" & One-Word Completion).',
    referenceBox: {
      title: 'List of Headings (for Questions 1–4)',
      items: [
        'i. Biochemical mechanisms that silence or activate genes without altering DNA',
        'ii. Why all inherited traits in mammals are permanently erased at fertilization',
        'iii. Epidemiological evidence from historical human famines',
        'iv. Therapeutic applications of reversible epigenetic editing in oncology',
        'v. Controversies surrounding evolutionary interpretations of acquired traits',
        'vi. A commercial blueprint for synthetic agricultural fertilizers'
      ]
    },
    paragraphs: [
      {
        label: 'A',
        text: 'For much of the twentieth century, classical genetics operated under the assumption that biological inheritance was mediated exclusively by the linear sequence of nucleotides within deoxyribonucleic acid (DNA). Over the past three decades, however, molecular biologists have mapped an intricate regulatory layer known as the epigenome. Through chemical modifications such as cytosine methylation and histone acetylation, cells control how tightly chromatin is wound around protein spools. When methyl groups attach to promoter regions, transcription factors are physically blocked from binding, effectively silencing gene expression without changing a single base pair of the underlying genetic code.'
      },
      {
        label: 'B',
        text: 'Although most epigenetic marks in mammals undergo comprehensive reprogramming during gametogenesis and early embryonic development, compelling human cohort studies suggest that certain environmental exposures leave persistent molecular traces. Analyses of registry records from the 1944–1945 Dutch Hunger Winter revealed that individuals conceived during severe maternal caloric restriction exhibited altered methylation patterns on the insulin-like growth factor 2 (IGF2) gene six decades later. Crucially, these individuals faced elevated rates of metabolic syndrome and cardiovascular disease compared with unexposed siblings of the same genetic background.'
      },
      {
        label: 'C',
        text: 'These findings have reignited fierce theoretical debate among evolutionary biologists over whether environmentally induced epigenetic states constitute a genuine form of neo-Lamarckian inheritance. Sceptics point out that in humans, separating true transgenerational inheritance from direct in-utero exposure of the developing foetus and its primordial germ cells requires tracking traits to the great-grandchildren (the F3 generation). In botanical and nematode models, however, small non-coding RNAs have been shown to transmit pathogen resistance stably across more than ten generations.'
      },
      {
        label: 'D',
        text: 'Because epigenetic modifications—unlike somatic DNA mutations—are intrinsically reversible, clinical pharmacologists have begun targeting the enzymes that write and erase these marks. In several haematological malignancies, hypermethylation silences critical tumour-suppressor genes. Newly approved demethylating agents and histone deacetylase (HDAC) inhibitors strip away these aberrant chemical tags, restoring normal cellular checkpoints and sensitizing resistant tumours to immunotherapy without inflicting the widespread collateral DNA damage associated with conventional cytotoxic chemotherapy.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Matching Headings (Choose the correct heading i–vi for Paragraphs A–D)',
        type: 'mcq',
        prompt: 'Paragraph A',
        options: ['i', 'ii', 'iii', 'iv', 'v', 'vi'],
        answer: 'i',
        explanation: 'Paragraph A explains how cytosine methylation and histone acetylation silence or activate gene expression without altering the DNA sequence (Heading i).'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Matching Headings (Choose the correct heading i–vi for Paragraphs A–D)',
        type: 'mcq',
        prompt: 'Paragraph B',
        options: ['i', 'ii', 'iii', 'iv', 'v', 'vi'],
        answer: 'iii',
        explanation: 'Paragraph B presents cohort evidence from the 1944–1945 Dutch Hunger Winter famine showing persistent IGF2 methylation changes (Heading iii).'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Matching Headings (Choose the correct heading i–vi for Paragraphs A–D)',
        type: 'mcq',
        prompt: 'Paragraph C',
        options: ['i', 'ii', 'iii', 'iv', 'v', 'vi'],
        answer: 'v',
        explanation: 'Paragraph C discusses the fierce debate among evolutionary biologists over neo-Lamarckian inheritance and F3 generation criteria (Heading v).'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Matching Headings (Choose the correct heading i–vi for Paragraphs A–D)',
        type: 'mcq',
        prompt: 'Paragraph D',
        options: ['i', 'ii', 'iii', 'iv', 'v', 'vi'],
        answer: 'iv',
        explanation: 'Paragraph D details how reversible demethylating agents and HDAC inhibitors reactivate tumour-suppressor genes in cancer therapy (Heading iv).'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple-Select (Choose TWO) & One-Word Completion',
        type: 'mcq_multi',
        maxSelect: 2,
        prompt: 'Choose TWO letters (A–E). Which TWO statements are supported by the passage regarding epigenetic inheritance and reprogramming?',
        options: [
          'A) Methyl groups attached to promoter regions physically prevent transcription factors from binding.',
          'B) The Dutch Hunger Winter completely mutated the nucleotide sequence of the IGF2 gene.',
          'C) Small non-coding RNAs in plants and nematodes can pass pathogen resistance across over ten generations.',
          'D) Somatic DNA mutations are much easier to reverse pharmacologically than epigenetic marks.',
          'E) All human epigenetic modifications are guaranteed to persist unchanged for at least four generations.'
        ],
        answer: 'A, C',
        acceptableAnswers: ['A, C', 'C, A'],
        explanation: 'Paragraph A confirms A (methyl groups block transcription factors), and Paragraph C confirms C (small non-coding RNAs in botanical and nematode models transmit resistance across >10 generations).'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple-Select (Choose TWO) & One-Word Completion',
        type: 'fill',
        prompt: 'Within cell nuclei, DNA and histone proteins are packaged into a complex regulatory structure whose tightness is adjusted by chemical tags: ________. (ONE WORD from Paragraph A)',
        answer: 'chromatin',
        acceptableAnswers: ['chromatin'],
        explanation: 'Paragraph A states: "...cells control how tightly chromatin is wound around protein spools."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple-Select (Choose TWO) & One-Word Completion',
        type: 'fill',
        prompt: 'In certain blood cancers, aberrant hypermethylation deactivates vital tumour-suppressor genes, which can be restored using ________ inhibitors. (ONE WORD/ACRONYM from Paragraph D)',
        answer: 'HDAC',
        acceptableAnswers: ['HDAC', 'deacetylase'],
        explanation: 'Paragraph D refers to "histone deacetylase (HDAC) inhibitors".'
      }
    ]
  },

  {
    id: 'read-researchers-match-linguistics',
    section: 'reading',
    taskType: 'Matching Researchers (A–D) + Word Bank Summary Completion',
    topic: 'Cognitive Psycholinguistics & Spatial Time Metaphors',
    title: 'How Language Shapes the Mental Architecture of Time and Space',
    instructions:
      'Read the academic passage below and complete Task A (Matching Statements 1–4 to the correct Researcher A–D) and Task B (Summary Completion from the Word Bank Box).',
    referenceBox: {
      title: 'List of Researchers & Word Bank Reference',
      items: [
        'Researcher A — Prof. Lera Boroditsky (Cognitive Scientist)',
        'Researcher B — Dr. Alice Gaby (Field Linguist)',
        'Researcher C — Prof. Rafael Núñez (Embodied Cognition Theorist)',
        'Researcher D — Dr. Emanuel Bylund (Bilingual Psycholinguist)',
        'Word Bank (for Q5–Q7): [ cardinal ] • [ sagittal ] • [ acoustic ] • [ flexibility ] • [ amnesia ] • [ gesture ]'
      ]
    },
    paragraphs: [
      {
        label: 'A',
        text: 'Whether the structure of a speaker’s native tongue constrains non-linguistic thought—a proposition historically associated with the Sapir-Whorf hypothesis—has been rigorously tested through cross-cultural studies of temporal reasoning. In English and most European languages, time is mapped onto an egocentric sagittal axis: the future lies ahead of the speaker’s body ("looking forward to tomorrow") while the past trails behind ("looking back on childhood"). However, Prof. Lera Boroditsky demonstrated that Mandarin speakers, who frequently employ vertical spatial metaphors ("shàng" or up for earlier events, and "xià" or down for later events), are significantly faster at verifying temporal sequences after being primed with vertical visual arrays.'
      },
      {
        label: 'B',
        text: 'Even more striking departures from egocentric time appear in indigenous Australian languages studied by field linguist Dr. Alice Gaby. Among speakers of Kuuk Thaayorre in Pormpuraaw, Cape York, spatial descriptions rely exclusively on absolute cardinal directions—north, south, east, and west—rather than relative terms like "left" or "right". When asked to arrange chronological picture cards showing a human ageing or a crocodile growing, Kuuk Thaayorre speakers consistently laid out time from east to west,regardless of which compass direction their own bodies were facing, mirroring the daily trajectory of the sun across the sky.'
      },
      {
        label: 'C',
        text: 'A third configuration was documented in the Andean highlands by Prof. Rafael Núñez, who investigated speakers of Aymara. In Aymara, the lexical item "nayra" (literally "eye" or "front") designates the past, whereas "qhipa" ("back" or "behind") refers to the future. Analysis of spontaneous co-speech gesture revealed that fluent Aymara elders point forward in front of their chests when recounting known historical events that have already been witnessed, and gesture backward over their shoulders when speculating about unseen future occurrences.'
      },
      {
        label: 'D',
        text: 'To determine whether these spatial-temporal mappings are hardwired or dynamically adaptable, Dr. Emanuel Bylund tested Swedish-Spanish bilinguals. In Swedish, duration is typically quantified using physical distance metaphors ("a long break"), whereas Spanish relies predominantly on volumetric metaphors ("mucho tiempo" — "much time"). Bylund found that when bilinguals were tested in Swedish, their duration estimates were distorted by the physical length of a growing line on a screen, whereas switching the test interface into Spanish caused the same participants to be influenced by the filling of a visual container, proving remarkable cognitive flexibility.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Matching Statements to Researchers (A–D)',
        type: 'mcq',
        prompt: 'Found that speakers of an Andean language point in front of their bodies when referring to the past because past events have already been seen.',
        options: ['Researcher A', 'Researcher B', 'Researcher C', 'Researcher D'],
        answer: 'Researcher C',
        explanation: 'Paragraph C states that Prof. Rafael Núñez (Researcher C) documented Aymara speakers pointing forward for the witnessed past.'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Matching Statements to Researchers (A–D)',
        type: 'mcq',
        prompt: 'Showed that bilingual speakers automatically shift how visual illusions affect their time perception depending on which language they are currently using.',
        options: ['Researcher A', 'Researcher B', 'Researcher C', 'Researcher D'],
        answer: 'Researcher D',
        explanation: 'Paragraph D describes Dr. Emanuel Bylund’s (Researcher D) experiments with Swedish-Spanish bilinguals.'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Matching Statements to Researchers (A–D)',
        type: 'mcq',
        prompt: 'Observed that an indigenous community arranges chronological sequences from east to west regardless of the speaker’s bodily orientation.',
        options: ['Researcher A', 'Researcher B', 'Researcher C', 'Researcher D'],
        answer: 'Researcher B',
        explanation: 'Paragraph B details Dr. Alice Gaby’s (Researcher B) fieldwork with Kuuk Thaayorre speakers.'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Matching Statements to Researchers (A–D)',
        type: 'mcq',
        prompt: 'Demonstrated that habitual use of vertical spatial terms for earlier and later events speeds up temporal reasoning after vertical priming.',
        options: ['Researcher A', 'Researcher B', 'Researcher C', 'Researcher D'],
        answer: 'Researcher A',
        explanation: 'Paragraph A describes Prof. Lera Boroditsky’s (Researcher A) experiments with Mandarin speakers.'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Summary Completion from the Word Bank',
        type: 'mcq',
        prompt: 'Whereas European languages map time along a front-to-back ________ axis centered on the speaker’s body, other cultures organize time very differently.',
        options: ['cardinal', 'sagittal', 'acoustic', 'flexibility', 'gesture'],
        answer: 'sagittal',
        explanation: 'Paragraph A states: "...time is mapped onto an egocentric sagittal axis: the future lies ahead... while the past trails behind."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Summary Completion from the Word Bank',
        type: 'mcq',
        prompt: 'In Pormpuraaw, speakers rely on absolute ________ directions (north, south, east, west), aligning chronological sequences with the sun’s path.',
        options: ['cardinal', 'sagittal', 'acoustic', 'flexibility', 'gesture'],
        answer: 'cardinal',
        explanation: 'Paragraph B states: "...spatial descriptions rely exclusively on absolute cardinal directions—north, south, east, and west..."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Summary Completion from the Word Bank',
        type: 'mcq',
        prompt: 'Experiments with Swedish-Spanish bilinguals confirm that human temporal representation is not rigid, but instead displays rapid cognitive ________ when switching linguistic contexts.',
        options: ['cardinal', 'sagittal', 'acoustic', 'flexibility', 'gesture'],
        answer: 'flexibility',
        explanation: 'Paragraph D concludes that bilinguals shift representations depending on language context, "proving remarkable cognitive flexibility."'
      }
    ]
  },

  {
    id: 'read-sentence-endings-chrono-nutrition',
    section: 'reading',
    taskType: 'Matching Sentence Endings (A–F) + Choose TWO (A–E) + Completion',
    topic: 'Circadian Endocrinology & Peripheral Metabolic Clocks',
    title: 'Chrono-Nutrition: Why Meal Timing Governs Metabolic Health',
    instructions:
      'Read the academic passage below and complete Task A (Matching Sentence Stems 1–4 with the correct Ending A–F) and Task B (Choose TWO & One-Word Completion).',
    referenceBox: {
      title: 'List of Sentence Endings (A–F) for Questions 1–4',
      items: [
        'A. decouples peripheral organ clocks from the master pacemaker in the brain.',
        'B. permanently destroys photoreceptor cells in the human retina.',
        'C. triggers substantially higher postprandial glucose spikes than an identical morning meal.',
        'D. improves insulin sensitivity and blood pressure even when total caloric intake remains unchanged.',
        'E. requires candidates to consume 80% of their daily protein after midnight.',
        'F. is regulated directly by blue-wavelength light hitting intrinsically photosensitive retinal ganglion cells.'
      ]
    },
    paragraphs: [
      {
        label: 'A',
        text: 'For decades, clinical dietetics adhered to a strictly thermodynamic model of energy balance, assuming that a calorie consumed at 08:00 exerted the same physiological effect as an identical calorie ingested at 23:00. Research in circadian endocrinology has dismantled this assumption by demonstrating that virtually every mammalian organ possesses its own autonomous molecular clock. While the master circadian pacemaker—the suprachiasmatic nucleus (SCN) of the hypothalamus—is regulated directly by blue-wavelength light hitting intrinsically photosensitive retinal ganglion cells, peripheral clocks in the liver, pancreas, and adipose tissue are entrained primarily by the timing of nutrient intake.'
      },
      {
        id: 'B',
        label: 'B',
        text: 'When food is consumed during the biological night—such as during rotating shift work or late-evening snacking—nutrient signals arrive when pancreatic beta cells are primed for rest. This feeding mistiming decouples peripheral organ clocks from the master pacemaker in the brain, creating a state of internal circadian desynchrony. Controlled metabolic ward trials show that an isocaloric dinner eaten two hours before habitual sleep triggers substantially higher postprandial glucose spikes than an identical morning meal, largely because melatonin secretion binds to pancreatic receptors and suppresses insulin release.'
      },
      {
        label: 'C',
        text: 'To counteract circadian desynchrony, researchers have evaluated Early Time-Restricted Eating (eTRE), a regimen in which all daily caloric intake is consolidated within an eight-to-ten-hour daytime window (for example, 08:00 to 17:00). In a landmark randomized crossover trial of men with prediabetes, five weeks of eTRE—where meals were matched molecule-for-molecule to a twelve-hour control schedule—demonstrated that aligning food intake with daytime circadian rhythms improves insulin sensitivity and blood pressure even when total caloric intake remains unchanged.'
      },
      {
        label: 'D',
        text: 'Furthermore, prolonged nocturnal fasting intervals allow the gastrointestinal tract to activate the migrating motor complex and upregulate hepatic autophagy, a cellular recycling process that clears damaged mitochondria. Nevertheless, public health nutritionists caution that rigid early eating windows face sociological barriers in cultures where late family dinners represent a primary vehicle of social cohesion, suggesting that shifting the largest proportion of daily carbohydrates to midday may offer a more pragmatic compromise.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Matching Sentence Endings (Choose Ending A–F)',
        type: 'mcq',
        prompt: 'The central circadian pacemaker located in the hypothalamus (the SCN)...',
        options: ['Ending A', 'Ending B', 'Ending C', 'Ending D', 'Ending E', 'Ending F'],
        answer: 'Ending F',
        explanation: 'Paragraph A states that the SCN "is regulated directly by blue-wavelength light hitting intrinsically photosensitive retinal ganglion cells" (Ending F).'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Matching Sentence Endings (Choose Ending A–F)',
        type: 'mcq',
        prompt: 'Ingesting meals late in the biological night during shift work or late snacking...',
        options: ['Ending A', 'Ending B', 'Ending C', 'Ending D', 'Ending E', 'Ending F'],
        answer: 'Ending A',
        explanation: 'Paragraph B states: "This feeding mistiming decouples peripheral organ clocks from the master pacemaker in the brain" (Ending A).'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Matching Sentence Endings (Choose Ending A–F)',
        type: 'mcq',
        prompt: 'According to controlled metabolic ward trials, an isocaloric meal eaten shortly before bedtime...',
        options: ['Ending A', 'Ending B', 'Ending C', 'Ending D', 'Ending E', 'Ending F'],
        answer: 'Ending C',
        explanation: 'Paragraph B notes that a late dinner "triggers substantially higher postprandial glucose spikes than an identical morning meal" (Ending C).'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Matching Sentence Endings (Choose Ending A–F)',
        type: 'mcq',
        prompt: 'Consolidating meals into an Early Time-Restricted Eating (eTRE) daytime window...',
        options: ['Ending A', 'Ending B', 'Ending C', 'Ending D', 'Ending E', 'Ending F'],
        answer: 'Ending D',
        explanation: 'Paragraph C shows that eTRE "improves insulin sensitivity and blood pressure even when total caloric intake remains unchanged" (Ending D).'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple-Select (Choose TWO) & One-Word Completion',
        type: 'mcq_multi',
        maxSelect: 2,
        prompt: 'Choose TWO letters (A–E). Which TWO biological or social factors are mentioned in the passage regarding nocturnal fasting and meal timing?',
        options: [
          'A) Rising evening melatonin levels bind to pancreatic receptors and inhibit insulin secretion.',
          'B) Peripheral clocks in the liver respond solely to blue light rather than nutrient intake.',
          'C) Extended overnight fasting stimulates hepatic autophagy to clear damaged mitochondria.',
          'D) Prediabetic patients on eTRE must reduce their daily calorie intake by at least 40% to see benefits.',
          'E) Melatonin injections completely cure rotating shift-work disorder within 48 hours.'
        ],
        answer: 'A, C',
        acceptableAnswers: ['A, C', 'C, A'],
        explanation: 'Paragraph B confirms A (melatonin binds to pancreatic receptors and suppresses insulin release) and Paragraph D confirms C (overnight fasting upregulates hepatic autophagy to clear damaged mitochondria).'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple-Select (Choose TWO) & One-Word Completion',
        type: 'fill',
        prompt: 'Peripheral clocks in organs such as the liver, pancreas, and ________ tissue are synchronized primarily by feeding times rather than light. (ONE WORD from Paragraph A)',
        answer: 'adipose',
        acceptableAnswers: ['adipose'],
        explanation: 'Paragraph A mentions "peripheral clocks in the liver, pancreas, and adipose tissue".'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple-Select (Choose TWO) & One-Word Completion',
        type: 'fill',
        prompt: 'Strict early eating schedules can be difficult to maintain in societies where late-evening meals are central to social ________. (ONE WORD from Paragraph D)',
        answer: 'cohesion',
        acceptableAnswers: ['cohesion'],
        explanation: 'Paragraph D refers to cultures where late family dinners represent "a primary vehicle of social cohesion".'
      }
    ]
  },

  {
    id: 'read-wordbank-glaciology-albedo',
    section: 'reading',
    taskType: 'Word Bank Summary Completion + Yes / No / Not Given',
    topic: 'Cryosphere Glaciology & Cryoconite Bio-Albedo Feedback',
    title: 'Darkening Ice: How Glacial Algae Accelerate Ice-Sheet Melt',
    instructions:
      'Read the academic passage below and complete Task A (Yes / No / Not Given on the writer’s claims) and Task B (Summary Completion using the Word Bank Box).',
    referenceBox: {
      title: 'Word Bank for Summary Completion (Questions 5–7)',
      items: [
        'reflectivity',
        'pigments',
        'salinity',
        'sublimation',
        'hydrological',
        'volcanic'
      ]
    },
    paragraphs: [
      {
        label: 'A',
        text: 'Climate models projecting sea-level contributions from the Greenland Ice Sheet have historically treated surface melt primarily as a function of atmospheric temperature and inorganic mineral dust deposition. Yet field glaciologists working across Greenland’s western ablation zone—"the Dark Zone"—have demonstrated that biological colonization plays a far larger role in darkening the ice surface than previously assumed. During the boreal summer, blooms of cold-adapted streptophyte microalgae (Ancylonema nordenskiöldii) proliferate across bare, melting ice, forming dense dark mats that dramatically reduce surface albedo.'
      },
      {
        label: 'B',
        text: 'Paradoxically, these glacial algae darken the ice to protect themselves from the very solar radiation that sustains their photosynthesis. Exposed to intense ultraviolet and visible irradiance at high elevations, the cells synthesize deep purple-brown phenolic pigments called purpurogallin derivatives. While these intracellular sunscreens shield the algae’s chloroplasts from photo-oxidative damage, they convert absorbed photons into localized thermal energy, melting the surrounding ice crystals and generating thin films of liquid water that the algae require for nutrient uptake and reproduction.'
      },
      {
        label: 'C',
        text: 'This biological feedback loop interacts synergistically with windblown mineral dust and black carbon soot to form cylindrical water-filled depressions known as cryoconite holes. As microbial filaments bind mineral grains into dark granules, the granules sink into the ice until radiative heating reaches equilibrium. When intense mid-summer rainfall or warm foehn winds flush out these cryoconite holes, dark microbial sediment is redistributed across vast expanses of the ice sheet, accelerating surface runoff into supraglacial rivers and moulins.'
      },
      {
        label: 'D',
        text: 'Omitting biological albedo feedback from global climate models leads to systematic underestimation of future ice-sheet mass loss. Satellite spectrometry calibrated against ground-truth radiometers indicates that algal blooms account for up to 13 percent of total surface runoff in southwestern Greenland during peak melt years. Consequently, integrating microbial growth dynamics into next-generation Earth System Models is no longer an esoteric ecological exercise, but an urgent necessity for coastal flood planning worldwide.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Yes / No / Not Given (Writer’s Claims)',
        type: 'tfng',
        prompt: 'Traditional climate models accurately accounted for the full impact of biological algae blooms on Greenland’s surface melt.',
        options: ['YES', 'NO', 'NOT GIVEN'],
        answer: 'NO',
        explanation: 'Paragraph A states that climate models historically treated melt primarily as a function of temperature and inorganic dust, and that biological colonization plays "a far larger role... than previously assumed."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Yes / No / Not Given (Writer’s Claims)',
        type: 'tfng',
        prompt: 'The dark phenolic compounds produced by glacial algae serve both as a protective sunscreen and as a mechanism that generates liquid water.',
        options: ['YES', 'NO', 'NOT GIVEN'],
        answer: 'YES',
        explanation: 'Paragraph B explains that the purple-brown pigments shield chloroplasts from UV damage AND convert photons into heat that melts ice into liquid water needed for nutrient uptake.'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Yes / No / Not Given (Writer’s Claims)',
        type: 'tfng',
        prompt: 'Spraying chemical algicides from aircraft is the most cost-effective method for halting glacial darkening.',
        options: ['YES', 'NO', 'NOT GIVEN'],
        answer: 'NOT GIVEN',
        explanation: 'The passage never mentions spraying chemical algicides or any artificial eradication methods.'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Yes / No / Not Given (Writer’s Claims)',
        type: 'tfng',
        prompt: 'Incorporating microbial albedo dynamics into climate models is essential for accurate coastal flood forecasting.',
        options: ['YES', 'NO', 'NOT GIVEN'],
        answer: 'YES',
        explanation: 'Paragraph D concludes that integrating microbial growth dynamics into Earth System Models is "an urgent necessity for coastal flood planning worldwide."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Summary Completion from the Word Bank',
        type: 'mcq',
        prompt: 'During the summer melt season in western Greenland, blooms of cold-adapted microalgae spread across bare ice and significantly lower its surface albedo, or ________.',
        options: ['reflectivity', 'pigments', 'salinity', 'sublimation', 'hydrological', 'volcanic'],
        answer: 'reflectivity',
        explanation: 'Albedo refers to surface reflectivity (how much solar radiation is reflected vs. absorbed by darkening ice).'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Summary Completion from the Word Bank',
        type: 'mcq',
        prompt: 'To survive intense ultraviolet radiation, the algal cells manufacture dark purple-brown phenolic ________ that absorb solar energy and warm the surrounding ice.',
        options: ['reflectivity', 'pigments', 'salinity', 'sublimation', 'hydrological', 'volcanic'],
        answer: 'pigments',
        explanation: 'Paragraph B states: "...the cells synthesize deep purple-brown phenolic pigments called purpurogallin derivatives."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Summary Completion from the Word Bank',
        type: 'fill',
        prompt: 'Satellite measurements indicate that biological blooms contribute up to ________ percent of surface runoff in southwestern Greenland during peak melt seasons. (A NUMBER from Paragraph D)',
        answer: '13',
        acceptableAnswers: ['13', 'thirteen', '13%'],
        explanation: 'Paragraph D states: "...algal blooms account for up to 13 percent of total surface runoff in southwestern Greenland..."'
      }
    ]
  },

  // ========================================================================
  // WRITING (4 NEW WORKOUTS: BEFORE/AFTER MAPS, MIXED PIE+BAR, TWO-PART ESSAY)
  // ========================================================================
  {
    id: 'write-t1-map-harbour-redevelopment',
    section: 'writing',
    subMode: 'task1',
    taskType: 'Academic Writing Task 1 — Before & After Map Comparison (15-Min Sprint)',
    topic: 'Urban Geography & Waterfront Regeneration',
    title: 'Task 1: Redevelopment of Porthaven Harbour (1995 vs. Present Day)',
    targetWords: 150,
    instructions:
      'Spend about 15 minutes on this task. The maps below show Porthaven Industrial Harbour in 1995 and the same waterfront area today following regeneration. Summarize the main spatial changes and make comparisons where relevant. Write at least 150 words.',
    prompt:
      'The two maps below illustrate the layout of Porthaven Harbour in 1995 and its present-day layout after an urban waterfront regeneration project.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartSpec: {
      chartType: 'map',
      title: 'Porthaven Harbour Spatial Transformation (1995 vs. Present Day)',
      beforeTitle: '1995 — Industrial Fishing & Cargo Port',
      afterTitle: 'Present Day — Mixed-Use Maritime & Cultural District',
      waterFeature: 'Northern Sea Basin & Harbour Mouth',
      beforeZones: [
        { pos: 'NW', label: 'Coal Storage Yard', status: 'demolished' },
        { pos: 'N', label: 'Harbour Entrance & Cargo Cranes', status: 'demolished' },
        { pos: 'NE', label: 'Historic Brick Lighthouse (1880)', status: 'unchanged' },
        { pos: 'W', label: 'Commercial Fishing Docks', status: 'demolished' },
        { pos: 'C', label: 'Heavy Freight Railway & Siding', status: 'demolished' },
        { pos: 'E', label: 'Fish Processing Warehouses', status: 'demolished' },
        { pos: 'SW', label: 'Workers’ Gravel Car Park', status: 'demolished' },
        { pos: 'S', label: 'Harbour Road (2-Lane Vehicular)', status: 'unchanged' },
        { pos: 'SE', label: 'Customs Office & Dockyard Gate', status: 'unchanged' }
      ],
      afterZones: [
        { pos: 'NW', label: 'Tidal Wetland Park & Boardwalk', status: 'green' },
        { pos: 'N', label: 'Passenger Ferry & Eco-Catamaran Pier', status: 'new' },
        { pos: 'NE', label: 'Historic Brick Lighthouse (Retained)', status: 'unchanged' },
        { pos: 'W', label: '120-Berth Recreational Yacht Marina', status: 'new' },
        { pos: 'C', label: 'Pedestrianized Waterfront Promenade', status: 'green' },
        { pos: 'E', label: 'Maritime Museum & Art Galleries (Converted)', status: 'expanded' },
        { pos: 'SW', label: 'Electric Tram Terminus & Cycle Hub', status: 'new' },
        { pos: 'S', label: 'Harbour Road (Retained Access)', status: 'unchanged' },
        { pos: 'SE', label: 'Customs Heritage Café (Converted)', status: 'expanded' }
      ]
    },
    modelAnswer:
      'The two maps illustrate the extensive spatial transformation of Porthaven Harbour from an industrial cargo and fishing port in 1995 into a modern, pedestrian-friendly leisure and cultural waterfront today.\n\nOverall, the most striking change is the complete removal of heavy industrial infrastructure—including coal yards, freight railways, and fish processing plants—in favour of green public spaces, recreational maritime facilities, and sustainable transport links. Only a few heritage landmarks in the eastern sector have been preserved.\n\nIn the western and central zones, the former Coal Storage Yard in the north-west was demolished to make way for a Tidal Wetland Park and coastal boardwalk. Immediately south of this, the commercial fishing docks along the western quay were replaced by a 120-berth recreational yacht marina. Meanwhile, the central heavy freight railway line was dismantled and converted into a landscaped pedestrian promenade, while the workers’ gravel car park in the south-west was redeveloped into an electric tram terminus and cycle hub.\n\nAlong the eastern side of the harbour, the 1880 Brick Lighthouse in the north-east and Harbour Road in the south remained unchanged. However, the cargo cranes at the northern entrance were replaced by a passenger ferry pier, and the former fish processing warehouses in the east were repurposed into a Maritime Museum and art galleries.'
  },

  {
    id: 'write-t1-map-university-campus',
    section: 'writing',
    subMode: 'task1',
    taskType: 'Academic Writing Task 1 — Campus Floor Plan Comparison (15-Min Sprint)',
    topic: 'Higher Education Infrastructure & Campus Planning',
    title: 'Task 1: Westfield University Science Precinct (2005 vs. Planned 2030)',
    targetWords: 150,
    instructions:
      'Spend about 15 minutes on this task. The maps below show the layout of the Westfield University Science Precinct in 2005 and the proposed redevelopment plan for 2030. Summarize the main changes and make comparisons where relevant. Write at least 150 words.',
    prompt:
      'The plans below show the Westfield University Science Precinct in 2005 and the proposed layout for 2030 following a campus modernization programme.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartSpec: {
      chartType: 'map',
      title: 'Westfield University Science Precinct (2005 vs. Proposed 2030)',
      beforeTitle: '2005 — Original Science Precinct',
      afterTitle: '2030 — Proposed Net-Zero Innovation Campus',
      waterFeature: 'Northern Botanical Woodland Boundary',
      beforeZones: [
        { pos: 'NW', label: 'Single-Storey Biology Annex', status: 'demolished' },
        { pos: 'N', label: 'Open Grass Lawn', status: 'unchanged' },
        { pos: 'NE', label: ' Founders’ Clocktower Library', status: 'unchanged' },
        { pos: 'W', label: 'Surface Staff Car Park (180 Spaces)', status: 'demolished' },
        { pos: 'C', label: 'Through-Road (Internal Campus Traffic)', status: 'demolished' },
        { pos: 'E', label: 'Chemistry & Physics Lecture Blocks', status: 'unchanged' },
        { pos: 'SW', label: 'Temporary Prefab Workshops', status: 'demolished' },
        { pos: 'S', label: 'Main South Gate & Bus Stop', status: 'unchanged' },
        { pos: 'SE', label: 'Small Student Canteen', status: 'demolished' }
      ],
      afterZones: [
        { pos: 'NW', label: '4-Storey Genomics & Biotech Hub', status: 'new' },
        { pos: 'N', label: 'Open Grass Lawn + Solar Canopy Walk', status: 'green' },
        { pos: 'NE', label: 'Founders’ Clocktower Library (Retained)', status: 'unchanged' },
        { pos: 'W', label: 'AI & Robotics Cleanroom Complex', status: 'new' },
        { pos: 'C', label: 'Car-Free Academic Spine & Rain Garden', status: 'green' },
        { pos: 'E', label: 'Chemistry & Physics Blocks (Refurbished)', status: 'expanded' },
        { pos: 'SW', label: 'Underground Cycle Vault & Shuttle Hub', status: 'new' },
        { pos: 'S', label: 'Main South Gate & Metro Link', status: 'expanded' },
        { pos: 'SE', label: '3-Storey Student Union & Dining Hall', status: 'new' }
      ]
    },
    modelAnswer:
      'The two plans compare the layout of the Westfield University Science Precinct in 2005 with its proposed reconfiguration for 2030.\n\nOverall, the 2030 masterplan substantially densifies the precinct’s research capacity while eliminating private vehicle traffic from the campus core. Temporary and low-rise structures on the western side will be replaced by multi-storey interdisciplinary laboratories, whereas key academic buildings in the east will be retained.\n\nIn 2005, the western third of the campus was occupied by a single-storey Biology Annex in the north-west, a 180-space surface staff car park in the west, and temporary prefab workshops in the south-west. By 2030, all three facilities will be demolished: a four-storey Genomics and Biotech Hub will rise in the north-west, an AI and Robotics Cleanroom Complex will replace the surface car park, and an underground cycle vault and shuttle hub will occupy the south-west corner.\n\nIn the centre of the precinct, the internal through-road bisecting the campus from north to south will be pedestrianized and transformed into a car-free academic spine with rain gardens. On the eastern side, the Founders’ Clocktower Library in the north-east and the Chemistry and Physics blocks in the east will remain in situ, while the small south-eastern canteen will be expanded into a three-storey Student Union and dining hall.'
  },

  {
    id: 'write-t1-mixed-water-withdrawal',
    section: 'writing',
    subMode: 'task1',
    taskType: 'Academic Writing Task 1 — Mixed Pie + Bar Combo Chart (15-Min Sprint)',
    topic: 'Hydrology, Industrial Water Efficiency & Resource Allocation',
    title: 'Task 1: Global Freshwater Withdrawal by Sector & Regional Industrial Recycling',
    targetWords: 150,
    instructions:
      'Spend about 15 minutes on this task. The pie chart shows the proportion of global freshwater withdrawals by sector, while the bar chart compares the percentage of industrial wastewater recycled across five regions in 2010 and 2025. Summarize the main features and make comparisons where relevant. Write at least 150 words.',
    prompt:
      'The pie chart below shows the breakdown of global freshwater withdrawals across four major sectors, and the bar chart illustrates the percentage of industrial water recycled in five world regions in 2010 and 2025.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartSpec: {
      chartType: 'mixed',
      title: 'Global Freshwater Withdrawals & Industrial Water Recycling (2010 vs. 2025)',
      pieTitle: 'Share of Global Freshwater Withdrawal (%)',
      pieSlices: [
        { name: 'Agriculture & Irrigation', value: 69 },
        { name: 'Industrial Manufacturing', value: 19 },
        { name: 'Municipal & Domestic', value: 9 },
        { name: 'Thermoelectric Cooling', value: 3 }
      ],
      barTitle: 'Industrial Wastewater Recycled by Region (%)',
      barUnit: '%',
      barItems: [
        { label: 'Western Europe', v1: 54, v2: 78, s1Name: '2010', s2Name: '2025' },
        { label: 'East Asia', v1: 32, v2: 67, s1Name: '2010', s2Name: '2025' },
        { label: 'North America', v1: 46, v2: 64, s1Name: '2010', s2Name: '2025' },
        { label: 'Middle East & N. Africa', v1: 28, v2: 61, s1Name: '2010', s2Name: '2025' },
        { label: 'South America', v1: 18, v2: 35, s1Name: '2010', s2Name: '2025' }
      ]
    },
    modelAnswer:
      'The combined visuals illustrate the sectoral distribution of global freshwater withdrawals alongside changes in industrial wastewater recycling rates across five geographical regions between 2010 and 2025.\n\nOverall, agriculture accounts for the overwhelming majority of global freshwater extraction, more than triple the share of industry. However, within the industrial sector, every surveyed region achieved substantial gains in wastewater recycling over the fifteen-year period, with East Asia and the Middle East recording the steepest proportional increases.\n\nAccording to the pie chart, agriculture and irrigation consume 69% of all freshwater globally. Industrial manufacturing represents the second-largest user at 19%, whereas municipal domestic supply (9%) and thermoelectric power cooling (3%) together account for just 12% of total withdrawals.\n\nTurning to the bar chart, Western Europe maintained the highest industrial water recycling rate in both years, rising from 54% in 2010 to 78% in 2025. North America followed a moderate upward trajectory from 46% to 64%. By contrast, East Asia more than doubled its industrial recycling rate from 32% to 67%, overtaking North America by 2025. Similarly, the Middle East and North Africa surged from 28% to 61%, while South America, despite nearly doubling from 18% to 35%, remained the lowest-performing region.'
  },

  {
    id: 'write-t2-twopart-overtourism-heritage',
    section: 'writing',
    subMode: 'task2',
    taskType: 'Academic Writing Task 2 — Direct Two-Part Question Essay (15-Min Sprint)',
    topic: 'Cultural Heritage Management, Overtourism & Sustainable Economics',
    title: 'Task 2: Fragile Historical Sites & Mass Global Tourism (Two-Part Question)',
    targetWords: 180,
    instructions:
      'Spend about 15 minutes writing a structured academic essay (or a complete 2-body-paragraph core argument of 180–250 words) addressing BOTH questions in the prompt equally.',
    prompt:
      'In recent years, many fragile historical monuments and ancient cities have experienced unprecedented levels of mass tourism.\n\nWhy has visitor demand concentrated so heavily on these specific sites, and what policy measures can governments implement to protect cultural heritage without devastating local economies?',
    modelAnswer:
      'Over the past two decades, iconic archaeological sites and historic urban centres—from Machu Picchu to Venice—have been overwhelmed by concentrated surges in international visitor numbers. This phenomenon is driven primarily by the convergence of low-cost aviation and algorithmically curated social media, yet it can be mitigated through dynamic pricing and geographic dispersal policies that preserve local livelihoods.\n\nThe hyper-concentration of tourists at fragile heritage monuments stems from two mutually reinforcing factors. Firstly, the deregulation of budget airlines and the expansion of mega-cruise liners have drastically reduced the financial and logistical barriers to international travel, allowing tens of thousands of day-trippers to disembark simultaneously at compact medieval ports. Secondly, visual social media platforms incentivize "bucket-list" conformity: algorithms amplify a narrow canon of photogenic landmarks, funneling millions of travellers toward the exact same vantage points while equally significant secondary archaeological sites nearby remain virtually deserted.\n\nTo safeguard irreplaceable monuments without triggering economic collapse in host communities, authorities should replace crude bans with smart demand-management instruments. The most effective tool is tiered, pre-booked timed-entry ticketing paired with dynamic congestion levies that charge higher fees to short-stay cruise excursions while offering discounts to visitors who book multi-night stays in local guesthouses. Furthermore, ministries of culture can invest ticket revenues into regional rail shuttles and joint "heritage pass" itineraries that bundle a famous monument with lesser-known rural museums and artisan towns.\n\nIn conclusion, while cheap transit and digital viral loops have concentrated tourism to unsustainable levels, calibrated congestion pricing and regional itinerary bundling can protect ancient architecture while distributing tourism revenue more equitably.'
  },

  // ========================================================================
  // LISTENING (4 NEW WORKOUTS: PART 1 DISTRACTORS, PART 2 MAPS, PART 3 PICK TWO)
  // ========================================================================
  {
    id: 'listen-p1-accommodation-booking-distractors',
    section: 'listening',
    taskType: 'IELTS Listening Part 1 — Transactional Dialogue (Spelling, Numbers & Distractors)',
    topic: 'University Visiting Researcher Accommodation & Registration',
    title: 'Part 1: Booking Short-Term Visiting Fellow Accommodation at Northgate House',
    instructions:
      'Click Play to listen to a Part 1 telephone conversation between a visiting researcher and a university housing officer. Watch out for classic IELTS self-corrections and distractors! Complete Task A (Form Completion Q1–Q4: ONE WORD AND/OR A NUMBER) and Task B (Multiple Choice Q5–Q7).',
    script: [
      {
        speaker: 'Housing Officer',
        pitch: 1.05,
        rate: 0.98,
        text: 'Good morning, University Visiting Scholars Housing Office, Clara speaking. How can I help you today?'
      },
      {
        speaker: 'Dr. Lindqvist',
        pitch: 0.92,
        rate: 0.98,
        text: 'Hello Clara. I am arriving next month as a visiting fellow in the Department of Marine Geochemistry, and I need to finalize my studio apartment booking at Northgate House.'
      },
      {
        speaker: 'Housing Officer',
        pitch: 1.05,
        rate: 0.98,
        text: 'Certainly! Let me pull up the reservation form. Could you confirm how your surname is spelled for the security pass?'
      },
      {
        speaker: 'Dr. Lindqvist',
        pitch: 0.92,
        rate: 0.97,
        text: 'Yes, it is Lindqvist—spelled L-I-N-D-Q-V-I-S-T. People often write a U after the Q, but it is a V.'
      },
      {
        speaker: 'Housing Officer',
        pitch: 1.05,
        rate: 0.98,
        text: 'Got it, L-I-N-D-Q-V-I-S-T. And I see your arrival date is currently penciled in for the fourteenth of October. Is that still accurate?'
      },
      {
        speaker: 'Dr. Lindqvist',
        pitch: 0.92,
        rate: 0.98,
        text: 'Actually, my research vessel docks two days later than originally scheduled, so I need to move my check-in date from the fourteenth to the sixteenth of October.'
      },
      {
        speaker: 'Housing Officer',
        pitch: 1.05,
        rate: 0.98,
        text: 'No problem, I have updated your check-in to the 16th of October. Now, for mail forwarding, the postcode for Northgate House is CB4 9HT—wait, apologies, that is the old wing. The newly renovated Annex where your studio is located uses postcode CB4 8WR.'
      },
      {
        speaker: 'Dr. Lindqvist',
        pitch: 0.92,
        rate: 0.98,
        text: 'CB4 8WR, thank you. And what is the refundable security deposit required upon key collection?'
      },
      {
        speaker: 'Housing Officer',
        pitch: 1.05,
        rate: 0.98,
        text: 'For standard two-bedroom flats it is four hundred and五十 pounds, sorry, four hundred and fifty pounds, but because you are in a self-contained single studio, the refundable deposit is three hundred and twenty pounds.'
      },
      {
        speaker: 'Dr. Lindqvist',
        pitch: 0.92,
        rate: 0.98,
        text: 'Three hundred and twenty pounds, understood. Does the monthly rental fee include utilities and access to the campus bicycle storage?'
      },
      {
        speaker: 'Housing Officer',
        pitch: 1.05,
        rate: 0.98,
        text: 'Heating, water, and high-speed eduroam fiber are all included in the rent. Underground bicycle storage is free as well, though if you want a reserved electric vehicle charging bay, that carries a small monthly surcharge. Also, please note that the reception desk closes at 18:00 on weekdays, so if your train arrives after 18:00, you will collect your keycard from the 24-hour Campus Security Lodge at the East Gate.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Form Completion (Write ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Visiting Fellow Surname: Dr. ________ (Watch the exact spelling given by the speaker)',
        answer: 'Lindqvist',
        acceptableAnswers: ['Lindqvist', 'LINDQVIST'],
        explanation: 'The speaker explicitly spells his surname: "L-I-N-D-Q-V-I-S-T" (noting it has a V, not a U).'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Form Completion (Write ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Confirmed Check-In Date: ________ October (Beware of the initial date distractor)',
        answer: '16',
        acceptableAnswers: ['16', '16th', 'sixteenth'],
        explanation: '14th October is a distractor; Dr. Lindqvist moves his check-in two days later to the 16th of October.'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Form Completion (Write ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Studio Annex Postcode: CB4 ________',
        answer: '8WR',
        acceptableAnswers: ['8WR', 'CB4 8WR'],
        explanation: 'The officer corrects herself: CB4 9HT is the old wing; the renovated Annex postcode is CB4 8WR.'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Form Completion (Write ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Refundable Studio Deposit: £________',
        answer: '320',
        acceptableAnswers: ['320', 'three hundred and twenty'],
        explanation: '£450 is a distractor for two-bedroom flats; for a single studio, the deposit is £320.'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Which academic department is Dr. Lindqvist visiting?',
        options: [
          'A) Atmospheric Physics',
          'B) Marine Geochemistry',
          'C) Coastal Civil Engineering',
          'D) Molecular Oceanography'
        ],
        answer: 'B) Marine Geochemistry',
        explanation: 'In his first turn, Dr. Lindqvist states he is a visiting fellow in the Department of Marine Geochemistry.'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Which facility at Northgate House requires an additional monthly payment?',
        options: [
          'A) High-speed fiber internet',
          'B) Underground bicycle storage',
          'C) Central heating and hot water',
          'D) A reserved electric vehicle charging bay'
        ],
        answer: 'D) A reserved electric vehicle charging bay',
        explanation: 'The officer states heating, water, fiber, and bicycle storage are free, whereas a reserved EV charging bay carries a monthly surcharge.'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Where should residents collect their keycard if they arrive after 18:00 on a weekday?',
        options: [
          'A) From the automated lockbox outside the Annex',
          'B) From the 24-hour Campus Security Lodge at the East Gate',
          'C) From the Marine Geochemistry department secretary',
          'D) From the Northgate House cafeteria manager'
        ],
        answer: 'B) From the 24-hour Campus Security Lodge at the East Gate',
        explanation: 'The officer explains that after 18:00, keycards are collected from the 24-hour Campus Security Lodge at the East Gate.'
      }
    ]
  },

  {
    id: 'listen-p2-campus-innovation-hub-map',
    section: 'listening',
    taskType: 'IELTS Listening Part 2 — Map / Floor Plan Labeling (A–G) + Choose TWO',
    topic: 'University Engineering & Robotics Innovation Centre Orientation',
    title: 'Part 2: Floor Plan Tour of the Faraday Engineering & Prototyping Hub',
    instructions:
      'Examine the Floor Plan Map (Locations A–G) below, then click Play to hear the Centre Director guide new researchers through the building from the Main South Entrance. Complete Task A (Map Labeling Q1–Q5: Choose Letter A–G) and Task B (Questions 6–7).',
    mapSpec: {
      title: 'Faraday Engineering Hub — Ground Floor Plan (Label Rooms A–G)',
      entranceLabel: '★ YOU ARE HERE: Main South Entrance & Reception Foyer',
      landmarks: [
        { pos: 'NW', code: 'A', label: 'Room [ A ] (North-West Corner)' },
        { pos: 'N', code: 'B', label: 'Room [ B ] (North Terrace Wing)' },
        { pos: 'NE', code: 'C', label: 'Room [ C ] (North-East Corner)' },
        { pos: 'W', code: 'D', label: 'Room [ D ] (West Corridor, opposite Courtyard)' },
        { pos: 'C', code: 'LANDMARK', label: 'Central Glass Courtyard & Stairwell' },
        { pos: 'E', code: 'E', label: 'Room [ E ] (East Corridor, opposite Courtyard)' },
        { pos: 'SW', code: 'F', label: 'Room [ F ] (Immediately Left of Main Entrance)' },
        { pos: 'S', code: 'ENTRANCE', label: '★ YOU ARE HERE: Main South Entrance' },
        { pos: 'SE', code: 'G', label: 'Room [ G ] (Immediately Right of Main Entrance)' }
      ]
    },
    script: [
      {
        speaker: 'Centre Director',
        pitch: 0.96,
        rate: 0.97,
        text: 'Welcome everyone to the newly opened Faraday Engineering and Prototyping Hub. We are currently standing right inside the Main South Entrance foyer at the bottom of your floor plan. Let me orient you to the key laboratories on the ground floor so you know where to go after our safety briefing.'
      },
      {
        speaker: 'Centre Director',
        pitch: 0.96,
        rate: 0.97,
        text: 'First, before entering any of the technical workshops, you will need to collect your laser-safety goggles and biometric badge. That is handled in the Safety Gear & Locker Room, which is located immediately to your left as you step through the Main South Entrance, in the south-west corner of the building.'
      },
      {
        speaker: 'Centre Director',
        pitch: 0.96,
        rate: 0.97,
        text: 'Conversely, if you turn immediately to your right from the Main South Entrance into the south-east corner, you will find the Patent & Industry Liaison Office, where our legal advisors help postgraduate teams file intellectual property disclosures.'
      },
      {
        speaker: 'Centre Director',
        pitch: 0.96,
        rate: 0.97,
        text: 'Now, if you walk straight ahead from the entrance toward the middle of the building, you will see the Central Glass Courtyard. Taking the West Corridor along the left-hand side of that Central Courtyard brings you to our Additive Manufacturing & 3D Metal Printing Lab, which sits directly opposite the west wall of the courtyard.'
      },
      {
        speaker: 'Centre Director',
        pitch: 0.96,
        rate: 0.97,
        text: 'If you continue all the way up that West Corridor to the far north-west corner of the floor plan, we have constructed a heavily insulated Acoustic Anechoic Chamber for testing drone propeller noise and ultrasonic sensors.'
      },
      {
        speaker: 'Centre Director',
        pitch: 0.96,
        rate: 0.97,
        text: 'Finally, walking across the northern edge of the building past the North Terrace Wing to the far north-east corner, you will reach the High-Voltage Battery Testing Suite, which has reinforced blast walls and external ventilation.'
      },
      {
        speaker: 'Centre Director',
        pitch: 0.96,
        rate: 0.97,
        text: 'One quick reminder about operating hours: while the collaborative study lounges stay open 24 hours a day, operating heavy CNC milling machines or high-power lasers requires two certified people in the room—we call this the "two-person buddy rule"—and all hazardous fabrication equipment shuts down automatically at 21:00 every evening.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–5: Map / Floor Plan Labeling (Choose the correct letter A–G)',
        type: 'mcq',
        prompt: 'Safety Gear & Locker Room',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        answer: 'F',
        explanation: 'Located immediately to the left of the Main South Entrance in the south-west corner (Room F).'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–5: Map / Floor Plan Labeling (Choose the correct letter A–G)',
        type: 'mcq',
        prompt: 'Patent & Industry Liaison Office',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        answer: 'G',
        explanation: 'Located immediately to the right of the Main South Entrance in the south-east corner (Room G).'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–5: Map / Floor Plan Labeling (Choose the correct letter A–G)',
        type: 'mcq',
        prompt: 'Additive Manufacturing & 3D Metal Printing Lab',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        answer: 'D',
        explanation: 'Located along the West Corridor directly opposite the Central Glass Courtyard (Room D).'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–5: Map / Floor Plan Labeling (Choose the correct letter A–G)',
        type: 'mcq',
        prompt: 'Acoustic Anechoic Chamber',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        answer: 'A',
        explanation: 'Located at the top of the West Corridor in the far north-west corner (Room A).'
      },
      {
        id: 'q5',
        group: 'Task A — Questions 1–5: Map / Floor Plan Labeling (Choose the correct letter A–G)',
        type: 'mcq',
        prompt: 'High-Voltage Battery Testing Suite',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        answer: 'C',
        explanation: 'Located across the northern edge in the far north-east corner (Room C).'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 6–7: Safety Regulations (Choose TWO & Completion)',
        type: 'mcq_multi',
        maxSelect: 2,
        prompt: 'Choose TWO letters (A–E). Which TWO safety rules apply to using the Faraday Engineering Hub?',
        options: [
          'A) Collaborative study lounges close strictly at 18:00.',
          'B) Researchers must collect laser-safety goggles and a biometric badge before entering workshops.',
          'C) First-year undergraduates are allowed to operate CNC mills alone overnight.',
          'D) Operating heavy CNC or laser equipment requires two certified people present ("two-person buddy rule").',
          'E) All battery testing must be conducted inside the Central Glass Courtyard.'
        ],
        answer: 'B, D',
        acceptableAnswers: ['B, D', 'D, B'],
        explanation: 'The Director states that researchers must collect laser goggles and a biometric badge first (B), and operating heavy CNC/laser machinery requires the "two-person buddy rule" (D).'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 6–7: Safety Regulations (Choose TWO & Completion)',
        type: 'fill',
        prompt: 'All hazardous fabrication machinery powers down automatically at ________ every evening. (Write A TIME/NUMBER)',
        answer: '21:00',
        acceptableAnswers: ['21:00', '9 pm', '9pm', '9:00', '21.00'],
        explanation: 'The Director states: "...all hazardous fabrication equipment shuts down automatically at 21:00 every evening."'
      }
    ]
  },

  {
    id: 'listen-p2-archaeological-park-map',
    section: 'listening',
    taskType: 'IELTS Listening Part 2 — Archaeological Site Map (A–G) + Note Completion',
    topic: 'Classical Archaeology & Heritage Site Conservation',
    title: 'Part 2: Field Briefing at the Verulamium Roman Villa Excavation Park',
    instructions:
      'Study the Excavation Site Plan (Locations A–G) below, then click Play to listen to the Lead Archaeologist orienting field volunteers. Complete Task A (Map Labeling Q1–Q4: Choose A–G) and Task B (Note Completion Q5–Q7).',
    mapSpec: {
      title: 'Verulamium Roman Villa — Field Excavation Map (Locations A–G)',
      entranceLabel: '★ YOU ARE HERE: South Gate Visitor Turnstile',
      landmarks: [
        { pos: 'NW', code: 'A', label: 'Site [ A ] (North-West Hilltop)' },
        { pos: 'N', code: 'B', label: 'Site [ B ] (Northern Boundary Wall)' },
        { pos: 'NE', code: 'C', label: 'Site [ C ] (North-East Stream Bank)' },
        { pos: 'W', code: 'D', label: 'Site [ D ] (West of Central Atrium)' },
        { pos: 'C', code: 'LANDMARK', label: 'Central Villa Atrium & Mosaic Pavilion' },
        { pos: 'E', code: 'E', label: 'Site [ E ] (East of Central Atrium)' },
        { pos: 'SW', code: 'F', label: 'Site [ F ] (South-West Timber Shed)' },
        { pos: 'S', code: 'ENTRANCE', label: '★ YOU ARE HERE: South Gate Turnstile' },
        { pos: 'SE', code: 'G', label: 'Site [ G ] (South-East Paddock)' }
      ]
    },
    script: [
      {
        speaker: 'Lead Archaeologist',
        pitch: 1.02,
        rate: 0.97,
        text: 'Good morning field volunteers! We are gathered right inside the South Gate Turnstile at the bottom center of your site map. Before we hand out trowels, let me walk you through the layout of the third-century Roman villa complex.'
      },
      {
        speaker: 'Lead Archaeologist',
        pitch: 1.02,
        rate: 0.97,
        text: 'Directly in front of us in the middle of the park is the covered Central Villa Atrium. If you walk past the eastern side of the Central Atrium—Directly to the right of the pavilion—you will find the Hypocaust Bathhouse Trench, where we uncovered intact underfloor terracotta heating pillars last summer.'
      },
      {
        speaker: 'Lead Archaeologist',
        pitch: 1.02,
        rate: 0.97,
        text: 'Continuing north-east toward the stream bank in the far north-east corner of the site, our geoarchaeology team is excavating the Roman Watermill & Timber Sluice, which used the natural current to grind grain.'
      },
      {
        speaker: 'Lead Archaeologist',
        pitch: 1.02,
        rate: 0.97,
        text: 'On the opposite side, high up on the dry north-west hilltop in the far north-west corner, lies the Romano-British Temple Foundation, positioned to overlook the entire valley.'
      },
      {
        speaker: 'Lead Archaeologist',
        pitch: 1.02,
        rate: 0.97,
        text: 'Whenever you unearth pottery shards or coins, please bring them to the Finds Washing & Conservation Tent, located in the south-west timber shed immediately to the left of the South Gate entrance.'
      },
      {
        speaker: 'Lead Archaeologist',
        pitch: 1.02,
        rate: 0.97,
        text: 'A few technical notes for your field journals: the main mosaic floor in the Central Atrium dates specifically to the year 275 AD. To prevent rapid moisture loss and cracking when fragile organic leather sandals or wooden writing tablets are lifted from waterlogged soil, they must be stored immediately in sealed tubs of deionized water. Finally, our ground-penetrating radar survey will begin at 14:30 in the south-east paddock, so please keep metal tools clear of that sector.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Site Map Labeling (Choose the correct letter A–G)',
        type: 'mcq',
        prompt: 'Hypocaust Bathhouse Trench',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        answer: 'E',
        explanation: 'Located immediately east (to the right) of the Central Villa Atrium (Site E).'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Site Map Labeling (Choose the correct letter A–G)',
        type: 'mcq',
        prompt: 'Roman Watermill & Timber Sluice',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        answer: 'C',
        explanation: 'Located along the stream bank in the far north-east corner (Site C).'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Site Map Labeling (Choose the correct letter A–G)',
        type: 'mcq',
        prompt: 'Romano-British Temple Foundation',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        answer: 'A',
        explanation: 'Located on the north-west hilltop in the far north-west corner (Site A).'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Site Map Labeling (Choose the correct letter A–G)',
        type: 'mcq',
        prompt: 'Finds Washing & Conservation Tent',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        answer: 'F',
        explanation: 'Located in the south-west timber shed immediately to the left of the South Gate Turnstile (Site F).'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Field Notes Completion (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'The main mosaic pavement in the Central Atrium has been dated to ________ AD.',
        answer: '275',
        acceptableAnswers: ['275'],
        explanation: 'The Lead Archaeologist states: "...the main mosaic floor in the Central Atrium dates specifically to the year 275 AD."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Field Notes Completion (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Waterlogged leather and wooden artifacts must be immersed in tubs of ________ water to prevent cracking. (ONE WORD)',
        answer: 'deionized',
        acceptableAnswers: ['deionized', 'deionised'],
        explanation: 'The speaker instructs volunteers to store organic finds in "sealed tubs of deionized water."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Field Notes Completion (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Volunteers must keep metal tools away from the south-east paddock during the ________ survey at 14:30. (ONE WORD)',
        answer: 'radar',
        acceptableAnswers: ['radar', 'GPR'],
        explanation: 'The speaker refers to "our ground-penetrating radar survey".'
      }
    ]
  },

  {
    id: 'listen-p3-classification-choosetwo-ai-ethics',
    section: 'listening',
    taskType: 'IELTS Listening Part 3 — Classification (A–C) + Choose TWO (A–E)',
    topic: 'Medical Informatics & Diagnostic AI Validation',
    title: 'Part 3: Seminar on Evaluating Clinical AI Radiology Datasets',
    instructions:
      'Click Play to listen to two biomedical engineering students (Tariq and Elena) discussing four hospital datasets with their supervisor (Dr. Varma). Complete Task A (Classification Q1–Q4: Match each dataset to status A, B, or C) and Task B (Choose TWO & Completion).',
    referenceBox: {
      title: 'Classification Categories (for Questions 1–4)',
      items: [
        'A — Ready for immediate inclusion in the final thesis model',
        'B — Requires additional de-identification or calibration before use',
        'C — Must be excluded completely due to methodological flaws'
      ]
    },
    script: [
      {
        speaker: 'Dr. Varma',
        pitch: 0.9,
        rate: 0.98,
        text: 'Come in, Tariq and Elena. Let us review the four hospital chest X-ray datasets you audited this week for your diagnostic machine-learning thesis. Which dataset did you evaluate first?'
      },
      {
        speaker: 'Elena',
        pitch: 1.12,
        rate: 1.0,
        text: 'We started with the St. Jude Metropolitan Archive—that has over forty thousand high-resolution scans. The demographic balance across age groups is superb, and the radiologist annotations were double-blinded, so it is ready for immediate inclusion in our training pipeline.'
      },
      {
        speaker: 'Tariq',
        pitch: 0.96,
        rate: 1.0,
        text: 'Next we examined the North-West Portable Ward Dataset. At first we were excited because it had thousands of positive pneumonia cases, but then we noticed a fatal shortcut: all the sickest ICU patients were scanned lying down with portable bedside machines that stamp a metallic "PORTABLE" marker in the top corner. The neural network was just reading the corner text tag instead of looking at the lung tissue!'
      },
      {
        speaker: 'Dr. Varma',
        pitch: 0.9,
        rate: 0.98,
        text: 'Classic Clever Hans shortcut learning! You cannot fix that without corrupting the pixel integrity. Exclude the North-West Portable dataset completely. What about the third source, the Alpine Regional Clinic Registry?'
      },
      {
        speaker: 'Elena',
        pitch: 1.12,
        rate: 1.0,
        text: 'The Alpine Clinic images are crystal clear, Dr. Varma, and free of text artifacts. However, the DICOM file headers still contain unmasked patient birthdates and clinician initials, so our ethics board requires us to run an automated header-stripping script before we can load them.'
      },
      {
        speaker: 'Dr. Varma',
        pitch: 0.9,
        rate: 0.98,
        text: 'Good catch—run the de-identification script first, then include it. And the fourth dataset, the Harbourview Historical Digitized Film Set?'
      },
      {
        speaker: 'Tariq',
        pitch: 0.96,
        rate: 1.0,
        text: 'Those were analog film X-rays from the 1990s photographed with a consumer digital camera. Half the images have severe glare from overhead fluorescent bulbs, so we agreed it has to be excluded completely.'
      },
      {
        speaker: 'Dr. Varma',
        pitch: 0.9,
        rate: 0.98,
        text: 'Wise decision. Before next Friday, make sure you test your trained model on an external holdout hospital to measure out-of-distribution generalization, and plot a calibration curve alongside your sensitivity metrics.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Classification (Choose A, B, or C from the Classification Box)',
        type: 'mcq',
        prompt: 'Dataset 1: St. Jude Metropolitan Archive',
        options: ['A', 'B', 'C'],
        answer: 'A',
        explanation: 'Elena confirms it has balanced demographics and double-blinded annotations, so it is "ready for immediate inclusion" (Category A).'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Classification (Choose A, B, or C from the Classification Box)',
        type: 'mcq',
        prompt: 'Dataset 2: North-West Portable Ward Dataset',
        options: ['A', 'B', 'C'],
        answer: 'C',
        explanation: 'Because the AI learned to read the "PORTABLE" metallic corner marker rather than lung pathology, Dr. Varma instructs them to "Exclude the North-West Portable dataset completely" (Category C).'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Classification (Choose A, B, or C from the Classification Box)',
        type: 'mcq',
        prompt: 'Dataset 3: Alpine Regional Clinic Registry',
        options: ['A', 'B', 'C'],
        answer: 'B',
        explanation: 'The images are high quality, but unmasked birthdates in the DICOM headers require an automated de-identification script before use (Category B).'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Classification (Choose A, B, or C from the Classification Box)',
        type: 'mcq',
        prompt: 'Dataset 4: Harbourview Historical Digitized Film Set',
        options: ['A', 'B', 'C'],
        answer: 'C',
        explanation: 'Analog 1990s films photographed with fluorescent glare must be "excluded completely" (Category C).'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple-Select (Choose TWO) & One-Word Completion',
        type: 'mcq_multi',
        maxSelect: 2,
        prompt: 'Choose TWO letters (A–E). Which TWO validation steps does Dr. Varma instruct the students to complete before next Friday?',
        options: [
          'A) Retake all 1990s analog X-rays using a flatbed laser scanner.',
          'B) Evaluate the trained model on an external holdout hospital dataset.',
          'C) Manually crop the top corners of every portable ICU radiograph.',
          'D) Plot a calibration curve alongside sensitivity metrics.',
          'E) Replace chest X-rays with full-body MRI scans.'
        ],
        answer: 'B, D',
        acceptableAnswers: ['B, D', 'D, B'],
        explanation: 'In the final turn, Dr. Varma tells them to "test your trained model on an external holdout hospital" (B) and "plot a calibration curve alongside your sensitivity metrics" (D).'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple-Select (Choose TWO) & One-Word Completion',
        type: 'fill',
        prompt: 'In the North-West Portable dataset, the neural network was relying on a metallic corner marker instead of examining the ________ tissue. (ONE WORD)',
        answer: 'lung',
        acceptableAnswers: ['lung'],
        explanation: 'Tariq notes: "The neural network was just reading the corner text tag instead of looking at the lung tissue!"'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple-Select (Choose TWO) & One-Word Completion',
        type: 'fill',
        prompt: 'The Harbourview dataset suffered from severe surface ________ caused by overhead fluorescent lighting during digitization. (ONE WORD)',
        answer: 'glare',
        acceptableAnswers: ['glare'],
        explanation: 'Tariq states: "Half the images have severe glare from overhead fluorescent bulbs..."'
      }
    ]
  },

  // ========================================================================
  // SPEAKING (4 NEW WORKOUTS OPTIMIZED FOR TURN-BY-TURN REAL EXAM BLIND MODE)
  // ========================================================================
  {
    id: 'speak-urban-mobility-transport',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Supports Blind Turn-by-Turn Exam Mode)',
    topic: 'Urban Mobility, Walkable Cities & Autonomous Transit',
    title: 'Speaking Workout: Public Transport, Commuting & Future Mobility',
    instructions:
      'Complete all 3 parts of the speaking workout. Tip: Toggle "Real Exam Blind Mode" above if you want Part 1 and Part 3 questions hidden until the Examiner reads each one aloud!',
    part1: [
      'What is your preferred method of travelling around your city or town on a daily basis?',
      'Has public transport in your area improved or declined over the past few years?',
      'Do you usually use travel time to read and work, or do you prefer to rest and listen to music?'
    ],
    part2: {
      topic: 'Describe a memorable journey you made using public transport (such as a high-speed train, ferry, or metro system).',
      bullets: [
        'Where you were travelling to and who was with you',
        'Why you chose that specific form of public transport over driving or flying',
        'What you observed or experienced during the journey',
        'And explain why that trip left a positive or lasting impression on you.'
      ]
    },
    part3: [
      'Should municipal governments make all buses and subways completely free of charge to reduce private car emissions?',
      'Why do many commuters remain reluctant to give up private automobiles even when public transit is available?',
      'How might fully autonomous self-driving vehicles reshape the design of city streets and parking infrastructure over the next twenty years?'
    ]
  },

  {
    id: 'speak-food-systems-culinary-heritage',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Supports Blind Turn-by-Turn Exam Mode)',
    topic: 'Agricultural Sustainability, Nutrition & Culinary Heritage',
    title: 'Speaking Workout: Food Culture, Local Markets & Global Supply Chains',
    instructions:
      'Complete all 3 parts of the speaking workout. Record your voice or type your full response below.',
    part1: [
      'Do you enjoy cooking meals from scratch, or do you prefer quick and simple dishes?',
      'Are there any traditional dishes from your region that are only prepared during special festivals?',
      'How important is it to you to buy locally grown produce when shopping for groceries?'
    ],
    part2: {
      topic: 'Describe a traditional meal, street food market, or culinary custom that represents the culture of a place you know well.',
      bullets: [
        'What the dish or food market is and where it is found',
        'How the food is prepared or how people gather to eat it',
        'What historical or geographic factors shaped those ingredients',
        'And explain why preserving this culinary tradition matters to local identity.'
      ]
    },
    part3: [
      'Has the globalization of fast-food chains and supermarket supply chains permanently eroded regional food diversity?',
      'Who bears the primary responsibility for reducing household and supermarket food waste: consumers, retailers, or lawmakers?',
      'To what extent should schools teach practical nutrition and agricultural literacy alongside traditional academic subjects?'
    ]
  },

  {
    id: 'speak-digital-privacy-cybersecurity',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Supports Blind Turn-by-Turn Exam Mode)',
    topic: 'Digital Privacy, Biometrics & Consumer Data Rights',
    title: 'Speaking Workout: Online Privacy, Algorithms & Digital Trust',
    instructions:
      'Complete all 3 parts of the speaking workout. Record your voice or type your full response below.',
    part1: [
      'Do you usually read the privacy policies or terms of service when installing a new mobile application?',
      'How do you manage passwords and security across your digital accounts?',
      'Have you ever stopped using a website or app because of intrusive targeted advertisements?'
    ],
    part2: {
      topic: 'Describe a digital tool, security habit, or technology policy that helped you protect your personal information or focus.',
      bullets: [
        'What the tool, setting, or habit was and when you adopted it',
        'What prompted you to take your digital privacy or security more seriously',
        'How difficult or convenient it was to implement in your daily routine',
        'And explain how it changed the way you interact with online platforms.'
      ]
    },
    part3: [
      'Why are so many citizens willing to trade personal biometric and location data in exchange for minor digital conveniences?',
      'Should technology corporations be legally required to pay users a dividend when profiting from their behavioural data?',
      'Where should democratic societies draw the boundary between public safety surveillance (such as facial recognition) and individual anonymity?'
    ]
  },

  {
    id: 'speak-space-science-astronomy',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Supports Blind Turn-by-Turn Exam Mode)',
    topic: 'Astrophysics, Satellite Infrastructure & Scientific Exploration',
    title: 'Speaking Workout: The Night Sky, Satellites & Space Exploration',
    instructions:
      'Complete all 3 parts of the speaking workout. Record your voice or type your full response below.',
    part1: [
      'Can you see stars clearly at night from where you live, or is there too much urban light pollution?',
      'Were you interested in astronomy, planets, or space travel when you were a child?',
      'Would you ever want to experience weightlessness on an orbital flight if it were completely safe?'
    ],
    part2: {
      topic: 'Describe a scientific discovery, space mission, or astronomical phenomenon (such as an eclipse or meteor shower) that fascinated you.',
      bullets: [
        'What the discovery, mission, or phenomenon was',
        'How you first learned about it or witnessed it',
        'What scientific technology or human effort made it possible',
        'And explain why it sparked your sense of wonder or curiosity.'
      ]
    },
    part3: [
      'Is spending billions of dollars on deep-space telescopes and planetary rovers justified when urgent environmental problems exist on Earth?',
      'How has the rapid commercialization of space by private rocket companies changed international scientific cooperation?',
      'Should outer space and celestial bodies be governed by binding international environmental treaties to prevent orbital pollution and resource monopolies?'
    ]
  }
];
