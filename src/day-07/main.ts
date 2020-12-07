import * as _ from "lodash";
import * as fs from "fs";
import { assert } from "console";

const inputFilename = "./src/day-07/input.txt";
const exampleQ1Filename = "./src/day-07/exampleQ1Filename.txt";
const exampleQ2Filename = "./src/day-07/exampleQ2Filename.txt";

let day07 = () => {
  question1Example();
  question1Input();
  question2Example();
  question2Input();
};
export { day07 };

function question1Example() {
  let exampleQ1Bags: Bag[] = parseFile(exampleQ1Filename);
  let result = howManyColors("shiny gold", exampleQ1Bags);
  assert(result === 4);
  console.log(
    "Question 1, example: How many bag colors can eventually contain at least one shiny gold bag? -> " +
      result
  );
}

function question1Input() {
  let bags: Bag[] = parseFile(inputFilename);
  let result = howManyColors("shiny gold", bags);
  assert(result === 246);
  console.log(
    "Question 1, input: How many bag colors can eventually contain at least one shiny gold bag? -> " +
      result
  );
}

function question2Example() {
  let exampleQ2Bags: Bag[] = parseFile(exampleQ2Filename);
  let result = containsHowManyBags("shiny gold", exampleQ2Bags);
  assert(result === 126);
  console.log(
    "Question 2, example: How many individual bags are required inside your single shiny gold bag? -> " +
      result
  );
}

function question2Input() {
  let bags: Bag[] = parseFile(inputFilename);
  let result = containsHowManyBags("shiny gold", bags);
  assert(result === 2976);
  console.log(
    "Question 2, input: How many individual bags are required inside your single shiny gold bag? -> " +
      result
  );
}
interface BagElement {
  name: string;
  amount: number;
}

interface Bag {
  name: string;
  elements: BagElement[];
}

// compute how many bags are contained within a bag of name NAME
function containsHowManyBags(name: string, bags: Bag[]) {
  let ctr: number = 0;
  let stack: BagElement[] = _.clone(
    _.find(bags, (bag: Bag) => bag.name === name)!.elements
  );
  while (stack.length !== 0) {
    let bagElement = stack.pop();
    ctr += bagElement!.amount;
    let bag = _.clone(
      _.find(bags, (bag: Bag) => bag!.name === bagElement!.name)!
    );
    bag.elements.forEach((element: BagElement) =>
      stack.push({
        name: element.name,
        amount: element!.amount * bagElement!.amount,
      })
    );
  }
  return ctr;
}

function howManyColors(name: string, bags: Bag[]) {
  return _.sum(
    bags
      .map((bag: Bag) => howOftenContainedIn(name, bag.name, bags))
      .map((howOften: number) => (howOften === 0 ? 0 : 1))
  );
}

// how often is INNER eventually contained in an OUTER bag
function howOftenContainedIn(inner: string, outer: string, bags: Bag[]) {
  let ctr: number = 0;
  let stack: BagElement[] = _.clone(
    _.find(bags, (bag: Bag) => bag.name === outer)!.elements
  );
  while (stack.length !== 0) {
    let bagElement = stack.pop();
    if (bagElement!.name === inner) {
      ctr += bagElement!.amount;
    }
    let bag = _.clone(
      _.find(bags, (bag: Bag) => bag.name === bagElement!.name)!
    );
    bag.elements.forEach((element: BagElement) =>
      stack.push({
        name: element.name,
        amount: element.amount * bagElement!.amount,
      })
    );
  }
  return ctr;
}

function parseFile(filename: string): Bag[] {
  let lines: string[] = [];
  try {
    const data: string = fs.readFileSync(filename).toString();
    lines = data.split(/\r?\n/);
  } catch (err) {
    console.error(err);
  }
  return lines.map((line) => parseLine(line));
}

function parseLine(line: string): Bag {
  let splits = line.split(" bags contain ");
  let fst = splits[0];
  let bag: Bag = {
    name: fst,
    elements: [],
  };
  let snd = splits[1].substring(0, splits[1].length - 1);

  let elements: BagElement[] = [];
  if (snd === "no other bags") {
    elements = [];
  } else {
    let snds = snd.split(", ");
    elements = snds.map((el) => {
      let spli = el.split(" ");
      let bagElement: BagElement = {
        name: spli[1] + " " + spli[2],
        amount: parseInt(spli[0]),
      };
      return bagElement;
    });
  }
  bag.elements = elements;
  return bag;
}
