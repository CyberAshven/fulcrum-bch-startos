import { sdk } from '../sdk'
import { configure } from './configure'
import { selectNode } from './selectNode'

export const actions = sdk.Actions.of().addAction(selectNode).addAction(configure)
