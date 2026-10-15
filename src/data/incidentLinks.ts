/**
 * Encyclopedia link targets for incidents.
 * Wikipedia titles are standard article names.
 * Grokipedia: use /page/Slug when confident; else search (labeled unsure).
 */

import type { Certainty } from './types'
import {
  grokPageLink,
  grokSearchLink,
  wikiLink,
  type ExternalLink,
} from './externalLinks'

type IncidentLinkSpec = {
  /** Wikipedia article title (spaces OK; converted to underscores). */
  wikipediaTitle: string
  wikiCertainty?: Certainty
  /**
   * Grokipedia page slug if believed to resolve; omit to force search fallback.
   * Verified host pattern: https://grokipedia.com/page/{Slug}
   */
  grokipediaSlug?: string
}

const SPECS: Record<string, IncidentLinkSpec> = {
  'marco-polo': { wikipediaTitle: 'Marco Polo Bridge Incident', grokipediaSlug: 'Marco_Polo_Bridge_Incident' },
  'battle-shanghai': { wikipediaTitle: 'Battle of Shanghai', grokipediaSlug: 'Battle_of_Shanghai' },
  'nanjing-fall': { wikipediaTitle: 'Nanjing Massacre', grokipediaSlug: 'Nanjing_Massacre' },
  anschluss: { wikipediaTitle: 'Anschluss', grokipediaSlug: 'Anschluss' },
  'munich-agreement': { wikipediaTitle: 'Munich Agreement', grokipediaSlug: 'Munich_Agreement' },
  kristallnacht: { wikipediaTitle: 'Kristallnacht', grokipediaSlug: 'Kristallnacht' },
  'czecho-occupation': {
    wikipediaTitle: 'German occupation of Czechoslovakia',
    grokipediaSlug: 'German_occupation_of_Czechoslovakia',
  },
  'molotov-ribbentrop': {
    wikipediaTitle: 'Molotov–Ribbentrop Pact',
    grokipediaSlug: 'Molotov–Ribbentrop_Pact',
  },
  'poland-invasion': { wikipediaTitle: 'Invasion of Poland', grokipediaSlug: 'Invasion_of_Poland' },
  'uk-france-declare': {
    wikipediaTitle: 'United Kingdom declaration of war on Germany (1939)',
    // search — long title may not match Grokipedia slug
  },
  'ussr-poland': { wikipediaTitle: 'Soviet invasion of Poland', grokipediaSlug: 'Soviet_invasion_of_Poland' },
  'warsaw-surrender': { wikipediaTitle: 'Siege of Warsaw (1939)' },
  'scapa-flow': { wikipediaTitle: 'HMS Royal Oak (08)' },
  'winter-war': { wikipediaTitle: 'Winter War', grokipediaSlug: 'Winter_War' },
  altmark: { wikipediaTitle: 'Altmark incident' },
  weserubung: { wikipediaTitle: 'Operation Weserübung', grokipediaSlug: 'Operation_Weserübung' },
  'churchill-pm': { wikipediaTitle: 'Winston Churchill', grokipediaSlug: 'Winston_Churchill' },
  'fall-gelb': { wikipediaTitle: 'Battle of France', grokipediaSlug: 'Battle_of_France' },
  dunkirk: { wikipediaTitle: 'Dunkirk evacuation', grokipediaSlug: 'Dunkirk_evacuation' },
  'italy-enters': { wikipediaTitle: 'Italian entry into World War II' },
  'france-armistice': { wikipediaTitle: 'Armistice of 22 June 1940' },
  'mera-elkem': { wikipediaTitle: 'Soviet occupation of Bessarabia and Northern Bukovina' },
  'battle-britain': { wikipediaTitle: 'Battle of Britain', grokipediaSlug: 'Battle_of_Britain' },
  'blitz-london': { wikipediaTitle: 'The Blitz', grokipediaSlug: 'The_Blitz' },
  'tripartite-pact': { wikipediaTitle: 'Tripartite Pact', grokipediaSlug: 'Tripartite_Pact' },
  'greece-italy': { wikipediaTitle: 'Greco-Italian War', grokipediaSlug: 'Greco-Italian_War' },
  taranto: { wikipediaTitle: 'Battle of Taranto', grokipediaSlug: 'Battle_of_Taranto' },
  'lend-lease': { wikipediaTitle: 'Lend-Lease', grokipediaSlug: 'Lend-Lease' },
  'yugoslavia-coup': { wikipediaTitle: 'Invasion of Yugoslavia', grokipediaSlug: 'Invasion_of_Yugoslavia' },
  'greece-germany': { wikipediaTitle: 'German invasion of Greece' },
  'iraq-war': { wikipediaTitle: 'Anglo-Iraqi War' },
  crete: { wikipediaTitle: 'Battle of Crete', grokipediaSlug: 'Battle_of_Crete' },
  'bismarck-sunk': { wikipediaTitle: 'Last battle of the battleship Bismarck' },
  barbarossa: { wikipediaTitle: 'Operation Barbarossa', grokipediaSlug: 'Operation_Barbarossa' },
  'syria-lebanon': { wikipediaTitle: 'Syria–Lebanon campaign' },
  'atlantic-charter': { wikipediaTitle: 'Atlantic Charter', grokipediaSlug: 'Atlantic_Charter' },
  'iran-invasion': { wikipediaTitle: 'Anglo-Soviet invasion of Iran' },
  'siege-leningrad': { wikipediaTitle: 'Siege of Leningrad', grokipediaSlug: 'Siege_of_Leningrad' },
  'moscow-defense': { wikipediaTitle: 'Battle of Moscow', grokipediaSlug: 'Battle_of_Moscow' },
  'pearl-harbor': { wikipediaTitle: 'Attack on Pearl Harbor', grokipediaSlug: 'Attack_on_Pearl_Harbor' },
  'germany-declares-us': { wikipediaTitle: 'German declaration of war against the United States' },
  'hong-kong-falls': { wikipediaTitle: 'Battle of Hong Kong' },
  wansee: { wikipediaTitle: 'Wannsee Conference', grokipediaSlug: 'Wannsee_Conference' },
  'singapore-falls': { wikipediaTitle: 'Fall of Singapore', grokipediaSlug: 'Fall_of_Singapore' },
  'java-sea': { wikipediaTitle: 'Battle of the Java Sea' },
  bataan: { wikipediaTitle: 'Bataan Death March', grokipediaSlug: 'Bataan_Death_March' },
  'doolittle-raid': { wikipediaTitle: 'Doolittle Raid', grokipediaSlug: 'Doolittle_Raid' },
  'coral-sea': { wikipediaTitle: 'Battle of the Coral Sea', grokipediaSlug: 'Battle_of_the_Coral_Sea' },
  midway: { wikipediaTitle: 'Battle of Midway', grokipediaSlug: 'Battle_of_Midway' },
  'gazala-fall-tobruk': { wikipediaTitle: 'Battle of Gazala' },
  guadalcanal: { wikipediaTitle: 'Guadalcanal campaign', grokipediaSlug: 'Guadalcanal_campaign' },
  dieppe: { wikipediaTitle: 'Dieppe Raid', grokipediaSlug: 'Dieppe_Raid' },
  stalingrad: { wikipediaTitle: 'Battle of Stalingrad', grokipediaSlug: 'Battle_of_Stalingrad' },
  'el-alamein': {
    wikipediaTitle: 'Second Battle of El Alamein',
    grokipediaSlug: 'Second_Battle_of_El_Alamein',
  },
  torch: { wikipediaTitle: 'Operation Torch', grokipediaSlug: 'Operation_Torch' },
  uranus: { wikipediaTitle: 'Operation Uranus', grokipediaSlug: 'Operation_Uranus' },
  casablanca: { wikipediaTitle: 'Casablanca Conference', grokipediaSlug: 'Casablanca_Conference' },
  'stalingrad-surrender': { wikipediaTitle: 'Battle of Stalingrad', grokipediaSlug: 'Battle_of_Stalingrad' },
  kasserine: { wikipediaTitle: 'Battle of Kasserine Pass' },
  'warsaw-ghetto': { wikipediaTitle: 'Warsaw Ghetto Uprising', grokipediaSlug: 'Warsaw_Ghetto_Uprising' },
  'tunisia-ends': { wikipediaTitle: 'Tunisian campaign' },
  kursk: { wikipediaTitle: 'Battle of Kursk', grokipediaSlug: 'Battle_of_Kursk' },
  husky: { wikipediaTitle: 'Allied invasion of Sicily', grokipediaSlug: 'Allied_invasion_of_Sicily' },
  'mussolini-fall': { wikipediaTitle: 'Fall of the Fascist regime in Italy' },
  'hamburg-gomorrah': { wikipediaTitle: 'Bombing of Hamburg in World War II' },
  'italy-armistice': { wikipediaTitle: 'Armistice of Cassibile' },
  salerno: { wikipediaTitle: 'Allied invasion of Italy' },
  'smolensk-liberated': { wikipediaTitle: 'Smolensk operation (1943)' },
  tarawa: { wikipediaTitle: 'Battle of Tarawa', grokipediaSlug: 'Battle_of_Tarawa' },
  tehran: { wikipediaTitle: 'Tehran Conference', grokipediaSlug: 'Tehran_Conference' },
  'leningrad-lifted': { wikipediaTitle: 'Siege of Leningrad', grokipediaSlug: 'Siege_of_Leningrad' },
  'monte-cassino': { wikipediaTitle: 'Battle of Monte Cassino', grokipediaSlug: 'Battle_of_Monte_Cassino' },
  hailstone: { wikipediaTitle: 'Operation Hailstone' },
  'imphal-kohima': { wikipediaTitle: 'Battle of Imphal' },
  'rome-falls': { wikipediaTitle: 'Italian campaign (World War II)' },
  'd-day': { wikipediaTitle: 'Normandy landings', grokipediaSlug: 'Normandy_landings' },
  saipan: { wikipediaTitle: 'Battle of Saipan', grokipediaSlug: 'Battle_of_Saipan' },
  bagration: { wikipediaTitle: 'Operation Bagration', grokipediaSlug: 'Operation_Bagration' },
  'july-20-plot': { wikipediaTitle: '20 July plot', grokipediaSlug: '20_July_plot' },
  'warsaw-uprising': { wikipediaTitle: 'Warsaw Uprising', grokipediaSlug: 'Warsaw_Uprising' },
  falaise: { wikipediaTitle: 'Falaise pocket', grokipediaSlug: 'Falaise_pocket' },
  'paris-liberated': { wikipediaTitle: 'Liberation of Paris', grokipediaSlug: 'Liberation_of_Paris' },
  'market-garden': { wikipediaTitle: 'Operation Market Garden', grokipediaSlug: 'Operation_Market_Garden' },
  'finland-armistice': { wikipediaTitle: 'Moscow Armistice' },
  leyte: { wikipediaTitle: 'Battle of Leyte' },
  'leyte-gulf': { wikipediaTitle: 'Battle of Leyte Gulf', grokipediaSlug: 'Battle_of_Leyte_Gulf' },
  bulge: { wikipediaTitle: 'Battle of the Bulge', grokipediaSlug: 'Battle_of_the_Bulge' },
  'vistula-oder': { wikipediaTitle: 'Vistula–Oder offensive' },
  'auschwitz-liberated': { wikipediaTitle: 'Auschwitz concentration camp', grokipediaSlug: 'Auschwitz_concentration_camp' },
  yalta: { wikipediaTitle: 'Yalta Conference', grokipediaSlug: 'Yalta_Conference' },
  dresden: { wikipediaTitle: 'Bombing of Dresden', grokipediaSlug: 'Bombing_of_Dresden' },
  'iwo-jima': { wikipediaTitle: 'Battle of Iwo Jima', grokipediaSlug: 'Battle_of_Iwo_Jima' },
  remagen: { wikipediaTitle: 'Battle of Remagen' },
  'tokyo-firebombing': { wikipediaTitle: 'Bombing of Tokyo', grokipediaSlug: 'Bombing_of_Tokyo' },
  okinawa: { wikipediaTitle: 'Battle of Okinawa', grokipediaSlug: 'Battle_of_Okinawa' },
  'roosevelt-dies': { wikipediaTitle: 'Franklin D. Roosevelt', grokipediaSlug: 'Franklin_D._Roosevelt' },
  'vienna-falls': { wikipediaTitle: 'Vienna offensive' },
  'italian-surrender': { wikipediaTitle: 'Surrender of Caserta' },
  'hitler-death': { wikipediaTitle: 'Death of Adolf Hitler', grokipediaSlug: 'Death_of_Adolf_Hitler' },
  'berlin-falls': { wikipediaTitle: 'Battle of Berlin', grokipediaSlug: 'Battle_of_Berlin' },
  've-day': { wikipediaTitle: 'Victory in Europe Day', grokipediaSlug: 'Victory_in_Europe_Day' },
  trinity: { wikipediaTitle: 'Trinity (nuclear test)', grokipediaSlug: 'Trinity_(nuclear_test)' },
  potsdam: { wikipediaTitle: 'Potsdam Conference', grokipediaSlug: 'Potsdam_Conference' },
  hiroshima: {
    wikipediaTitle: 'Atomic bombings of Hiroshima and Nagasaki',
    grokipediaSlug: 'Atomic_bombings_of_Hiroshima_and_Nagasaki',
  },
  'soviet-japan': { wikipediaTitle: 'Soviet–Japanese War', grokipediaSlug: 'Soviet–Japanese_War' },
  nagasaki: {
    wikipediaTitle: 'Atomic bombings of Hiroshima and Nagasaki',
    grokipediaSlug: 'Atomic_bombings_of_Hiroshima_and_Nagasaki',
  },
  'japan-accepts': { wikipediaTitle: 'Surrender of Japan', grokipediaSlug: 'Surrender_of_Japan' },
  'vj-day': { wikipediaTitle: 'Victory over Japan Day', grokipediaSlug: 'Victory_over_Japan_Day' },
}

export function incidentExternalLinks(
  incidentId: string,
  incidentTitle: string,
): ExternalLink[] {
  const spec = SPECS[incidentId]
  if (!spec) {
    return [wikiLink(incidentTitle, 'unsure'), grokSearchLink(incidentTitle)]
  }
  const links: ExternalLink[] = [
    wikiLink(spec.wikipediaTitle, spec.wikiCertainty ?? 'certain'),
  ]
  if (spec.grokipediaSlug) {
    links.push(grokPageLink(spec.grokipediaSlug, 'certain'))
  } else {
    links.push(grokSearchLink(spec.wikipediaTitle))
  }
  return links
}
