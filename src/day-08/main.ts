import * as _ from "lodash";
import * as fs from "fs";
import { assert } from "console";

const inputFilename = "./src/day-08/input.txt";
const exampleFilename = "./src/day-08/example.txt";

let day08 = () => {
  question1Example();
  question1Input();
  question2Example();
  question2Input();
};
export { day08 };

function question1Example() {
  let commands: Command[] = parseFile(exampleFilename);
  let result = accBeforeLoop(commands);
  assert(result === 5);
  console.log(
    "Question 1, example: Immediately before any instruction is executed a second time, what value is in the accumulator? -> " +
      result
  );
}

function question1Input() {
  let commands: Command[] = parseFile(inputFilename);
  let result = accBeforeLoop(commands);
  assert(result === 1451);
  console.log(
    "Question 1, input: Immediately before any instruction is executed a second time, what value is in the accumulator? -> " +
      result
  );
}

function question2Example() {
  let commands: Command[] = parseFile(exampleFilename);
  let result = accPatchedLoop(commands);
  assert(result === 8);
  console.log(
    "Question 2, example: What is the value of the accumulator after the program terminates? -> " +
      result
  );
}

function question2Input() {
  let commands: Command[] = parseFile(inputFilename);
  let result = accPatchedLoop(commands);
  assert(result === 1160);
  console.log(
    "Question 2, input: What is the value of the accumulator after the program terminates? -> " +
      result
  );
}

enum Operation {
  NOP,
  ACC,
  JMP,
}
interface Command {
  op: Operation;
  arg: number;
}

enum Status {
  ONGOING,
  TERMINATED,
  LOOPDETECTED,
}

interface State {
  pc: number;
  acc: number;
  commands: Command[];
  pcHistory: number[];
  status: Status;
}

// compute multiple steps until a loop has been detected or the program has terminated
function steps(state: State): State {
  while (state.status == Status.ONGOING) {
    state = step(state);
  }
  return state;
}

// compute a single step
function step(state: State): State {
  state = _.clone(state);
  if (state.pcHistory.includes(state.pc)) {
    state.status = Status.LOOPDETECTED;
    return state;
  }
  if (state.commands.length == state.pc) {
    state.status = Status.TERMINATED;
    return state;
  }
  state.pcHistory.push(state.pc);
  let command = state.commands[state.pc];
  if (command.op == Operation.ACC) {
    state.acc = state.acc + command.arg;
  }

  if (command.op == Operation.JMP) {
    state.pc = state.pc + command.arg;
  } else {
    state.pc = state.pc + 1;
  }

  return state;
}

// init a new state given an array of commands
function initSate(commands: Command[]): State {
  return {
    pc: 0,
    acc: 0,
    commands: commands,
    pcHistory: [],
    status: Status.ONGOING,
  };
}

// patch a NOP/JMP command (NOP becomes JMP and vice versa)
function patchCommand(command: Command): Command {
  command = _.clone(command);
  if (command.op === Operation.JMP) {
    command.op = Operation.NOP;
  } else if (command.op === Operation.NOP) {
    command.op = Operation.JMP;
  } else {
    throw Error("can only patch JMP or NOP");
  }
  return command;
}

// compute the value of the accumulator after patching the program
function accPatchedLoop(commands: Command[]): number | undefined {
  let patchCommandLocations = commands
    .map((value, index) => {
      if ([Operation.NOP, Operation.JMP].includes(value.op)) {
        return index;
      } else {
        return undefined;
      }
    })
    .filter((value) => value !== undefined);

  let states: State[] = patchCommandLocations.map((value) => {
    let stateCommands = _.clone(commands);
    stateCommands.splice(value!, 1, patchCommand(stateCommands[value!]));
    return initSate(stateCommands);
  });

  for (let i = 0; i < states.length; i++) {
    let state = steps(states[i]);
    if (state.status === Status.TERMINATED) {
      return state.acc;
    }
  }
  return undefined;
}

// compute the value of the accumulator before entering a loop
function accBeforeLoop(commands: Command[]): number {
  let state = initSate(commands);
  state = steps(state);
  return state.acc;
}

function parseFile(filename: string): Command[] {
  let lines: string[] = [];
  try {
    const data: string = fs.readFileSync(filename).toString();
    lines = data.split(/\r?\n/);
  } catch (err) {
    console.error(err);
  }
  return lines.map((line) => parseLine(line));
}

function parseLine(line: string): Command {
  let splits = line.split(" ");
  let fst = splits[0];
  let snd = splits[1];
  let op = undefined;
  let arg = undefined;
  if (fst == "nop") {
    op = Operation.NOP;
  } else if (fst == "acc") {
    op = Operation.ACC;
  } else {
    op = Operation.JMP;
  }
  arg = parseInt(snd);

  return {
    op: op,
    arg: arg,
  };
}
