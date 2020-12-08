import * as _ from "lodash";
import * as fs from "fs";
import { assert } from "console";

const inputFilename = "./src/day-02/input.txt";
const exampleFilename = "./src/day-02/example.txt";

let day02 = () => {
  question1Example();
  question1Input();
  question2Example();
  question2Input();
};
export { day02 };

function question1Example() {
  let entries: Entry[] = parseFile(exampleFilename);
  let result = numberOfValidPasswords(entries);
  assert(result === 2);
  console.log(
    "Question 1, example: How many passwords are valid? -> " + result
  );
}

function question1Input() {
  let entries: Entry[] = parseFile(inputFilename);
  let result = numberOfValidPasswords(entries);
  assert(result === 439);
  console.log("Question 1, input: How many passwords are valid? -> " + result);
}

function question2Example() {
  let entries: Entry[] = parseFile(exampleFilename);
  let result = numberOfValidPasswordsQ2(entries);
  assert(result === 1);
  console.log(
    "Question 2, example: How many passwords are valid? -> " + result
  );
}

function question2Input() {
  let entries: Entry[] = parseFile(inputFilename);
  let result = numberOfValidPasswordsQ2(entries);
  assert(result === 584);
  console.log("Question 2, input: How many passwords are valid? -> " + result);
}

function isValidQ1(entry: Entry): boolean {
  let occurrences = entry.password.split("").filter((c) => c === entry.letter)
    .length;
  return entry.min <= occurrences && occurrences <= entry.max;
}

function isValidQ2(entry: Entry): boolean {
  let c1 = entry.password[entry.min - 1];
  let c2 = entry.password[entry.max - 1];

  return (
    (c1 === entry.letter && c2 !== entry.letter) ||
    (c1 !== entry.letter && c2 === entry.letter)
  );
}

function numberOfValidPasswordsQ2(entries: Entry[]): number {
  return entries.filter((entry) => isValidQ2(entry)).length;
}

function numberOfValidPasswords(entries: Entry[]): number {
  return entries.filter((entry) => isValidQ1(entry)).length;
}

interface Entry {
  min: number;
  max: number;
  letter: string;
  password: string;
}

function parseFile(filename: string): Entry[] {
  let lines: string[] = [];
  try {
    const data: string = fs.readFileSync(filename).toString();
    lines = data.split(/\r?\n/);
  } catch (err) {
    console.error(err);
  }
  return lines.map((line) => parseLine(line));
}

function parseLine(line: string): Entry {
  let password = line.split(": ")[1];
  let letter = line.split(" ")[1].split(":")[0];
  let min = parseInt(line.split(" ")[0].split("-")[0]);
  let max = parseInt(line.split(" ")[0].split("-")[1]);

  return {
    min: min,
    max: max,
    letter: letter,
    password: password,
  };
}
