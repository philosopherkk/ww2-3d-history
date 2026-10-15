import type { Certainty, DetailLevel } from './types'
import { grokPageLink, grokSearchLink, wikiLink, type ExternalLink } from './externalLinks'

export interface Person {
  id: string
  name: string
  /** Short role label shown in lists */
  role: string
  /** Country entity ids this person is most associated with in this atlas */
  countryIds: string[]
  /** Incident ids where this person is especially relevant */
  incidentIds: string[]
  backgroundOverview: string
  backgroundStandard: string
  backgroundDeep: string
  certainty: Certainty
  /** Verified Wikipedia article title */
  wikipediaTitle: string
  /**
   * Grokipedia page slug/title when certain; if null, UI uses search and labels unsure.
   * Pattern: https://grokipedia.com/page/{Slug}
   */
  grokipediaSlug: string | null
}

export const people: Person[] = [
  {
    id: 'hitler',
    name: 'Adolf Hitler',
    role: 'German Führer / Nazi dictator',
    countryIds: ['deu', 'aut'],
    incidentIds: [
      'anschluss',
      'munich-agreement',
      'kristallnacht',
      'poland-invasion',
      'barbarossa',
      'july-20-plot',
      'hitler-death',
    ],
    backgroundOverview: 'Dictator of Nazi Germany; central driver of European aggression and the Holocaust.',
    backgroundStandard:
      'Chancellor (1933) then Führer. Directed rearmament, Anschluss, the destruction of Czechoslovakia’s independence, the invasion of Poland (1939), and the war of annihilation in the East. Died in Berlin, 30 April 1945.',
    backgroundDeep:
      'Ideology combined extreme nationalism, antisemitism, and expansionism (Lebensraum). Military decisions after 1941 increasingly micromanaged; the July 1944 bomb plot failed. Treat personal anecdotes and unverified “last words” stories as unsure unless sourced.',
    certainty: 'certain',
    wikipediaTitle: 'Adolf Hitler',
    grokipediaSlug: 'Adolf_Hitler',
  },
  {
    id: 'churchill',
    name: 'Winston Churchill',
    role: 'British Prime Minister (wartime)',
    countryIds: ['gbr'],
    incidentIds: ['churchill-pm', 'dunkirk', 'battle-britain', 'atlantic-charter', 'tehran', 'yalta', 'potsdam'],
    backgroundOverview: 'British wartime PM from May 1940; symbol of resistance in 1940–41.',
    backgroundStandard:
      'Replaced Chamberlain after Norway crisis. Led Britain through Dunkirk, the Battle of Britain, and alliance-building with the US and USSR. Lost the July 1945 election before Japan’s surrender ceremonies concluded.',
    backgroundDeep:
      'Also First Lord of the Admiralty earlier in the war. Conferences (Atlantic Charter, Tehran, Yalta, Potsdam) shaped Allied war aims and postwar settlement debates. Speeches are well documented; casual quotations online are often garbled (unsure if unsourced).',
    certainty: 'certain',
    wikipediaTitle: 'Winston Churchill',
    grokipediaSlug: 'Winston_Churchill',
  },
  {
    id: 'roosevelt',
    name: 'Franklin D. Roosevelt',
    role: 'US President',
    countryIds: ['usa'],
    incidentIds: ['lend-lease', 'pearl-harbor', 'atlantic-charter', 'casablanca', 'tehran', 'yalta', 'roosevelt-dies'],
    backgroundOverview: 'US President 1933–1945; led American mobilization and Grand Alliance diplomacy.',
    backgroundStandard:
      'Moved from neutrality legislation toward aid for Britain (Lend-Lease), then full war after Pearl Harbor. Died 12 April 1945; Truman succeeded him.',
    backgroundDeep:
      'Four-term president; New Deal background. Key conference participant (Casablanca, Tehran, Yalta). Health in 1944–45 was poor — exact medical details remain partly private/unsure in popular accounts.',
    certainty: 'certain',
    wikipediaTitle: 'Franklin D. Roosevelt',
    grokipediaSlug: 'Franklin_D._Roosevelt',
  },
  {
    id: 'stalin',
    name: 'Joseph Stalin',
    role: 'Soviet leader',
    countryIds: ['sun'],
    incidentIds: [
      'molotov-ribbentrop',
      'ussr-poland',
      'winter-war',
      'barbarossa',
      'stalingrad',
      'tehran',
      'yalta',
      'potsdam',
      'soviet-japan',
    ],
    backgroundOverview: 'General Secretary / Premier; directed the USSR through invasion, survival, and counter-offensive.',
    backgroundStandard:
      'Pact with Germany (1939), then catastrophic surprise in 1941, then industrial relocation and eventual advance into Central Europe. Occupied Eastern Europe at war’s end.',
    backgroundDeep:
      'Purges of the 1930s weakened the Red Army officer corps before Barbarossa (scale estimates vary — approximate/unsure at fine grain). Wartime decisions mixed with terror and propaganda; casualty totals remain debated.',
    certainty: 'certain',
    wikipediaTitle: 'Joseph Stalin',
    grokipediaSlug: 'Joseph_Stalin',
  },
  {
    id: 'mussolini',
    name: 'Benito Mussolini',
    role: 'Italian Fascist dictator',
    countryIds: ['ita', 'rsi'],
    incidentIds: ['italy-enters', 'greece-italy', 'mussolini-fall', 'italy-armistice'],
    backgroundOverview: 'Fascist leader of Italy; entered WWII in 1940; deposed 1943; later headed the Salò RSI.',
    backgroundStandard:
      'Declared war June 1940. Failed Greek campaign and North African losses undermined prestige. Arrested July 1943; rescued by Germans; executed by partisans April 1945.',
    backgroundDeep:
      'Alliance with Hitler was unequal. After armistice, Italy split between co-belligerent south and RSI north — force accounting in this atlas is labeled carefully for that split.',
    certainty: 'certain',
    wikipediaTitle: 'Benito Mussolini',
    grokipediaSlug: 'Benito_Mussolini',
  },
  {
    id: 'tojo',
    name: 'Hideki Tojo',
    role: 'Japanese Prime Minister / general',
    countryIds: ['jpn'],
    incidentIds: ['pearl-harbor', 'midway', 'saipan'],
    backgroundOverview: 'Army general; PM during Pearl Harbor and early Pacific expansion; resigned 1944.',
    backgroundStandard:
      'Advocated a hard line in China and against Western embargoes. Oversaw the decision for war with the US/UK/Netherlands. Lost political ground after Midway and island defeats; resigned after Saipan.',
    backgroundDeep:
      'Tried and executed after the war (IMTFE). Responsibility debates among Japanese leaders remain a historiographical topic — treat simplified “sole villain” narratives as incomplete.',
    certainty: 'certain',
    wikipediaTitle: 'Hideki Tojo',
    grokipediaSlug: 'Hideki_Tojo',
  },
  {
    id: 'hirohito',
    name: 'Hirohito (Emperor Shōwa)',
    role: 'Emperor of Japan',
    countryIds: ['jpn'],
    incidentIds: ['pearl-harbor', 'hiroshima', 'nagasaki', 'japan-accepts', 'vj-day'],
    backgroundOverview: 'Japanese emperor throughout the war; announced surrender in August 1945.',
    backgroundStandard:
      'Constitutional and symbolic roles are debated by historians. The Gyokuon-hōsō broadcast (15 Aug 1945) accepted Potsdam terms after Hiroshima, Nagasaki, and Soviet entry.',
    backgroundDeep:
      'Degree of personal responsibility for war decisions remains contested in scholarship — mark strong claims as unsure without archival citation. Retained as emperor under Occupation reforms.',
    certainty: 'certain',
    wikipediaTitle: 'Hirohito',
    grokipediaSlug: 'Hirohito',
  },
  {
    id: 'chiang',
    name: 'Chiang Kai-shek',
    role: 'Leader of Nationalist China (ROC)',
    countryIds: ['chn'],
    incidentIds: ['marco-polo', 'battle-shanghai', 'nanjing-fall'],
    backgroundOverview: 'Head of the Nationalist government fighting Japan from 1937; Allied China theatre leader.',
    backgroundStandard:
      'Led ROC through the Second Sino-Japanese War, retreat to Chongqing, and uneasy United Front with Communists. Represented China among the Allies.',
    backgroundDeep:
      'Corruption, inflation, and civil-war tensions with the CCP shaped the Chinese theatre. Force and GDP figures for China in this atlas are often approximate/unsure.',
    certainty: 'certain',
    wikipediaTitle: 'Chiang Kai-shek',
    grokipediaSlug: 'Chiang_Kai-shek',
  },
  {
    id: 'de-gaulle',
    name: 'Charles de Gaulle',
    role: 'Free French leader',
    countryIds: ['fra', 'fre'],
    incidentIds: ['france-armistice', 'paris-liberated'],
    backgroundOverview: 'Refused armistice; led Free France from exile; entered Paris 1944.',
    backgroundStandard:
      'Broadcast from London after June 1940. Built Free French forces and political legitimacy against Vichy. Became central to liberated France’s government.',
    backgroundDeep:
      'Relations with Roosevelt and Churchill were often strained. Vichy vs Free France metrics must not be double-counted — see dataset notes.',
    certainty: 'certain',
    wikipediaTitle: 'Charles de Gaulle',
    grokipediaSlug: 'Charles_de_Gaulle',
  },
  {
    id: 'chamberlain',
    name: 'Neville Chamberlain',
    role: 'British Prime Minister (to May 1940)',
    countryIds: ['gbr'],
    incidentIds: ['munich-agreement', 'uk-france-declare', 'churchill-pm'],
    backgroundOverview: 'PM at Munich (1938) and the outbreak of war; resigned May 1940.',
    backgroundStandard:
      'Associated with appeasement at Munich. Led Britain into war after Poland’s invasion; Norway setbacks ended his premiership.',
    backgroundDeep:
      'Historians debate whether Munich bought rearmament time — treat one-sided verdicts as contested.',
    certainty: 'certain',
    wikipediaTitle: 'Neville Chamberlain',
    grokipediaSlug: 'Neville_Chamberlain',
  },
  {
    id: 'truman',
    name: 'Harry S. Truman',
    role: 'US President (from Apr 1945)',
    countryIds: ['usa'],
    incidentIds: ['roosevelt-dies', 'potsdam', 'hiroshima', 'nagasaki', 'vj-day'],
    backgroundOverview: 'Succeeded Roosevelt; authorized atomic bombings; present at war’s end diplomacy.',
    backgroundStandard:
      'Sworn in 12 April 1945. At Potsdam with Stalin and (initially) Churchill/Attlee. Ordered use of atomic weapons against Japan.',
    backgroundDeep:
      'Decision-making on the bomb remains intensively studied; casualty estimates for invasion alternatives are speculative (unsure).',
    certainty: 'certain',
    wikipediaTitle: 'Harry S. Truman',
    grokipediaSlug: 'Harry_S._Truman',
  },
  {
    id: 'eisenhower',
    name: 'Dwight D. Eisenhower',
    role: 'Supreme Allied Commander (Europe)',
    countryIds: ['usa'],
    incidentIds: ['torch', 'd-day', 'market-garden', 'bulge', 've-day'],
    backgroundOverview: 'Directed Torch and Overlord; Supreme Commander of the Allied Expeditionary Force.',
    backgroundStandard:
      'Coordinated multinational forces in North Africa, Italy’s strategic context, and Northwest Europe from D-Day to VE Day.',
    backgroundDeep:
      'Broad-front vs concentrated thrust debates (with Montgomery et al.) are well documented. Later US President (postwar — outside this atlas window).',
    certainty: 'certain',
    wikipediaTitle: 'Dwight D. Eisenhower',
    grokipediaSlug: 'Dwight_D._Eisenhower',
  },
  {
    id: 'macarthur',
    name: 'Douglas MacArthur',
    role: 'US Army general (SW Pacific)',
    countryIds: ['usa', 'phi'],
    incidentIds: ['bataan', 'leyte', 'leyte-gulf', 'vj-day'],
    backgroundOverview: 'Commanded US Army Forces in the Far East; returned to the Philippines; accepted Japan’s surrender.',
    backgroundStandard:
      'Evacuated from Corregidor (1942); island-hopping campaigns; Leyte landings (1944). Presided over the USS Missouri ceremony (2 Sep 1945).',
    backgroundDeep:
      'Public image and self-promotion were notable; operational judgments (e.g., Philippines defense 1941–42) are debated.',
    certainty: 'certain',
    wikipediaTitle: 'Douglas MacArthur',
    grokipediaSlug: 'Douglas_MacArthur',
  },
  {
    id: 'zhukov',
    name: 'Georgy Zhukov',
    role: 'Soviet marshal',
    countryIds: ['sun'],
    incidentIds: ['moscow-defense', 'stalingrad', 'kursk', 'bagration', 'berlin-falls'],
    backgroundOverview: 'Key Red Army commander in defense of Moscow, Stalingrad context, Kursk, Bagration, and Berlin.',
    backgroundStandard:
      'Among the most prominent Soviet wartime generals; later sidelined politically. Central to 1941–45 operational narrative.',
    backgroundDeep:
      'Memoirs are valuable but partisan; exact credit among Soviet commanders is contested (approximate).',
    certainty: 'certain',
    wikipediaTitle: 'Georgy Zhukov',
    grokipediaSlug: 'Georgy_Zhukov',
  },
  {
    id: 'rommel',
    name: 'Erwin Rommel',
    role: 'German field marshal (North Africa)',
    countryIds: ['deu'],
    incidentIds: ['gazala-fall-tobruk', 'el-alamein', 'july-20-plot'],
    backgroundOverview: 'Commanded Afrika Korps / Panzer Army Africa; later in France; linked to July 20 aftermath.',
    backgroundStandard:
      'Famous for desert mobile warfare; defeated at El Alamein / Torch squeeze. Forced suicide after July 1944 plot associations (details nuanced).',
    backgroundDeep:
      '“Desert Fox” myth-making was strong on both sides; treat popular hagiography as incomplete. Exact July 20 involvement level is debated.',
    certainty: 'certain',
    wikipediaTitle: 'Erwin Rommel',
    grokipediaSlug: 'Erwin_Rommel',
  },
  {
    id: 'petain',
    name: 'Philippe Pétain',
    role: 'Vichy France head of state',
    countryIds: ['vichy', 'fra'],
    incidentIds: ['france-armistice'],
    backgroundOverview: 'WWI hero who led the Vichy regime after the 1940 armistice.',
    backgroundStandard:
      'Sought armistice June 1940; authoritarian “National Revolution”; collaboration with Germany. Tried after liberation.',
    backgroundDeep:
      'Degrees of collaboration vs protection claims are heavily debated; Jewish deportations under Vichy are documented fact.',
    certainty: 'certain',
    wikipediaTitle: 'Philippe Pétain',
    grokipediaSlug: 'Philippe_Pétain',
  },
  {
    id: 'molotov',
    name: 'Vyacheslav Molotov',
    role: 'Soviet foreign minister',
    countryIds: ['sun'],
    incidentIds: ['molotov-ribbentrop', 'winter-war'],
    backgroundOverview: 'Signed the 1939 pact with Ribbentrop; long-serving Soviet diplomat.',
    backgroundStandard:
      'Negotiated the Nazi–Soviet pact and later wartime diplomacy. Name attached to the pact in Western usage.',
    backgroundDeep:
      'Career Stalinist; postwar political fate varied. Secret protocols of 1939 are archival fact (published after Cold War).',
    certainty: 'certain',
    wikipediaTitle: 'Vyacheslav Molotov',
    grokipediaSlug: 'Vyacheslav_Molotov',
  },
  {
    id: 'ribbentrop',
    name: 'Joachim von Ribbentrop',
    role: 'German foreign minister',
    countryIds: ['deu'],
    incidentIds: ['molotov-ribbentrop', 'tripartite-pact'],
    backgroundOverview: 'Nazi foreign minister; signed the Molotov–Ribbentrop Pact and Tripartite Pact.',
    backgroundStandard:
      'Pushed aggressive diplomacy before 1939; convicted and executed at Nuremberg.',
    backgroundDeep:
      'Often assessed as diplomatically inept relative to his influence — interpretive, not a metric fact.',
    certainty: 'certain',
    wikipediaTitle: 'Joachim von Ribbentrop',
    grokipediaSlug: null, // use search — slug not verified here
  },
  {
    id: 'yamamoto',
    name: 'Isoroku Yamamoto',
    role: 'Japanese Combined Fleet commander',
    countryIds: ['jpn'],
    incidentIds: ['pearl-harbor', 'midway'],
    backgroundOverview: 'Planned Pearl Harbor; Combined Fleet commander; killed 1943 (outside listed pins).',
    backgroundStandard:
      'Advocated a decisive early blow against the US Pacific Fleet. Midway (June 1942) destroyed Japan’s carrier edge.',
    backgroundDeep:
      'Opposed prolonged war with the US in some accounts — degree and timing of opposition are debated (unsure in simplified form).',
    certainty: 'certain',
    wikipediaTitle: 'Isoroku Yamamoto',
    grokipediaSlug: 'Isoroku_Yamamoto',
  },
  {
    id: 'montgomery',
    name: 'Bernard Montgomery',
    role: 'British field marshal',
    countryIds: ['gbr'],
    incidentIds: ['el-alamein', 'd-day', 'market-garden', 'bulge'],
    backgroundOverview: 'Commanded Eighth Army at El Alamein; major NW Europe command under Eisenhower.',
    backgroundStandard:
      'El Alamein (1942) turned the desert war. Later 21st Army Group; Market Garden (Sep 1944) failed to end the war early.',
    backgroundDeep:
      'Personality clashes with US peers are well attested. Operational critiques of Market Garden are mainstream historiography.',
    certainty: 'certain',
    wikipediaTitle: 'Bernard Montgomery',
    grokipediaSlug: 'Bernard_Montgomery',
  },
  {
    id: 'nimitz',
    name: 'Chester W. Nimitz',
    role: 'US Pacific Fleet admiral',
    countryIds: ['usa'],
    incidentIds: ['midway', 'guadalcanal', 'leyte-gulf', 'iwo-jima', 'okinawa'],
    backgroundOverview: 'Commander-in-Chief, US Pacific Fleet / Pacific Ocean Areas.',
    backgroundStandard:
      'Directed carrier warfare after Midway and dual advance across the Central Pacific toward Japan.',
    backgroundDeep:
      'Coordination with MacArthur’s SWPA was a standing strategic management problem — documented in official histories.',
    certainty: 'certain',
    wikipediaTitle: 'Chester W. Nimitz',
    grokipediaSlug: 'Chester_W._Nimitz',
  },
  {
    id: 'tito',
    name: 'Josip Broz Tito',
    role: 'Yugoslav Partisan leader',
    countryIds: ['yug'],
    incidentIds: ['yugoslavia-coup'],
    backgroundOverview: 'Led Communist Partisans against Axis occupation; postwar Yugoslav leader.',
    backgroundStandard:
      'After Axis invasion (1941), Partisans fought occupation forces and rival factions; recognized increasingly by Allies.',
    backgroundDeep:
      'Civil-war dimensions (Partisans vs Chetniks) are complex; casualty attribution is often unsure at fine scale.',
    certainty: 'certain',
    wikipediaTitle: 'Josip Broz Tito',
    grokipediaSlug: 'Josip_Broz_Tito',
  },
  {
    id: 'mannerheim',
    name: 'Carl Gustaf Emil Mannerheim',
    role: 'Finnish commander / statesman',
    countryIds: ['fin'],
    incidentIds: ['winter-war', 'finland-armistice'],
    backgroundOverview: 'Led Finnish defense in the Winter War; later Continuation War context; president 1944–46.',
    backgroundStandard:
      'Winter War (1939–40) against the USSR made him an international figure. Finland fought with Germany against the USSR later, then exited via 1944 armistice.',
    backgroundDeep:
      'Finland’s co-belligerent status is distinct from full Axis membership — reflected in this atlas’s involvement tags.',
    certainty: 'certain',
    wikipediaTitle: 'Carl Gustaf Emil Mannerheim',
    grokipediaSlug: null,
  },
  {
    id: 'wang-jingwei',
    name: 'Wang Jingwei',
    role: 'Reorganized National Government (puppet) leader',
    countryIds: ['wjc'],
    incidentIds: [],
    backgroundOverview: 'Led the Japanese-sponsored regime at Nanjing; rival to Chiang’s ROC.',
    backgroundStandard:
      'Broke with Chiang; headed a collaborationist government. Died 1944. Metrics for the regime are sparse/unsure.',
    backgroundDeep:
      'Portrayed as traitor in Chinese historiography; some revisionist debates exist — keep teaching focus on occupation structure.',
    certainty: 'certain',
    wikipediaTitle: 'Wang Jingwei',
    grokipediaSlug: 'Wang_Jingwei',
  },
]

export function personBackground(person: Person, detail: DetailLevel): string {
  if (detail === 'overview') return person.backgroundOverview
  if (detail === 'standard') return person.backgroundStandard
  return person.backgroundDeep
}

export function peopleForCountry(countryId: string): Person[] {
  return people.filter((p) => p.countryIds.includes(countryId))
}

export function peopleForIncident(incidentId: string): Person[] {
  return people.filter((p) => p.incidentIds.includes(incidentId))
}

export function getPerson(id: string | null | undefined): Person | undefined {
  if (!id) return undefined
  return people.find((p) => p.id === id)
}

export function personExternalLinks(person: Person): ExternalLink[] {
  const links: ExternalLink[] = [wikiLink(person.wikipediaTitle, 'certain')]
  if (person.grokipediaSlug) {
    links.push(grokPageLink(person.grokipediaSlug, 'certain'))
  } else {
    links.push(grokSearchLink(person.name))
  }
  return links
}
