const formData1 = [
  {
    name: 'First Name',
    value: 'firstname',
    type: 'text',
  },
  {
    name: 'Last Name',
    value: 'lastname',
    type: 'text',
  },
];

const selectData = [
  {
    name: 'Class',
    value: 'class',
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
  },
  {
    name: 'Authorization Code',
    value: 'code',
    type: 'password',
  },
  {
    name: 'Password',
    value: 'password',
    type: 'password',
  },
  {
    name: 'Password Confirmation',
    value: 'confirmation',
    type: 'password',
  },
];

export {formData1, selectData, formData2};