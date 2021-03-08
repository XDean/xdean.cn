import {BuKao, Combination, Dui, Hand, Hu, Ke, QiDui, Shun, Tile, TilePoint, Tiles, Yao13, ZuHeLong} from "./type";

export function calculate(hand: Hand): Hu {
  if (hand.count != 14) {
    throw 'hand count must be 14'
  }
  return new Hu(new Combination([]), [])
}

function* findAllCombinations(tiles: Tiles): Generator<Combination> {
  if (tiles.length === 14) {
    const yao = find13Yao(tiles);
    if (!!yao) {
      return new Combination([yao])
    }
    const bukao = findBuKao(tiles);
    if (!!bukao) {
      return new Combination([bukao])
    }
  }
  const duis = findDui(tiles);
  if (duis.length === 7) {
    yield new Combination([new QiDui(tiles.distinct)])
  }

  for (let [left, dui] of duis) {
    for (let [l, zhl] of findZuHeLong(left)) {
      for (let sub of findShunKeCombinations(l)) {
        yield sub.with(zhl).with(dui)
      }
    }
    for (let comb of findShunKeCombinations(left)) {
      yield comb.with(dui)
    }
  }
}

function* findShunKeCombinations(tiles: Tiles): Generator<Combination> {
  if (tiles.length === 0) {
    yield new Combination([])
  }
  for (let [left, ke] of findKe(tiles, tiles[0])) {
    for (let sub of findShunKeCombinations(left)) {
      yield sub.with(ke)
    }
  }
  for (let [left, shun] of findShun(tiles, tiles[0])) {
    for (let sub of findShunKeCombinations(left)) {
      yield sub.with(shun)
    }
  }
}

function findDui(tiles: Tiles): [Tiles, Dui][] {
  const exist = []
  const dups = []
  for (let tile of tiles.tiles) {
    if (exist.indexOf(tile) === -1) {
      exist.push(tile)
    } else if (dups.indexOf(tile) === -1) {
      dups.push(tile)
    }
  }
  const results = []
  for (let dup of dups) {
    const [left] = tiles.split(dup, dup);
    results.push([left, new Dui(dup)])
  }
  return results
}


function* findShun(tiles: Tiles, tile: Tile): Generator<[Tiles, Shun]> {
  if (tile.type === 'z') {
    return
  }
  const subTiles = tiles.filterType(tile.type).filterShunPoint(tile.point);
  if (subTiles.length < 2) {
    return
  }
  for (let [a, b] of subTiles.pairs()) {
    const diff = Math.abs(a.point - b.point)
    if (diff === 1 || diff === 2) {
      const [left] = tiles.split(a, b, tile)

      yield [left, new Shun(new Tiles([a, b, tile]).minPointTile)]
    }
  }
}

function findKe(tiles: Tiles, tile: Tile): [Tiles, Ke][] {
  const sames = tiles.filterType(tile.type).filterPoint(tile.point)
  if (sames.length > 1) {
    const [left] = tiles.split(tile, tile, tile);
    return [[left, new Ke(tile)]]
  } else {
    return []
  }
}

function findZuHeLong(tiles: Tiles): [Tiles, ZuHeLong][] {
  const distinct = tiles.distinct
  const types = [
    distinct.filterType('m'),
    distinct.filterType('p'),
    distinct.filterType('s'),
  ]
  if (types.some(t => t.length < 3)) {
    return []
  }
  const groups = types.map(ts => {
    const points: TilePoint[][] = [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
    return points.map(ps => ts.filterPoint(...ps))
      .filter(t => t.length === 3)
  })
  if (groups.some(t => t.length === 0)) {
    return []
  }
  for (let m of groups[0]) {
    for (let p of groups[1]) {
      for (let s of groups[2]) {
        const mp = m.minPointTile.point
        const pp = p.minPointTile.point
        const sp = s.minPointTile.point
        if (mp != pp && mp != sp && pp != sp) {
          const [left, used] = tiles.split(...m.tiles, ...p.tiles, ...s.tiles)
          return [[left, new ZuHeLong(used)]]
        }
      }
    }
  }
  return []
}

function find13Yao(tiles: Tiles): Yao13 | null {
  if (!tiles.tiles.every(t => t.point === 1 || t.point === 9 || t.type === 'z')) {
    return null
  }
  const last = tiles.last;
  const [left] = tiles.split(last)
  if (left.distinct.length != 13) {
    return null
  }
  return new Yao13(last)
}

function findBuKao(tiles: Tiles): BuKao | null {
  if (tiles.distinct.length != 14) {
    return null
  }
  if ([
    tiles.filterType('s'),
    tiles.filterType('m'),
    tiles.filterType('p'),
  ].every(ts => {
    for (let [a, b] of ts.pairs()) {
      const diff = Math.abs(a.point - b.point)
      if (diff !== 3 && diff !== 6) {
        return false
      }
    }
    return true
  })) {
    return new BuKao(tiles)
  } else {
    return null
  }
}