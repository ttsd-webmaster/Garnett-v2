export default function sortChalkboards(chalkboards, filter) {
  return chalkboards.sort(function(a, b) {
    if (filter === 'attendees') {
      let chalkboard1 = [];
      let chalkboard2 = [];
      
      if (a[filter] !== undefined) {
        chalkboard1 = a[filter];
      }
      if (b[filter] !== undefined) {
        chalkboard2 = b[filter];
      }
      return Object.keys(chalkboard1).length > Object.keys(chalkboard2).length ? 1 : -1;
    }
    else if (filter === 'timeCommitment') {
      return a[filter].value < b[filter].value ? 1 : -1;
    }
    else if (filter === 'date') {
      return new Date(a.date) - new Date(b.date);
    }
    else {
      return a[filter] > b[filter] ? 1 : -1;
    }
  });
};
