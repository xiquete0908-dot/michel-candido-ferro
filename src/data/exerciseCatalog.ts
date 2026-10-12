import { CatalogExercise } from '../types';

export const EXERCISE_CATEGORIES = [
  "Todos",
  "Quadríceps",
  "Glúteos",
  "Posteriores",
  "Costas",
  "Peitoral",
  "Ombros",
  "Bíceps",
  "Tríceps",
  "Panturrilhas",
  "Abdômen & Core"
] as const;

export const POPULAR_EXERCISES_CATALOG: CatalogExercise[] = [
  // ---------- QUADRÍCEPS & PERNAS GERAIS ----------
  {
    id: "cat_leg_press_45",
    name: "Leg Press 45°",
    category: "Quadríceps",
    sets: 4,
    reps: "8–12",
    rest: "90–120s",
    equip: "Aparelho Leg Press 45° com anilhas.",
    video: "https://youtube.com/shorts/GRci51cuGgT",
    load: true
  },
  {
    id: "cat_cadeira_extensora",
    name: "Cadeira Extensora",
    category: "Quadríceps",
    sets: 4,
    reps: "10–15",
    rest: "60–90s",
    equip: "Máquina extensora com ajuste no tornozelo.",
    video: "https://youtube.com/shorts/HfHQM5qVY-Q",
    load: true
  },
  {
    id: "cat_agachamento_livre",
    name: "Agachamento Livre com Barra",
    category: "Quadríceps",
    sets: 4,
    reps: "8–10",
    rest: "120s",
    equip: "Barra olímpica com anilhas e trava.",
    video: "https://youtube.com/shorts/3n23n_p-Z9M",
    load: true
  },
  {
    id: "cat_agachamento_hack",
    name: "Agachamento no Hack Machine",
    category: "Quadríceps",
    sets: 4,
    reps: "8–12",
    rest: "90–120s",
    equip: "Aparelho Hack Machine.",
    video: "https://youtube.com/shorts/p4v1v3Fm8p4",
    load: true
  },
  {
    id: "cat_agachamento_goblet",
    name: "Agachamento Goblet",
    category: "Quadríceps",
    sets: 4,
    reps: "8–12",
    rest: "90–120s",
    equip: "Halter ou kettlebell segurado na frente do peito.",
    video: "https://youtube.com/shorts/XBsOmtbLlYQ",
    load: true
  },
  {
    id: "cat_afundo_passada",
    name: "Passada / Avanço com Halteres",
    category: "Quadríceps",
    sets: 3,
    reps: "10–12 por perna",
    rest: "90s",
    equip: "Par de halteres nas mãos.",
    video: "https://youtube.com/shorts/ZpIMkV6cf7c",
    load: true
  },
  {
    id: "cat_agachamento_smith",
    name: "Agachamento no Smith",
    category: "Quadríceps",
    sets: 4,
    reps: "8–12",
    rest: "90–120s",
    equip: "Máquina guiada Smith.",
    video: "https://youtube.com/shorts/7QcWq-W_E_8",
    load: true
  },
  {
    id: "cat_agachamento_bulgaro",
    name: "Agachamento Búlgaro",
    category: "Quadríceps",
    sets: 3,
    reps: "8–12 por perna",
    rest: "90–120s",
    equip: "Banco reto + par de halteres.",
    video: "https://youtube.com/shorts/ZpIMkV6cf7c",
    load: true
  },
  {
    id: "cat_step_up",
    name: "Step-up / Subida no Banco",
    category: "Quadríceps",
    sets: 3,
    reps: "10 por perna",
    rest: "60–90s",
    equip: "Caixa ou banco estável + carga opcional.",
    video: "https://youtube.com/shorts/87R7-PfGc0E",
    load: true
  },

  // ---------- GLÚTEOS ----------
  {
    id: "cat_hip_thrust",
    name: "Elevação Pélvica com Barra (Hip Thrust)",
    category: "Glúteos",
    sets: 4,
    reps: "8–12",
    rest: "90–120s",
    equip: "Banco reto com barra acolchoada sobre o quadril.",
    video: "https://youtube.com/shorts/uUuPYcK9SJI",
    load: true
  },
  {
    id: "cat_gluteo_polia",
    name: "Glúteo Coice na Polia Baixa",
    category: "Glúteos",
    sets: 3,
    reps: "10–15 por perna",
    rest: "60s",
    equip: "Tornezeleira conectada ao cabo da polia.",
    video: "https://youtube.com/shorts/7sQx6B8aZvw",
    load: true
  },
  {
    id: "cat_cadeira_abdutora",
    name: "Cadeira Abdutora",
    category: "Glúteos",
    sets: 4,
    reps: "12–15",
    rest: "60s",
    equip: "Máquina abdutora com tronco ligeiramente inclinado.",
    video: "https://youtube.com/shorts/8NWsDeYI7Og",
    load: true
  },
  {
    id: "cat_bulgaro_inclinado",
    name: "Búlgaro com Tronco Inclinado (Glúteos)",
    category: "Glúteos",
    sets: 3,
    reps: "8–12 por perna",
    rest: "90–120s",
    equip: "Banco e halteres com inclinação frontal do tronco.",
    video: "https://youtube.com/shorts/tWIof-DeJj4",
    load: true
  },
  {
    id: "cat_agachamento_sumo",
    name: "Agachamento Sumô com Halter",
    category: "Glúteos",
    sets: 4,
    reps: "8–12",
    rest: "90–120s",
    equip: "Halter pesado ou barra com base aberta.",
    video: "https://youtube.com/shorts/qRUa_H3um5I",
    load: true
  },
  {
    id: "cat_elevacao_pelvica_unilateral",
    name: "Elevação Pélvica Unilateral",
    category: "Glúteos",
    sets: 3,
    reps: "10–12 por perna",
    rest: "60s",
    equip: "Peso corporal ou halter sobre o quadril.",
    video: "https://youtube.com/shorts/eJD2kKndN4k",
    load: true
  },

  // ---------- POSTERIORES DE COXA ----------
  {
    id: "cat_stiff_barra",
    name: "Stiff com Barra (RDL)",
    category: "Posteriores",
    sets: 4,
    reps: "8–12",
    rest: "90–120s",
    equip: "Barra olímpica com anilhas.",
    video: "https://youtube.com/shorts/Y_WA8NbtsyQ",
    load: true
  },
  {
    id: "cat_mesa_flexora",
    name: "Mesa Flexora Deitada",
    category: "Posteriores",
    sets: 4,
    reps: "10–12",
    rest: "60–90s",
    equip: "Aparelho mesa flexora.",
    video: "https://youtube.com/shorts/FnQXfJ9H_ey",
    load: true
  },
  {
    id: "cat_cadeira_flexora",
    name: "Cadeira Flexora Sentada",
    category: "Posteriores",
    sets: 4,
    reps: "10–15",
    rest: "60–90s",
    equip: "Máquina flexora sentada com trava firme.",
    video: "https://youtube.com/shorts/WDMfjU8iTwk",
    load: true
  },
  {
    id: "cat_levantamento_terra",
    name: "Levantamento Terra (Deadlift)",
    category: "Posteriores",
    sets: 4,
    reps: "6–8",
    rest: "120s",
    equip: "Barra olímpica no chão com pegada firme.",
    video: "https://youtube.com/shorts/3n23n_p-Z9M",
    load: true
  },
  {
    id: "cat_stiff_unilateral",
    name: "Stiff Unilateral com Halter",
    category: "Posteriores",
    sets: 3,
    reps: "8–12 por perna",
    rest: "90s",
    equip: "Halter em uma das mãos para equilíbrio e foco.",
    video: "https://youtube.com/shorts/NvMPjt3Vqyw",
    load: true
  },
  {
    id: "cat_afundo_reverso",
    name: "Afundo Reverso",
    category: "Posteriores",
    sets: 3,
    reps: "10–12 por perna",
    rest: "90s",
    equip: "Halteres ou barra.",
    video: "https://youtube.com/shorts/QPI3CtIBqgg",
    load: true
  },

  // ---------- COSTAS & DORSAIS ----------
  {
    id: "cat_puxada_frontal",
    name: "Puxada Frontal Aberta (Pulley)",
    category: "Costas",
    sets: 4,
    reps: "8–12",
    rest: "90s",
    equip: "Máquina de puxada alta com barra longa.",
    video: "https://youtube.com/shorts/EWQ9v_BjipJ",
    load: true
  },
  {
    id: "cat_remada_curvada",
    name: "Remada Curvada com Barra",
    category: "Costas",
    sets: 4,
    reps: "8–12",
    rest: "90–120s",
    equip: "Barra com pegada pronada ou supinada.",
    video: "https://youtube.com/shorts/w_5jMzr3f8c",
    load: true
  },
  {
    id: "cat_remada_baixa",
    name: "Remada Baixa no Triângulo",
    category: "Costas",
    sets: 4,
    reps: "10–12",
    rest: "90s",
    equip: "Cabo baixo com puxador triângulo.",
    video: "https://youtube.com/shorts/VRoPX0c8k9Y",
    load: true
  },
  {
    id: "cat_remada_unilateral",
    name: "Remada Unilateral com Halter (Serrote)",
    category: "Costas",
    sets: 4,
    reps: "8–12 por braço",
    rest: "60–90s",
    equip: "Banco reto de apoio e halter pesado.",
    video: "https://youtube.com/shorts/VRoPX0c8k9Y",
    load: true
  },
  {
    id: "cat_barra_fixa",
    name: "Barra Fixa (Pull-up)",
    category: "Costas",
    sets: 3,
    reps: "6–10",
    rest: "90–120s",
    equip: "Barra fixa (pode usar elástico de assistência).",
    video: "https://youtube.com/shorts/Hkv0ls11y_c",
    load: false
  },
  {
    id: "cat_pulldown_corda",
    name: "Pulldown na Polia com Corda",
    category: "Costas",
    sets: 3,
    reps: "12–15",
    rest: "60s",
    equip: "Polia alta com corda ou barra reta.",
    video: "https://youtube.com/shorts/y3AHraZTrK6",
    load: true
  },

  // ---------- PEITORAL ----------
  {
    id: "cat_supino_reto_barra",
    name: "Supino Reto com Barra",
    category: "Peitoral",
    sets: 4,
    reps: "8–12",
    rest: "90–120s",
    equip: "Banco reto com barra olímpica e travas.",
    video: "https://youtube.com/shorts/Exa7LHErESs",
    load: true
  },
  {
    id: "cat_supino_inclinado_halteres",
    name: "Supino Inclinado com Halteres",
    category: "Peitoral",
    sets: 4,
    reps: "8–12",
    rest: "90s",
    equip: "Banco inclinado a 30°–45° + halteres.",
    video: "https://youtube.com/shorts/Ye5-fuRryec",
    load: true
  },
  {
    id: "cat_supino_reto_halteres",
    name: "Supino Reto com Halteres",
    category: "Peitoral",
    sets: 4,
    reps: "8–12",
    rest: "90s",
    equip: "Banco reto e par de halteres.",
    video: "https://youtube.com/shorts/Ye5-fuRryec",
    load: true
  },
  {
    id: "cat_crossover",
    name: "Crossover na Polia (Cabo)",
    category: "Peitoral",
    sets: 3,
    reps: "12–15",
    rest: "60s",
    equip: "Polia dupla com manoplas individuais.",
    video: "https://youtube.com/shorts/r-72m2lWq9E",
    load: true
  },
  {
    id: "cat_voador_peck_deck",
    name: "Voador / Peck Deck",
    category: "Peitoral",
    sets: 3,
    reps: "10–15",
    rest: "60s",
    equip: "Máquina Peck Deck / Voador peitoral.",
    video: "https://youtube.com/shorts/Exa7LHErESs",
    load: true
  },
  {
    id: "cat_flexao_solo",
    name: "Flexão de Braço no Solo",
    category: "Peitoral",
    sets: 3,
    reps: "8–15",
    rest: "60–90s",
    equip: "Peso corporal no chão ou apoio elevado.",
    video: "https://youtube.com/shorts/IED65msJZU4",
    load: false
  },

  // ---------- OMBROS & DELTOIDES ----------
  {
    id: "cat_elevacao_lateral_halteres",
    name: "Elevação Lateral com Halteres",
    category: "Ombros",
    sets: 4,
    reps: "12–15",
    rest: "60s",
    equip: "Par de halteres com movimento controlado.",
    video: "https://youtube.com/shorts/7q282CL_DSU",
    load: true
  },
  {
    id: "cat_desenvolvimento_halteres",
    name: "Desenvolvimento com Halteres",
    category: "Ombros",
    sets: 4,
    reps: "8–12",
    rest: "90s",
    equip: "Banco com encosto a 80° + halteres.",
    video: "https://youtube.com/shorts/0tkYjwEOoSs",
    load: true
  },
  {
    id: "cat_elevacao_lateral_polia",
    name: "Elevação Lateral na Polia",
    category: "Ombros",
    sets: 3,
    reps: "12–15 por braço",
    rest: "60s",
    equip: "Polia baixa com manopla.",
    video: "https://youtube.com/shorts/HCICbJMkj1-",
    load: true
  },
  {
    id: "cat_crucifixo_inverso",
    name: "Crucifixo Inverso com Halteres",
    category: "Ombros",
    sets: 4,
    reps: "12–15",
    rest: "60s",
    equip: "Halteres leves com tronco inclinado à frente.",
    video: "https://youtube.com/shorts/3Gjq7Q2UadA",
    load: true
  },
  {
    id: "cat_desenvolvimento_arnold",
    name: "Desenvolvimento Arnold",
    category: "Ombros",
    sets: 3,
    reps: "8–12",
    rest: "60–90s",
    equip: "Halteres com rotação controlada de punho.",
    video: "https://youtube.com/shorts/r5R77waZzVo",
    load: true
  },

  // ---------- BÍCEPS ----------
  {
    id: "cat_rosca_direta_barra",
    name: "Rosca Direta com Barra W / Reta",
    category: "Bíceps",
    sets: 4,
    reps: "8–12",
    rest: "60–90s",
    equip: "Barra W ou reta com anilhas.",
    video: "https://youtube.com/shorts/vDWPtEMrzeU",
    load: true
  },
  {
    id: "cat_rosca_martelo",
    name: "Rosca Martelo com Halteres",
    category: "Bíceps",
    sets: 3,
    reps: "10–12",
    rest: "60s",
    equip: "Halteres com pegada neutra.",
    video: "https://youtube.com/shorts/oBrWmkbJBeQ",
    load: true
  },
  {
    id: "cat_rosca_scott",
    name: "Rosca Scott na Máquina ou Banco",
    category: "Bíceps",
    sets: 3,
    reps: "10–12",
    rest: "60s",
    equip: "Banco Scott com barra W ou máquina.",
    video: "https://youtube.com/shorts/vDWPtEMrzeU",
    load: true
  },
  {
    id: "cat_rosca_alternada",
    name: "Rosca Alternada com Halteres",
    category: "Bíceps",
    sets: 3,
    reps: "10–12 por braço",
    rest: "60s",
    equip: "Par de halteres com rotação do punho na subida.",
    video: "https://youtube.com/shorts/vDWPtEMrzeU",
    load: true
  },

  // ---------- TRÍCEPS ----------
  {
    id: "cat_triceps_corda",
    name: "Tríceps Corda na Polia Alta",
    category: "Tríceps",
    sets: 4,
    reps: "10–15",
    rest: "60s",
    equip: "Polia alta com puxador de corda.",
    video: "https://youtube.com/shorts/AYqg9S5FrUU",
    load: true
  },
  {
    id: "cat_triceps_frances",
    name: "Tríceps Francês com Halter",
    category: "Tríceps",
    sets: 3,
    reps: "10–12",
    rest: "60s",
    equip: "Halter acima e atrás da cabeça com cotovelos fechados.",
    video: "https://youtube.com/shorts/AYqg9S5FrUU",
    load: true
  },
  {
    id: "cat_triceps_testa",
    name: "Tríceps Testa com Barra W",
    category: "Tríceps",
    sets: 3,
    reps: "10–12",
    rest: "60–90s",
    equip: "Banco reto com barra W acima da testa.",
    video: "https://youtube.com/shorts/AYqg9S5FrUU",
    load: true
  },
  {
    id: "cat_triceps_pulley_barra",
    name: "Tríceps Pulley com Barra Reta",
    category: "Tríceps",
    sets: 3,
    reps: "10–12",
    rest: "60s",
    equip: "Polia alta com barra reta ou V.",
    video: "https://youtube.com/shorts/AYqg9S5FrUU",
    load: true
  },

  // ---------- PANTURRILHAS ----------
  {
    id: "cat_panturrilha_pe",
    name: "Panturrilha em Pé na Máquina / Degrau",
    category: "Panturrilhas",
    sets: 4,
    reps: "12–20",
    rest: "60s",
    equip: "Degrau ou máquina com amplitude máxima.",
    video: "https://youtube.com/shorts/cTGdHPcWQKk",
    load: true
  },
  {
    id: "cat_panturrilha_sentada",
    name: "Panturrilha Sentada (Gêmeos Sentado)",
    category: "Panturrilhas",
    sets: 4,
    reps: "15–20",
    rest: "60s",
    equip: "Aparelho de panturrilha sentada.",
    video: "https://youtube.com/shorts/vtsVOys39lA",
    load: true
  },
  {
    id: "cat_panturrilha_leg_press",
    name: "Panturrilha no Leg Press 45°",
    category: "Panturrilhas",
    sets: 4,
    reps: "12–15",
    rest: "60s",
    equip: "Plataforma do Leg Press com a ponta dos pés.",
    video: "https://youtube.com/shorts/ltr9yAkP79Y",
    load: true
  },
  {
    id: "cat_panturrilha_unilateral",
    name: "Panturrilha Unilateral com Halter",
    category: "Panturrilhas",
    sets: 3,
    reps: "12–15 por perna",
    rest: "60s",
    equip: "Degrau com halter na mão do lado trabalhado.",
    video: "https://youtube.com/shorts/ltr9yAkP79Y",
    load: true
  },

  // ---------- ABDÔMEN & CORE ----------
  {
    id: "cat_prancha_isometrica",
    name: "Prancha Isométrica",
    category: "Abdômen & Core",
    sets: 3,
    reps: "30–60 segundos",
    rest: "60s",
    equip: "Peso corporal com alinhamento da coluna.",
    video: "https://youtube.com/shorts/sEw8EGZBC1w",
    load: false
  },
  {
    id: "cat_abdominal_supra",
    name: "Abdominal Supra no Solo",
    category: "Abdômen & Core",
    sets: 3,
    reps: "15–25",
    rest: "45–60s",
    equip: "Colchonete, focando na flexão torácica.",
    video: "https://youtube.com/shorts/htfn3L8Efw8",
    load: false
  },
  {
    id: "cat_dead_bug",
    name: "Dead Bug (Controle de Core)",
    category: "Abdômen & Core",
    sets: 3,
    reps: "10–12 por lado",
    rest: "60s",
    equip: "Colchonete no chão.",
    video: "https://youtube.com/shorts/htfn3L8Efw8",
    load: false
  },
  {
    id: "cat_prancha_lateral",
    name: "Prancha Lateral",
    category: "Abdômen & Core",
    sets: 3,
    reps: "25–45 segundos por lado",
    rest: "60s",
    equip: "Peso corporal no colchonete.",
    video: "https://youtube.com/shorts/pWGhRO5grqs",
    load: false
  }
];
