import { VersionInfo } from '@start9labs/start-sdk'

export const v_2_1_0_2 = VersionInfo.of({
  version: '2.1.0:2',
  releaseNotes:
    'Fix init loop: seed files only on fresh install to prevent restart cycling. Updated dependency references.',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
