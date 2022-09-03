import dayjs from "dayjs";

console.log(1)
const dia = '01/08/21'
const expirationDateFormated = dayjs(dia).format('MM/YY');
const today = dayjs().format("MM/YY");

console.log(expirationDateFormated);
console.log(today);

const diff = dayjs(today).isAfter(dayjs(expirationDateFormated));
console.log(diff);