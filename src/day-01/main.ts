import * as _ from "lodash";
import * as fs from "fs";
import { assert } from "console";

const inputFilename = "./src/day-01/input.txt";
const exampleFilename = "./src/day-01/example.txt";

let day01 = () => {
  question1Example();
  question1Input();
  question2Example();
  question2Input();
};
export { day01 };

function question1Example() {
  let numbers: number[] = parseFile(exampleFilename);
  let result = multipliedSumOfTwo(numbers);
  assert(result === 514579);
  console.log(
    "Question 1, example: Find the two entries that sum to 2020; what do you get if you multiply them together? -> " +
      result
  );
}

function question1Input() {
  let numbers: number[] = parseFile(inputFilename);
  let result = multipliedSumOfTwo(numbers);
  assert(result === 471019);
  console.log(
    "Question 1, input: Find the two entries that sum to 2020; what do you get if you multiply them together? -> " +
      result
  );
}

function question2Example() {
  let numbers: number[] = parseFile(exampleFilename);
  let result = multipliedSumOfThree2020(numbers);
  assert(result === 241861950);
  console.log(
    "Question 2, example: What is the product of the three entries that sum to 2020? -> " +
      result
  );
}

function question2Input() {
  let numbers: number[] = parseFile(inputFilename);
  let result = multipliedSumOfThree2020(numbers);
  assert(result === 103927824);
  console.log(
    "Question 2, input: What is the product of the three entries that sum to 2020? -> " +
      result
  );
}

function multipliedSumOfThree2020(numbers: number[]): number | undefined {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      for (let k = 0; k < numbers.length; k++) {
        if (i === j || i === k || j === k) {
          // we need three different numbers
          continue;
        }
        let ni = numbers[i];
        let nj = numbers[j];
        let nk = numbers[k];

        if (ni + nj + nk === 2020) {
          return ni * nj * nk;
        }
      }
    }
  }
  return undefined;
}

function multipliedSumOfTwo(numbers: number[]): number | undefined {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (i === j) {
        // we need two different numbers
        continue;
      }
      let ni = numbers[i];
      let nj = numbers[j];

      if (ni + nj === 2020) {
        return ni * nj;
      }
    }
  }
  return undefined;
}

function parseFile(filename: string): number[] {
  let lines: string[] = [];
  try {
    const data: string = fs.readFileSync(filename).toString();
    lines = data.split(/\r?\n/);
  } catch (err) {
    console.error(err);
  }
  return lines.map((line) => parseLine(line));
}

function parseLine(line: string): number {
  return parseInt(line, 10);
}
