import { WorkoutDay } from '../types';

export const WORKOUTS: Record<string, WorkoutDay> = {
  seg: {
    key: "seg",
    label: "SEGUNDA-FEIRA",
    focus: "INFERIOR A",
    sub: "Glúteos + Quadríceps",
    ex: [
      {
        id: "seg1",
        name: "Agachamento Goblet",
        sets: 4,
        reps: "8–12",
        rest: "90–120s",
        equip: "Halter, galão ou mochila carregada.",
        video: "https://youtube.com/shorts/XBsOmtbLlYQ",
        load: true
      },
      {
        id: "seg2",
        name: "Afundo / Agachamento Búlgaro",
        sets: 3,
        reps: "8–12 por perna",
        rest: "90–120s",
        equip: "Cadeira firme + carga.",
        video: "https://youtube.com/shorts/ZpIMkV6cf7c",
        load: true
      },
      {
        id: "seg3",
        name: "Elevação Pélvica / Hip Thrust",
        sets: 4,
        reps: "10–15",
        rest: "90–120s",
        equip: "Costas apoiadas no sofá + carga sobre o quadril.",
        video: "https://youtube.com/shorts/uUuPYcK9SJI",
        load: true
      },
      {
        id: "seg4",
        name: "Step-up / Subida",
        sets: 3,
        reps: "10 por perna",
        rest: "60–90s",
        equip: "Superfície firme e segura.",
        video: "https://youtube.com/shorts/87R7-PfGc0E",
        load: true
      },
      {
        id: "seg5",
        name: "Panturrilha em Pé",
        sets: 4,
        reps: "12–20",
        rest: "60–90s",
        equip: "Peso corporal ou carga nas mãos.",
        video: "https://youtube.com/shorts/cTGdHPcWQKk",
        load: true
      },
      {
        id: "seg6",
        name: "Dead Bug",
        sets: 3,
        reps: "8–12 por lado",
        rest: "60s",
        equip: "Peso corporal, no chão.",
        video: "https://youtube.com/shorts/htfn3L8Efw8",
        load: false
      }
    ]
  },
  ter: {
    key: "ter",
    label: "TERÇA-FEIRA",
    focus: "SUPERIOR A",
    sub: "Costas + Peito + Ombros + Braços",
    ex: [
      {
        id: "ter1",
        name: "Remada Curvada",
        sets: 4,
        reps: "8–12",
        rest: "90–120s",
        equip: "Halteres, garrafas ou mochila carregada.",
        video: "https://youtube.com/shorts/w_5jMzr3f8c",
        load: true
      },
      {
        id: "ter2",
        name: "Flexão de Braço",
        sets: 3,
        reps: "6–12",
        rest: "90s",
        equip: "Progressão: apoio elevado → flexão convencional.",
        video: "https://youtube.com/shorts/IED65msJZU4",
        load: false
      },
      {
        id: "ter3",
        name: "Desenvolvimento de Ombros",
        sets: 3,
        reps: "8–12",
        rest: "60–90s",
        equip: "Halteres ou garrafas.",
        video: "https://youtube.com/shorts/0tkYjwEOoSs",
        load: true
      },
      {
        id: "ter4",
        name: "Elevação Lateral",
        sets: 3,
        reps: "12–15",
        rest: "60–90s",
        equip: "Halteres leves ou garrafas.",
        video: "https://youtube.com/shorts/7q282CL_DSU",
        load: true
      },
      {
        id: "ter5",
        name: "Rosca de Bíceps",
        sets: 3,
        reps: "10–15",
        rest: "60–90s",
        equip: "Halteres ou garrafas.",
        video: "https://youtube.com/shorts/vDWPtEMrzeU",
        load: true
      },
      {
        id: "ter6",
        name: "Tríceps Francês / Acima da Cabeça",
        sets: 3,
        reps: "10–15",
        rest: "60–90s",
        equip: "Halter ou garrafa.",
        video: "https://youtube.com/shorts/AYqg9S5FrUU",
        load: true
      }
    ]
  },
  qua: {
    key: "qua",
    label: "QUARTA-FEIRA",
    focus: "INFERIOR B",
    sub: "Posteriores + Glúteos + Panturrilhas",
    ex: [
      {
        id: "qua1",
        name: "Stiff / Romanian Deadlift",
        sets: 4,
        reps: "8–12",
        rest: "90–120s",
        equip: "Halteres, galões ou mochila carregada.",
        video: "https://youtube.com/shorts/Y_WA8NbtsyQ",
        load: true
      },
      {
        id: "qua2",
        name: "Elevação Pélvica Unilateral",
        sets: 3,
        reps: "8–12 por perna",
        rest: "60–90s",
        equip: "Peso corporal ou carga sobre o quadril.",
        video: "https://youtube.com/shorts/eJD2kKndN4k",
        load: true
      },
      {
        id: "qua3",
        name: "Afundo Reverso",
        sets: 3,
        reps: "10 por perna",
        rest: "90s",
        equip: "Halteres ou mochila carregada.",
        video: "https://youtube.com/shorts/QPI3CtIBqgg",
        load: true
      },
      {
        id: "qua4",
        name: "Flexão de Joelho Deslizante",
        sets: 3,
        reps: "8–15",
        rest: "60–90s",
        equip: "Adaptação: pode usar toalha em piso adequado.",
        video: "https://youtube.com/shorts/WDMfjU8iTwk",
        load: false
      },
      {
        id: "qua5",
        name: "Abdução de Quadril",
        sets: 3,
        reps: "15–25",
        rest: "60s",
        equip: "Pode utilizar miniband.",
        video: "https://youtube.com/shorts/8NWsDeYI7Og",
        load: false
      },
      {
        id: "qua6",
        name: "Panturrilha Sentada",
        sets: 4,
        reps: "15–25",
        rest: "60–90s",
        equip: "Adaptação: carga apoiada sobre os joelhos.",
        video: "https://youtube.com/shorts/vtsVOys39lA",
        load: true
      }
    ]
  },
  qui: {
    key: "qui",
    label: "QUINTA-FEIRA",
    focus: "SUPERIOR B",
    sub: "Costas + Ombros + Braços + Core",
    ex: [
      {
        id: "qui1",
        name: "Remada Unilateral",
        sets: 4,
        reps: "8–12 por lado",
        rest: "90s",
        equip: "Halter, garrafa ou galão.",
        video: "https://youtube.com/shorts/VRoPX0c8k9Y",
        load: true
      },
      {
        id: "qui2",
        name: "Supino no Chão / Floor Press",
        sets: 3,
        reps: "8–12",
        rest: "90s",
        equip: "Halteres ou garrafas.",
        video: "https://youtube.com/shorts/Ye5-fuRryec",
        load: true
      },
      {
        id: "qui3",
        name: "Desenvolvimento Arnold",
        sets: 3,
        reps: "8–12",
        rest: "60–90s",
        equip: "Halteres ou garrafas.",
        video: "https://youtube.com/shorts/r5R77waZzVo",
        load: true
      },
      {
        id: "qui4",
        name: "Crucifixo Inverso",
        sets: 3,
        reps: "12–15",
        rest: "60–90s",
        equip: "Halteres leves ou garrafas.",
        video: "https://youtube.com/shorts/3Gjq7Q2UadA",
        load: true
      },
      {
        id: "qui5",
        name: "Rosca Martelo",
        sets: 3,
        reps: "10–15",
        rest: "60–90s",
        equip: "Halteres ou garrafas.",
        video: "https://youtube.com/shorts/oBrWmkbJBeQ",
        load: true
      },
      {
        id: "qui6",
        name: "Tríceps Francês",
        sets: 3,
        reps: "10–15",
        rest: "60–90s",
        equip: "Halter ou garrafa.",
        video: "https://youtube.com/shorts/AYqg9S5FrUU",
        load: true
      },
      {
        id: "qui7",
        name: "Prancha",
        sets: 3,
        reps: "20–45 segundos",
        rest: "60s",
        equip: "Peso corporal, no chão.",
        video: "https://youtube.com/shorts/sEw8EGZBC1w",
        load: false
      }
    ]
  },
  sex: {
    key: "sex",
    label: "SEXTA-FEIRA",
    focus: "INFERIOR C",
    sub: "Pernas completas + Glúteos + Panturrilhas",
    ex: [
      {
        id: "sex1",
        name: "Agachamento Sumô",
        sets: 4,
        reps: "8–12",
        rest: "90–120s",
        equip: "Halter, galão ou mochila carregada.",
        video: "https://youtube.com/shorts/qRUa_H3um5I",
        load: true
      },
      {
        id: "sex2",
        name: "Búlgaro com Inclinação do Tronco",
        sets: 3,
        reps: "8–12 por perna",
        rest: "90–120s",
        equip: "Ênfase em glúteos. Cadeira firme + carga.",
        video: "https://youtube.com/shorts/tWIof-DeJj4",
        load: true
      },
      {
        id: "sex3",
        name: "Stiff Unilateral",
        sets: 3,
        reps: "8–12 por perna",
        rest: "90s",
        equip: "Halter ou garrafa.",
        video: "https://youtube.com/shorts/NvMPjt3Vqyw",
        load: true
      },
      {
        id: "sex4",
        name: "Elevação Pélvica",
        sets: 4,
        reps: "8–12",
        rest: "90–120s",
        equip: "Estímulo mais pesado da semana — aumente a carga.",
        video: "https://youtube.com/shorts/uUuPYcK9SJI",
        load: true
      },
      {
        id: "sex5",
        name: "Abdução de Quadril",
        sets: 3,
        reps: "15–25",
        rest: "60s",
        equip: "Pode utilizar miniband.",
        video: "https://youtube.com/shorts/8NWsDeYI7Og",
        load: false
      },
      {
        id: "sex6",
        name: "Panturrilha Unilateral",
        sets: 4,
        reps: "10–15 por perna",
        rest: "60–90s",
        equip: "Peso corporal ou carga na mão.",
        video: "https://youtube.com/shorts/ltr9yAkP79Y",
        load: true
      },
      {
        id: "sex7",
        name: "Prancha Lateral",
        sets: 3,
        reps: "20–40 segundos por lado",
        rest: "60s",
        equip: "Peso corporal, no chão.",
        video: "https://youtube.com/shorts/pWGhRO5grqs",
        load: false
      }
    ]
  }
};

export const DAY_ORDER = ["seg", "ter", "qua", "qui", "sex"] as const;

export const DAY_SHORT: Record<string, string> = {
  seg: "SEG",
  ter: "TER",
  qua: "QUA",
  qui: "QUI",
  sex: "SEX"
};

export const DEFAULT_GYM_COVER = "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=85";

export const GYM_COVER_PRESETS = [
  {
    name: "Academia Luxury",
    url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=85"
  },
  {
    name: "Design & Halteres",
    url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=85"
  },
  {
    name: "Iluminação Âmbar",
    url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=85"
  },
  {
    name: "Vista Panorâmica",
    url: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=85"
  }
];
