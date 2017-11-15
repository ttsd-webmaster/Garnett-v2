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
    options: [
      { 
        value: 'Kappa', 
        label: 'Kappa',
      },
      { 
        value: 'Lambda', 
        label: 'Lambda',
      },
      { 
        value: 'Mu', 
        label: 'Mu',
      },
      { 
        value: 'Nu', 
        label: 'Nu',
      },
      { 
        value: 'Xi', 
        label: 'Xi',
      },
      { 
        value: 'Omicron', 
        label: 'Omicron',
      },
      { 
        value: 'Pi', 
        label: 'Pi',
      },
      {
        value: 'Rho',
        label: 'Rho',
      }
    ]
  },
  {
    name: 'Major',
    value: 'major',
    errorText: 'Please select a major.',
    options: [
      { 
        value: 'Aerospace Engineering', 
        label: 'Aerospace Engineering',
      },
      { 
        value: 'Bioengineering', 
        label: 'Bioengineering',
      },
      { 
        value: 'Chemical Engineering', 
        label: 'Chemical Engineering',
      },
      { 
        value: 'Computer Engineering', 
        label: 'Computer Engineering',
      },
      { 
        value: 'Computer Science', 
        label: 'Computer Science', 
      },
      { 
        value: 'Electrical Engineering', 
        label: 'Electrical Engineering',
      },
      { 
        value: 'Environmental Engineering', 
        label: 'Environmental Engineering',
      },
      { 
        value: 'Mechanical Engineering', 
        label: 'Mechanical Engineering',
      },
      { 
        value: 'Nanoengineering', 
        label: 'Nanoengineering',
      },
      { 
        value: 'Structural Engineering', 
        label: 'Structural Engineering',
      },
    ]
  },
  {
    name: 'Year',
    value: 'year',
    errorText: 'Please select an year.',
    options: [
      {
        value: '1st Year',
        label: '1st Year'
      },
      {
        value: '2nd Year',
        label: '2nd Year'
      },
      {
        value: '3rd Year',
        label: '3rd Year'
      },
      {
        value: '4th Year',
        label: '4th Year'
      },
      {
        value: '5th Year',
        label: '5th Year'
      },
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
