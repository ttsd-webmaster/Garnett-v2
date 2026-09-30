const PLEDGING_START_DATE = new Date();
const PLEDGING_END_DATE = new Date();
PLEDGING_START_DATE.setDate(16);
PLEDGING_START_DATE.setMonth(9);
PLEDGING_START_DATE.setYear(2019)
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

export const MERIT_FILTER_OPTIONS = [
  'Created on Garnett',
  'Merit Date'
];

// Hardcoded active point admins. Only these two can award, correct, or take
// back active points. Keep in sync with POINTS_ADMINS in
// controllers/activePointsController.js, which is what actually enforces it.
// Emanuel is listed under both his own key and his pledge instructor key, since
// the PI handoff moves his account between them.
export const POINTS_ADMINS = ['EmanuelNader', 'PledgeInstructorNader', 'SophiaKim'];

export const POINTS_VIEW_OPTIONS = [
  { view: 'myPoints', label: 'My Points' },
  { view: 'leaderboard', label: 'Leaderboard' }
];

// Point admins also get a feed of every award, like All Merits
export const POINTS_ADMIN_VIEW_OPTIONS = POINTS_VIEW_OPTIONS.concat([
  { view: 'allPoints', label: 'All Points' }
]);
