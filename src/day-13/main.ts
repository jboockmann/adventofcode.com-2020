import * as _ from "lodash";
import * as fs from "fs";
import { assert } from "console";

const inputFilename = "./src/day-13/input.txt";
const exampleFilename = "./src/day-13/example.txt";
const example2Filename = "./src/day-13/example2.txt";

let day13 = () => {
  question1Example();
  question1Input();
  question2Example0();
  question2Example1();
  question2Example2();
  question2Example3();
  question2Example4();
  question2Example5();
  question2Input();
};
export { day13 };

function question1Example() {
  let numbers: number[] = parseFile(exampleFilename);
  let result = question1(939, numbers);
  assert(result === 295);
  console.log(
    "Question 1, example: What is the ID of the earliest bus you can take to the airport multiplied by the number of minutes you'll need to wait for that bus? -> " +
      result
  );
}

function question1Input() {
  let numbers: number[] = parseFile(inputFilename);
  let result = question1(1002576, numbers);
  assert(result === 3865);
  console.log(
    "Question 1, input: What is the ID of the earliest bus you can take to the airport multiplied by the number of minutes you'll need to wait for that bus? -> " +
      result
  );
}

function question2Example0() {
  let result = question2([5, 7]);
  assert(result === 20);
  console.log(
    "Question 2, example: What is the earliest timestamp such that all of the listed bus IDs depart at offsets matching their positions in the list? -> " +
      result
  );
}

function question2Example1() {
  let result = question2([17, 0, 13, 19]);
  assert(result === 3417);
  console.log(
    "Question 2, example: What is the earliest timestamp such that all of the listed bus IDs depart at offsets matching their positions in the list? -> " +
      result
  );
}

function question2Example2() {
  let result = question2([67, 7, 59, 61]);
  assert(result === 754018);
  console.log(
    "Question 2, example: What is the earliest timestamp such that all of the listed bus IDs depart at offsets matching their positions in the list? -> " +
      result
  );
}

function question2Example3() {
  let result = question2([67, 0, 7, 59, 61]);
  assert(result === 779210);
  console.log(
    "Question 2, example: What is the earliest timestamp such that all of the listed bus IDs depart at offsets matching their positions in the list? -> " +
      result
  );
}

function question2Example4() {
  let result = question2([67, 7, 0, 59, 61]);
  assert(result === 1261476);
  console.log(
    "Question 2, example: What is the earliest timestamp such that all of the listed bus IDs depart at offsets matching their positions in the list? -> " +
      result
  );
}

function question2Example5() {
  let result = question2([1789, 37, 47, 1889]);
  assert(result === 1202161486);
  console.log(
    "Question 2, example: What is the earliest timestamp such that all of the listed bus IDs depart at offsets matching their positions in the list? -> " +
      result
  );
}

function question2Input() {
  let commands: number[] = parseFile(inputFilename);
  let result = question2(commands);
  assert(result === 415579909629976);
  console.log(
    "Question 2, input: What is the earliest timestamp such that all of the listed bus IDs depart at offsets matching their positions in the list? -> " +
      result
  );
}

function question2(entries: number[]): number | undefined {
  // entry -> index
  let dctEntries: { [id: number]: number } = {};
  for (let i = 0; i < entries.length; i++) {
    if (entries[i] !== 0) {
      dctEntries[entries[i]] = i;
    }
  }

  let ctr = 0;
  let step = 1;

  while (Object.keys(dctEntries).length > 0) {
    for (let entry in dctEntries) {
      let entry_ = parseInt(entry!);
      if ((ctr + dctEntries[entry_]) % entry_ === 0) {
        step = step * entry_;
        delete dctEntries[entry_];
        if (Object.keys(dctEntries).length === 0) {
          return ctr;
        }
      }
    }
    ctr += step;
  }

  return undefined;
}

function question1(goal: number, numbers: number[]): number | undefined {
  numbers = numbers.filter((n) => n !== 0);

  let arr = numbers.map((n) => n - (goal % n));
  let minDelta = _.min(arr);

  for (let i = 0; i < numbers.length; i++) {
    if (arr[i] === minDelta) {
      return minDelta * numbers[i];
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
  return parseLine(lines[1]);
}

function parseLine(line: string): number[] {
  return line
    .split(",")

    .map((n) => {
      if (n === "x") {
        return 0;
      } else {
        return parseInt(n);
      }
    });
}
