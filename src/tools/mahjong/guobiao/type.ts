import assert from "assert";
import {Tile, TilePoint, TilePoints, TileType, TileTypes, YaoList} from "./tile";


export type Options = {
  zimo: boolean
  lastTile: boolean
  gangShang: boolean
  juezhang: boolean
  menfeng: TilePoint
  quanfeng: TilePoint
  hua: number
}

export class Tiles {
  static of(map: { 't'?: TilePoint[], 'b'?: TilePoint[], 'w'?: TilePoint[], 'z'?: TilePoint[] }) {
    const tiles = []
    map.t?.forEach(p => tiles.push(new Tile('t', p)))
    map.b?.forEach(p => tiles.push(new Tile('b', p)))
    map.w?.forEach(p => tiles.push(new Tile('w', p)))
    map.z?.forEach(p => tiles.push(new Tile('z', p)))
    return new Tiles(tiles)
  }

  readonly tiles: Tile[]

  constructor(
    tiles: Tile[] | Tiles,
  ) {
    if (tiles instanceof Tiles) {
      this.tiles = tiles.tiles
    } else {
      this.tiles = tiles
    }
  }

  get length() {
    return this.tiles.length
  }

  indexOf(tile: Tile) {
    return this.tiles.findIndex(t => t.equals(tile))
  }

  withTile = (tile: Tile) => new Tiles([...this.tiles, tile])

  split(...removes: Tile[]): [Tiles, Tiles] {
    const copy = [...this.tiles]
    const removed = []
    for (let remove of removes) {
      const index = remove.indexIn(copy)
      if (index != -1) {
        copy.splice(index, 1)
        removed.push(remove)
      }
    }
    return [new Tiles(copy), new Tiles(removed)]
  }

  filterType(...types: TileType[]) {
    if (this.length === 0) return new Tiles([])
    if (types.length === 0) {
      types = [this.last.type]
    }
    return new Tiles(this.tiles.filter(t => types.indexOf(t.type) !== -1))
  }

  removeType(...types: TileType[]) {
    if (this.length === 0) return new Tiles([])
    if (types.length === 0) {
      types = [this.last.type]
    }
    return new Tiles(this.tiles.filter(t => types.indexOf(t.type) === -1))
  }

  filterPoint(...points: TilePoint[]) {
    if (this.length === 0) return new Tiles([])
    return new Tiles(this.tiles.filter(t => points.indexOf(t.point) !== -1))
  }

  filterTiles(tiles: Tiles | Tile[]) {
    if (this.length === 0) return new Tiles([])
    return new Tiles(this.tiles.filter(t => t.in(tiles)))
  }

  filterShunPoint(point: TilePoint) {
    if (this.length === 0) return new Tiles([])
    return new Tiles(this.tiles.filter(t => t.point !== point && Math.abs(t.point - point) < 3))
  }

  filterMoreThan(count: number) {
    const res = []
    for (let tile of this.distinct.tiles) {
      if (this.count(tile) > count) {
        res.push(tile)
      }
    }
    return new Tiles(res)
  }

  * pairs() {
    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = i + 1; j < this.tiles.length; j++) {
        yield [this.tiles[i], this.tiles[j]]
      }
    }
  }

  * triples() {
    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = i + 1; j < this.tiles.length; j++) {
        for (let k = j + 1; k < this.tiles.length; k++) {
          yield [this.tiles[i], this.tiles[j], this.tiles[k]]
        }
      }
    }
  }

  get minPointTile(): Tile {
    let min = this.tiles[0]
    for (let tile of this.tiles) {
      if (tile.point < min.point) {
        min = tile
      }
    }
    return min
  }

  get maxPointTile(): Tile {
    let max = this.tiles[0]
    for (let tile of this.tiles) {
      if (tile.point > max.point) {
        max = tile
      }
    }
    return max
  }

  get distinct(): Tiles {
    const result = []
    for (let tile of this.tiles) {
      if (!tile.in(result)) {
        result.push(tile)
      }
    }
    return new Tiles(result)
  }

  get distinctTypes(): TileType[] {
    const result = []
    for (let tile of this.tiles) {
      if (result.indexOf(tile.type) === -1) {
        result.push(tile.type)
      }
    }
    return result
  }

  get distinctPoints(): TileType[] {
    const result = []
    for (let tile of this.tiles) {
      if (result.indexOf(tile.point) === -1) {
        result.push(tile.point)
      }
    }
    return result
  }

  get last(): Tile {
    return this.tiles[this.tiles.length - 1]
  }

  get withoutLast(): Tiles {
    return this.split(this.last)[0]
  }

  allIn(tiles: Tile[] | Tiles) {
    return this.tiles.every(t => t.in(tiles))
  }

  equals(tiles: Tile[] | Tiles) {
    return this.tiles.length === tiles.length && this.contains(tiles)
  }

  contains(tiles: Tile[] | Tiles) {
    const copy = [...this.tiles]
    for (let tile of new Tiles(tiles).tiles) {
      const index = tile.indexIn(copy)
      if (index === -1) {
        return false
      }
      copy.splice(index, 1)
    }
    return true
  }

  hasSameTypeAndDiff(diff: number = 1) {
    if (this.length === 0) return false
    return this.filterType(this.minPointTile.type).length === this.length && this.hasDiff(diff)
  }

  hasDiff(diff: number = 1) {
    if (this.length === 0) return false
    const min = this.minPointTile
    let left = this as Tiles
    for (let i = 0; i < this.length; i++) {
      const p = min.point + i * diff;
      const finds = left.filterPoint(p as TilePoint);
      if (p > 9 || finds.length === 0) {
        return false
      }
      left = left.split(finds.last)[0]
    }
    return true
  }

  get mostType() {
    let maxLen = 0
    let maxType = TileTypes[0]
    for (let t of TileTypes) {
      const len = this.filterType(t).length
      if (len > maxLen) {
        maxType = t
        maxLen = len
      }
    }
    return [maxType, maxLen]
  }

  get mostPoint() {
    let maxLen = 0
    let mostPoint = 0
    for (let t of TilePoints) {
      const len = this.filterType('t', 'b', 'w').filterPoint(t).length
      if (len > maxLen) {
        mostPoint = t
        maxLen = len
      }
    }
    return [mostPoint, maxLen]
  }

  count(tile: Tile) {
    return this.filterType(tile.type).filterPoint(tile.point).length
  }
}

const defaultOptions: Options = {
  hua: 0,
  lastTile: false,
  gangShang: false,
  juezhang: false,
  quanfeng: 1,
  menfeng: 1,
  zimo: false,
};

export class Hand {
  readonly option: Options

  constructor(
    readonly tiles: Tiles, // last one is last card
    readonly mings: Ming[] = [],
    option: Partial<Options> = defaultOptions,
  ) {
    this.option = {
      ...defaultOptions,
      ...option,
    }
  }

  get count() {
    return this.tiles.length + 3 * this.mings.length
  }

  get allTiles() {
    const mingTiles = this.mings.flatMap(m => m.toMian().toTiles.tiles)
    return new Tiles([...mingTiles, ...this.tiles.tiles])
  }

  copy = () => new Hand(new Tiles(this.tiles.tiles), [...this.mings], {...this.option})
}

export class Combination {
  constructor(
    readonly mians: Mian[]
  ) {
  }

  with = (...ms: Mian[]) => new Combination([...this.mians, ...ms])

  get toTiles(): Tiles {
    return new Tiles(this.mians.flatMap(m => m.toTiles.tiles))
  }

  hasKe(tiles: Tile[]) {
    for (let tile of tiles) {
      let found = false
      for (let mian of this.mians) {
        if (mian.type === 'ke' && mian.tile === tile) {
          found = true
          break
        }
      }
      if (!found) {
        return false
      }
    }
    return true
  }

  getMianWith(tile: Tile) {
    return this.mians.filter(m => tile.in(m.toTiles.tiles))
  }
}

export interface Fan {
  readonly score: number
  readonly name: string
}

export class Hu {
  constructor(
    readonly combination: Combination,
    readonly fans: Fan[],
  ) {
  }

  get totalScore() {
    return this.fans.map(f => f.score).reduce((a, b) => a + b)
  }
}

export class Chi {
  readonly type = 'chi'

  constructor(
    readonly tile: Tile,
  ) {
  }

  toMian = () => new Shun(this.tile, true)
}

export class Peng {
  readonly type = 'peng'

  constructor(
    readonly tile: Tile,
  ) {
  }

  toMian = () => new Ke(this.tile, true)
}


export class Gang {
  readonly type = 'gang'

  constructor(
    readonly tile: Tile,
    readonly open: boolean,
  ) {
  }

  toMian = () => new Ke(this.tile, this.open, true)
}

export type Ming = Chi | Peng | Gang

export class Shun {
  readonly type = 'shun'
  readonly simple = true

  constructor(
    readonly tile: Tile,
    readonly open: boolean = false,
  ) {
    assert(tile.type !== 'z', '字牌不能顺')
    assert(tile.point < 8, '8,9不能顺')
  }

  get name() {
    return this.open ? '吃' : '顺'
  }

  get toTiles() {
    return new Tiles([this.tile, this.tile.next, this.tile.next.next])
  }

  toMing() {
    if (this.open) {
      return new Chi(this.tile)
    } else {
      throw 'can not transfer to chi'
    }
  }
}

export class Ke {
  readonly type = 'ke'
  readonly simple = true

  constructor(
    readonly tile: Tile,
    readonly open: boolean = false,
    readonly gang: boolean = false,
  ) {
  }

  get name() {
    return this.gang ? (this.open ? '明杠' : '暗杠') : (this.open ? '碰' : '暗刻')
  }

  get toTiles() {
    return new Tiles([this.tile, this.tile, this.tile])
  }

  toMing() {
    if (this.gang) {
      return new Gang(this.tile, this.open)
    } else if (this.open) {
      return new Peng(this.tile)
    } else {
      throw 'can not transfer to chi'
    }
  }
}

export class Dui {
  readonly type = 'dui'
  readonly open = false
  readonly simple = true

  constructor(
    readonly tile: Tile,
  ) {
  }

  get toTiles() {
    return new Tiles([this.tile, this.tile])
  }
}

export class QiDui {
  readonly type = 'qi-dui'
  readonly open = false
  readonly simple = false

  constructor(
    readonly tiles: Tiles,
  ) {
    assert(tiles.length == 7)
  }

  get toTiles() {
    return new Tiles([...this.tiles.tiles, ...this.tiles.tiles])
  }
}

export class ZuHeLong {
  readonly type = 'zu-he-long'
  readonly open = false
  readonly simple = false

  constructor(
    readonly tiles: Tiles,
  ) {
    assert(tiles.length == 9)
  }

  get toTiles() {
    return this.tiles
  }
}

export class BuKao {
  readonly type = 'bu-kao'
  readonly open = false
  readonly simple = false

  constructor(
    readonly tiles: Tiles,
  ) {
    assert(tiles.length == 14)
  }

  get toTiles() {
    return this.tiles
  }
}

export class Yao13 {
  readonly type = '13yao'
  readonly open = false
  readonly simple = false

  constructor(
    readonly tile: Tile,
  ) {
  }

  get toTiles() {
    return new Tiles([this.tile, ...YaoList])
  }
}

export type Mian = Dui | Shun | Ke | QiDui | BuKao | Yao13 | ZuHeLong