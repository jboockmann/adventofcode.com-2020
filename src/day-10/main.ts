import * as _ from "lodash";
import * as fs from "fs";
import { assert } from "console";

const inputFilename = "./src/day-10/input.txt";
const exampleFilename = "./src/day-10/example.txt";
const example2Filename = "./src/day-10/example2.txt";

let day10 = () => {
  question1Example();
  question1Input();
  question2Example();
  question2Input();
};
export { day10 };

function question1Example() {
  let commands: number[] = parseFile(exampleFilename);
  let result = question1(commands);
  assert(result === 220);
  console.log(
    "Question 1, example: What is the number of 1-jolt differences multiplied by the number of 3-jolt differences? -> " +
      result
  );
}

function question1Input() {
  let commands: number[] = parseFile(inputFilename);
  let result = question1(commands);
  assert(result === 2400);
  console.log(
    "Question 1, input: What is the number of 1-jolt differences multiplied by the number of 3-jolt differences? -> " +
      result
  );
}

function question2Example() {
  let commands: number[] = parseFile(example2Filename);
  let result = question2(commands);
  assert(result === 8);
  console.log(
    "Question 2, example: What is the total number of distinct ways you can arrange the adapters to connect the charging outlet to your device? -> " +
      result
  );
}

function question2Input() {
  let commands: number[] = parseFile(inputFilename);
  let result = question2(commands);
  assert(result === 338510590509056);
  console.log(
    "Question 2, input: What is the total number of distinct ways you can arrange the adapters to connect the charging outlet to your device? -> " +
      result
  );
}

function question1(numbers: number[]): number {
  numbers.sort((n1, n2) => n1 - n2);

  let differences = [];

  numbers.push(_.max(numbers)! + 3);
  numbers.unshift(0);
  for (let i = 1; i < numbers.length; i++) {
    differences.push(numbers[i] - numbers[i - 1]);
  }

  let countBy = _.countBy(differences);
  let product = Object.keys(countBy)
    .map((k) => countBy[k])
    .reduce((a, b) => a * b, 1);

  return product;
}

function question2(numbers: number[]): number {
  let graph: { [id: number]: number[] } = {};
  numbers = numbers.concat([0, _.max(numbers)! + 3]);
  numbers.forEach((n: number) => {
    graph[n] = numbers.filter((next: number) => n < next && next <= n + 3);
  });
  let possibleWays: { [id: number]: number } = {};
  numbers
    .sort((a, b) => b - a)
    .forEach((index) => {
      if (graph[index].length === 0) {
        possibleWays[index] = 1;
      } else {
        possibleWays[index] = graph[index]
          .map((index) => possibleWays[index])
          .reduce((a, b) => a + b, 0);
      }
    });
  return possibleWays[0];
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
