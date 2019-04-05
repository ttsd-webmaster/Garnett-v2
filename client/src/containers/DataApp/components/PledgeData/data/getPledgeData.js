import { loadFirebase } from 'helpers/functions.js';

export function getPledgeData() {
  loadFirebase('database')
  .then(() => {
    const { firebase } = window;
    const usersRef = firebase.database().ref('/users/');
    const meritsRef = firebase.database().ref('/merits');

    meritsRef.once('value', (snapshot) => {
      usersRef.once('value', (users) => {
        let totalActiveMeritInstances = new Map();
        let mostActiveMeritInstances = new Map();
        let mostActiveDemeritInstances = new Map();
        let totalPledgeMeritInstances = new Map();
        let mostPledgeMeritInstances = new Map();
        let mostPledgeDemeritInstances = new Map();
        let totalMeritAmount = new Map();
        let mostMeritAmount = new Map();
        let mostDemeritAmount = new Map();

        users.forEach((user) => {
          if (user.val().Merits) {
            let merits = Object.keys(user.val().Merits).map(function(key) {
              return user.val().Merits[key];
            });

            merits.forEach((merit) => {
              let totalActiveInstanceCounter;
              let meritActiveInstanceCounter;
              let demeritActiveInstanceCounter;
              let totalPledgeInstanceCounter;
              let meritPledgeInstanceCounter;
              let demeritPledgeInstanceCounter;
              let totalMeritAmountCounter;
              let meritAmountCounter;
              let demeritAmountCounter;

              if (snapshot.val()[merit].activeName) {
                totalActiveInstanceCounter = totalActiveMeritInstances.get(snapshot.val()[merit].activeName) || 0;
                meritActiveInstanceCounter = mostActiveMeritInstances.get(snapshot.val()[merit].activeName) || 0;
                demeritActiveInstanceCounter = mostActiveDemeritInstances.get(snapshot.val()[merit].activeName) || 0;
                totalMeritAmountCounter = totalMeritAmount.get(snapshot.val()[merit].activeName) || 0;
                meritAmountCounter = mostMeritAmount.get(snapshot.val()[merit].activeName) || 0;
                demeritAmountCounter = mostDemeritAmount.get(snapshot.val()[merit].activeName) || 0;
              }

              if (merit.pledgeName) {
                totalPledgeInstanceCounter = totalPledgeMeritInstances.get(snapshot.val()[merit].pledgeName) || 0;
                meritPledgeInstanceCounter = mostPledgeMeritInstances.get(snapshot.val()[merit].pledgeName) || 0;
                demeritPledgeInstanceCounter = mostPledgeDemeritInstances.get(snapshot.val()[merit].pledgeName) || 0;
              }

              if (merit.amount > 0) {
                mostActiveMeritInstances.set(snapshot.val()[merit].activeName, meritActiveInstanceCounter += 1);
                mostPledgeMeritInstances.set(snapshot.val()[merit].pledgeName, meritPledgeInstanceCounter += 1);
                mostMeritAmount.set(snapshot.val()[merit].pledgeName, meritAmountCounter += snapshot.val()[merit].amount);
              } else {
                mostActiveDemeritInstances.set(snapshot.val()[merit].activeName, demeritActiveInstanceCounter += 1);
                mostPledgeDemeritInstances.set(snapshot.val()[merit].pledgeName, demeritPledgeInstanceCounter += 1);
                mostDemeritAmount.set(snapshot.val()[merit].pledgeName, demeritAmountCounter += snapshot.val()[merit].amount);
              }

              totalActiveMeritInstances.set(snapshot.val()[merit].activeName, totalActiveInstanceCounter += 1);
              totalPledgeMeritInstances.set(snapshot.val()[merit].pledgeName, totalPledgeInstanceCounter += 1);
              totalMeritAmount.set(snapshot.val()[merit].pledgeName, totalMeritAmountCounter += snapshot.val()[merit].amount);
            });
          }
        });

        totalActiveMeritInstances = [...totalActiveMeritInstances.entries()].sort((a,b) => b[1] - a[1]).slice(2, 12);
        mostActiveMeritInstances = [...mostActiveMeritInstances.entries()].sort((a,b) => b[1] - a[1]).slice(1, 11);
        mostActiveDemeritInstances = [...mostActiveDemeritInstances.entries()].sort((a,b) => b[1] - a[1]).slice(1, 11);
        totalPledgeMeritInstances = [...totalPledgeMeritInstances.entries()].sort((a,b) => b[1] - a[1]).slice(2, 12);
        mostPledgeMeritInstances = [...mostPledgeMeritInstances.entries()].sort((a,b) => b[1] - a[1]).slice(1, 11);
        mostPledgeDemeritInstances = [...mostPledgeDemeritInstances.entries()].sort((a,b) => b[1] - a[1]).slice(1, 11);
        totalMeritAmount = [...totalMeritAmount.entries()].sort((a,b) => b[1] - a[1]).slice(1, 11);
        mostMeritAmount = [...mostMeritAmount.entries()].sort((a,b) => b[1] - a[1]).slice(2, 12);
        mostDemeritAmount = [...mostDemeritAmount.entries()].sort((a,b) => a[1] - b[1]).slice(1, 11);

        const pledgeData = [
          ['Total Merit Instances (Active)', totalActiveMeritInstances],
          ['Most Merit Instances (Active)', mostActiveMeritInstances],
          ['Most Demerit Instances (Active)', mostActiveDemeritInstances],
          ['Total Merit Instances (Pledge)', totalPledgeMeritInstances],
          ['Most Merit Instances (Pledge)', mostPledgeMeritInstances],
          ['Most Demerit Instances (Pledge)', mostPledgeDemeritInstances],
          ['Total Merit Amount', totalMeritAmount],
          ['Most Merit Amount', mostMeritAmount],
          ['Most Demerit Amount', mostDemeritAmount]
        ];

        return pledgeData;
      });
    });
  });
}
