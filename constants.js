const tightCallRange = ['QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AKs', 'AKo', 'AQs', 'AJs', 'ATs',
                        'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'T9s', '98s', '87s', '76s'];
const tightRaiseRange = ['A9s', 'A9o', 'A8s', 'A8o', 'A7s', 'A7o', 'A6s', 'A4s', 'A3s', 'A2s', 'K9s', 'K9o', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s',
                        'K2s', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'J9s', 'J8s', 'J7s', 'T8s', 'T7s', '97s', '96s',
                        '86s', '75s', '65s', '64s', '54s', '53s', '43s', 'AQo', 'KQo', 'AJo', 'KJo', 'QJo', 'ATo',
                        'KTo', 'QTo', 'JTo', 'A9o', 'K9o', 'A8o', 'A7o'];
const tightThreeBetRange = ['AA', 'KK', 'A5s'];

const looseCallRange = ['A9s', 'A8s', 'A7s', 'A6s', 'KTs', 'K9s', 'QTs', 'Q9s', 'J9s', 'J8s', 'T9s', 'T8s', 'T7s',
                        '98s', '87s', '86s', '76s', '65s', '64s', '54s', '53s', '43s', '88', '77', '66', '55',
                         '44', '33', '22', 'KQo', 'AJo', 'KJo', 'ATo'];
const looseRaiseRange = ['K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'J7s', '96s',
                         'QJo', 'KTo', 'QTo', 'JTo', 'A9o', 'K9o', 'A8o', 'A7o'];
const looseThreeBetRange = ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', 'AKs', 'AQs', 'AJs', 'ATs', 'A5s', 'A4s', 'A3s', 'A2s',
                        'KQs', 'KJs', 'QJs', 'JTs', '97s', '75s'];

const cutOffCallRange = ['AKo', 'QQ', 'JJ', 'TT','99', '88', '77', '66', '55', '44', '33', '22',
                            'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs',
                        'JTs', 'T9s', '98s', '87s', '76s', ]
const cutOffRaiseRange = ['A9s', 'A8s', 'A7s', 'A6s', 'A4s', 'A3s', 'A2s', 'K9s', 'K8s', 'K7s',
                            'Q9s', 'J9s', 'T8s', '97s', '86s', '75s', '65s', '64s', '54s', '53s', '43s',
                        'AQo', 'KQo', 'AJo', 'KJo', 'ATo']
const cutOffThreeBetRange = ['AA', 'KK', 'A5s']

export default {
    tightCallRange: tightCallRange,
    tightRaiseRange: tightRaiseRange,
    tightThreeBetRange: tightThreeBetRange,

    looseCallRange: looseCallRange,
    looseRaiseRange: looseRaiseRange,
    looseThreeBetRange: looseThreeBetRange,

    cutOffCallRange: cutOffCallRange,
    cutOffRaiseRange: cutOffRaiseRange,
    cutOffThreeBetRange: cutOffThreeBetRange
}