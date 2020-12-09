import * as _ from "lodash";
import * as fs from "fs";
import { assert } from "console";

const inputFilename = "./src/day-09/input.txt";
const exampleFilename = "./src/day-09/example.txt";

let day09 = () => {
  question1Example();
  question1Input();
  question2Example();
  question2Input();
};
export { day09 };

function question1Example() {
  let commands: number[] = parseFile(exampleFilename);
  let result = question1(commands, 5);
  assert(result === 127);
  console.log(
    "Question 1, example: What is the first number that does not have this property? -> " +
      result
  );
}

function question1Input() {
  let commands: number[] = parseFile(inputFilename);
  let result = question1(commands, 25);
  assert(result === 731031916);
  console.log(
    "Question 1, input: What is the first number that does not have this property? -> " +
      result
  );
}

function question2Example() {
  let commands: number[] = parseFile(exampleFilename);
  let result = question2(commands, 5);
  assert(result === 62);
  console.log(
    "Question 2, example: hat is the encryption weakness in your XMAS-encrypted list of numbers? -> " +
      result
  );
}

function question2Input() {
  let commands: number[] = parseFile(inputFilename);
  let result = question2(commands, 25);
  assert(result === 93396727);
  console.log(
    "Question 2, input: hat is the encryption weakness in your XMAS-encrypted list of numbers? -> " +
      result
  );
}

function step(
  current: number[],
  candidate: number,
  size: number
): number[] | undefined {
  // find a pair of numbers that add up to ENTRY
  for (let i = 0; i < current.length; i++) {
    for (let j = 0; j < current.length; j++) {
      if (i === j) {
        continue;
      }
      if (current[i] + current[j] !== candidate) {
        continue;
      }
      current.push(candidate);
      if (current.length > size) {
        current.splice(0, current.length - size);
      }
      return current;
    }
  }
  return undefined;
}

function question2(entries: number[], size: number): number | undefined {
  let entriesCopy = _.clone(entries);
  let invalidNumber = question1(entries, size)!;
  let invalidNumberLocation = _.findIndex(
    entriesCopy,
    (x: number) => x === invalidNumber
  );
  for (let i = 0; i < invalidNumberLocation; i++) {
    for (let j = i; j < invalidNumberLocation; j++) {
      // if numbers between I and J in sum > invalidNumber then continue, else compute result and return
      let range = entriesCopy.filter(
        (value, index) => i <= index && index <= j
      );
      let sum = _.sum(range);
      if (sum > invalidNumber) {
        continue;
      }
      if (sum === invalidNumber) {
        return _.min(range)! + _.max(range)!;
      }
    }
  }
  return undefined;
}

function question1(entries: number[], size: number): number | undefined {
  var current: number[] | undefined = entries.splice(0, size);
  for (let i of entries) {
    current = step(current, i, size);
    if (current === undefined) {
      return i;
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
  return parseInt(line);
}
