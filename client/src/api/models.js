// @flow

export type User = {
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  class: string,
  major: string,
  status: string,
  photoURL: string
};

export type SignUpParams = {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  className: string,
  majorName: string,
  year: string,
  phone: string,
  code: string,
  pledgeCode: string
};

export type Merit = {
  createdBy: string,
  activeName: string,
  description: string,
  amount: number,
  activePhoto: string,
  date: string,
  isPCGreet: boolean
};

export type MeritInfo = {
  displayName: string,
  selectedPledges: Array<Object>, // TODO: Change Object to Pledge type
  merit: Merit, //TODO: Change Object to Merit type
  isChalkboard: boolean,
  isPCGreet: boolean,
  status?: string 
};
