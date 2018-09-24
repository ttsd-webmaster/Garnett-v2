export default function sortChalkboards(chalkboards, filter) {
  return chalkboards.sort(function(a, b) {
    switch (filter) {
      case 'attendees':
        let chalkboard1 = [];
        let chalkboard2 = [];
        
        if (a[filter] !== undefined) {
          chalkboard1 = a[filter];
        }
        if (b[filter] !== undefined) {
          chalkboard2 = b[filter];
        }
        return Object.keys(chalkboard1).length > Object.keys(chalkboard2).length ? 1 : -1;
        break;
      case 'timeCommitment':
        return a[filter].value < b[filter].value ? 1 : -1;
        break;
      case 'date':
        return new Date(a.date) - new Date(b.date);
        break;
      default:
        return a[filter] > b[filter] ? 1 : -1;
    }
  });
};
