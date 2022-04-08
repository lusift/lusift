const roundNum = (value: number, decimalPlaces: number=2) => {
  return Math.round((value + Number.EPSILON) * Math.pow(10, decimalPlaces)) / (Math.pow(10, decimalPlaces));
}
export default roundNum;
