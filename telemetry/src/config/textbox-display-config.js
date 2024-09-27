/**
 * Applies to every node
 * @type {[{ignoredIf: (function(*): boolean), name: string, key: string}]}
 */
export const GENERIC_FILTERS = [
  {
    name: 'Number Updates',
    key: 't2-number-updates',
    ignoredIf: (node) => (typeof node._val === 'number') // if node value is a number, probably is a value update
  },
]

export const ROOT_OPTION_GROUPING = {
  name: 'Select All',
  key: 't1-all',
  children: [
    {
      name: 'Control Updates',
      key: 't2-controls',
      children: [
        { key: 'abort', highlight: 'rgba(255,0,0,0.4)' },
        { key: 'hold' },
        { key: 'send-custom-message', name: 'Send Custom Message'},
        { key: 'fcEvent', name: 'Receive Custom Message', highlight: "rgba(183,255,150,0.21)"}
      ]
    },
    {
      name: 'Connection Status',
      key: 't2-connection-status',
      highlight: 'rgba(255,243,0,0.4)',
      children: [
        { key: 'flightConnected' },
        { key: 'daq1Connected' },
        { key: 'daq2Connected' },
        { key: 'actCtrlr1Connected' },
        { key: 'actCtrlr2Connected' },
      ]
    },
    {
      name: 'Unknown (Catch All) Updates',
      key: 't2-unknowns',
      highlight: 'rgba(255,72,0,0.21)',
    },
    {
      name: 'Spacers',
      key: 't2-spacers',
      children: [
        { key: 'filler' }
      ]
    }
  ]
}
