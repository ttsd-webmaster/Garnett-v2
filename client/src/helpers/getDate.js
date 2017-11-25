export default function getDate() {
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;

  if (day < 10) {
    day = '0' + day;
  } 

  if (month < 10) { 
    month = '0' + month;
  }

  today = month + '/' + day;

  return today;
}