// @flow

export type User = {
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  class: string,
  major: string,
  status: string,
  photoURL: string,
  remainingMerits?: number
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

export const MeritType =
  'personal' |
  'standardized' |
  'interview' |
  'chalkboard';

type BaseMerit = {
  type: MeritType,
  createdBy: string,
  description: string,
  amount: number,
  date: string
};

export type ActiveMerit = {
  ...BaseMerit,
  activeName: string,
  activePhoto: string
};

export type PledgeMerit = {
  ...BaseMerit,
  pledgeName: string,
  pledgePhoto: string
};

export type Merit = {
  ...BaseMerit,
  activeName: string,
  activePhoto: string,
  pledgeName: string,
  pledgePhoto: string,
  platform: string
};

export type MeritInfo = {
  user: User,
  selectedUsers: Array<Object>, // TODO: Change Object to Pledge type
  merit: ActiveMerit | PledgeMerit
};

export type UrlInfo = {
  urlToShorten: string,
  newUrl: string
}