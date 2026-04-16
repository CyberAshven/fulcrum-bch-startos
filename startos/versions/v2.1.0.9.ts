import { VersionInfo } from '@start9labs/start-sdk'
import { storeJson } from '../file-models/store.json'

export const v_2_1_0_9 = VersionInfo.of({
  version: '2.1.0:9',
  releaseNotes:
    'Fix Fulcrum backend task cleanup using supported replay-ID clearing and require backend re-selection after upgrade.',
  migrations: {
    up: async ({ effects }) => {
      await storeJson.merge(effects, { nodeConfirmed: false })
    },
    down: async () => {},
  },
})