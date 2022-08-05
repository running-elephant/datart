import { CalculationType } from 'globalConstants';
import { precisionCalculation } from '../number';

describe('number Test', () => {
  describe.each([
    [CalculationType.ADD, [null, 1, '1', undefined], 2],
    [CalculationType.SUBTRACT, [null, 1, '1', undefined], 0],
  ])('precisionCalculation Test - ', (type, numberList, expected) => {
    test(`The precision calculation method test, type ${type} number list ${numberList} expected ${expected}`, () => {
      expect(precisionCalculation(type, numberList as any)).toEqual(expected);
    });
  });
});
