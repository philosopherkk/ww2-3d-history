import type { LocalizedText } from '../shared/i18n/types'

const START = 1937 + 6 / 12
const END = 1945 + 8 / 12

function lessonTime(year: number, month: number): number {
  const y = year + (month - 1) / 12
  return Math.min(1, Math.max(0, (y - START) / (END - START)))
}

export interface Lesson {
  id: string
  incidentId: string
  t: number
  title: LocalizedText
  /** One neutral, source-based prompt. No new casualty figures. */
  prompt: LocalizedText
}

export const lessons: Lesson[] = [
  {
    id: 'marco-polo-1937',
    incidentId: 'marco-polo',
    t: lessonTime(1937, 7),
    title: {
      en: 'Marco Polo Bridge, 1937',
      zhHant: '七七事變/盧溝橋事變，1937',
      zhHantReviewed: true,
    },
    prompt: {
      en: 'Open Sources and compare this pin’s date with the scrubber. What does the cited Britannica timeline establish about the Marco Polo Bridge Incident, and which nearby metrics stay labeled unsure?',
      zhHant:
        '打開資料來源，把這枚地圖釘的日期和時間軸對一下。Britannica 年表對七七事變/盧溝橋事變確立了什麼？附近哪些指標仍標為 unsure？',
      zhHantReviewed: true,
    },
  },
  {
    id: 'barbarossa-1941',
    incidentId: 'barbarossa',
    t: lessonTime(1941, 6),
    title: {
      en: 'Barbarossa, 1941',
      zhHant: '巴巴羅薩行動，1941',
      zhHantReviewed: true,
    },
    prompt: {
      en: 'Using the incident’s listed sources, what date does this atlas give for the invasion, and what do the evidence badges say about country metrics at that scrubber date?',
      zhHant:
        '依這個事件列出的資料來源，本圖給這次入侵的日期是什麼？在該時間軸日期，國家指標的證據標記說了什麼？',
      zhHantReviewed: true,
    },
  },
  {
    id: 'pearl-harbor-1941',
    incidentId: 'pearl-harbor',
    t: lessonTime(1941, 12),
    title: {
      en: 'Pearl Harbor, 1941',
      zhHant: '珍珠港事件，1941',
      zhHantReviewed: true,
    },
    prompt: {
      en: 'Read the incident summary and its Wikipedia link before the Grokipedia link. What does the atlas treat as established about the attack, and what does it still mark unsure?',
      zhHant:
        '先讀事件摘要和維基百科連結，再看 Grokipedia。本圖把這次攻擊的哪些部分視為已確立，哪些仍標為 unsure？',
      zhHantReviewed: true,
    },
  },
  {
    id: 'stalingrad-1942',
    incidentId: 'stalingrad',
    t: lessonTime(1942, 8),
    title: {
      en: 'Stalingrad, 1942–43',
      zhHant: '史達林格勒戰役，1942–43',
      zhHantReviewed: true,
    },
    prompt: {
      en: 'This stop uses the atlas incident for the 1942–43 battle. Compare its date with the scrubber and note which metric points are anchors and which are estimated.',
      zhHant:
        '這一站使用圖上已有的 1942–43 年戰役事件。把事件日期和時間軸對一下，並分辨哪些指標點是錨點、哪些是推估。',
      zhHantReviewed: true,
    },
  },
  {
    id: 'hiroshima-nagasaki-1945',
    incidentId: 'hiroshima',
    t: lessonTime(1945, 8),
    title: {
      en: 'Hiroshima and Nagasaki, 1945',
      zhHant: '廣島與長崎，1945',
      zhHantReviewed: true,
    },
    prompt: {
      en: 'Use the sources on the Hiroshima pin, then the Nagasaki pin. Which dates does the atlas record, and why does the content note appear before the longest summary?',
      zhHant:
        '先看廣島地圖釘的資料來源，再看長崎。本圖記錄了哪些日期？為什麼最長的摘要之前會出現內容提示？',
      zhHantReviewed: true,
    },
  },
]
