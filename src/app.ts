import {algToString, fromJSON, BlockMove, invert, Sequence, coalesceBaseMoves} from "alg"
import {connect, debugKeyboardConnect, MoveEvent} from "cuble"
import {Transformation, SVG, Combine, Invert, Puzzles, KPuzzle, EquivalentStates} from "kpuzzle"
import {offThread} from "min2phase"

console.log("match-the-scramble");

const USE_KEYBOARD = false;

const def = Puzzles["333"];

class App {
  private svg: SVG[] = [null as any, new SVG(def), new SVG(def)];
  private states: Transformation[] = [null as any, Puzzles["333"].startPieces, Puzzles["333"].startPieces];
  private counter = 0;
  private latestMove: BlockMove | undefined;
  private previousSolution: Sequence = new Sequence([]);

  constructor() {
    this.init();
  }

  async init(): Promise<void> {
    document.querySelector(`#cube1`)!.appendChild(this.svg[1].element);
    document.querySelector(`#cube2`)!.appendChild(this.svg[2].element);

    document.querySelector("#connect1")!.addEventListener("click", function() {
      this.initCube(1);
    }.bind(this));
    document.querySelector("#connect2")!.addEventListener("click", function() {
      this.initCube(2);
    }.bind(this));

    this.setStale(true);
    await offThread.initialize();
    this.setStale(false);
  }

  async initCube(idx: number): Promise<void> {
    const div = document.querySelector(`#connect${idx}`)!;
    div.textContent = `Connecting...`

    const cube = await (USE_KEYBOARD ? debugKeyboardConnect() : connect());

    div.textContent = "Connected!";
    document.querySelector(`#cube${idx}`)!.classList.add("connected");
    this.setState(idx, (await cube.getState())!);
    cube.addMoveListener(this.cubeUpdated.bind(this, idx));
  }

  cubeUpdated(idx: number, e: MoveEvent): void {
    this.latestMove = e.latestMove;
    this.setState(idx, e.state!);
  }

  setState(idx: number, state: Transformation): void {
    this.states[idx] = state;
    this.svg[idx].draw(def, state);
    this.updateMTS();
  }

  setStale(isStale: boolean) {
    if (isStale) {
      document.querySelector("#mts-alg")!.classList.add("stale");
    } else {
      document.querySelector("#mts-alg")!.classList.remove("stale");
    }
  }

  private isSolution(s: Transformation, a: Sequence): boolean {
    const puzzle = new KPuzzle(def);
    puzzle.applyAlg(invert(a));
    for (var i = 0; i < 6; i++) {
      puzzle.state["CENTER"].orientation[i] = 0;
      s["CENTER"].orientation[i] = 0;
    }
    return EquivalentStates(def, puzzle.state, s);
  }

  async updateMTS(): Promise<void> {
    const mts = Combine(def, Invert(def, this.states[2]), this.states[1]);
    this.setStale(true);
    this.counter += 1;
    const id = this.counter;

    var solution;
    if (this.latestMove) {
      const modifiedPrevious = new Sequence(
        invert(new Sequence([this.latestMove])).nestedUnits.concat(<BlockMove[]>this.previousSolution.nestedUnits)
      );

      var coalescedPrevious = coalesceBaseMoves(modifiedPrevious);
      var newMoves = [];
      // TODO: Support modulus in coalesceBaseMoves().
      for (var move of <BlockMove[]>coalescedPrevious.nestedUnits) {
        const newAmount = (((move.amount % 4) + 5) % 4) - 1;
        if (newAmount != 0) {
          newMoves.push(new BlockMove(
            move.outerLayer,
            move.innerLayer,
            move.family,
            newAmount
          ));
        }
      }
      coalescedPrevious = new Sequence(newMoves);

      if (coalescedPrevious.nestedUnits.length <= this.previousSolution.nestedUnits.length) {
        if (this.isSolution(mts, coalescedPrevious)) {
          solution = coalescedPrevious;
        } else {
          solution = fromJSON(await offThread.solve(mts));
        }
      } else {
        solution = fromJSON(await offThread.solve(mts));
      }
    } else {
      solution = fromJSON(await offThread.solve(mts));
    }

    if (id == this.counter) {
      this.setStale(false);
      this.previousSolution = solution;
      document.querySelector("#mts-alg")!.classList.add("right-aligned");
      document.querySelector("#mts-alg")!.textContent = algToString(solution);
    }
  }
}

window.addEventListener("load", function() {
    new App();
});
