import merge from 'webpack-merge'
import * as baseConfig from '../../config'

const config = merge(baseConfig, {

  API_ROUTES: {
    HEALTH: baseConfig.SERVER_URL + '/ok',
    GET_USERNAME: baseConfig.SERVER_URL + '/username',
  },

  SOCKET_WORKSPACES: {
    ROOM: baseConfig.SOCKET_URL + '/room'
  },

  TEXTURES: {
    HERO: 'hero',
    BOX: 'box',
  },

  EVENTS: {
    HERO: {
      DASH: 'dash',
      DASH_ENDED: 'dash-ended',
    }
  },

  GAME: {},

  STORAGE: {
    NAME: '_name'
  },

  PING_INTERVAL_TIME: 1000, // check ping interval

})

const {
  API_ROUTES,
  SOCKET_WORKSPACES,
  TEXTURES,
  EVENTS,
  GAME,
  STORAGE,
  PING_INTERVAL_TIME,
} = config

export {
  API_ROUTES,
  SOCKET_WORKSPACES,
  TEXTURES,
  EVENTS,
  GAME,
  STORAGE,
  PING_INTERVAL_TIME,
}