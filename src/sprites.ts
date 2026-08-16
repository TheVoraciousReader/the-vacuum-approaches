import { dogFrames } from "./dog-frames";

export type Palette = Record<string, string>;

export const palette = {
  ink: "#1a1410",
  wall: "#4a3224",
  wallHi: "#6b4a32",
  floor: "#c4a06a",
  floor2: "#b89058",
  rug: "#7a3b32",
  rugHi: "#9a4e42",
  wood: "#6b4423",
  cream: "#e8d5a3",
  snout: "#f4ead4",
  ear: "#5c4033",
  vacuum: "#3a3c42",
  vacuumHi: "#5c616c",
  vacuumRed: "#c45c4a",
  gold: "#d4a017",
  leaf: "#6a9e6d",
  water: "#4a7380",
  waterHi: "#6a98a4",
} as const;

export function pixelsToDataUrl(
  rows: string[],
  colors: Palette,
  scale = 2,
): string {
  const w = rows[0].length;
  const h = rows.length;
  const canvas = document.createElement("canvas");
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x];
      if (ch === "." || ch === " ") continue;
      const hex = colors[ch];
      if (!hex) continue;
      ctx.fillStyle = hex;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
  return canvas.toDataURL();
}

const wall: string[] = [
  "################",
  "#++++++++++++++#",
  "#++++++++++++++#",
  "#++++++++++++++#",
  "#++++++++++++++#",
  "################",
  "################",
  "#++++++++++++++#",
  "#++++++++++++++#",
  "#++++++++++++++#",
  "#++++++++++++++#",
  "################",
  "################",
  "#++++++++++++++#",
  "#++++++++++++++#",
  "################",
];

const floorA: string[] = [
  "oooooooooooooooo",
  "o--------------o",
  "o--------------o",
  "o--------------o",
  "o--------------o",
  "o--------------o",
  "o--------------o",
  "o--------------o",
  "o--------------o",
  "o--------------o",
  "o--------------o",
  "o--------------o",
  "o--------------o",
  "o--------------o",
  "o--------------o",
  "oooooooooooooooo",
];

const floorB: string[] = [
  "xxxxxxxxxxxxxxxx",
  "x--------------x",
  "x--------------x",
  "x--------------x",
  "x--------------x",
  "x--------------x",
  "x--------------x",
  "x--------------x",
  "x--------------x",
  "x--------------x",
  "x--------------x",
  "x--------------x",
  "x--------------x",
  "x--------------x",
  "x--------------x",
  "xxxxxxxxxxxxxxxx",
];

const rug: string[] = [
  "rrrrrrrrrrrrrrrr",
  "rRRRRRRRRRRRRRRr",
  "rR............Rr",
  "rR.rrrrrrrrrr.Rr",
  "rR.r........r.Rr",
  "rR.r.rrrrrr.r.Rr",
  "rR.r.r....r.r.Rr",
  "rR.r.r.rr.r.r.Rr",
  "rR.r.r.rr.r.r.Rr",
  "rR.r.r....r.r.Rr",
  "rR.r.rrrrrr.r.Rr",
  "rR.r........r.Rr",
  "rR.rrrrrrrrrr.Rr",
  "rR............Rr",
  "rRRRRRRRRRRRRRRr",
  "rrrrrrrrrrrrrrrr",
];

const couch: string[] = [
  "................................",
  "..############################..",
  ".##BBBBBBBBBBBBBBBBBBBBBBBBBB##.",
  "##BBBBBBBBBBBBBBBBBBBBBBBBBBBB##",
  "##BBbbbbbbBBBBBBBBbbbbbbBBBBBB##",
  "##BBbBBBBBbBBBBBBbBBBBBbBBBBBB##",
  "##BBBBBBBBBBBBBBBBBBBBBBBBBBBB##",
  "##BBBBBBBBBBBBBBBBBBBBBBBBBBBB##",
  "##AA########################AA##",
  "##AA#SSSSSSSS##SSSSSSSSSSSS#AA##",
  "##AA#SSSSSSSs##sSSSSSSSSSSS#AA##",
  "##AA#SSSSSSSS##SSSSSSSSSSSS#AA##",
  "##AA#SSSSSSSS##SSSSSSSSSSSS#AA##",
  "##AA#SSSSSSSs##sSSSSSSSSSSS#AA##",
  "##AA#SSSSSSSS##SSSSSSSSSSSS#AA##",
  "##AA########################AA##",
  "##AAAAAAAAAAAAAAAAAAAAAAAAAAAA##",
  ".##AAAAAAAAAAAAAAAAAAAAAAAAAA##.",
  "..############################..",
  "....##WW##............##WW##....",
  "....##WW##............##WW##....",
  "....######............######....",
  "................................",
  "................................",
];

const shoes: string[] = [
  "................................",
  "................................",
  "...##########......#########....",
  "..#LLLLLLLLLL#....#LLLLLLLLL#...",
  ".#LLooooooooLL#..#LLoooooooLL#..",
  ".#LL########LL#..#LL#######LL#..",
  ".#LLLLLLLLLLLL#..#LLLLLLLLLLL#..",
  ".##############..#############..",
  "..#ssssssssss#....#sssssssss#...",
  "...##########......#########....",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
];

const tv: string[] = [
  "................",
  ".##############.",
  ".#oooooooooooo#.",
  ".#o##########o#.",
  ".#o#........#o#.",
  ".#o#..gg..g.#o#.",
  ".#o#........#o#.",
  ".#o##########o#.",
  ".#oooooooooooo#.",
  ".##############.",
  "......####......",
  ".....######.....",
  "....########....",
  "................",
  "................",
  "................",
];

const fridge: string[] = [
  ".##############.",
  ".#oooooooooooo#.",
  ".#o##########o#.",
  ".#o#........#o#.",
  ".#o#........#o#.",
  ".#o#........#o#.",
  ".#o#......g.#o#.",
  ".#o#......g.#o#.",
  ".#o#........#o#.",
  ".#o#........#o#.",
  ".#o##########o#.",
  ".#oooooooooooo#.",
  ".#o##########o#.",
  ".#o#........#o#.",
  ".#o#........#o#.",
  ".#o#........#o#.",
  ".#o#........#o#.",
  ".#o#........#o#.",
  ".#o#........#o#.",
  ".#o#......g.#o#.",
  ".#o#......g.#o#.",
  ".#o#......g.#o#.",
  ".#o#........#o#.",
  ".#o#........#o#.",
  ".#o#........#o#.",
  ".#o#........#o#.",
  ".#o#........#o#.",
  ".#o#........#o#.",
  ".#o#........#o#.",
  ".#o#........#o#.",
  ".#o#........#o#.",
  ".#o##########o#.",
  ".#oooooooooooo#.",
  ".##############.",
  ".#++++++++++++#.",
  ".##############.",
];

const trash: string[] = [
  "................",
  "......oooo......",
  "....oo####oo....",
  "...o##rrrr##o...",
  "..o#rrggggrr#o..",
  "..o#rgg..ggr#o..",
  "..o#rrggggrr#o..",
  "...o##rrrr##o...",
  "....o######o....",
  ".....o####o.....",
  "......oooo......",
  "................",
  "................",
  "................",
  "................",
  "................",
];

const bowl: string[] = [
  "................",
  "................",
  "......oooo......",
  "....oo####oo....",
  "...o##wwww##o...",
  "..o#wwWWWWWw#o..",
  "..o#wWW..WWw#o..",
  "..o#wwWWWWWw#o..",
  "...o##wwww##o...",
  "....o######o....",
  ".....o####o.....",
  "......oooo......",
  "................",
  "................",
  "................",
  "................",
];

const bed: string[] = [
  "................................",
  "..############################..",
  ".##HHHHHHHHHHHHHHHHHHHHHHHHHH##.",
  "##HHHHHHHHHHHHHHHHHHHHHHHHHHHH##",
  "##HHHHHHHHHHHHHHHHHHHHHHHHHHHH##",
  "##..ooPPPPPoo....ooPPPPPoo....##",
  "##.oPPPPPPPPo....oPPPPPPPPo...##",
  "##.oPPppPPPpo....oPPppPPPpo...##",
  "##.oPPPPPPPPo....oPPPPPPPPo...##",
  "##..ooPPPPPoo....ooPPPPPoo....##",
  "##............................##",
  "##.BBBBBBBBBBBBBBBBBBBBBBBBBB.##",
  "##.BBBBbbBBBBBBBBBBbbBBBBBBBB.##",
  "##.BBBBBBBBBBBBBBBBBBBBBBBBBB.##",
  "##.BBBBBBBBbbBBBBBBBBBBBBBBBB.##",
  "##.BBBBBBBBBBBBBBBBBBBBBSSSBB.##",
  "##.BBbbBBBBBBBBBBBBbbBBBSSSSB.##",
  "##.BBBBBBBBBBBBBBBBBBBBSSSSSS.##",
  "##.BBBBBBBBbbBBBBBBBB.SSSSSSS.##",
  "##.BBBBBBBBBBBBBBBBBB...SSSS..##",
  "##.BBBBBBBBbbBBBBBBBB.........##",
  "##.BBBBBBBBBBBBBBBBBB.........##",
  "##.##########################.##",
  "##FFFFFFFFFFFFFFFFFFFFFFFFFFFF##",
  ".##FFFFFFFFFFFFFFFFFFFFFFFFFF##.",
  "..############################..",
  "....##WW##..........##WW##......",
  "....######..........######......",
];

const sock: string[] = [
  "................",
  "...oooooo.......",
  "..o######o......",
  "..o#ssss#o......",
  "..o#ssoo#o......",
  "..o#ssss#o......",
  "..o#ssss#o......",
  "..o#ssss#oooooo.",
  "..o#ssssssssss#o",
  "..o#ssssssssss#o",
  "..o#ssssoo#ss#o.",
  "...o#ssssssss#o.",
  "...o########o...",
  "....oooooooo....",
  "................",
  "................",
];

const vacuum: string[] = [
  "................",
  ".....oooooo.....",
  "....o######o....",
  "....o#rrrr#o....",
  "....o#r..r#o....",
  "....o#rrrr#o....",
  "....o######o....",
  ".....oooooo.....",
  "......o##o......",
  ".....o#..#o.....",
  "....o#....#o....",
  "...o#......#o...",
  "..o#........#o..",
  "..o##########o..",
  "...oooooooooo...",
  "................",
];

const treat: string[] = [
  "........",
  "..oooo..",
  ".o####o.",
  ".o#gg#o.",
  ".o#gg#o.",
  ".o####o.",
  "..oooo..",
  "........",
];

const heartFull: string[] = [
  ".r.r.",
  "rrrrr",
  "rrrrr",
  ".rrr.",
  "..r..",
];

const heartEmpty: string[] = [
  ".r.r.",
  "r...r",
  "r...r",
  ".r.r.",
  "..r..",
];

const tileColors: Palette = {
  "#": palette.wall,
  "+": palette.wallHi,
  o: palette.floor,
  "-": palette.floor,
  x: palette.floor2,
  r: palette.rug,
  R: palette.rugHi,
};

const woodColors: Palette = {
  "#": palette.ink,
  "+": palette.wood,
  o: palette.cream,
  e: palette.ear,
  c: palette.cream,
  s: palette.snout,
  g: palette.gold,
  r: palette.vacuumRed,
};

const couchColors: Palette = {
  "#": palette.ink,
  B: "#4a2c28",
  b: "#6b423c",
  S: "#8a5248",
  s: "#6b3a32",
  A: "#5c3832",
  W: palette.wood,
};

const shoeColors: Palette = {
  "#": palette.ink,
  L: palette.ear,
  o: palette.snout,
  s: palette.wood,
};

const bedColors: Palette = {
  "#": palette.ink,
  H: palette.wood,
  o: palette.ink,
  P: palette.snout,
  p: palette.cream,
  B: "#b08a68",
  b: "#8a6a4e",
  S: palette.cream,
  F: palette.ear,
  W: palette.wood,
};

const vacuumColors: Palette = {
  "#": palette.ink,
  o: palette.vacuumHi,
  r: palette.vacuumRed,
};

const dogColors: Palette = {
  "#": "#3a2218",
  T: "#d4a05a",
  t: "#c48440",
  W: "#f6efe4",
  p: "#e39280",
};

function sheetFromFrames(frames: string[][], scale = 2): string {
  const fw = frames[0][0].length;
  const fh = frames[0].length;
  const cols = 2;
  const rows = 4;
  const canvas = document.createElement("canvas");
  canvas.width = fw * cols * scale;
  canvas.height = fh * rows * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  frames.forEach((frame, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    for (let y = 0; y < fh; y++) {
      for (let x = 0; x < fw; x++) {
        const ch = frame[y][x];
        if (ch === "." || ch === " ") continue;
        const hex = dogColors[ch];
        if (!hex) continue;
        ctx.fillStyle = hex;
        ctx.fillRect(
          (col * fw + x) * scale,
          (row * fh + y) * scale,
          scale,
          scale,
        );
      }
    }
  });
  return canvas.toDataURL();
}

export const spriteUrls = {
  wall: pixelsToDataUrl(wall, tileColors, 2),
  floorA: pixelsToDataUrl(floorA, tileColors, 2),
  floorB: pixelsToDataUrl(floorB, tileColors, 2),
  rug: pixelsToDataUrl(rug, tileColors, 2),
  couch: pixelsToDataUrl(couch, couchColors, 2),
  shoes: pixelsToDataUrl(shoes, shoeColors, 2),
  tv: pixelsToDataUrl(tv, woodColors, 2),
  fridge: pixelsToDataUrl(fridge, woodColors, 2),
  trash: pixelsToDataUrl(trash, woodColors, 2),
  bowl: pixelsToDataUrl(
    bowl,
    { ...woodColors, w: palette.water, W: palette.waterHi },
    2,
  ),
  bed: pixelsToDataUrl(bed, bedColors, 2),
  sock: pixelsToDataUrl(sock, woodColors, 2),
  vacuum: pixelsToDataUrl(vacuum, vacuumColors, 2),
  treat: pixelsToDataUrl(treat, woodColors, 3),
  heart: pixelsToDataUrl(heartFull, { r: palette.vacuumRed }, 3),
  heartEmpty: pixelsToDataUrl(heartEmpty, { r: palette.vacuumRed }, 3),
  dog: sheetFromFrames([
    dogFrames.down0,
    dogFrames.down1,
    dogFrames.left0,
    dogFrames.left1,
    dogFrames.right0,
    dogFrames.right1,
    dogFrames.up0,
    dogFrames.up1,
  ]),
};
