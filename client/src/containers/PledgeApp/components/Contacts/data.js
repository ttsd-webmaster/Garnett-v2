export default {
   class: [ 'Charter', 'Alpha', 'Beta', 'Gamma', 
            'Delta', 'Epsilon', 'Zeta', 'Eta', 
            'Theta', 'Iota', 'Kappa', 'Lambda', 
            'Mu', 'Nu', 'Xi', 'Omicron', 
            'Pi', 'Rho', 'Sigma'
          ],
   active: ['Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau'],
   major: [ 'Aerospace Engineering',
            'Bioengineering',
            'Chemical Engineering',
            'Computer Engineering',
            'Computer Science',
            'Electrical Engineering',
            'Environmental Engineering',
            'Math-CS',
            'Mechanical Engineering',
            'Nanoengineering',
            'Structural Engineering'
           ],
   name: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
   year: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Alumni'],
   mbti: ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISTP', 'ESTJ', 'ESTP', 'ISFJ', 'ISFP', 'ESFJ', 'ESFP']
};

export type Filter =
   'active' |
   'alumni' |
   'class' |
   'major' |
   'year' |
   'firstName' |
   'lastName' |
   'mbti';

export type FilterName =
   'Active' |
   'Alumni' |
   'Class' |
   'Major' |
   'Year' |
   'First Name' |
   'Last Name' |
   'Personality Type';
