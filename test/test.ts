import {Inverter} from "../src/inverter"
import {SwappableInverter} from "../src/swappable-inverter"

describe("Inverter", () => {
  it("should invert", () => {
    var inverter = new Inverter("R U'");
    inverter.invert();
    expect(inverter.getAlg()).toBe("U R'");
    expect(inverter.inversionCount).toBe(1);
    inverter.invert();
    expect(inverter.getAlg()).toBe("R U'");
    expect(inverter.inversionCount).toBe(2);
  });
});

describe("SwappableInverter", () => {
  it("should allow swapping without resetting count", () => {
    var inverter = new SwappableInverter("R U'");
    inverter.invert();
    expect(inverter.getAlg()).toBe("U R'");
    expect(inverter.inversionCount).toBe(1);
    inverter.swap("F D");
    expect(inverter.getAlg()).toBe("F D");
    expect(inverter.inversionCount).toBe(1);
    inverter.swap("F D");
    inverter.invert();
    expect(inverter.getAlg()).toBe("D' F'");
    expect(inverter.inversionCount).toBe(2);
  });
});
