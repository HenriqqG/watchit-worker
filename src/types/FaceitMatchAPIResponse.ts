export interface FaceitMatch {
  match_id: string
  version: number
  game: string
  region: string
  competition_id: string
  competition_type: string
  competition_name: string
  organizer_id: string
  teams: Teams
  voting: Voting
  calculate_elo: boolean
  configured_at: number
  started_at: number
  finished_at: number
  demo_url: string[]
  chat_room_id: string
  best_of: number
  results: Results
  detailed_results: DetailedResult[]
  status: string
  faceit_url: string
}

export interface Teams {
  faction1: Faction1
  faction2: Faction2
}

export interface Faction1 {
  faction_id: string
  leader: string
  avatar: string
  roster: Roster[]
  stats: Stats
  substituted: boolean
  name: string
  type: string
}

export interface Roster {
  player_id: string
  nickname: string
  avatar: string
  membership: string
  game_player_id: string
  game_player_name: string
  game_skill_level: number
  anticheat_required: boolean
}

export interface Stats {
  winProbability: number
  skillLevel: SkillLevel
  rating: number
}

export interface SkillLevel {
  average: number
  range: Range
}

export interface Range {
  min: number
  max: number
}

export interface Faction2 {
  faction_id: string
  leader: string
  avatar: string
  roster: Roster2[]
  stats: Stats2
  substituted: boolean
  name: string
  type: string
}

export interface Roster2 {
  player_id: string
  nickname: string
  avatar: string
  membership: string
  game_player_id: string
  game_player_name: string
  game_skill_level: number
  anticheat_required: boolean
}

export interface Stats2 {
  winProbability: number
  skillLevel: SkillLevel2
  rating: number
}

export interface SkillLevel2 {
  average: number
  range: Range2
}

export interface Range2 {
  min: number
  max: number
}

export interface Voting {
  voted_entity_types: string[]
  location: Location
  map: Map
}

export interface Location {
  entities: Entity[]
  pick: string[]
}

export interface Entity {
  name: string
  class_name: string
  game_location_id: string
  guid: string
  image_lg: string
  image_sm: string
}

export interface Map {
  pick: string[]
  entities: Entity2[]
}

export interface Entity2 {
  class_name: string
  game_map_id: string
  guid: string
  image_lg: string
  image_sm: string
  name: string
}

export interface Results {
  winner: string
  score: Score
}

export interface Score {
  faction2: number
  faction1: number
}

export interface DetailedResult {
  asc_score: boolean
  winner: string
  factions: Factions
}

export interface Factions {
  faction2: Faction22
  faction1: Faction12
}

export interface Faction22 {
  score: number
}

export interface Faction12 {
  score: number
}
