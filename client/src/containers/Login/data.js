const activeCode = 'garnett';

const pledgeCode = 'rhoclass';

const formData1 = [
  {
    name: 'First Name',
    value: 'firstName',
    type: 'text',
    errorText: 'Please enter a first name.',
  },
  {
    name: 'Last Name',
    value: 'lastName',
    type: 'text',
    errorText: 'Please enter a last name.',
  },
];

const selectData = [
  {
    name: 'Class',
    value: 'class',
    errorText: 'Please select a class.',
    options: [ 'Charter', 'Alpha', 'Beta', 'Gamma', 
               'Delta', 'Epsilon', 'Zeta', 'Eta', 
               'Iota', 'Kappa', 'Lambda', 'Mu', 
               'Nu', 'Xi', 'Omicron', 'Pi', 
               'Rho'
             ],
  },
  {
    name: 'Major',
    value: 'major',
    errorText: 'Please select a major.',
    options: [ 'Aerospace Engineering',
               'Bioengineering',
               'Chemical Engineering',
               'Computer Engineering',
               'Computer Science',
               'Electrical Engineering',
               'Environmental Engineering',
               'Mechanical Engineering',
               'Nanoengineering',
               'Structural Engineering'
             ]
  },
  {
    name: 'Year',
    value: 'year',
    errorText: 'Please select an year.',
    options: [ '1st Year',
               '2nd Year',
               '3rd Year',
               '4th Year',
               '5th Year',
               'Alumni'
             ]
  }
];

const formData2 = [
  {
    name: 'Phone',
    value: 'phone',
    type: 'number',
    errorText: 'Please enter a valid phone number.',
  },
  {
    name: 'Email',
    value: 'email',
    type: 'email',
    errorText: 'Please enter a valid email.',
  },
  {
    name: 'Authorization Code',
    value: 'code',
    type: 'password',
    errorText: 'The authorization code is not correct.',
  },
  {
    name: 'Password',
    value: 'password',
    type: 'password',
    errorText: 'Please enter a password that is longer than 8 characters.',
  },
  {
    name: 'Password Confirmation',
    value: 'confirmation',
    type: 'password',
    errorText: 'The confirmation password does not match.',
  },
];

export {activeCode, pledgeCode, formData1, selectData, formData2};
