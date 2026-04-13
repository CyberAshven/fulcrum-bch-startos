import { sdk } from '../sdk'
import { fulcrumConf } from '../file-models/fulcrum.conf'
import { bannerTxt } from '../file-models/banner.txt'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  banner: Value.textarea({
    name: 'Server Banner',
    description:
      'MOTD banner shown to Electrum clients when they connect to this server',
    required: false,
    default: null,
  }),
  bitcoind_timeout: Value.number({
    name: 'Bitcoin RPC Timeout (seconds)',
    description:
      'Timeout in seconds for RPC calls to Bitcoin Cash Node. Increase if you experience timeouts during initial sync.',
    required: true,
    default: 30,
    min: 5,
    max: 600,
    integer: true,
    units: 'seconds',
  }),
  bitcoind_clients: Value.number({
    name: 'Bitcoin RPC Clients',
    description:
      'Number of simultaneous RPC connections to Bitcoin Cash Node. Higher values may speed up initial sync but use more resources.',
    required: true,
    default: 3,
    min: 1,
    max: 16,
    integer: true,
    units: null,
  }),
  worker_threads: Value.number({
    name: 'Worker Threads (0 for auto)',
    description:
      'Number of worker threads for serving Electrum clients. Set to 0 for automatic (uses all available CPU cores).',
    required: true,
    default: 0,
    min: 0,
    max: 64,
    integer: true,
    units: null,
  }),
  db_mem: Value.number({
    name: 'Database Memory (MB)',
    description:
      'Amount of memory in MB allocated to the database cache. Higher values improve performance but use more RAM.',
    required: true,
    default: 2048,
    min: 64,
    max: 16384,
    integer: true,
    units: 'MB',
  }),
  db_max_open_files: Value.number({
    name: 'Database Max Open Files',
    description:
      'Maximum number of files the database engine will keep open. Increase if you encounter "too many open files" errors.',
    required: true,
    default: 1000,
    min: 64,
    max: 100000,
    integer: true,
    units: null,
  }),
})

export const configure = sdk.Action.withInput(
  'configure',

  async ({ effects }) => ({
    name: 'Configure',
    description: 'Configure Fulcrum banner and performance settings',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  // Pre-fill from current config
  async ({ effects }) => {
    const conf = await fulcrumConf.read().once()
    const banner = await bannerTxt.read().once()
    return {
      banner: banner ?? null,
      bitcoind_timeout: conf?.bitcoind_timeout ?? 30,
      bitcoind_clients: conf?.bitcoind_clients ?? 3,
      worker_threads: conf?.worker_threads ?? 0,
      db_mem: conf?.db_mem ?? 2048,
      db_max_open_files: conf?.db_max_open_files ?? 1000,
    }
  },

  // Save config
  async ({ effects, input }) => {
    await fulcrumConf.merge(effects, {
      bitcoind_timeout: input.bitcoind_timeout,
      bitcoind_clients: input.bitcoind_clients,
      worker_threads: input.worker_threads,
      db_mem: input.db_mem,
      db_max_open_files: input.db_max_open_files,
    })
    if (input.banner != null) {
      await bannerTxt.write(effects, input.banner)
    }
    return null
  },
)
