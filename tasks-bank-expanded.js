// ==========================================================================
// DAILY IELTS ACADEMIC 15 — EXPANDED RESEARCHED TASK BANK (28 ADDITIONAL WORKOUTS)
// Brings total built-in bank to 52 Complete IELTS Academic Workouts (13 per skill)
// ==========================================================================

export const EXPANDED_SEED_TASKS = [
  // ========================================================================
  // ADDITIONAL READING TASKS (7 Workouts = 49 Questions)
  // Includes T/F/NG, YES/NO/NG, Matching Paragraphs (A-D), Completion & MCQ
  // ========================================================================
  {
    id: 'read-aeroponic-rooftop-agriculture',
    section: 'reading',
    taskType: 'Academic Passage + T/F/NG & One-Word Completion',
    topic: 'Urban Agronomy & Controlled-Environment Agriculture',
    title: 'Vapor-Phase Cultivation: High-Pressure Aeroponics on Metropolitan Rooftops',
    instructions:
      'Read the academic passage below (recommended time: 15 minutes) and complete BOTH Task A (Questions 1–4) and Task B (Questions 5–7).',
    paragraphs: [
      {
        label: 'A',
        text: 'As land values in metropolitan cores escalate and peri-urban farmland is converted into logistics warehouses, urban agronomists have increasingly turned to flat commercial rooftops. However, conventional soil beds impose structural dead-loads exceeding 400 kilograms per square meter when saturated with rainwater, requiring costly steel retrofitting on older buildings. High-pressure aeroponic systems circumvent this engineering constraint by suspending plant roots inside enclosed, light-proof chambers and misting them intermittently with atomized nutrient droplets measuring 20 to 50 micrometers in diameter.'
      },
      {
        label: 'B',
        text: 'Because roots hang directly in an oxygen-saturated atmosphere rather than a waterlogged substrate, root hair proliferation accelerates markedly, allowing leafy greens and culinary herbs to mature up to thirty percent faster than in field cultivation while consuming ninety-five percent less irrigation water. During a two-year commercial trial atop a municipal distribution hall in southern Paris, agronomist Dr. Henri Moreau demonstrated that vertical aeroponic columns yielded 65 kilograms of lettuce per square meter annually without a single application of synthetic pesticides.'
      },
      {
        label: 'C',
        text: 'Yet aeroponic architecture carries acute operational vulnerabilities. Unlike soil or deep-water hydroponic troughs—which possess substantial thermal and hydraulic buffering capacity—suspended roots desiccate rapidly if misting nozzles clog with precipitated calcium salts or if electrical pumps fail during a summer heatwave. Consequently, Moreau’s facility relies on dual-redundant solar battery inverters and ultrasonic nozzle self-cleaning cycles to prevent catastrophic crop loss within a forty-minute window.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Wet soil beds on rooftops often require structural reinforcement on older buildings because of their heavy weight.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        explanation: 'Paragraph A states that conventional soil beds exceed 400 kg/m² when saturated, "requiring costly steel retrofitting on older buildings."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'In an aeroponic chamber, plant roots are kept continuously submerged in a deep tank of liquid water.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        explanation: 'Paragraph A and B explain that roots are suspended in air inside enclosed chambers and misted intermittently rather than submerged in liquid.'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Produce grown in Dr. Moreau’s Paris rooftop trial sold at a lower retail price than supermarket vegetables.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'NOT GIVEN',
        explanation: 'The passage reports yield per square meter and zero pesticide use, but never mentions the retail price of the produce.'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Aeroponic crops can survive for several days without damage if the misting pumps lose power in summer.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        explanation: 'Paragraph C warns that suspended roots "desiccate rapidly" and face "catastrophic crop loss within a forty-minute window" if pumps fail.'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: One-Word Completion & Multiple Choice',
        type: 'fill',
        prompt: 'Aeroponic systems use ninety-five percent less water while helping leafy crops mature thirty percent ________ than field crops. (Write ONE WORD from Passage B)',
        answer: 'faster',
        acceptableAnswers: ['faster', 'quicker'],
        explanation: 'Paragraph B states: "...allowing leafy greens and culinary herbs to mature up to thirty percent faster than in field cultivation."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: One-Word Completion & Multiple Choice',
        type: 'fill',
        prompt: 'Misting nozzles can become blocked by precipitated ________ salts if not cleaned ultrasonically. (Write ONE WORD from Passage C)',
        answer: 'calcium',
        acceptableAnswers: ['calcium'],
        explanation: 'Paragraph C notes: "...if misting nozzles clog with precipitated calcium salts."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: One-Word Completion & Multiple Choice',
        type: 'mcq',
        prompt: 'Why do roots grow so rapidly inside an aeroponic chamber?',
        options: [
          'A) The chambers are illuminated with intense ultraviolet light.',
          'B) The roots are exposed directly to an oxygen-rich atmosphere.',
          'C) Earthworms are added to the misting solution.',
          'D) The water temperature is kept near freezing.'
        ],
        answer: 'B) The roots are exposed directly to an oxygen-rich atmosphere.',
        explanation: 'Paragraph B explains: "Because roots hang directly in an oxygen-saturated atmosphere... root hair proliferation accelerates markedly."'
      }
    ]
  },

  {
    id: 'read-ancient-mediterranean-thalassocracy',
    section: 'reading',
    taskType: 'Academic Passage + Matching Paragraphs & Completion',
    topic: 'Classical History & Maritime Economics',
    title: 'Raiders and Regulators: Piracy and State Formation in the Ancient Mediterranean',
    instructions:
      'Read the passage below (recommended time: 15 minutes) and answer Questions 1–7, including Matching Paragraph Information (A–D).',
    paragraphs: [
      {
        label: 'A',
        text: 'In classical antiquity, the boundary between legitimate naval warfare and maritime piracy was remarkably fluid. Throughout the Homeric epics, coastal raiding is depicted not as a shameful criminal enterprise, but as an honorable avenue for aristocratic youths to acquire bronze tripods, livestock, and prestige. Because the fragmented topography of the Aegean Sea offered thousands of sheltered coves along rocky headlands, oar-powered galleys could ambush merchantmen becalmed in narrow straits and vanish before coastal militias mustered.'
      },
      {
        label: 'B',
        text: 'As city-states consolidated during the fifth century BCE, however, unchecked predation threatened the grain arteries upon which urban populations depended. Classical Athens leveraged its tribute-funded fleet of triremes—originally assembled to repel Persian invasion—to police Aegean shipping lanes. Paradoxically, Athenian inscriptions reveal that the democracy routinely branded rival maritime states as "piratical" to justify imposing mandatory harbor duties and forcing smaller island polities into its Delian League.'
      },
      {
        label: 'C',
        text: 'During the Hellenistic and late Republican eras, Cilician corsairs operating from fortified cliff-citadels in southern Anatolia organized syndicates that functioned as shadow states. Far from being enemies of Roman elites, Cilician raiders supplied the vast slave markets on the island of Delos, where tens of thousands of captives were purchased by Roman senators to work agricultural estates in Italy.'
      },
      {
        label: 'D',
        text: 'Rome tolerated this symbiotic arrangement until Cilician squadrons began intercepting Egyptian grain convoys bound for Ostia, triggering bread riots in the capital. In 67 BCE, the Roman assembly granted Pompey the Great unprecedented Mediterranean-wide command under the Lex Gabinia. Rather than executing all surrendered corsairs, Pompey resettled thousands of former raiders onto inland arable farms in Cilicia, recognizing that chronic maritime banditry was rooted in coastal landlessness.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Matching Information (Which Paragraph A–D contains the following?)',
        type: 'mcq',
        prompt: 'An explanation of how geography helped early raiders attack cargo ships and escape.',
        options: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
        answer: 'Paragraph A',
        explanation: 'Paragraph A describes how the fragmented topography of the Aegean offered sheltered coves and narrow straits for oar-powered galleys to ambush merchantmen.'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Matching Information (Which Paragraph A–D contains the following?)',
        type: 'mcq',
        prompt: 'A reference to how a powerful naval state used anti-piracy rhetoric to collect taxes and control smaller islands.',
        options: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
        answer: 'Paragraph B',
        explanation: 'Paragraph B explains that Athens branded rivals as "piratical" to justify mandatory harbor duties and Delian League membership.'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Matching Information (Which Paragraph A–D contains the following?)',
        type: 'mcq',
        prompt: 'An account of an economic partnership between maritime raiders and wealthy landowners.',
        options: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
        answer: 'Paragraph C',
        explanation: 'Paragraph C details how Cilician corsairs supplied the Delos slave markets for Roman senators’ Italian estates.'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Matching Information (Which Paragraph A–D contains the following?)',
        type: 'mcq',
        prompt: 'A non-violent socio-economic policy used to prevent former pirates from returning to crime.',
        options: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
        answer: 'Paragraph D',
        explanation: 'Paragraph D describes how Pompey resettled surrendered raiders onto inland arable farms.'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: One-Word Completion & Multiple Choice',
        type: 'fill',
        prompt: 'In Homeric poetry, coastal raiding was viewed as an honorable way to gain livestock, bronze items, and ________. (Write ONE WORD from Passage A)',
        answer: 'prestige',
        acceptableAnswers: ['prestige'],
        explanation: 'Paragraph A states: "...an honorable avenue for aristocratic youths to acquire bronze tripods, livestock, and prestige."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: One-Word Completion & Multiple Choice',
        type: 'fill',
        prompt: 'Rome finally acted against Cilician pirates when they disrupted Egyptian ________ shipments, causing riots. (Write ONE WORD from Passage D)',
        answer: 'grain',
        acceptableAnswers: ['grain'],
        explanation: 'Paragraph D states: "...until Cilician squadrons began intercepting Egyptian grain convoys bound for Ostia, triggering bread riots."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: One-Word Completion & Multiple Choice',
        type: 'mcq',
        prompt: 'What did Pompey the Great identify as the underlying cause of Cilician piracy?',
        options: [
          'A) Religious conflict between Athens and Persia',
          'B) A lack of farmland for coastal populations',
          'C) The invention of larger bronze battering rams',
          'D) Excessive taxation by the island of Delos'
        ],
        answer: 'B) A lack of farmland for coastal populations',
        explanation: 'Paragraph D concludes that Pompey resettled raiders onto inland farms, "recognizing that chronic maritime banditry was rooted in coastal landlessness."'
      }
    ]
  },

  {
    id: 'read-tennis-racket-materials-engineering',
    section: 'reading',
    taskType: 'Academic Passage + T/F/NG & Note Completion',
    topic: 'Materials Engineering & Sports Biomechanics',
    title: 'Moment of Inertia: How Composite Materials Transformed the Tennis Racket',
    instructions:
      'Read the passage below (recommended time: 15 minutes) and complete Questions 1–7.',
    paragraphs: [
      {
        label: 'A',
        text: 'For the first century of lawn tennis, rackets were laminated from steamed ash or beech wood and strung with bovine serosa—commonly known as natural gut. Because wood possesses a relatively low stiffness-to-weight ratio, any attempt to enlarge the circular head beyond 65 square inches caused the frame to warp under string tension or become too heavy for a player to swing rapidly. Consequently, classical players relied on compact, fluid strokes to strike the ball precisely at the center of percussion.'
      },
      {
        label: 'B',
        text: 'The transition to aluminum and tubular steel frames in the late 1960s, followed by Howard Head’s patenting of the oversized 110-square-inch frame in 1976, fundamentally altered racket kinematics. By widening the hoop, engineers doubled the polar moment of inertia—the frame’s resistance to twisting around its longitudinal axis when a ball impacts off-center. Beginners and professionals alike could now hit aggressive topspin shots near the outer rim without the racket deflecting in their hand.'
      },
      {
        label: 'C',
        text: 'In the 1980s, aerospace-grade carbon-fiber composites (braided graphite) superseded metal alloys. Because carbon fibers can be oriented at specific angles within an epoxy resin matrix, manufacturers decoupled stiffness from mass, producing sub-300-gram rackets that transfer kinetic energy with minimal vibrational damping. Combined with low-friction co-polyester monofilament strings—which snap back elastically after ball impact—modern composite frames generate spin rates exceeding 3,500 revolutions per minute, transforming tennis from a serve-and-volley contest into an athletic baseline duel.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Wooden tennis rackets could easily be built with 110-square-inch heads without bending or becoming heavy.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        explanation: 'Paragraph A states that enlarging a wooden head beyond 65 square inches caused the frame to warp under tension or become too heavy.'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Widening the racket head reduced the tendency of the frame to twist on off-center hits.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        explanation: 'Paragraph B explains that widening the hoop "doubled the polar moment of inertia—the frame’s resistance to twisting around its longitudinal axis when a ball impacts off-center."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'The International Tennis Federation banned braided graphite rackets for two years in the 1980s.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'NOT GIVEN',
        explanation: 'The passage discusses the adoption of braided graphite in the 1980s, but never mentions any ban by the International Tennis Federation.'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Modern composite rackets and polyester strings have encouraged more baseline play rather than serve-and-volley tactics.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        explanation: 'Paragraph C concludes that high spin rates transformed tennis "from a serve-and-volley contest into an athletic baseline duel."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: One-Word Completion & Multiple Choice',
        type: 'fill',
        prompt: 'Traditional rackets were made from laminated ash or beech wood and strung with natural ________. (Write ONE WORD from Passage A)',
        answer: 'gut',
        acceptableAnswers: ['gut', 'serosa'],
        explanation: 'Paragraph A states: "...strung with bovine serosa—commonly known as natural gut."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: One-Word Completion & Multiple Choice',
        type: 'fill',
        prompt: 'In composite rackets, carbon fibers are embedded at specific angles inside an ________ resin matrix. (Write ONE WORD from Passage C)',
        answer: 'epoxy',
        acceptableAnswers: ['epoxy'],
        explanation: 'Paragraph C states: "Because carbon fibers can be oriented at specific angles within an epoxy resin matrix..."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: One-Word Completion & Multiple Choice',
        type: 'mcq',
        prompt: 'How do co-polyester monofilament strings increase topspin according to Paragraph C?',
        options: [
          'A) They absorb moisture from the court air.',
          'B) They slide and snap back elastically during ball impact.',
          'C) They are glued permanently to the wooden frame.',
          'D) They weigh twice as much as aluminum frames.'
        ],
        answer: 'B) They slide and snap back elastically during ball impact.',
        explanation: 'Paragraph C highlights "low-friction co-polyester monofilament strings—which snap back elastically after ball impact."'
      }
    ]
  },

  {
    id: 'read-rewilding-trophic-cascades',
    section: 'reading',
    taskType: 'Academic Passage + YES/NO/NOT GIVEN & Completion',
    topic: 'Conservation Biology & Trophic Ecology',
    title: 'Fear and Foliage: Apex Predators and the Limits of Trophic Rewilding',
    instructions:
      'Read the passage below (recommended time: 15 minutes). Questions 1–4 test whether the statements agree with the VIEWS/CLAIMS OF THE WRITER (YES / NO / NOT GIVEN).',
    paragraphs: [
      {
        label: 'A',
        text: 'Few ecological concepts have captured the public imagination as vividly as the "trophic cascade"—the proposition that reintroducing apex carnivores restores degraded landscapes by altering both the population density and foraging behavior of herbivores. Following the 1995 reintroduction of gray wolves to Yellowstone National Park, popular media celebrated a linear miracle: wolves allegedly frightened elk away from valley streambanks, allowing willow and aspen groves to rebound, which in turn stabilized river channels and attracted songbirds and beavers.'
      },
      {
        label: 'B',
        text: 'While this narrative is inspiring, treating apex predator reintroduction as a universal panacea oversimplifies ecosystem hysteresis. Long-term hydrological experiments in Yellowstone conducted by Professor D. J. Marshall demonstrated that in valleys where elk had browsed willows to the ground for seven decades, streams had incised deep channels, causing the water table to drop by over a meter. Without beavers to build dams that raise groundwater levels, willow saplings failed to recover even when researchers fenced out elk completely.'
      },
      {
        label: 'C',
        text: 'Furthermore, transposing North American wilderness models onto densely populated European agricultural landscapes ignores socio-ecological realities. When wolves recolonize fragmented pastoral regions in the Alps or Iberia without accompanying compensation schemes and livestock-guarding dogs, rural backlash frequently undermines broader biodiversity treaties. Effective rewilding therefore requires simultaneous hydrological engineering and community co-management, rather than assuming that carnivores alone can rewind centuries of human modification.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Yes / No / Not Given (Writer’s Claims)',
        type: 'tfng',
        prompt: 'Popular media accounts of the Yellowstone wolf reintroduction presented an overly simplistic version of how ecosystems recover.',
        options: ['YES', 'NO', 'NOT GIVEN'],
        answer: 'YES',
        explanation: 'In Paragraphs A and B, the writer contrasts the popular "linear miracle" narrative with the view that treating predator reintroduction as a universal panacea "oversimplifies ecosystem hysteresis."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Yes / No / Not Given (Writer’s Claims)',
        type: 'tfng',
        prompt: 'Simply keeping elk away from overgrazed Yellowstone valleys was sufficient on its own to restore tall willow groves.',
        options: ['YES', 'NO', 'NOT GIVEN'],
        answer: 'NO',
        explanation: 'Paragraph B states that because the water table had dropped, "willow saplings failed to recover even when researchers fenced out elk completely."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Yes / No / Not Given (Writer’s Claims)',
        type: 'tfng',
        prompt: 'European farmers receive higher government subsidies for wolf damage than North American ranchers.',
        options: ['YES', 'NO', 'NOT GIVEN'],
        answer: 'NOT GIVEN',
        explanation: 'The writer mentions compensation schemes in Europe, but never compares subsidy amounts between Europe and North America.'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Yes / No / Not Given (Writer’s Claims)',
        type: 'tfng',
        prompt: 'Successful rewilding projects must combine ecological restoration with active support for local rural communities.',
        options: ['YES', 'NO', 'NOT GIVEN'],
        answer: 'YES',
        explanation: 'Paragraph C concludes that "Effective rewilding therefore requires simultaneous hydrological engineering and community co-management."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: One-Word Completion & Multiple Choice',
        type: 'fill',
        prompt: 'In degraded Yellowstone valleys, deep stream erosion caused the local water ________ to drop by more than a meter. (Write ONE WORD from Passage B)',
        answer: 'table',
        acceptableAnswers: ['table', 'levels'],
        explanation: 'Paragraph B states: "...causing the water table to drop by over a meter."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: One-Word Completion & Multiple Choice',
        type: 'fill',
        prompt: 'In addition to compensation programs, pastoral regions use livestock-guarding ________ to reduce wolf conflict. (Write ONE WORD from Passage C)',
        answer: 'dogs',
        acceptableAnswers: ['dogs'],
        explanation: 'Paragraph C mentions "compensation schemes and livestock-guarding dogs."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: One-Word Completion & Multiple Choice',
        type: 'mcq',
        prompt: 'Why were beavers essential to willow recovery in Professor Marshall’s study?',
        options: [
          'A) Beavers planted willow seeds along dry hilltops.',
          'B) Beaver dams raised groundwater levels so willow roots could reach moisture.',
          'C) Beavers protected elk from wolf packs.',
          'D) Beavers removed invasive insects from willow bark.'
        ],
        answer: 'B) Beaver dams raised groundwater levels so willow roots could reach moisture.',
        explanation: 'Paragraph B explains: "Without beavers to build dams that raise groundwater levels, willow saplings failed to recover..."'
      }
    ]
  },

  {
    id: 'read-kessler-syndrome-orbital-debris',
    section: 'reading',
    taskType: 'Academic Passage + T/F/NG & Completion',
    topic: 'Aerospace Engineering & Orbital Mechanics',
    title: 'Tragedy of the Orbital Commons: Mitigating the Kessler Cascade',
    instructions:
      'Read the passage below (recommended time: 15 minutes) and complete Questions 1–7.',
    paragraphs: [
      {
        label: 'A',
        text: 'Since the launch of Sputnik 1 in 1957, human spaceflight has treated Low Earth Orbit (LEO)—the altitude band between 200 and 2,000 kilometers—as an infinite disposal sink. Today, space surveillance networks track over 35,000 defunct rocket stages, inactive satellites, and fragmentation bolts larger than ten centimeters, alongside an estimated 130 million untrackable paint flecks and alloy shards. Because orbital velocities in LEO average 7.8 kilometers per second, a five-millimeter aluminum sphere strikes with the kinetic energy of a bowling ball moving at 100 kilometers per hour.'
      },
      {
        label: 'B',
        text: 'In 1978, astrophysicist Donald Kessler warned that once object density in a given orbital shell surpasses a critical threshold, a single collision between two massive derelicts generates a cloud of shrapnel that triggers a self-sustaining chain reaction—now termed the Kessler cascade. Even if all rocket launches ceased tomorrow, computer simulations by the European Space Agency indicate that collision fragments in the crowded 800-to-1,000-kilometer sun-synchronous belt would continue to multiply over the next century.'
      },
      {
        label: 'C',
        text: 'Preventing this cascade requires combining strict passivation rules with Active Debris Removal (ADR). International guidelines now urge operators to vent residual fuel from upper rocket stages—preventing delayed chemical explosions—and to de-orbit satellites into the upper atmosphere within five years of mission completion. Meanwhile, prototype ADR spacecraft are testing robotic capture arms, electrodynamic tethers, and ground-based pulsed lasers designed to nudge tumbling debris into atmospheric burn-up.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Ground radar networks can currently track every piece of orbital debris down to one millimeter in size.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        explanation: 'Paragraph A states that networks track objects larger than ten centimeters, while 130 million smaller flecks and shards are "untrackable."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'According to European Space Agency simulations, stopping all future rocket launches would immediately halt the growth of debris in the 800–1,000 km belt.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        explanation: 'Paragraph B states: "Even if all rocket launches ceased tomorrow... collision fragments in the crowded 800-to-1,000-kilometer... belt would continue to multiply."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Leftover fuel inside abandoned rocket stages can cause them to explode in orbit.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        explanation: 'Paragraph C notes that operators are urged to "vent residual fuel from upper rocket stages—preventing delayed chemical explosions."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: True / False / Not Given',
        type: 'tfng',
        prompt: 'Electrodynamic tethers are cheaper to manufacture than robotic capture arms.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'NOT GIVEN',
        explanation: 'Paragraph C mentions both technologies as ADR prototypes, but never compares their manufacturing cost.'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Objects in Low Earth Orbit travel at an average speed of ________ kilometers per second. (Write A NUMBER from Passage A)',
        answer: '7.8',
        acceptableAnswers: ['7.8'],
        explanation: 'Paragraph A states: "Because orbital velocities in LEO average 7.8 kilometers per second..."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'New international rules recommend de-orbiting inactive satellites within ________ years of the end of their mission. (Write ONE WORD OR A NUMBER from Passage C)',
        answer: 'five',
        acceptableAnswers: ['five', '5'],
        explanation: 'Paragraph C mentions: "...de-orbit satellites into the upper atmosphere within five years of mission completion."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice (ONE WORD AND/OR A NUMBER)',
        type: 'mcq',
        prompt: 'Why does a tiny five-millimeter aluminum fragment pose such a severe threat in Low Earth Orbit?',
        options: [
          'A) Aluminum is highly radioactive in space.',
          'B) Its extreme orbital velocity gives it immense kinetic impact energy.',
          'C) It blocks solar panels from receiving sunlight.',
          'D) It interferes with radio transmissions to Earth.'
        ],
        answer: 'B) Its extreme orbital velocity gives it immense kinetic impact energy.',
        explanation: 'Paragraph A explains that due to velocities of 7.8 km/s, a 5mm sphere strikes with the kinetic energy of a bowling ball at 100 km/h.'
      }
    ]
  },

  {
    id: 'read-bilingual-executive-control-aging',
    section: 'reading',
    taskType: 'Academic Passage + YES/NO/NOT GIVEN & Completion',
    topic: 'Cognitive Neuroscience & Psycholinguistics',
    title: 'The Juggler’s Cortex: Lifelong Bilingualism and Cognitive Reserve',
    instructions:
      'Read the passage below (recommended time: 15 minutes) and complete Questions 1–7 (including YES / NO / NOT GIVEN on the writer’s claims).',
    paragraphs: [
      {
        label: 'A',
        text: 'Early twentieth-century educational psychologists frequently warned that raising children with two languages would induce "mental confusion" and delay vocabulary acquisition. Modern neuroimaging has thoroughly dismantled this deficit model. Functional MRI studies demonstrate that in a bilingual brain, both linguistic systems remain simultaneously active even when the speaker is conversing in only one environment—requiring the dorsolateral prefrontal cortex and anterior cingulate cortex to continuously inhibit the non-target language.'
      },
      {
        label: 'B',
        text: 'While debate persists over whether this constant mental juggling yields measurable reaction-time advantages in healthy twenty-year-olds—who are already operating at peak cognitive ceiling—the clinical evidence regarding neurodegenerative aging is compelling. Retrospective clinical audits across memory clinics in Toronto, Brussels, and Hyderabad indicate that lifelong bilinguals develop clinical symptoms of Alzheimer’s dementia four to five years later than monolinguals matched for education, occupation, and diet.'
      },
      {
        label: 'C',
        text: 'Remarkably, post-mortem neuropathology reveals that bilingual patients often exhibit the same physical accumulation of beta-amyloid plaques and tau tangles as monolingual patients who suffered severe cognitive decline years earlier. Bilingualism does not prevent the biological pathology of Alzheimer’s disease; rather, it builds "cognitive reserve" by strengthening fronto-parietal white-matter connectivity, allowing the aging brain to route information around damaged hippocampal circuits.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Yes / No / Not Given (Writer’s Claims)',
        type: 'tfng',
        prompt: 'When a bilingual person speaks one language, the other language is completely switched off in the brain.',
        options: ['YES', 'NO', 'NOT GIVEN'],
        answer: 'NO',
        explanation: 'Paragraph A states that "both linguistic systems remain simultaneously active even when the speaker is conversing in only one environment."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Yes / No / Not Given (Writer’s Claims)',
        type: 'tfng',
        prompt: 'Scientists all agree that bilingual twenty-year-olds have faster reaction times than monolingual twenty-year-olds.',
        options: ['YES', 'NO', 'NOT GIVEN'],
        answer: 'NO',
        explanation: 'Paragraph B states: "While debate persists over whether this constant mental juggling yields measurable reaction-time advantages in healthy twenty-year-olds..."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Yes / No / Not Given (Writer’s Claims)',
        type: 'tfng',
        prompt: 'Learning a third language in retirement provides the same cognitive reserve as lifelong bilingualism.',
        options: ['YES', 'NO', 'NOT GIVEN'],
        answer: 'NOT GIVEN',
        explanation: 'The passage discusses lifelong bilinguals, but does not compare learning a third language in retirement.'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Yes / No / Not Given (Writer’s Claims)',
        type: 'tfng',
        prompt: 'Bilingualism delays the outward symptoms of Alzheimer’s without stopping the physical build-up of plaques in the brain.',
        options: ['YES', 'NO', 'NOT GIVEN'],
        answer: 'YES',
        explanation: 'Paragraph C explains that bilinguals show the same physical beta-amyloid plaques, meaning bilingualism builds cognitive reserve to compensate rather than preventing the physical pathology.'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice',
        type: 'fill',
        prompt: 'Lifelong bilinguals typically show symptoms of Alzheimer’s dementia four to ________ years later than comparable monolinguals. (Write ONE WORD OR A NUMBER from Passage B)',
        answer: 'five',
        acceptableAnswers: ['five', '5', '4-5'],
        explanation: 'Paragraph B states: "...four to five years later than monolinguals matched for education, occupation, and diet."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice',
        type: 'fill',
        prompt: 'Bilingualism strengthens white-matter connectivity to build cognitive ________, helping the brain bypass damaged areas. (Write ONE WORD from Passage C)',
        answer: 'reserve',
        acceptableAnswers: ['reserve'],
        explanation: 'Paragraph C states: "...it builds \'cognitive reserve\' by strengthening fronto-parietal white-matter connectivity."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice',
        type: 'mcq',
        prompt: 'Why did including Hyderabad in the memory clinic studies strengthen the findings in Paragraph B?',
        options: [
          'A) It showed the effect holds true across diverse linguistic and cultural settings.',
          'B) It was the only city where monolinguals outnumbered bilinguals.',
          'C) It used a new surgical treatment for dementia.',
          'D) It focused exclusively on children under ten.'
        ],
        answer: 'A) It showed the effect holds true across diverse linguistic and cultural settings.',
        explanation: 'Paragraph B cites clinics across Toronto, Brussels, and Hyderabad controlled for education, occupation, and diet.'
      }
    ]
  },

  {
    id: 'read-silbo-gomero-whistled-languages',
    section: 'reading',
    taskType: 'Academic Passage + Matching Paragraphs & Completion',
    topic: 'Acoustic Phonetics & Cultural Linguistics',
    title: 'Phonemes Across the Ravine: The Bioacoustics of Whistled Speech',
    instructions:
      'Read the passage below (recommended time: 15 minutes) and answer Questions 1–7.',
    paragraphs: [
      {
        label: 'A',
        text: 'Across roughly eighty mountainous or densely forested regions worldwide—from the volcanic ravines of La Gomera in the Canary Islands to the Pontic Alps of northeastern Turkey—shepherds and subsistence farmers have developed whistled speech registers. Far from being simple pre-arranged signal codes or musical melodies, whistled languages such as Silbo Gomero are direct acoustic transpositions of the local spoken language, capable of conveying unlimited novel sentences.'
      },
      {
        label: 'B',
        text: 'The survival of whistled speech in steep terrain is governed by atmospheric physics. Ordinary shouted human speech spreads energy across a wide frequency band from 100 to 4,000 hertz and degrades into unintelligible echoes beyond 200 meters. Whistlers, by contrast, compress vocal tract resonances into a narrow, high-intensity frequency band between 1,000 and 3,000 hertz—precisely the range where human auditory sensitivity peaks and ambient wind or stream noise is minimal—allowing messages to travel clearly across five kilometers of canyon.'
      },
      {
        label: 'C',
        text: 'How can a single whistled pitch contour encode complex Spanish or Turkish grammar? Acoustic phonetician Dr. Julien Meyer demonstrated that whistlers emulate the second formant of spoken vowels through steady frequency levels (for instance, a high whistle for /i/ and a low whistle for /o/), while consonants are articulated by abrupt frequency modulations and glottal stops.'
      },
      {
        label: 'D',
        text: 'In the late twentieth century, rural road paving and mobile cellular networks pushed Silbo Gomero toward extinction. In 1999, however, the Canary Islands regional parliament made Silbo instruction compulsory in all primary and secondary schools on La Gomera. Neuroimaging of fluent Silbo practitioners subsequently revealed that while non-speakers process the whistles merely as non-linguistic musical tones in the right hemisphere, trained Silbo users activate the left-hemisphere Broca’s and Wernicke’s language areas identically to spoken Spanish.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Matching Information (Which Paragraph A–D contains the following?)',
        type: 'mcq',
        prompt: 'An explanation of why whistled sounds carry much farther than shouted words.',
        options: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
        answer: 'Paragraph B',
        explanation: 'Paragraph B explains the atmospheric physics and 1,000–3,000 Hz frequency compression that lets whistles travel 5 km compared to 200 m for shouting.'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Matching Information (Which Paragraph A–D contains the following?)',
        type: 'mcq',
        prompt: 'A description of how specific vowels and consonants are shaped inside a whistle.',
        options: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
        answer: 'Paragraph C',
        explanation: 'Paragraph C details Dr. Julien Meyer’s findings on how vowel formants and consonant frequency modulations are produced.'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Matching Information (Which Paragraph A–D contains the following?)',
        type: 'mcq',
        prompt: 'Evidence from brain scans showing how fluent practitioners interpret whistled speech.',
        options: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
        answer: 'Paragraph D',
        explanation: 'Paragraph D describes neuroimaging showing left-hemisphere activation in Broca’s and Wernicke’s areas.'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Matching Information (Which Paragraph A–D contains the following?)',
        type: 'mcq',
        prompt: 'A clarification that whistled languages are not just a fixed list of short commands.',
        options: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
        answer: 'Paragraph A',
        explanation: 'Paragraph A clarifies that whistled languages are "Far from being simple pre-arranged signal codes... capable of conveying unlimited novel sentences."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice',
        type: 'fill',
        prompt: 'Shouted human speech usually becomes unintelligible beyond ________ meters due to echoes. (Write A NUMBER from Passage B)',
        answer: '200',
        acceptableAnswers: ['200', 'two hundred'],
        explanation: 'Paragraph B states that shouted speech "degrades into unintelligible echoes beyond 200 meters."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice',
        type: 'fill',
        prompt: 'In 1999, the regional parliament made learning Silbo Gomero ________ in all schools on the island. (Write ONE WORD from Passage D)',
        answer: 'compulsory',
        acceptableAnswers: ['compulsory', 'mandatory'],
        explanation: 'Paragraph D states: "...the Canary Islands regional parliament made Silbo instruction compulsory in all primary and secondary schools."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Completion & Multiple Choice',
        type: 'mcq',
        prompt: 'What nearly caused Silbo Gomero to die out in the late twentieth century?',
        options: [
          'A) A volcanic eruption on La Gomera',
          'B) The expansion of paved roads and mobile phone networks',
          'C) A government ban on outdoor whistling',
          'D) A decline in tourism across the Canary Islands'
        ],
        answer: 'B) The expansion of paved roads and mobile phone networks',
        explanation: 'Paragraph D states: "In the late twentieth century, rural road paving and mobile cellular networks pushed Silbo Gomero toward extinction."'
      }
    ]
  },

  // ========================================================================
  // ADDITIONAL WRITING TASKS (7 Workouts: Process Diagrams, Stacked Charts, Bar Charts & Essays)
  // ========================================================================
  {
    id: 'write-t1-process-geothermal-power-plant',
    section: 'writing',
    subMode: 'task1',
    taskType: 'Academic Writing Task 1 — Process Diagram Report (15-Min Sprint)',
    topic: 'Renewable Energy Engineering & Thermodynamics',
    title: 'Task 1: Electricity Generation in a Binary-Cycle Geothermal Power Plant',
    targetWords: 150,
    instructions:
      'Spend about 15 minutes on this task. Summarize the process diagram by selecting and reporting the main stages and cyclical flow. Write at least 150 words using passive voice and sequential connectors.',
    prompt:
      'The process diagram below illustrates how electricity is generated in a closed-loop binary-cycle geothermal power plant.',
    chartSpec: {
      chartType: 'process',
      title: 'Binary-Cycle Geothermal Electricity Generation Process',
      isCyclical: true,
      steps: [
        {
          stage: 'Stage 1',
          label: 'Production Well',
          detail: 'Pumps hot geothermal brine (180°C) from 2km deep rock reservoir'
        },
        {
          stage: 'Stage 2',
          label: 'Heat Exchanger',
          detail: 'Brine transfers thermal energy to low-boiling Isobutane fluid'
        },
        {
          stage: 'Stage 3',
          label: 'Vapor Turbine & Generator',
          detail: 'High-pressure Isobutane vapor spins turbine blades to produce electricity'
        },
        {
          stage: 'Stage 4',
          label: 'Cooling Condenser',
          detail: 'Exhaust vapor is cooled back into liquid Isobutane for reuse'
        },
        {
          stage: 'Stage 5',
          label: 'Injection Well',
          detail: 'Cooled geothermal water (70°C) is reinjected deep underground'
        }
      ]
    },
    modelAnswer:
      'The flow diagram illustrates the five-stage cyclical process by which a binary-cycle geothermal power station converts subterranean thermal energy into electrical power without releasing steam or emissions into the atmosphere.\n\nOverall, the system operates through two separate, closed fluid loops—a primary geothermal water loop and a secondary isobutane working-fluid loop—linked thermally via a central heat exchanger.\n\nIn the first stage, superheated geothermal brine at 180°C is extracted from a deep underground rock reservoir, located two kilometers beneath the surface, via a production well. Next, this hot brine enters a heat exchanger (Stage 2), where its thermal energy is transferred across sealed pipes to a secondary fluid, isobutane, which has a much lower boiling point than water.\n\nDuring Stage 3, the rapidly vaporized, high-pressure isobutane gas is directed into a turbine connected to an electrical generator, spinning the rotor blades to generate electricity for the power grid. Subsequently, in Stage 4, the spent isobutane vapor passes through a cooling condenser, where it condenses back into a liquid and recirculates to the heat exchanger. Simultaneously, in Stage 5, the cooled geothermal brine (now at 70°C) is pumped back into the subterranean rock layer through an injection well to reheated naturally, completing the sustainable cycle.'
  },

  {
    id: 'write-t1-process-glass-bottle-recycling',
    section: 'writing',
    subMode: 'task1',
    taskType: 'Academic Writing Task 1 — Industrial Process Diagram (15-Min Sprint)',
    topic: 'Materials Engineering & Circular Manufacturing',
    title: 'Task 1: Closed-Loop Industrial Recycling of Waste Glass Containers',
    targetWords: 150,
    instructions:
      'Spend about 15 minutes on this task. Describe the industrial stages shown in the process diagram. Write at least 150 words.',
    prompt:
      'The diagram below shows the six stages involved in the closed-loop collection, optical sorting, melting, and remanufacturing of recycled glass bottles.',
    chartSpec: {
      chartType: 'process',
      title: 'Closed-Loop Industrial Glass Container Recycling',
      isCyclical: true,
      steps: [
        {
          stage: 'Stage 1',
          label: 'Collection & Transport',
          detail: 'Used glass bottles collected from municipal banks and hauled to treatment plant'
        },
        {
          stage: 'Stage 2',
          label: 'Washing & Ferrous Removal',
          detail: 'High-pressure jets remove labels; overhead magnets extract steel bottle caps'
        },
        {
          stage: 'Stage 3',
          label: 'Optical Laser Sorting & Crushing',
          detail: 'Lasers sort glass by color (clear, green, amber) and crush into "cullet"'
        },
        {
          stage: 'Stage 4',
          label: 'Furnace Melting (1,500°C)',
          detail: '90% recycled cullet mixed with 10% silica sand and limestone in furnace'
        },
        {
          stage: 'Stage 5',
          label: 'Pneumatic Blow-Molding',
          detail: 'Molten glass gobs are dropped into steel molds and blown into new bottles'
        },
        {
          stage: 'Stage 6',
          label: 'Annealing Kiln & Bottling',
          detail: 'Bottles cooled gradually to prevent cracking, filled, and distributed'
        }
      ]
    },
    modelAnswer:
      'The diagram delineates the six sequential stages through which discarded glass containers are collected, purified, melted, and remanufactured into new commercial bottles.\n\nOverall, glass recycling is a continuous, closed-loop industrial process that begins with municipal collection and mechanical decontamination, proceeds through high-temperature furnace fusion, and concludes with pneumatic molding and controlled thermal cooling.\n\nInitially, in Stage 1, post-consumer glass bottles are gathered from municipal recycling banks and transported by truck to a processing facility. Upon arrival (Stage 2), the containers undergo pressurized washing to strip paper adhesives and food residue, while overhead electromagnets extract ferrous metal bottle caps.\n\nIn Stage 3, optical laser sensors segregate the cleaned glass into clear, green, and amber streams before mechanical crushers pulverize the material into fine gravel known as cullet. Next, in Stage 4, a blend comprising 90% recycled cullet and 10% virgin silica sand and limestone is fed into a furnace heated to 1,500°C. Once molten (Stage 5), measured gobs of liquid glass are dropped into steel molds and shaped using compressed air. Finally, in Stage 6, the newly formed bottles pass through an annealing kiln to cool gradually—preventing internal thermal stress—before being filled and returned to retail circulation.'
  },

  {
    id: 'write-t1-stacked-water-use-by-sector',
    section: 'writing',
    subMode: 'task1',
    taskType: 'Academic Writing Task 1 — Proportional Breakdown Chart (15-Min Sprint)',
    topic: 'Hydrology & Economic Geography',
    title: 'Task 1: Freshwater Withdrawal by Sector Across Four Global Regions',
    targetWords: 150,
    instructions:
      'Spend about 15 minutes on this task. Compare the proportional shares of freshwater withdrawal across the three sectors in the four regions. Write at least 150 words.',
    prompt:
      'The chart below compares the percentage of total freshwater withdrawals allocated to Agriculture, Industrial Manufacturing/Cooling, and Municipal/Household Use across South Asia, Southern Europe, North America, and Western Europe.',
    chartSpec: {
      chartType: 'stacked',
      title: 'Distribution of Freshwater Withdrawals by Economic Sector (%)',
      unit: '%',
      categories: ['South Asia', 'Southern Europe', 'North America', 'Western Europe'],
      series: [
        { name: 'Agriculture & Irrigation', values: [88, 62, 39, 14] },
        { name: 'Industrial & Power Cooling', values: [5, 22, 47, 64] },
        { name: 'Municipal & Household', values: [7, 16, 14, 22] }
      ]
    },
    modelAnswer:
      'The proportional breakdown chart illustrates how total freshwater abstractions are distributed among agriculture, industry, and municipal households across four regions: South Asia, Southern Europe, North America, and Western Europe.\n\nOverall, there is an inverse relationship between agricultural and industrial water consumption across the four regions. Whereas South Asia and Southern Europe allocate the majority of their freshwater to crop irrigation, North America and Western Europe direct the largest share toward industrial manufacturing and thermoelectric cooling.\n\nIn South Asia, agricultural irrigation accounts for an overwhelming 88% of total water withdrawals, leaving just 7% for domestic municipal supply and a marginal 5% for industry. Southern Europe also prioritizes agriculture, though at a more moderate 62%, alongside 22% for industry and 16% for household consumption.\n\nBy contrast, industrial water demand predominates in Western Europe and North America, representing 64% and 47% of total abstractions, respectively. Notably, agricultural usage in Western Europe stands at only 14%—less than one-sixth of South Asia’s share—while its municipal household allocation is the highest among all four regions at 22%.'
  },

  {
    id: 'write-t1-bar-postgraduate-enrollment-stem',
    section: 'writing',
    subMode: 'task1',
    taskType: 'Academic Writing Task 1 — Bar Chart Report (15-Min Sprint)',
    topic: 'Higher Education & STEM Demographics',
    title: 'Task 1: Postgraduate Enrollment by Gender Across Four Engineering Fields (2024)',
    targetWords: 150,
    instructions:
      'Spend about 15 minutes on this task. Summarize the main features and compare the figures across disciplines. Write at least 150 words.',
    prompt:
      'The bar chart below shows the number of male and female postgraduate students (in thousands) enrolled in four engineering disciplines across UK universities in 2024.',
    chartSpec: {
      chartType: 'bar',
      title: 'UK Postgraduate Engineering Enrollment by Discipline (Thousands, 2024)',
      unit: 'k',
      categories: ['Biomedical Eng.', 'Environmental Eng.', 'Software & AI', 'Mechanical Eng.'],
      series: [
        { name: 'Female Postgraduates', values: [18, 16, 14, 6] },
        { name: 'Male Postgraduates', values: [14, 15, 32, 26] }
      ]
    },
    modelAnswer:
      'The grouped bar chart compares the number of female and male postgraduate students, measured in thousands, enrolled across four engineering specializations at British universities in 2024.\n\nOverall, gender representation varied starkly depending on the branch of engineering. While female postgraduates outnumbered their male counterparts in Biomedical and Environmental Engineering, male students held a substantial majority in Software & AI and Mechanical Engineering.\n\nIn Biomedical Engineering, female enrollment reached 18,000, exceeding male enrollment (14,000) by 4,000 students. Similarly, Environmental Engineering achieved near gender parity with a slight female lead of 16,000 compared with 15,000 men.\n\nConversely, Software & AI recorded the largest total student cohort overall but exhibited a pronounced gender gap, with 32,000 male postgraduates—more than double the 14,000 female students. The disparity was most acute in Mechanical Engineering, where men numbered 26,000 against just 6,000 women, representing a ratio of more than four to one.'
  },

  {
    id: 'write-t2-universal-basic-income-automation',
    section: 'writing',
    subMode: 'task2',
    taskType: 'Academic Writing Task 2 — Opinion Essay (Agree / Disagree)',
    topic: 'Macroeconomics, Automation & Social Welfare',
    title: 'Task 2: Universal Basic Income in an Age of AI and Robotics',
    targetWords: 180,
    instructions:
      'Spend about 15 minutes crafting an Academic Task 2 response (target 180–250 words). State a clear position in your introduction and support it with analytical body paragraphs.',
    prompt:
      'As artificial intelligence and industrial robotics automate an increasing proportion of routine white-collar and manufacturing jobs, some economists argue that governments should introduce a Universal Basic Income (an unconditional monthly payment to every adult citizen).\n\nTo what extent do you agree or disagree with this proposal?',
    chartSpec: null,
    modelAnswer:
      'The rapid deployment of generative artificial intelligence and autonomous robotics threatens to decouple corporate productivity from human employment. Nevertheless, I largely disagree with the implementation of an unconditional Universal Basic Income (UBI), as targeted retraining stipends and negative income taxes offer a far more fiscally sustainable safety net.\n\nProponents of UBI rightly observe that algorithmic automation differs from past industrial revolutions by displacing cognitive and administrative roles alongside manual labor. An unconditional cash floor would eliminate bureaucratic welfare stigma and provide displaced workers with immediate liquidity during career transitions.\n\nHowever, distributing an identical monthly stipend to every adult citizen—including affluent households who do not need state assistance—entails astronomical fiscal expenditure. Financing a meaningful UBI would require either punitive marginal tax rates or deep cuts to targeted public goods such as subsidized childcare, vocational universities, and public healthcare. Furthermore, work provides not merely income, but social integration and civic purpose; a passive cash transfer does little to equip displaced bookkeepers or assembly-line technicians with the technical skills demanded by the green and digital economies.\n\nIn conclusion, while automation necessitates a modernized welfare state, governments should reject a blanket UBI in favor of conditional reskilling grants and wage subsidies linked to lifelong education.'
  },

  {
    id: 'write-t2-plastic-packaging-producer-responsibility',
    section: 'writing',
    subMode: 'task2',
    taskType: 'Academic Writing Task 2 — Problem & Solution Essay',
    topic: 'Environmental Policy & Industrial Regulation',
    title: 'Task 2: Curbing Single-Use Plastic Packaging Waste',
    targetWords: 180,
    instructions:
      'Spend about 15 minutes crafting an Academic Task 2 response (target 180–250 words). Address both questions in the prompt equally.',
    prompt:
      'Despite decades of public recycling campaigns, global production and disposal of single-use plastic packaging continue to rise rapidly.\n\nWhy have consumer awareness campaigns failed to solve this problem, and what regulatory measures should governments introduce instead?',
    chartSpec: null,
    modelAnswer:
      'Notwithstanding widespread environmental awareness, municipal landfills and marine ecosystems remain inundated with disposable plastic packaging. This persistence stems from the structural limitations of consumer-side recycling, and it can only be resolved by shifting legal and financial liability onto packaging manufacturers.\n\nPublic awareness campaigns have faltered primarily because ordinary shoppers rarely have viable plastic-free alternatives at the point of sale. In modern supermarkets, virtually all fresh produce, beverages, and household staples are encased in multi-layer polymer films engineered for shelf appeal rather than recyclability. Even when conscientious citizens sort their household waste, chemical incompatibilities between polyethylene, polypropylene, and colored additives mean that less than ten percent of collected plastic is economically reprocessed.\n\nTo reverse this trend, governments must enact stringent Extended Producer Responsibility (EPR) legislation. First, regulators should levy a graduated virgin-polymer tax on manufacturers based on the lifecycle recyclability of their packaging, making standardized glass, aluminum, or mono-material PET cheaper than complex composite plastics. Second, nationwide container-deposit return schemes—modeled on Scandinavian systems that achieve ninety-percent return rates—should be mandated for all beverage retailers.\n\nIn conclusion, consumer moralizing cannot overcome industrial design flaws. Binding producer taxes and deposit-return infrastructure are essential to eliminate single-use plastic waste at its source.'
  },

  {
    id: 'write-t2-remote-work-urban-decentralization',
    section: 'writing',
    subMode: 'task2',
    taskType: 'Academic Writing Task 2 — Advantages vs. Disadvantages Essay',
    topic: 'Urban Planning, Telework & Regional Economics',
    title: 'Task 2: Remote Knowledge Work and the Decentralization of Capital Cities',
    targetWords: 180,
    instructions:
      'Spend about 15 minutes crafting an Academic Task 2 response (target 180–250 words). Weigh both sides explicitly before reaching a clear judgement.',
    prompt:
      'High-speed broadband and cloud collaboration tools have enabled millions of white-collar professionals to work remotely from smaller towns rather than commuting daily into major capital cities.\n\nDo the advantages of this urban decentralization outweigh the disadvantages?',
    chartSpec: null,
    modelAnswer:
      'The normalization of remote and hybrid work has catalyzed a demographic shift away from hyper-dense metropolitan cores toward secondary towns and rural regions. Although this transition poses temporary fiscal challenges for downtown commercial landlords, I contend that its socioeconomic and environmental advantages far outweigh the drawbacks.\n\nAdmittedly, the hollowing out of central business districts carries real economic friction. Service workers in metropolitan sandwich shops, dry cleaners, and municipal transit networks suffer reduced footfall when office towers remain half-empty from Monday to Friday. Moreover, junior employees working exclusively from home may miss out on the spontaneous mentorship and tacit knowledge transfer that occur in shared physical offices.\n\nNevertheless, these transitional costs are dwarfed by the systemic benefits of geographic decentralization. For decades, the over-concentration of high-paying jobs in a handful of mega-cities inflated metropolitan housing prices to unsustainable levels while draining smaller regional towns of young talent and tax revenue. Remote work redistributes purchasing power into regional economies, revitalizes local high streets, and eliminates millions of hours of unproductive, carbon-intensive daily commuting.\n\nIn conclusion, while urban centers must adapt by converting surplus office blocks into residential apartments, the geographic democratization of employment is an overwhelmingly positive development.'
  },

  // ========================================================================
  // ADDITIONAL LISTENING TASKS (7 Workouts = 49 Questions)
  // ========================================================================
  {
    id: 'listen-p3-bioplastics-seaweed-packaging',
    section: 'listening',
    taskType: 'Part 3 Academic Tutorial + Note Completion & MCQ',
    topic: 'Polymer Chemistry & Sustainable Packaging',
    title: 'Section 3: Tutorial on Seaweed Alginate Packaging Films',
    instructions:
      'Listen to the chemical engineering tutorial between Dr. Nair and two undergraduate students (Elena and Sam). Complete Questions 1–7. Write ONE WORD AND/OR A NUMBER for Questions 1–4.',
    script: [
      {
        speaker: 'Dr. Nair',
        pitch: 0.94,
        rate: 0.97,
        text: 'Elena, Sam—let’s review the tensile strength results for your biodegradable food-packaging film extracted from brown kelp.'
      },
      {
        speaker: 'Elena',
        pitch: 1.12,
        rate: 1.0,
        text: 'Sure, Dr. Nair. Unlike corn-starch bioplastics—which require arable farmland and fresh water—brown kelp grows up to 45 centimeters per day in coastal waters without any fertilizer.'
      },
      {
        speaker: 'Sam',
        pitch: 0.98,
        rate: 1.0,
        text: 'When we extracted the sodium alginate polymer and cast it into thin sheets, the initial film was too brittle. So we added vegetable glycerol as a natural plasticizer, which made the film flexible enough to wrap dried pasta and coffee.'
      },
      {
        speaker: 'Dr. Nair',
        pitch: 0.94,
        rate: 0.97,
        text: 'And how did you solve the moisture-barrier problem? Alginate films usually dissolve too quickly in humid air.'
      },
      {
        speaker: 'Elena',
        pitch: 1.12,
        rate: 1.0,
        text: 'We cross-linked the polymer chains by dipping the dried sheets into a bath of calcium chloride for 90 seconds, then coated the outer surface with a microscopic layer of beeswax.'
      },
      {
        speaker: 'Sam',
        pitch: 0.98,
        rate: 1.0,
        text: 'In our soil-burial test, the finished film decomposed completely within 6 weeks at ambient garden temperatures, whereas conventional polylactic acid (PLA) requires industrial composting at 60 degrees Celsius.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Lab Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Brown kelp can grow up to ________ centimeters per day without fertilizer.',
        answer: '45',
        acceptableAnswers: ['45', 'forty-five'],
        explanation: 'Elena states: "brown kelp grows up to 45 centimeters per day in coastal waters."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Lab Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'To stop the alginate film from being brittle, the students added vegetable ________.',
        answer: 'glycerol',
        acceptableAnswers: ['glycerol'],
        explanation: 'Sam explains: "we added vegetable glycerol as a natural plasticizer, which made the film flexible."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Lab Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'The outer surface of the film was waterproofed with a thin coating of ________.',
        answer: 'beeswax',
        acceptableAnswers: ['beeswax', 'wax'],
        explanation: 'Elena states: "...coated the outer surface with a microscopic layer of beeswax."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Lab Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'In ordinary garden soil, the seaweed film broke down completely in ________ weeks.',
        answer: '6',
        acceptableAnswers: ['6', 'six'],
        explanation: 'Sam reports: "the finished film decomposed completely within 6 weeks at ambient garden temperatures."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'What advantage does brown kelp have over corn-starch bioplastics?',
        options: [
          'A) It does not require agricultural land or freshwater irrigation.',
          'B) It can withstand temperatures above 500 degrees Celsius.',
          'C) It is naturally magnetic.',
          'D) It is harvested from desert shrubs.'
        ],
        answer: 'A) It does not require agricultural land or freshwater irrigation.',
        explanation: 'Elena contrasts corn-starch (which requires arable farmland and freshwater) with marine kelp.'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Why did the students dip the alginate sheets into calcium chloride for 90 seconds?',
        options: [
          'A) To bleach the film bright white',
          'B) To cross-link the polymer chains and resist humidity',
          'C) To remove salt from the seaweed',
          'D) To make the packaging taste sweet'
        ],
        answer: 'B) To cross-link the polymer chains and resist humidity',
        explanation: 'Elena explains they cross-linked the polymer chains in calcium chloride to solve the moisture-barrier problem.'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'What is a limitation of conventional PLA bioplastic mentioned by Sam?',
        options: [
          'A) It releases toxic chlorine gas in sunlight.',
          'B) It requires high-temperature industrial composting (60°C) to break down.',
          'C) It cannot hold dry foods like pasta.',
          'D) It dissolves instantly in cold water.'
        ],
        answer: 'B) It requires high-temperature industrial composting (60°C) to break down.',
        explanation: 'Sam notes that "conventional polylactic acid (PLA) requires industrial composting at 60 degrees Celsius."'
      }
    ]
  },

  {
    id: 'listen-p4-history-of-salt-preservation',
    section: 'listening',
    taskType: 'Part 4 University Lecture + Note Completion & MCQ',
    topic: 'Economic History & Food Preservation',
    title: 'Section 4: Halite Economies — How Salt Shaped Ancient States',
    instructions:
      'Listen to the economic history lecture on salt production and taxation and complete Questions 1–7. Write ONE WORD ONLY for Questions 1–4.',
    script: [
      {
        speaker: 'Prof. Sterling',
        pitch: 0.9,
        rate: 0.96,
        text: 'Welcome to today’s lecture on commodity history. Before the invention of mechanical refrigeration in the nineteenth century, sodium chloride—or common salt—was the strategic mineral that enabled settled agriculture, long-distance naval voyages, and standing armies.'
      },
      {
        speaker: 'Prof. Sterling',
        pitch: 0.9,
        rate: 0.96,
        text: 'While hunter-gatherers obtained sufficient sodium from raw meat, cereal-farming societies consuming wheat, rice, or millet required supplemental salt, and relied on osmotic dehydration to preserve autumn harvests of fish and pork through the winter.'
      },
      {
        speaker: 'Prof. Sterling',
        pitch: 0.9,
        rate: 0.96,
        text: 'Because salt was universally essential, difficult to smuggle in bulk, and concentrated in specific coastal lagoons or underground mines, ancient empires quickly recognized it as the ideal target for state monopoly taxation. In 119 BCE, China’s Han Dynasty nationalized salt iron foundries and brine wells to finance campaigns along the northern frontier.'
      },
      {
        speaker: 'Prof. Sterling',
        pitch: 0.9,
        rate: 0.96,
        text: 'In medieval Venice, the republic subsidized merchants who imported coarse sea salt from Cyprus and Ibiza, enabling Venetian ships to undercut Genoese rivals and dominate the lucrative Adriatic herring and cheese trade.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'Hunter-gatherers did not need extra salt because their diet of ________ provided enough sodium.',
        answer: 'meat',
        acceptableAnswers: ['meat'],
        explanation: 'The lecturer states: "While hunter-gatherers obtained sufficient sodium from raw meat..."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'Farming communities used salt dehydration to preserve pork and ________ for the winter months.',
        answer: 'fish',
        acceptableAnswers: ['fish'],
        explanation: 'The lecturer mentions preserving "autumn harvests of fish and pork through the winter."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'In 119 BCE, the Han Dynasty nationalized iron foundries and salt ________ wells.',
        answer: 'brine',
        acceptableAnswers: ['brine'],
        explanation: 'The lecturer notes: "China’s Han Dynasty nationalized salt iron foundries and brine wells."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'Venice paid subsidies to ________ who brought coarse sea salt from Mediterranean islands.',
        answer: 'merchants',
        acceptableAnswers: ['merchants', 'traders'],
        explanation: 'The lecturer states: "the republic subsidized merchants who imported coarse sea salt from Cyprus and Ibiza."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Why did cereal-farming populations need to add salt to their diet?',
        options: [
          'A) Grains like wheat, rice, and millet naturally contain very little sodium.',
          'B) Salt neutralized arsenic in river water.',
          'C) Salt made clay cooking pots stronger.',
          'D) Emperors required citizens to drink salted tea.'
        ],
        answer: 'A) Grains like wheat, rice, and millet naturally contain very little sodium.',
        explanation: 'The lecture contrasts meat-eating hunter-gatherers with cereal-farming societies consuming wheat, rice, or millet who required supplemental salt.'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Why was salt such an attractive commodity for ancient governments to tax?',
        options: [
          'A) Only wealthy aristocrats bought salt.',
          'B) Everyone needed it, and its production sites were geographically concentrated and easy to monitor.',
          'C) It could be synthesized in any household kitchen.',
          'D) Foreign ambassadors paid their tributes in salt.'
        ],
        answer: 'B) Everyone needed it, and its production sites were geographically concentrated and easy to monitor.',
        explanation: 'The lecturer explains that salt was "universally essential, difficult to smuggle in bulk, and concentrated in specific coastal lagoons or underground mines."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'What did the Han Dynasty use its salt monopoly revenues to fund in 119 BCE?',
        options: [
          'A) Maritime expeditions to Cyprus',
          'B) Defense campaigns along the northern frontier',
          'C) The construction of mechanical refrigerators',
          'D) Public libraries in southern ports'
        ],
        answer: 'B) Defense campaigns along the northern frontier',
        explanation: 'The lecturer states the Han Dynasty nationalized salt and iron "to finance campaigns along the northern frontier."'
      }
    ]
  },

  {
    id: 'listen-p3-museum-visitor-eye-tracking',
    section: 'listening',
    taskType: 'Part 3 Academic Seminar + Note Completion & MCQ',
    topic: 'Museum Studies & Cognitive Psychology',
    title: 'Section 3: Eye-Tracking Study of Art Gallery Visitors',
    instructions:
      'Listen to the museum curation seminar between Dr. Clara Finch and two postgraduate students (Owen and Nadia). Complete Questions 1–7. Write ONE WORD AND/OR A NUMBER for Questions 1–4.',
    script: [
      {
        speaker: 'Dr. Finch',
        pitch: 1.04,
        rate: 0.97,
        text: 'Owen, Nadia—let’s examine the mobile eye-tracking data you gathered from 120 visitors at the National Portrait Gallery.'
      },
      {
        speaker: 'Owen',
        pitch: 0.95,
        rate: 1.0,
        text: 'The results really challenged curator assumptions, Dr. Finch. Curators usually assume visitors spend at least two minutes contemplating a major oil painting, but our infrared glasses showed the median viewing time per canvas was just 17 seconds.'
      },
      {
        speaker: 'Nadia',
        pitch: 1.12,
        rate: 1.0,
        text: 'Even more surprising, visitors spent 40 percent of those 17 seconds reading the wall plaque next to the frame rather than looking at the brushwork itself.'
      },
      {
        speaker: 'Dr. Finch',
        pitch: 1.04,
        rate: 0.97,
        text: 'Did changing the layout of the exhibition room alter that behavior?'
      },
      {
        speaker: 'Owen',
        pitch: 0.95,
        rate: 1.0,
        text: 'Yes. In Room B, we reduced the number of paintings on each wall from twelve to five and placed an upholstered wooden bench in the center. Average gaze duration jumped to 48 seconds.'
      },
      {
        speaker: 'Nadia',
        pitch: 1.12,
        rate: 1.0,
        text: 'We also rewrote the wall labels to start with an intriguing question—such as why the sitter’s hands were hidden—which prompted visitors to scan back and forth between the text and the portrait’s background details.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Research Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'In the initial gallery layout, the median time visitors spent looking at each painting was only ________ seconds.',
        answer: '17',
        acceptableAnswers: ['17', 'seventeen'],
        explanation: 'Owen states: "the median viewing time per canvas was just 17 seconds."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Research Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Visitors spent 40% of their viewing time reading the wall ________ beside the frame.',
        answer: 'plaque',
        acceptableAnswers: ['plaque', 'label', 'labels'],
        explanation: 'Nadia notes: "visitors spent 40 percent of those 17 seconds reading the wall plaque next to the frame."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Research Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'In Room B, viewing time increased after the students added a wooden ________ in the middle of the room.',
        answer: 'bench',
        acceptableAnswers: ['bench', 'seat'],
        explanation: 'Owen explains they "placed an upholstered wooden bench in the center. Average gaze duration jumped to 48 seconds."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Research Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Rewritten labels began with a ________ to encourage visitors to inspect the painting more closely.',
        answer: 'question',
        acceptableAnswers: ['question'],
        explanation: 'Nadia says: "We also rewrote the wall labels to start with an intriguing question..."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'How many gallery visitors participated in Owen and Nadia’s eye-tracking study?',
        options: [
          'A) 17 visitors',
          'B) 40 visitors',
          'C) 48 visitors',
          'D) 120 visitors'
        ],
        answer: 'D) 120 visitors',
        explanation: 'Dr. Finch opens by referencing "the mobile eye-tracking data you gathered from 120 visitors."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'How did the students reduce visual crowding on the walls of Room B?',
        options: [
          'A) By dimming the ceiling spotlights',
          'B) By cutting the number of paintings per wall from twelve to five',
          'C) By removing all golden picture frames',
          'D) By painting the walls bright yellow'
        ],
        answer: 'B) By cutting the number of paintings per wall from twelve to five',
        explanation: 'Owen states: "In Room B, we reduced the number of paintings on each wall from twelve to five."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'What effect did the revised wall labels have on visitor eye movements?',
        options: [
          'A) Visitors ignored the labels completely.',
          'B) Visitors looked repeatedly back and forth between the text and details in the painting.',
          'C) Visitors walked through the room twice as fast.',
          'D) Visitors only looked at the artist’s signature.'
        ],
        answer: 'B) Visitors looked repeatedly back and forth between the text and details in the painting.',
        explanation: 'Nadia notes that starting with a question "prompted visitors to scan back and forth between the text and the portrait’s background details."'
      }
    ]
  },

  {
    id: 'listen-p4-biomimicry-kingfisher-aerodynamics',
    section: 'listening',
    taskType: 'Part 4 University Lecture + Note Completion & MCQ',
    topic: 'Biomimetic Engineering & Industrial Design',
    title: 'Section 4: Biomimicry in High-Speed Rail and Passive Architecture',
    instructions:
      'Listen to the engineering lecture on biomimicry and answer Questions 1–7. Write ONE WORD ONLY for Questions 1–4.',
    script: [
      {
        speaker: 'Prof. Takahashi',
        pitch: 0.92,
        rate: 0.96,
        text: 'Good morning. Biomimicry is the practice of emulating biological structures evolved over millions of years to solve complex human engineering problems. A classic example occurred in Japan during the 1990s with the 500-Series Shinkansen bullet train.'
      },
      {
        speaker: 'Prof. Takahashi',
        pitch: 0.92,
        rate: 0.96,
        text: 'When trains entered narrow mountain tunnels at 300 kilometers per hour, they compressed air waves ahead of the locomotive like a piston, producing a deafening sonic boom at the tunnel exit that disturbed residents 400 meters away.'
      },
      {
        speaker: 'Prof. Takahashi',
        pitch: 0.92,
        rate: 0.96,
        text: 'Chief engineer Eiji Nakatsu, an avid birdwatcher, modeled the train’s 15-meter nose cone on the wedge-shaped beak of the common kingfisher, which dives from low-density air into high-density water with almost zero splash. The redesigned nose eliminated the tunnel boom and reduced train electricity consumption by 15 percent.'
      },
      {
        speaker: 'Prof. Takahashi',
        pitch: 0.92,
        rate: 0.96,
        text: 'Similarly, in Harare, Zimbabwe, architect Mick Pearce designed the Eastgate Centre office complex by studying subterranean termite mounds, which maintain a constant internal temperature of 30 degrees Celsius to cultivate fungus gardens. Using passive masonry chimneys that draw in cool night air, the building operates without conventional air-conditioning.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'High-speed trains entering narrow ________ compressed air ahead of them, causing loud sonic booms.',
        answer: 'tunnels',
        acceptableAnswers: ['tunnels', 'tunnel'],
        explanation: 'The lecturer explains: "When trains entered narrow mountain tunnels at 300 kilometers per hour, they compressed air waves..."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'The bullet train’s nose cone was modeled on the beak of a diving ________.',
        answer: 'kingfisher',
        acceptableAnswers: ['kingfisher'],
        explanation: 'The lecturer states that Eiji Nakatsu "modeled the train’s 15-meter nose cone on the wedge-shaped beak of the common kingfisher."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'African termites regulate mound temperatures to grow underground ________ gardens.',
        answer: 'fungus',
        acceptableAnswers: ['fungus', 'fungi'],
        explanation: 'The lecturer notes that termite mounds maintain a constant 30°C "to cultivate fungus gardens."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'The Eastgate Centre uses passive masonry ________ to circulate cool night air through the building.',
        answer: 'chimneys',
        acceptableAnswers: ['chimneys', 'chimney'],
        explanation: 'The lecturer states: "Using passive masonry chimneys that draw in cool night air, the building operates without conventional air-conditioning."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Besides eliminating tunnel sonic booms, what secondary benefit did the kingfisher nose cone achieve?',
        options: [
          'A) It doubled passenger seating capacity.',
          'B) It reduced the train’s electricity usage by 15 percent.',
          'C) It allowed the train to run on diesel fuel.',
          'D) It shortened braking distances in snow.'
        ],
        answer: 'B) It reduced the train’s electricity usage by 15 percent.',
        explanation: 'The lecturer states: "The redesigned nose eliminated the tunnel boom and reduced train electricity consumption by 15 percent."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Why is the kingfisher’s beak shape relevant to high-speed trains entering tunnels?',
        options: [
          'A) Both involve moving rapidly from a low-density fluid (air) into a higher-resistance medium.',
          'B) Kingfishers fly at 300 kilometers per hour.',
          'C) Kingfisher feathers absorb loud sound waves.',
          'D) Both rely on magnetic levitation.'
        ],
        answer: 'A) Both involve moving rapidly from a low-density fluid (air) into a higher-resistance medium.',
        explanation: 'The lecturer explains the kingfisher dives "from low-density air into high-density water with almost zero splash," analogous to entering compressed tunnel air.'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'What is the main engineering achievement of the Eastgate Centre in Harare?',
        options: [
          'A) It is built entirely out of recycled glass.',
          'B) It regulates indoor temperature passively without conventional air-conditioning.',
          'C) It floats on an artificial lake.',
          'D) It generates electricity from wind turbines on the roof.'
        ],
        answer: 'B) It regulates indoor temperature passively without conventional air-conditioning.',
        explanation: 'The lecture concludes that the Eastgate Centre "operates without conventional air-conditioning" by drawing in cool night air.'
      }
    ]
  },

  {
    id: 'listen-p3-glacier-microbiome-fieldwork',
    section: 'listening',
    taskType: 'Part 3 Academic Tutorial + Note Completion & MCQ',
    topic: 'Glaciology & Extremophile Microbiology',
    title: 'Section 3: Fieldwork Planning for Svalbard Cryoconite Holes',
    instructions:
      'Listen to the polar fieldwork tutorial between Dr. Lindholm and two microbiology students (Freya and Callum). Complete Questions 1–7. Write ONE WORD AND/OR A NUMBER for Questions 1–4.',
    script: [
      {
        speaker: 'Dr. Lindholm',
        pitch: 0.91,
        rate: 0.97,
        text: 'Freya, Callum—since we fly to Longyearbyen in Svalbard next Tuesday, let’s finalize your sampling protocol for the glacier cryoconite holes.'
      },
      {
        speaker: 'Freya',
        pitch: 1.11,
        rate: 1.0,
        text: 'Everything is packed, Dr. Lindholm. For the introductory section of our report, we’ve explained how windblown dark dust and soot settle on the glacier surface, absorb solar radiation, and melt cylindrical water-filled pits into the ice.'
      },
      {
        speaker: 'Callum',
        pitch: 0.98,
        rate: 1.0,
        text: 'And inside those miniature meltwater pools, filamentous cyanobacteria bind the mineral dust into dark granules, lowering the glacier’s surface reflectivity—or albedo—and accelerating summer ice melt.'
      },
      {
        speaker: 'Dr. Lindholm',
        pitch: 0.91,
        rate: 0.97,
        text: 'Good. How are you extracting the sediment granules without contaminating the DNA samples?'
      },
      {
        speaker: 'Freya',
        pitch: 1.11,
        rate: 1.0,
        text: 'Metal corers freeze onto the ice walls, so we are using sterilized polycarbonate syringes to aspirate the basal sediment from 30 separate holes along an altitude transect.'
      },
      {
        speaker: 'Callum',
        pitch: 0.98,
        rate: 1.0,
        text: 'Once extracted, we’ll preserve the vials immediately in liquid nitrogen so the tardigrades and rotifers inside the granules don’t degrade before RNA sequencing in Oslo.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Fieldwork Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Dark granules inside cryoconite holes lower the glacier’s surface ________, speeding up melting.',
        answer: 'albedo',
        acceptableAnswers: ['albedo', 'reflectivity'],
        explanation: 'Callum states: "...lowering the glacier’s surface reflectivity—or albedo—and accelerating summer ice melt."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Fieldwork Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Instead of metal corers, the students will use sterilized polycarbonate ________ to collect sediment.',
        answer: 'syringes',
        acceptableAnswers: ['syringes', 'syringe'],
        explanation: 'Freya explains: "we are using sterilized polycarbonate syringes to aspirate the basal sediment."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Fieldwork Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Samples will be collected from ________ separate cryoconite holes along an altitude transect.',
        answer: '30',
        acceptableAnswers: ['30', 'thirty'],
        explanation: 'Freya specifies collecting sediment "from 30 separate holes along an altitude transect."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Fieldwork Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Sample vials will be frozen immediately in liquid ________ for transport to the laboratory.',
        answer: 'nitrogen',
        acceptableAnswers: ['nitrogen'],
        explanation: 'Callum states: "we’ll preserve the vials immediately in liquid nitrogen."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'How do cryoconite holes initially form on a glacier?',
        options: [
          'A) Polar bears dig holes to find water.',
          'B) Dark windblown dust absorbs sunlight and melts cylindrical pits into the ice.',
          'C) Volcanic geysers melt the ice from underneath.',
          'D) Heavy rain drills holes through snowdrifts.'
        ],
        answer: 'B) Dark windblown dust absorbs sunlight and melts cylindrical pits into the ice.',
        explanation: 'Freya explains that "windblown dark dust and soot settle on the glacier surface, absorb solar radiation, and melt cylindrical water-filled pits."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'What role do filamentous cyanobacteria play inside the cryoconite holes?',
        options: [
          'A) They glue mineral dust particles together into dark granules.',
          'B) They freeze the water into solid ice.',
          'C) They reflect 90% of sunlight back into space.',
          'D) They release methane gas that warms the air.'
        ],
        answer: 'A) They glue mineral dust particles together into dark granules.',
        explanation: 'Callum notes that "filamentous cyanobacteria bind the mineral dust into dark granules."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Why did the students decide against using metal coring tools?',
        options: [
          'A) Metal tools are too heavy for airline luggage limits.',
          'B) Metal corers stick and freeze onto the ice walls.',
          'C) Metal rusts in saltwater.',
          'D) Airport security prohibited metal tubes.'
        ],
        answer: 'B) Metal corers stick and freeze onto the ice walls.',
        explanation: 'Freya states: "Metal corers freeze onto the ice walls, so we are using sterilized polycarbonate syringes."'
      }
    ]
  },

  {
    id: 'listen-p4-vernacular-windcatcher-architecture',
    section: 'listening',
    taskType: 'Part 4 University Lecture + Note Completion & MCQ',
    topic: 'Vernacular Architecture & Desert Thermodynamics',
    title: 'Section 4: Persian Windcatchers (Badgirs) and Subterranean Qanats',
    instructions:
      'Listen to the architectural history lecture on passive desert cooling and complete Questions 1–7. Write ONE WORD ONLY for Questions 1–4.',
    script: [
      {
        speaker: 'Dr. Shirazi',
        pitch: 1.02,
        rate: 0.96,
        text: 'In the arid plateau cities of central Iran, such as Yazd, summer afternoon temperatures routinely exceed 45 degrees Celsius. Yet for over a thousand years, builders maintained comfortable indoor living spaces and even stored winter ice through mid-summer using zero fossil energy.'
      },
      {
        speaker: 'Dr. Shirazi',
        pitch: 1.02,
        rate: 0.96,
        text: 'The centerpiece of this vernacular engineering is the badgir, or windcatcher—a rectangular masonry tower rising above the courtyard roof with vertical vents facing the prevailing wind. Even when a gentle breeze blows across the top of the tower, positive pressure on the windward side pushes fresh air down into the basement living quarters, while negative suction on the leeward vents draws rising warm air out.'
      },
      {
        speaker: 'Dr. Shirazi',
        pitch: 1.02,
        rate: 0.96,
        text: 'To achieve evaporative cooling in bone-dry desert air, the windcatcher shaft is connected to a subterranean aqueduct known as a qanat, which channels snowmelt water from distant mountains through underground tunnels. As warm surface air is pulled across the cold underground stream, evaporation drops the air temperature by up to 15 degrees Celsius before it enters the house.'
      },
      {
        speaker: 'Dr. Shirazi',
        pitch: 1.02,
        rate: 0.96,
        text: 'Furthermore, traditional walls in Yazd are constructed from thick sun-dried mudbrick mixed with straw, providing high thermal mass that delays daytime heat penetration until after sunset.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'Ancient builders in Yazd could even preserve winter ________ through the middle of summer.',
        answer: 'ice',
        acceptableAnswers: ['ice'],
        explanation: 'The lecturer states: "builders maintained comfortable indoor living spaces and even stored winter ice through mid-summer."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'Fresh air is pushed down into the ________ living rooms while warm air is sucked out.',
        answer: 'basement',
        acceptableAnswers: ['basement', 'lower'],
        explanation: 'The lecturer notes that positive pressure "pushes fresh air down into the basement living quarters."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'Subterranean aqueducts (qanats) bring cold ________ water from distant mountains.',
        answer: 'snowmelt',
        acceptableAnswers: ['snowmelt', 'mountain'],
        explanation: 'The lecturer explains that a qanat "channels snowmelt water from distant mountains through underground tunnels."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Lecture Notes (ONE WORD ONLY)',
        type: 'fill',
        prompt: 'Thick walls made of mudbrick and ________ provide thermal mass to block daytime heat.',
        answer: 'straw',
        acceptableAnswers: ['straw'],
        explanation: 'The lecturer states that walls are "constructed from thick sun-dried mudbrick mixed with straw."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'How do the leeward vents (facing away from the wind) assist ventilation in a badgir tower?',
        options: [
          'A) They trap sandstorms inside a filter bag.',
          'B) Negative pressure creates suction that pulls rising warm indoor air out of the building.',
          'C) They collect rainwater for rooftop gardens.',
          'D) They reflect sunlight onto solar panels.'
        ],
        answer: 'B) Negative pressure creates suction that pulls rising warm indoor air out of the building.',
        explanation: 'The lecturer explains: "negative suction on the leeward vents draws rising warm air out."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'By how much can qanat evaporative cooling lower the temperature of incoming air?',
        options: [
          'A) Up to 5 degrees Celsius',
          'B) Up to 15 degrees Celsius',
          'C) Up to 30 degrees Celsius',
          'D) Up to 45 degrees Celsius'
        ],
        answer: 'B) Up to 15 degrees Celsius',
        explanation: 'The lecturer states: "evaporation drops the air temperature by up to 15 degrees Celsius before it enters the house."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Why is combining a windcatcher with an underground qanat effective in central Iran?',
        options: [
          'A) Because the desert air is extremely dry, allowing rapid evaporative cooling over the cold stream.',
          'B) Because underground water is boiling hot.',
          'C) Because qanats generate hydroelectric power for fans.',
          'D) Because wind never blows during the daytime in Yazd.'
        ],
        answer: 'A) Because the desert air is extremely dry, allowing rapid evaporative cooling over the cold stream.',
        explanation: 'The lecturer explains that in bone-dry desert air, pulling warm air across the cold underground stream triggers strong evaporative cooling.'
      }
    ]
  },

  {
    id: 'listen-p3-behavioral-nudges-cafeteria-waste',
    section: 'listening',
    taskType: 'Part 3 Academic Discussion + Note Completion & MCQ',
    topic: 'Behavioral Economics & Sustainability',
    title: 'Section 3: Field Experiment on University Cafeteria Food Waste',
    instructions:
      'Listen to the behavioral economics discussion between two postgraduate researchers (Lucas and Mei) and their supervisor Dr. Grant. Complete Questions 1–7. Write ONE WORD AND/OR A NUMBER for Questions 1–4.',
    script: [
      {
        speaker: 'Dr. Grant',
        pitch: 0.92,
        rate: 0.97,
        text: 'Lucas, Mei—you’ve just completed your six-week behavioral nudge experiment across the three campus dining halls. What did the baseline waste audit show?'
      },
      {
        speaker: 'Mei',
        pitch: 1.12,
        rate: 1.0,
        text: 'During Week One, Dr. Grant, students threw away an average of 145 grams of edible food per tray. In the buffet hall, people systematically overloaded their plates because of the "variety effect."'
      },
      {
        speaker: 'Lucas',
        pitch: 0.98,
        rate: 1.0,
        text: 'In Week Two, we tried placing educational posters near the entrance about global food scarcity, but plate waste barely moved—it dropped by less than 3 percent.'
      },
      {
        speaker: 'Dr. Grant',
        pitch: 0.92,
        rate: 0.97,
        text: 'Information campaigns rarely override automatic habits at lunchtime. What structural changes worked?'
      },
      {
        speaker: 'Mei',
        pitch: 1.12,
        rate: 1.0,
        text: 'Two simple choice-architecture tweaks made a massive difference. First, we eliminated plastic carrying trays altogether so students could only carry one plate and a glass in their hands. Second, we reduced the diameter of the ceramic dinner plates from 28 centimeters to 24 centimeters.'
      },
      {
        speaker: 'Lucas',
        pitch: 0.98,
        rate: 1.0,
        text: 'Because of the Delboeuf optical illusion, a 24-centimeter plate looks completely full with 25 percent less food. Across the final four weeks, total plate waste fell by 38 percent without any drop in student satisfaction surveys.'
      }
    ],
    questions: [
      {
        id: 'q1',
        group: 'Task A — Questions 1–4: Experiment Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'In Week One, students discarded an average of ________ grams of edible food per tray.',
        answer: '145',
        acceptableAnswers: ['145'],
        explanation: 'Mei reports: "During Week One... students threw away an average of 145 grams of edible food per tray."'
      },
      {
        id: 'q2',
        group: 'Task A — Questions 1–4: Experiment Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Educational ________ placed near the dining hall entrance reduced waste by less than 3%.',
        answer: 'posters',
        acceptableAnswers: ['posters', 'signs'],
        explanation: 'Lucas states: "In Week Two, we tried placing educational posters near the entrance... it dropped by less than 3 percent."'
      },
      {
        id: 'q3',
        group: 'Task A — Questions 1–4: Experiment Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'The researchers removed plastic carrying ________ so diners could only hold one plate and a drink.',
        answer: 'trays',
        acceptableAnswers: ['trays'],
        explanation: 'Mei states: "First, we eliminated plastic carrying trays altogether."'
      },
      {
        id: 'q4',
        group: 'Task A — Questions 1–4: Experiment Notes (ONE WORD AND/OR A NUMBER)',
        type: 'fill',
        prompt: 'Smaller 24-cm plates and tray removal cut total food waste by ________ percent.',
        answer: '38',
        acceptableAnswers: ['38', '38%', 'thirty-eight'],
        explanation: 'Lucas notes: "Across the final four weeks, total plate waste fell by 38 percent."'
      },
      {
        id: 'q5',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'Why did Dr. Grant say the Week Two poster campaign was ineffective?',
        options: [
          'A) The font size on the posters was too small.',
          'B) Passive information rarely changes automatic habits when people are hungry.',
          'C) Most students entered through the back door.',
          'D) The posters were written in technical jargon.'
        ],
        answer: 'B) Passive information rarely changes automatic habits when people are hungry.',
        explanation: 'Dr. Grant remarks: "Information campaigns rarely override automatic habits at lunchtime."'
      },
      {
        id: 'q6',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'How does the Delboeuf optical illusion help reduce food waste?',
        options: [
          'A) It makes vegetables look brighter under LED lights.',
          'B) A smaller plate makes a moderate portion of food appear visually abundant and full.',
          'C) It makes dessert trays harder to reach.',
          'D) It slows down the speed of the checkout line.'
        ],
        answer: 'B) A smaller plate makes a moderate portion of food appear visually abundant and full.',
        explanation: 'Lucas explains: "Because of the Delboeuf optical illusion, a 24-centimeter plate looks completely full with 25 percent less food."'
      },
      {
        id: 'q7',
        group: 'Task B — Questions 5–7: Multiple Choice',
        type: 'mcq',
        prompt: 'How did diners react to the smaller plates and removal of trays in satisfaction surveys?',
        options: [
          'A) Satisfaction scores remained unchanged.',
          'B) Half of the students boycotted the cafeteria.',
          'C) Students demanded a 20% discount on meal plans.',
          'D) Diners brought their own plastic trays from home.'
        ],
        answer: 'A) Satisfaction scores remained unchanged.',
        explanation: 'Lucas concludes that waste fell by 38% "without any drop in student satisfaction surveys."'
      }
    ]
  },

  // ========================================================================
  // ADDITIONAL SPEAKING TASKS (7 Complete 3-Part Workouts)
  // ========================================================================
  {
    id: 'speak-mentorship-encouragement-goals',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Part 1 + Cue Card + Part 3)',
    topic: 'Mentorship, Motivation & Personal Development',
    title: 'Speaking Workout: Mentorship & Achieving Ambitious Goals',
    instructions:
      'Complete all 3 parts of the IELTS Speaking workout. Record your voice (or type/edit your transcript) for AI Band scoring across Fluency, Lexical Resource, Grammar, and Pronunciation.',
    part1: [
      'When you are learning something new, do you prefer to figure it out alone or ask a mentor for guidance?',
      'Did you have a favorite teacher at school who influenced your academic interests?',
      'How do you usually celebrate when you finish a demanding exam or project?'
    ],
    part2: {
      topic: 'Describe a person (such as a teacher, colleague, or family member) who encouraged you to achieve a difficult goal.',
      bullets: [
        'Who this person is and how you know them',
        'What the difficult goal was that you were trying to achieve',
        'How this person supported, advised, or motivated you when you felt discouraged',
        'And explain why their encouragement made such a lasting difference to you.'
      ]
    },
    part3: [
      'Is intrinsic motivation (personal passion) always more effective than external rewards such as bonuses or grades?',
      'Why do some highly talented people struggle to become effective teachers or mentors to beginners?',
      'How has remote working affected the way experienced professionals mentor younger colleagues entering an industry?'
    ]
  },

  {
    id: 'speak-changing-opinion-critical-thinking',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Part 1 + Cue Card + Part 3)',
    topic: 'Critical Thinking, Evidence & Intellectual Humility',
    title: 'Speaking Workout: Revising Beliefs in Light of Evidence',
    instructions:
      'Record or transcribe your responses across Part 1, the Part 2 Cue Card, and Part 3. Use nuanced concession and contrast structures (e.g., "Whereas I had previously assumed...", "Upon closer scrutiny...").',
    part1: [
      'Do you enjoy debating current events or philosophical topics with friends?',
      'Where do you usually look when you want to read balanced perspectives on a controversial issue?',
      'Do you find it easy or difficult to admit when you have made a mistake?'
    ],
    part2: {
      topic: 'Describe an occasion when you changed your opinion about an important topic, book, or policy after learning new information.',
      bullets: [
        'What your original opinion was and why you held it',
        'How you encountered the new evidence, book, or conversation that challenged your view',
        'Why you decided to revise your viewpoint',
        'And explain how changing your mind affected your actions or perspective afterward.'
      ]
    },
    part3: [
      'Why do many people view a politician or public figure who changes their mind as weak rather than open-minded?',
      'In what ways do social media recommendation algorithms reinforce confirmation bias?',
      'How can secondary schools and universities teach students to evaluate conflicting evidence more objectively?'
    ]
  },

  {
    id: 'speak-public-law-civic-regulation',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Part 1 + Cue Card + Part 3)',
    topic: 'Law, Public Policy & Civic Responsibility',
    title: 'Speaking Workout: Effective Laws & Civic Order',
    instructions:
      'Complete Part 1, the Part 2 Cue Card, and Part 3. Aim for precise legal and policy vocabulary (e.g., "regulatory compliance", "deterrent effect", "public welfare").',
    part1: [
      'Are there any everyday rules at your workplace or university that you find particularly helpful?',
      'Do people in your city generally obey traffic and pedestrian rules?',
      'Would you ever consider a career in law, public policy, or urban administration?'
    ],
    part2: {
      topic: 'Describe a law or public regulation (such as an environmental rule, workplace right, or safety law) that you think has had a positive impact on your country.',
      bullets: [
        'What the law or regulation is and when it was introduced',
        'What problem it was designed to solve',
        'How ordinary citizens or businesses reacted when it first took effect',
        'And explain why you believe this law has improved quality of life.'
      ]
    },
    part3: [
      'When governments want citizens to adopt eco-friendly habits, are financial incentives more effective than strict fines?',
      'Why do some well-intentioned laws fail to achieve their objectives in practice?',
      'How can international law keep pace with borderless technologies such as biotechnology and artificial intelligence?'
    ]
  },

  {
    id: 'speak-natural-waterways-conservation',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Part 1 + Cue Card + Part 3)',
    topic: 'Hydrology, Coastal Geography & Ecotourism',
    title: 'Speaking Workout: Rivers, Coastlines & Water Conservation',
    instructions:
      'Complete all 3 parts of the speaking workout. Record your voice via microphone or type your full response.',
    part1: [
      'Do you prefer spending holidays near the ocean, by a mountain lake, or in a historic city?',
      'Did you learn to swim or take part in water sports when you were a child?',
      'Does your hometown have a river, canal, or coastline that residents use for recreation?'
    ],
    part2: {
      topic: 'Describe a river, lake, or coastal area that you have visited and found particularly memorable.',
      bullets: [
        'Where this body of water is located and with whom you visited it',
        'What the surrounding landscape and wildlife looked like',
        'What economic or recreational activities take place there',
        'And explain why this particular waterway left a strong impression on you.'
      ]
    },
    part3: [
      'How should governments balance the economic benefits of coastal tourism against the protection of fragile marine ecosystems?',
      'Why do major rivers that flow through multiple countries often become a source of diplomatic tension?',
      'Should water utilities charge industrial factories significantly higher rates per liter than domestic households?'
    ]
  },

  {
    id: 'speak-collaborative-teamwork-pressure',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Part 1 + Cue Card + Part 3)',
    topic: 'Organizational Psychology, Leadership & Teamwork',
    title: 'Speaking Workout: High-Pressure Collaboration & Leadership',
    instructions:
      'Complete Part 1, the Part 2 Cue Card, and Part 3. Use varied past tenses in Part 2 and abstract analytical conditionals in Part 3.',
    part1: [
      'When working on an assignment, do you prefer collaborating in a team or working independently?',
      'What role do you usually naturally take when you are placed in a group project?',
      'How do you handle situations where a teammate has a very different working style from yours?'
    ],
    part2: {
      topic: 'Describe a challenging project or task that you completed successfully as part of a team under a tight deadline.',
      bullets: [
        'What the objective of the project was and why the deadline was so tight',
        'Who your teammates were and how you divided the responsibilities',
        'What unexpected disagreement or obstacle arose during the work',
        'And explain how your team managed to deliver the project on time.'
      ]
    },
    part3: [
      'Why do some teams composed entirely of top individual experts perform worse than diverse teams with complementary skills?',
      'Is a flat organizational structure without managers realistic for large companies?',
      'To what extent should schools grade students on group cooperation rather than individual exam performance?'
    ]
  },

  {
    id: 'speak-financial-decisions-value',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Part 1 + Cue Card + Part 3)',
    topic: 'Behavioral Economics, Value & Financial Literacy',
    title: 'Speaking Workout: Smart Investments & Financial Literacy',
    instructions:
      'Complete all 3 parts of the speaking workout. Record your voice or type your full transcript.',
    part1: [
      'Do you prefer paying for everyday purchases with cash, card, or mobile payment apps?',
      'Are you the kind of person who researches reviews extensively before buying something, or do you decide quickly?',
      'Did your parents or school teach you how to manage a budget when you were growing up?'
    ],
    part2: {
      topic: 'Describe a purchase, course, or piece of equipment that cost a significant amount of money but proved to be a worthwhile investment.',
      bullets: [
        'What you spent the money on and how you saved or budgeted for it',
        'Why you hesitated or compared alternatives before making the decision',
        'How you have used this item or qualification since acquiring it',
        'And explain why you consider it one of the best value-for-money decisions you have made.'
      ]
    },
    part3: [
      'Has the shift toward cashless mobile payments made younger generations less aware of how much they spend?',
      'Should financial literacy—such as understanding compound interest, taxes, and inflation—be a mandatory subject in secondary schools?',
      'Why do people often derive more long-term satisfaction from spending money on experiences and education than on luxury material goods?'
    ]
  },

  {
    id: 'speak-traditional-festivals-modernity',
    section: 'speaking',
    taskType: 'Full 3-Part Speaking Mock (Part 1 + Cue Card + Part 3)',
    topic: 'Cultural Anthropology, Traditions & Globalization',
    title: 'Speaking Workout: Civic Traditions in a Globalized Era',
    instructions:
      'Complete all 3 parts of the speaking workout. Focus on lexical precision and coherent paragraphing of your spoken ideas.',
    part1: [
      'What is your favorite public holiday or seasonal celebration of the year?',
      'Are there any special traditional foods associated with celebrations in your region?',
      'Do you prefer celebrating holidays in a large public crowd or quietly at home with close family?'
    ],
    part2: {
      topic: 'Describe a traditional festival, ceremony, or custom in your country that has changed over recent decades.',
      bullets: [
        'What the tradition is and what its historical origins are',
        'How your grandparents’ generation used to observe it',
        'How younger people celebrate or adapt it today',
        'And explain whether you think these modern changes have enriched or weakened the tradition.'
      ]
    },
    part3: [
      'Why have many traditional harvest or seasonal festivals become heavily commercialized in modern cities?',
      'Does globalization inevitably lead to a uniform global culture, or can it also help revive local traditions?',
      'Why is it important for rapidly modernizing societies to preserve intangible cultural heritage such as folk music and regional crafts?'
    ]
  }
];
