
export const SOCKET_IO_URL = '';

export const SOCKET_IO = {
  ROOM_WORKSPACE: SOCKET_IO_URL + '/room'
}

export const EVENTS = {
  SOCKET: {
    PLAYER_POSITION_CHANGED: 'player-position-changed',
    PLAYERS_COLLIDED: 'players-collided',
  }
}

export const TEXTURES = {
  HERO: 'hero',
  BOX: 'box',
}
export const HERO = TEXTURES.HERO
export const BOX = TEXTURES.BOX