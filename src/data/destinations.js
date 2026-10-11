// ponytail: placeholder data, move to a JSON/API when real trips exist. Optional per trip: `images`, `options` (duration + dates), `packages`, `inclusions`, `meeting`
export const destinations = [
  {
    name: 'Dahab', length: '4 Days/3 Nights', dates: ['15/10', '22/10', '29/10'], tone: 'blue',
    options: [
      { length: '4 Days / 3 Nights', dates: ['15/10', '22/10', '29/10'] },
      { length: '5 Days / 4 Nights', dates: ['11/10', '18/10', '25/10'] },
    ],
    packages: [
      { name: 'SEAHORSE Hotel', board: 'Room Only', price: 4700 },
      { name: 'NUBIA Hotel (Half Board)', board: 'Half Board (Breakfast & Dinner)', price: 6750 },
      { name: 'CANYON Hotel', board: 'Breakfast Only', price: 6700 },
    ],
    inclusions: [
      'Round-trip Cairo/Sinai luxury AC bus transfers',
      'Hotel stay according to selected package & board type',
      'Blue Hole & Three Pools snorkeling guided expedition',
      'Wadi Qunai hiking & Bedouin mountain dinner gathering',
      'Infinity Vibes group coordinator on-site 24/7',
    ],
    meeting: 'Abbaseya / Heliopolis / Alexandria pickup',
  },
  { name: 'Fayoum', length: '2 Days/1 Night', dates: ['18/10', '25/10'], tone: 'lime' },
  { name: 'Ain El Sokhna', length: '3 Days/2 Nights', dates: ['16/10', '30/10'], tone: 'grey' },
]

export const slugOf = (name) => name.toLowerCase().replace(/\s+/g, '-')
