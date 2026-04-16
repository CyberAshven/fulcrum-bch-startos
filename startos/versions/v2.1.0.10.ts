import { VersionInfo } from '@start9labs/start-sdk'
import { readFile, writeFile } from 'fs/promises'

const storePath = '/media/startos/volumes/main/store.json'

export const v_2_1_0_10 = VersionInfo.of({
  version: '2.1.0:10',
  releaseNotes:
    'Reliably force Fulcrum backend re-selection on upgrade so stale BCHN/BCHD task state is replaced by the current selected backend only.',
  migrations: {
    up: async () => {
      try {
        const raw = await readFile(storePath, 'utf8')
        const parsed = JSON.parse(raw)
        parsed.nodeConfirmed = false
        await writeFile(storePath, JSON.stringify(parsed, null, 2))
      } catch (error) {
        console.error('Failed to reset Fulcrum nodeConfirmed during migration', error)
      }
    },
    down: async () => {},
  },
})