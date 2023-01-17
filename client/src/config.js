import merge from 'webpack-merge'
import * as baseConfig from '../../config'

const config = merge(baseConfig, {

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

  PING_INTERVAL_TIME: 1000, // every one second

})

const {
  SOCKET_WORKSPACES,
  TEXTURES,
  EVENTS,
  PING_INTERVAL_TIME
} = config

export {
  SOCKET_WORKSPACES,
  TEXTURES,
  EVENTS,
  PING_INTERVAL_TIME
}