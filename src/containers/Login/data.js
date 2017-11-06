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
        value: 'kappa', 
        label: 'Kappa',
      },
      { 
        value: 'lambda', 
        label: 'Lambda',
      },
      { 
        value: 'mu', 
        label: 'Mu',
      },
      { 
        value: 'nu', 
        label: 'Nu',
      },
      { 
        value: 'xi', 
        label: 'Xi',
      },
      { 
        value: 'omicron', 
        label: 'Omicron',
      },
      { 
        value: 'pi', 
        label: 'Pi',
      },
      {
        value: 'rho',
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
      value: 'aero', 
      label: 'Aerospace Engineering',
    },
    { 
      value: 'bio', 
      label: 'Bioengineering',
    },
    { 
      value: 'chem', 
      label: 'Chemical Engineering',
    },
    { 
      value: 'ce', 
      label: 'Computer Engineering',
    },
    { 
      value: 'cs', 
      label: 'Computer Science', 
    },
    { 
      value: 'ee', 
      label: 'Electrical Engineering',
    },
    { 
      value: 'env', 
      label: 'Environmental Engineering',
    },
    { 
      value: 'mech', 
      label: 'Mechanical Engineering',
    },
    { 
      value: 'nano', 
      label: 'Nanoengineering',
    },
    { 
      value: 'struct', 
      label: 'Structural Engineering',
    },
    ]
  },
];

const formData2 = [
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