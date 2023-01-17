import merge from 'webpack-merge'
import * as baseConfig from '../../config'

const config = merge(baseConfig, {

  API_ROUTES: {
    HEALTH: baseConfig.SERVER_URL + '/ok',
    GET_USERNAME: baseConfig.SERVER_URL + '/username',
  },

  SOCKET_WORKSPACES: {
    ROOM: baseConfig.SERVER_URL + '/room'
  },

  TEXTURES: {
    HERO: 'hero',
    BOX: 'box',
  },

  EVENTS: {
    SOCKET: {
      TEST_EVENT_BLAKJDF: 'test-vente-sdfkjsdf'
    }
  },

  STORAGE: {
    NAME: '_name'
  },

  PING_INTERVAL_TIME: 1000, // every one second

})

const {
  API_ROUTES,
  SOCKET_WORKSPACES,
  TEXTURES,
  EVENTS,
  STORAGE,
  PING_INTERVAL_TIME
} = config

export {
  API_ROUTES,
  SOCKET_WORKSPACES,
  TEXTURES,
  EVENTS,
  STORAGE,
  PING_INTERVAL_TIME
}