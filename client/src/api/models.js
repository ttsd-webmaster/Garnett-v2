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
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  className: string,
  major: string,
  year: string,
  phone: string,
  code: string
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
