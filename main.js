function checkCashRegister(price, cash, cid) {
  let change = cash - price

  const objCid = Object.fromEntries(cid) // Array [[key,value]] => Object {key: value}

  const totalCid = Object.keys(objCid) // Total amount of money in the cash register
    .reduce((acc, coin) => {
      return acc + objCid[coin]
    }, 0)
    .toFixed(2) //String

  if (price > cash) return -1
  if (Object.keys(objCid).every(coin => objCid[coin] === 0)) return -1 // Not money in cash register
  if (change > Number(totalCid))
    return { status: 'INSUFFICIENT_FUNDS', change: [] }

  const monetaryUnit = {
    'ONE HUNDRED': 100,
    TWENTY: 20,
    TEN: 10,
    FIVE: 5,
    ONE: 1,
    QUARTER: 0.25,
    DIME: 0.1,
    NICKEL: 0.05,
    PENNY: 0.01,
  }

  let auxChange = change // copy the value so as not to mutate the `change` variable

  const objChange = Object.keys(monetaryUnit).reduce((acc, coin) => {
    // 100 - 3.26 = 96.74 change
    // One-hundred Dollars: NOT PASS                              => []
    // Twenty Dollars PASS => 4 INT * 20 = (80) but [TWENTY] (60) => [60]
    // 96.74 - 60 = 36.74
    // Ten Dollars PASS => 3 INT * 10 = (30) but [TEN] (20)       => [20]
    // 36.74 - 20 = 16.74
    // Five Dollars PASS => 3 INT * 5 = (15) - [FIVE] (55)        => [15]
    // 16.74 - 15 = 1.74
    // Dollar PASS => 1 INT * 1 = (1)- [ONE] (90)                 => [1]
    // 1.74 - 1 = 0.74
    // Quarter PASS 2 INT * 0.25 = (0.5) - [QUARTER] (4.25)       => [0.5]
    // 0.74 - 0.5 = 0.24
    // Dime PASS => 2 INT * 0.1 = (0.2) - [DIME] (3.1)            => [0.2]
    // 0.24 - 0.2 = 0.04
    // Nickel NOT PASS                                            => []
    // Penny PASS => 4 INT * 0.1 = (0.04) - [PENNY] (1.01)        => [0.04]

    const integerPart = Math.floor(auxChange / monetaryUnit[coin])

    if (integerPart !== 0) {
      if (integerPart * monetaryUnit[coin] > objCid[coin] && objCid[coin] > 0) {
        acc[coin] = objCid[coin]
        auxChange = (auxChange - acc[coin]).toFixed(2)
        auxChange = Number(auxChange)
      }

      if (
        integerPart * monetaryUnit[coin] <= objCid[coin] &&
        objCid[coin] > 0
      ) {
        acc[coin] = integerPart * monetaryUnit[coin]
        auxChange = (auxChange - acc[coin]).toFixed(2)
        auxChange = Number(auxChange)
      }
    }
    return acc
  }, {})

  const totalChangeCheck = Object.keys(objChange)
    .reduce((acc, coin) => {
      return acc + objChange[coin]
    }, 0)
    .toFixed(2)

  if (Number(totalChangeCheck) < change)
    return { status: 'INSUFFICIENT_FUNDS', change: [] }

  if (Number(totalChangeCheck) === Number(totalCid))
    return { status: 'CLOSED', change: Object.entries(objCid) }

  if (Number(totalChangeCheck) === change)
    return { status: 'OPEN', change: Object.entries(objChange) }
}

console.log(
  checkCashRegister(3.26, 100, [
    ['PENNY', 1.01],
    ['NICKEL', 2.05],
    ['DIME', 3.1],
    ['QUARTER', 4.25],
    ['ONE', 90],
    ['FIVE', 55],
    ['TEN', 20],
    ['TWENTY', 60],
    ['ONE HUNDRED', 100],
  ])
)
//debe devolver {status: "OPEN", change: [["TWENTY", 60], ["TEN", 20], ["FIVE", 15], ["ONE", 1], ["QUARTER", 0.5], ["DIME", 0.2], ["PENNY", 0.04]]} OK

// Devuelve {status: "INSUFFICIENT_FUNDS", change: []} si el efectivo en caja es menor que el cambio necesario, o si no puedes devolver el cambio exacto.

// Devuelve {status: "CLOSED", change: [...]} si el efectivo en caja como valor de la clave change es igual al cambio que se debe entregar.

// En cualquier otro caso, devuelve {status: "OPEN", change: [...]}, con el cambio a entregar en monedas y billetes, ordenados de mayor a menor, como valor de la clave change.

// checkCashRegister(19.5, 20, [
//   ['PENNY', 1.01],
//   ['NICKEL', 2.05],
//   ['DIME', 3.1],
//   ['QUARTER', 4.25],
//   ['ONE', 90],
//   ['FIVE', 55],
//   ['TEN', 20],
//   ['TWENTY', 60],
//   ['ONE HUNDRED', 100],
// ]) //debe devolver {status: "OPEN", change: [["QUARTER", 0.5]]} OK

// checkCashRegister(19.5, 20, [
//   ['PENNY', 0.01],
//   ['NICKEL', 0],
//   ['DIME', 0],
//   ['QUARTER', 0],
//   ['ONE', 0],
//   ['FIVE', 0],
//   ['TEN', 0],
//   ['TWENTY', 0],
//   ['ONE HUNDRED', 0],
// ]) //debe devolver {status: "INSUFFICIENT_FUNDS", change: []} OK

// checkCashRegister(19.5, 20, [
//   ['PENNY', 0.01],
//   ['NICKEL', 0],
//   ['DIME', 0],
//   ['QUARTER', 0],
//   ['ONE', 1],
//   ['FIVE', 0],
//   ['TEN', 0],
//   ['TWENTY', 0],
//   ['ONE HUNDRED', 0],
// ]) //debe devolver {status: "INSUFFICIENT_FUNDS", change: []} OK

// checkCashRegister(19.5, 20, [
//   ['PENNY', 0.5],
//   ['NICKEL', 0],
//   ['DIME', 0],
//   ['QUARTER', 0],
//   ['ONE', 0],
//   ['FIVE', 0],
//   ['TEN', 0],
//   ['TWENTY', 0],
//   ['ONE HUNDRED', 0],
// ]) //debe devolver {status: "CLOSED", change: [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]} O
