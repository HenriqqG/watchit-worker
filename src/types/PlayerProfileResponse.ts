export interface PlayerProfileResponse {
  player_id: string
  nickname: string
  avatar: string
  country: string
  cover_image: string
  platforms: Platforms
  games: Games
  settings: Settings
  friends_ids: string[]
  new_steam_id: string
  steam_id_64: string
  steam_nickname: string
  memberships: string[]
  faceit_url: string
  membership_type: string
  cover_featured_image: string
  infractions: Infractions
  verified: boolean
  activated_at: string
}

export interface Platforms {
  steam: string
}

export interface Games {
  cs2: Cs2
  csgo: Csgo
}

export interface Cs2 {
  region: string
  game_player_id: string
  skill_level: number
  faceit_elo: number
  game_player_name: string
  skill_level_label: string
  regions: Regions
  game_profile_id: string
}

export interface Regions {}

export interface Csgo {
  region: string
  game_player_id: string
  skill_level: number
  faceit_elo: number
  game_player_name: string
  skill_level_label: string
  regions: Regions2
  game_profile_id: string
}

export interface Regions2 {}

export interface Settings {
  language: string
}

export interface Infractions {}
