import type { LocalizedText } from '../shared/i18n/types'
import { enOf } from '../shared/i18n/pickText'
import type { Certainty, DetailLevel } from './types'
import { grokPageLink, grokSearchLink, wikiLink, type ExternalLink } from './externalLinks'

export interface Person {
  id: string
  name: LocalizedText
  /** Short role label shown in lists */
  role: LocalizedText
  /** Country entity ids this person is most associated with in this atlas */
  countryIds: string[]
  /** Incident ids where this person is especially relevant */
  incidentIds: string[]
  backgroundOverview: LocalizedText
  backgroundStandard: LocalizedText
  backgroundDeep: LocalizedText
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
    name: { en: 'Adolf Hitler' },
    role: { en: 'German Führer / Nazi dictator' },
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
    backgroundOverview: { en: 'Dictator of Nazi Germany; central driver of European aggression and the Holocaust.' },
    backgroundStandard:
      { en: 'Chancellor (1933) then Führer. Directed rearmament, Anschluss, the destruction of Czechoslovakia’s independence, the invasion of Poland (1939), and the war of annihilation in the East. Died in Berlin, 30 April 1945.' },
    backgroundDeep:
      { en: 'Ideology combined extreme nationalism, antisemitism, and expansionism (Lebensraum). Military decisions after 1941 increasingly micromanaged; the July 1944 bomb plot failed. Treat personal anecdotes and unverified “last words” stories as unsure unless sourced.' },
    certainty: 'certain',
    wikipediaTitle: 'Adolf Hitler',
    grokipediaSlug: 'Adolf_Hitler',
  },
  {
    id: 'churchill',
    name: { en: 'Winston Churchill' },
    role: { en: 'British Prime Minister (wartime)' },
    countryIds: ['gbr'],
    incidentIds: ['churchill-pm', 'dunkirk', 'battle-britain', 'atlantic-charter', 'tehran', 'yalta', 'potsdam'],
    backgroundOverview: { en: 'British wartime PM from May 1940; symbol of resistance in 1940–41.' },
    backgroundStandard:
      { en: 'Replaced Chamberlain after Norway crisis. Led Britain through Dunkirk, the Battle of Britain, and alliance-building with the US and USSR. Lost the July 1945 election before Japan’s surrender ceremonies concluded.' },
    backgroundDeep:
      { en: 'Also First Lord of the Admiralty earlier in the war. Conferences (Atlantic Charter, Tehran, Yalta, Potsdam) shaped Allied war aims and postwar settlement debates. Speeches are well documented; casual quotations online are often garbled (unsure if unsourced).' },
    certainty: 'certain',
    wikipediaTitle: 'Winston Churchill',
    grokipediaSlug: 'Winston_Churchill',
  },
  {
    id: 'roosevelt',
    name: { en: 'Franklin D. Roosevelt' },
    role: { en: 'US President' },
    countryIds: ['usa'],
    incidentIds: ['lend-lease', 'pearl-harbor', 'atlantic-charter', 'casablanca', 'tehran', 'yalta', 'roosevelt-dies'],
    backgroundOverview: { en: 'US President 1933–1945; led American mobilization and Grand Alliance diplomacy.' },
    backgroundStandard:
      { en: 'Moved from neutrality legislation toward aid for Britain (Lend-Lease), then full war after Pearl Harbor. Died 12 April 1945; Truman succeeded him.' },
    backgroundDeep:
      { en: 'Four-term president; New Deal background. Key conference participant (Casablanca, Tehran, Yalta). Health in 1944–45 was poor — exact medical details remain partly private/unsure in popular accounts.' },
    certainty: 'certain',
    wikipediaTitle: 'Franklin D. Roosevelt',
    grokipediaSlug: 'Franklin_D._Roosevelt',
  },
  {
    id: 'stalin',
    name: { en: 'Joseph Stalin' },
    role: { en: 'Soviet leader' },
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
    backgroundOverview: { en: 'General Secretary / Premier; directed the USSR through invasion, survival, and counter-offensive.' },
    backgroundStandard:
      { en: 'Pact with Germany (1939), then catastrophic surprise in 1941, then industrial relocation and eventual advance into Central Europe. Occupied Eastern Europe at war’s end.' },
    backgroundDeep:
      { en: 'Purges of the 1930s weakened the Red Army officer corps before Barbarossa (scale estimates vary — approximate/unsure at fine grain). Wartime decisions mixed with terror and propaganda; casualty totals remain debated.' },
    certainty: 'certain',
    wikipediaTitle: 'Joseph Stalin',
    grokipediaSlug: 'Joseph_Stalin',
  },
  {
    id: 'mussolini',
    name: { en: 'Benito Mussolini' },
    role: { en: 'Italian Fascist dictator' },
    countryIds: ['ita', 'rsi'],
    incidentIds: ['italy-enters', 'greece-italy', 'mussolini-fall', 'italy-armistice'],
    backgroundOverview: { en: 'Fascist leader of Italy; entered WWII in 1940; deposed 1943; later headed the Salò RSI.' },
    backgroundStandard:
      { en: 'Declared war June 1940. Failed Greek campaign and North African losses undermined prestige. Arrested July 1943; rescued by Germans; executed by partisans April 1945.' },
    backgroundDeep:
      { en: 'Alliance with Hitler was unequal. After armistice, Italy split between co-belligerent south and RSI north — force accounting in this atlas is labeled carefully for that split.' },
    certainty: 'certain',
    wikipediaTitle: 'Benito Mussolini',
    grokipediaSlug: 'Benito_Mussolini',
  },
  {
    id: 'tojo',
    name: { en: 'Hideki Tojo' },
    role: { en: 'Japanese Prime Minister / general' },
    countryIds: ['jpn'],
    incidentIds: ['pearl-harbor', 'midway', 'saipan'],
    backgroundOverview: { en: 'Army general; PM during Pearl Harbor and early Pacific expansion; resigned 1944.' },
    backgroundStandard:
      { en: 'Advocated a hard line in China and against Western embargoes. Oversaw the decision for war with the US/UK/Netherlands. Lost political ground after Midway and island defeats; resigned after Saipan.' },
    backgroundDeep:
      { en: 'Tried and executed after the war (IMTFE). Responsibility debates among Japanese leaders remain a historiographical topic — treat simplified “sole villain” narratives as incomplete.' },
    certainty: 'certain',
    wikipediaTitle: 'Hideki Tojo',
    grokipediaSlug: 'Hideki_Tojo',
  },
  {
    id: 'hirohito',
    name: { en: 'Hirohito (Emperor Shōwa)' },
    role: { en: 'Emperor of Japan' },
    countryIds: ['jpn'],
    incidentIds: ['pearl-harbor', 'hiroshima', 'nagasaki', 'japan-accepts', 'vj-day'],
    backgroundOverview: { en: 'Japanese emperor throughout the war; announced surrender in August 1945.' },
    backgroundStandard:
      { en: 'Constitutional and symbolic roles are debated by historians. The Gyokuon-hōsō broadcast (15 Aug 1945) accepted Potsdam terms after Hiroshima, Nagasaki, and Soviet entry.' },
    backgroundDeep:
      { en: 'Degree of personal responsibility for war decisions remains contested in scholarship — mark strong claims as unsure without archival citation. Retained as emperor under Occupation reforms.' },
    certainty: 'certain',
    wikipediaTitle: 'Hirohito',
    grokipediaSlug: 'Hirohito',
  },
  {
    id: 'chiang',
    name: { en: 'Chiang Kai-shek' },
    role: { en: 'Leader of Nationalist China (ROC)' },
    countryIds: ['chn'],
    incidentIds: ['marco-polo', 'battle-shanghai', 'nanjing-fall'],
    backgroundOverview: { en: 'Head of the Nationalist government fighting Japan from 1937; Allied China theatre leader.' },
    backgroundStandard:
      { en: 'Led ROC through the Second Sino-Japanese War, retreat to Chongqing, and uneasy United Front with Communists. Represented China among the Allies.' },
    backgroundDeep:
      { en: 'Corruption, inflation, and civil-war tensions with the CCP shaped the Chinese theatre. Force and GDP figures for China in this atlas are often approximate/unsure.' },
    certainty: 'certain',
    wikipediaTitle: 'Chiang Kai-shek',
    grokipediaSlug: 'Chiang_Kai-shek',
  },
  {
    id: 'de-gaulle',
    name: { en: 'Charles de Gaulle' },
    role: { en: 'Free French leader' },
    countryIds: ['fra', 'fre'],
    incidentIds: ['france-armistice', 'paris-liberated'],
    backgroundOverview: { en: 'Refused armistice; led Free France from exile; entered Paris 1944.' },
    backgroundStandard:
      { en: 'Broadcast from London after June 1940. Built Free French forces and political legitimacy against Vichy. Became central to liberated France’s government.' },
    backgroundDeep:
      { en: 'Relations with Roosevelt and Churchill were often strained. Vichy vs Free France metrics must not be double-counted — see dataset notes.' },
    certainty: 'certain',
    wikipediaTitle: 'Charles de Gaulle',
    grokipediaSlug: 'Charles_de_Gaulle',
  },
  {
    id: 'chamberlain',
    name: { en: 'Neville Chamberlain' },
    role: { en: 'British Prime Minister (to May 1940)' },
    countryIds: ['gbr'],
    incidentIds: ['munich-agreement', 'uk-france-declare', 'churchill-pm'],
    backgroundOverview: { en: 'PM at Munich (1938) and the outbreak of war; resigned May 1940.' },
    backgroundStandard:
      { en: 'Associated with appeasement at Munich. Led Britain into war after Poland’s invasion; Norway setbacks ended his premiership.' },
    backgroundDeep:
      { en: 'Historians debate whether Munich bought rearmament time — treat one-sided verdicts as contested.' },
    certainty: 'certain',
    wikipediaTitle: 'Neville Chamberlain',
    grokipediaSlug: 'Neville_Chamberlain',
  },
  {
    id: 'truman',
    name: { en: 'Harry S. Truman' },
    role: { en: 'US President (from Apr 1945)' },
    countryIds: ['usa'],
    incidentIds: ['roosevelt-dies', 'potsdam', 'hiroshima', 'nagasaki', 'vj-day'],
    backgroundOverview: { en: 'Succeeded Roosevelt; authorized atomic bombings; present at war’s end diplomacy.' },
    backgroundStandard:
      { en: 'Sworn in 12 April 1945. At Potsdam with Stalin and (initially) Churchill/Attlee. Ordered use of atomic weapons against Japan.' },
    backgroundDeep:
      { en: 'Decision-making on the bomb remains intensively studied; casualty estimates for invasion alternatives are speculative (unsure).' },
    certainty: 'certain',
    wikipediaTitle: 'Harry S. Truman',
    grokipediaSlug: 'Harry_S._Truman',
  },
  {
    id: 'eisenhower',
    name: { en: 'Dwight D. Eisenhower' },
    role: { en: 'Supreme Allied Commander (Europe)' },
    countryIds: ['usa'],
    incidentIds: ['torch', 'd-day', 'market-garden', 'bulge', 've-day'],
    backgroundOverview: { en: 'Directed Torch and Overlord; Supreme Commander of the Allied Expeditionary Force.' },
    backgroundStandard:
      { en: 'Coordinated multinational forces in North Africa, Italy’s strategic context, and Northwest Europe from D-Day to VE Day.' },
    backgroundDeep:
      { en: 'Broad-front vs concentrated thrust debates (with Montgomery et al.) are well documented. Later US President (postwar — outside this atlas window).' },
    certainty: 'certain',
    wikipediaTitle: 'Dwight D. Eisenhower',
    grokipediaSlug: 'Dwight_D._Eisenhower',
  },
  {
    id: 'macarthur',
    name: { en: 'Douglas MacArthur' },
    role: { en: 'US Army general (SW Pacific)' },
    countryIds: ['usa', 'phi'],
    incidentIds: ['bataan', 'leyte', 'leyte-gulf', 'vj-day'],
    backgroundOverview: { en: 'Commanded US Army Forces in the Far East; returned to the Philippines; accepted Japan’s surrender.' },
    backgroundStandard:
      { en: 'Evacuated from Corregidor (1942); island-hopping campaigns; Leyte landings (1944). Presided over the USS Missouri ceremony (2 Sep 1945).' },
    backgroundDeep:
      { en: 'Public image and self-promotion were notable; operational judgments (e.g., Philippines defense 1941–42) are debated.' },
    certainty: 'certain',
    wikipediaTitle: 'Douglas MacArthur',
    grokipediaSlug: 'Douglas_MacArthur',
  },
  {
    id: 'zhukov',
    name: { en: 'Georgy Zhukov' },
    role: { en: 'Soviet marshal' },
    countryIds: ['sun'],
    incidentIds: ['moscow-defense', 'stalingrad', 'kursk', 'bagration', 'berlin-falls'],
    backgroundOverview: { en: 'Key Red Army commander in defense of Moscow, Stalingrad context, Kursk, Bagration, and Berlin.' },
    backgroundStandard:
      { en: 'Among the most prominent Soviet wartime generals; later sidelined politically. Central to 1941–45 operational narrative.' },
    backgroundDeep:
      { en: 'Memoirs are valuable but partisan; exact credit among Soviet commanders is contested (approximate).' },
    certainty: 'certain',
    wikipediaTitle: 'Georgy Zhukov',
    grokipediaSlug: 'Georgy_Zhukov',
  },
  {
    id: 'rommel',
    name: { en: 'Erwin Rommel' },
    role: { en: 'German field marshal (North Africa)' },
    countryIds: ['deu'],
    incidentIds: ['gazala-fall-tobruk', 'el-alamein', 'july-20-plot'],
    backgroundOverview: { en: 'Commanded Afrika Korps / Panzer Army Africa; later in France; linked to July 20 aftermath.' },
    backgroundStandard:
      { en: 'Famous for desert mobile warfare; defeated at El Alamein / Torch squeeze. Forced suicide after July 1944 plot associations (details nuanced).' },
    backgroundDeep:
      { en: '“Desert Fox” myth-making was strong on both sides; treat popular hagiography as incomplete. Exact July 20 involvement level is debated.' },
    certainty: 'certain',
    wikipediaTitle: 'Erwin Rommel',
    grokipediaSlug: 'Erwin_Rommel',
  },
  {
    id: 'petain',
    name: { en: 'Philippe Pétain' },
    role: { en: 'Vichy France head of state' },
    countryIds: ['vichy', 'fra'],
    incidentIds: ['france-armistice'],
    backgroundOverview: { en: 'WWI hero who led the Vichy regime after the 1940 armistice.' },
    backgroundStandard:
      { en: 'Sought armistice June 1940; authoritarian “National Revolution”; collaboration with Germany. Tried after liberation.' },
    backgroundDeep:
      { en: 'Degrees of collaboration vs protection claims are heavily debated; Jewish deportations under Vichy are documented fact.' },
    certainty: 'certain',
    wikipediaTitle: 'Philippe Pétain',
    grokipediaSlug: 'Philippe_Pétain',
  },
  {
    id: 'molotov',
    name: { en: 'Vyacheslav Molotov' },
    role: { en: 'Soviet foreign minister' },
    countryIds: ['sun'],
    incidentIds: ['molotov-ribbentrop', 'winter-war'],
    backgroundOverview: { en: 'Signed the 1939 pact with Ribbentrop; long-serving Soviet diplomat.' },
    backgroundStandard:
      { en: 'Negotiated the Nazi–Soviet pact and later wartime diplomacy. Name attached to the pact in Western usage.' },
    backgroundDeep:
      { en: 'Career Stalinist; postwar political fate varied. Secret protocols of 1939 are archival fact (published after Cold War).' },
    certainty: 'certain',
    wikipediaTitle: 'Vyacheslav Molotov',
    grokipediaSlug: 'Vyacheslav_Molotov',
  },
  {
    id: 'ribbentrop',
    name: { en: 'Joachim von Ribbentrop' },
    role: { en: 'German foreign minister' },
    countryIds: ['deu'],
    incidentIds: ['molotov-ribbentrop', 'tripartite-pact'],
    backgroundOverview: { en: 'Nazi foreign minister; signed the Molotov–Ribbentrop Pact and Tripartite Pact.' },
    backgroundStandard:
      { en: 'Pushed aggressive diplomacy before 1939; convicted and executed at Nuremberg.' },
    backgroundDeep:
      { en: 'Often assessed as diplomatically inept relative to his influence — interpretive, not a metric fact.' },
    certainty: 'certain',
    wikipediaTitle: 'Joachim von Ribbentrop',
    grokipediaSlug: null, // use search — slug not verified here
  },
  {
    id: 'yamamoto',
    name: { en: 'Isoroku Yamamoto' },
    role: { en: 'Japanese Combined Fleet commander' },
    countryIds: ['jpn'],
    incidentIds: ['pearl-harbor', 'midway'],
    backgroundOverview: { en: 'Planned Pearl Harbor; Combined Fleet commander; killed 1943 (outside listed pins).' },
    backgroundStandard:
      { en: 'Advocated a decisive early blow against the US Pacific Fleet. Midway (June 1942) destroyed Japan’s carrier edge.' },
    backgroundDeep:
      { en: 'Opposed prolonged war with the US in some accounts — degree and timing of opposition are debated (unsure in simplified form).' },
    certainty: 'certain',
    wikipediaTitle: 'Isoroku Yamamoto',
    grokipediaSlug: 'Isoroku_Yamamoto',
  },
  {
    id: 'montgomery',
    name: { en: 'Bernard Montgomery' },
    role: { en: 'British field marshal' },
    countryIds: ['gbr'],
    incidentIds: ['el-alamein', 'd-day', 'market-garden', 'bulge'],
    backgroundOverview: { en: 'Commanded Eighth Army at El Alamein; major NW Europe command under Eisenhower.' },
    backgroundStandard:
      { en: 'El Alamein (1942) turned the desert war. Later 21st Army Group; Market Garden (Sep 1944) failed to end the war early.' },
    backgroundDeep:
      { en: 'Personality clashes with US peers are well attested. Operational critiques of Market Garden are mainstream historiography.' },
    certainty: 'certain',
    wikipediaTitle: 'Bernard Montgomery',
    grokipediaSlug: 'Bernard_Montgomery',
  },
  {
    id: 'nimitz',
    name: { en: 'Chester W. Nimitz' },
    role: { en: 'US Pacific Fleet admiral' },
    countryIds: ['usa'],
    incidentIds: ['midway', 'guadalcanal', 'leyte-gulf', 'iwo-jima', 'okinawa'],
    backgroundOverview: { en: 'Commander-in-Chief, US Pacific Fleet / Pacific Ocean Areas.' },
    backgroundStandard:
      { en: 'Directed carrier warfare after Midway and dual advance across the Central Pacific toward Japan.' },
    backgroundDeep:
      { en: 'Coordination with MacArthur’s SWPA was a standing strategic management problem — documented in official histories.' },
    certainty: 'certain',
    wikipediaTitle: 'Chester W. Nimitz',
    grokipediaSlug: 'Chester_W._Nimitz',
  },
  {
    id: 'tito',
    name: { en: 'Josip Broz Tito' },
    role: { en: 'Yugoslav Partisan leader' },
    countryIds: ['yug'],
    incidentIds: ['yugoslavia-coup'],
    backgroundOverview: { en: 'Led Communist Partisans against Axis occupation; postwar Yugoslav leader.' },
    backgroundStandard:
      { en: 'After Axis invasion (1941), Partisans fought occupation forces and rival factions; recognized increasingly by Allies.' },
    backgroundDeep:
      { en: 'Civil-war dimensions (Partisans vs Chetniks) are complex; casualty attribution is often unsure at fine scale.' },
    certainty: 'certain',
    wikipediaTitle: 'Josip Broz Tito',
    grokipediaSlug: 'Josip_Broz_Tito',
  },
  {
    id: 'mannerheim',
    name: { en: 'Carl Gustaf Emil Mannerheim' },
    role: { en: 'Finnish commander / statesman' },
    countryIds: ['fin'],
    incidentIds: ['winter-war', 'finland-armistice'],
    backgroundOverview: { en: 'Led Finnish defense in the Winter War; later Continuation War context; president 1944–46.' },
    backgroundStandard:
      { en: 'Winter War (1939–40) against the USSR made him an international figure. Finland fought with Germany against the USSR later, then exited via 1944 armistice.' },
    backgroundDeep:
      { en: 'Finland’s co-belligerent status is distinct from full Axis membership — reflected in this atlas’s involvement tags.' },
    certainty: 'certain',
    wikipediaTitle: 'Carl Gustaf Emil Mannerheim',
    grokipediaSlug: null,
  },
  {
    id: 'wang-jingwei',
    name: { en: 'Wang Jingwei' },
    role: { en: 'Reorganized National Government (puppet) leader' },
    countryIds: ['wjc'],
    incidentIds: [],
    backgroundOverview: { en: 'Led the Japanese-sponsored regime at Nanjing; rival to Chiang’s ROC.' },
    backgroundStandard:
      { en: 'Broke with Chiang; headed a collaborationist government. Died 1944. Metrics for the regime are sparse/unsure.' },
    backgroundDeep:
      { en: 'Portrayed as traitor in Chinese historiography; some revisionist debates exist — keep teaching focus on occupation structure.' },
    certainty: 'certain',
    wikipediaTitle: 'Wang Jingwei',
    grokipediaSlug: 'Wang_Jingwei',
  },
]

export function personBackground(person: Person, detail: DetailLevel): LocalizedText {
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
    links.push(grokSearchLink(enOf(person.name)))
  }
  return links
}
