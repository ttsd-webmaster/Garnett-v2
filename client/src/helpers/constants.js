const PLEDGING_START_DATE = new Date();
const PLEDGING_END_DATE = new Date();
PLEDGING_START_DATE.setDate(16);
PLEDGING_START_DATE.setMonth(9);
PLEDGING_END_DATE.setMonth(0);
PLEDGING_END_DATE.setYear(2020);

export { PLEDGING_START_DATE, PLEDGING_END_DATE };

export const STANDARDIZED_MERIT_OPTIONS = [
  {
    header: 'Merit reasons',
    choices: [
      { text: 'PC Merits', amount: '10', action: 'merit' },
      { text: 'Interview Merits', amount: '25', action: 'merit' },
      { text: 'Family Night Merits', amount: '20', action: 'merit' }
    ]
  },
  {
    header: 'Demerit reasons',
    choices: [
      { text: 'Late Greet', amount: '15', action: 'demerit' },
      { text: 'Missed Greet', amount: '30', action: 'demerit' },
      { text: 'Missed Text Reminder', amount: '20', action: 'demerit' },
      { text: 'Rude to Active', amount: '15', action: 'demerit' },
      { text: 'Asking for/ Complaining about Merits', amount: '15', action: 'demerit' }
    ]
  }
];
