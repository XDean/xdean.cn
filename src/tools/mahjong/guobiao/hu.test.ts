import {expect, test} from "@jest/globals";
import {calcHu, findAllCombinations} from "./hu";
import {Combination, Dui, Hand, Ke, Mian, QiDui, Shun, Tiles} from "./type";
import {arrayContentEquals} from "../../../util/util";
import {Tile} from "./tile";

function expectComb(
  {
    tiles,
    combs: mians,
  }: {
    tiles: Tiles
    combs: Mian[][],
  }) {
  const err = new Error()
  const line = err.stack.split('\n')[2]
  const colon1 = line.lastIndexOf(':');
  const colon2 = line.lastIndexOf(':', colon1 - 1);
  test(`line-${line.substring(colon2 + 1, colon1)}`, () => {
    const cs = findAllCombinations(tiles)
    const expectStrings = mians.map(ms => new Combination(ms).toString()).sort()
    const actualStrings = cs.map(c => c.toString()).sort()
    console.log(tiles.unicode)
    expect(actualStrings).toEqual(expectStrings)
  })
}

expectComb({
  tiles: Tiles.of({'t': [1, 1, 1, 2, 3]}),
  combs: [
    [new Shun(Tile.T[0]), new Dui(Tile.T[0])]
  ]
})

expectComb({
  tiles: Tiles.of({'t': [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4]}),
  combs: [
    [new Dui(Tile.T[3]), new Shun(Tile.T[0]), new Shun(Tile.T[0]), new Shun(Tile.T[0])],
    [new Dui(Tile.T[0]), new Shun(Tile.T[0]), new Shun(Tile.T[1]), new Shun(Tile.T[1])],
    [new Dui(Tile.T[3]), new Ke(Tile.T[0]), new Ke(Tile.T[1]), new Ke(Tile.T[2])],
  ]
})

expectComb({
  tiles: Tiles.of({'t': [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]}),
  combs: [
    [new QiDui(Tiles.of({'t': [2, 3, 4, 5, 6, 7, 8]}))],
    [new Dui(Tile.T[1]), new Shun(Tile.T[2]), new Shun(Tile.T[2]), new Shun(Tile.T[5]), new Shun(Tile.T[5])],
    [new Dui(Tile.T[4]), new Shun(Tile.T[1]), new Shun(Tile.T[1]), new Shun(Tile.T[5]), new Shun(Tile.T[5])],
    [new Dui(Tile.T[7]), new Shun(Tile.T[1]), new Shun(Tile.T[1]), new Shun(Tile.T[4]), new Shun(Tile.T[4])],
  ]
})