export const TILE = 32;
export const HUD_H = 48;
export const MAP_W = 20;
export const MAP_H = 12;

export type RoomId = "living" | "kitchen" | "bedroom";
export type SpawnId = "default" | "n" | "e" | "s" | "w";

export type Furniture = {
  id: string;
  name: string;
  sprite: string;
  tx: number;
  ty: number;
};

export type RoomDef = {
  id: RoomId;
  title: string;
  map: string[];
  furniture: Furniture[];
  vacuum?: { tx: number; ty: number; minX: number; maxX: number };
  spawns: Record<SpawnId, { tx: number; ty: number }>;
};

export const rooms: Record<RoomId, RoomDef> = {
  living: {
    id: "living",
    title: "Living Room",
    map: [
      "#########n##########",
      "#..................#",
      "#..................#",
      "#..................#",
      "#..................#",
      "#..................#",
      "#..................e",
      "#..................#",
      "#..................#",
      "#..................#",
      "#..................#",
      "####################",
    ],
    furniture: [
      { id: "couch", name: "Couch", sprite: "couch", tx: 3, ty: 3 },
      { id: "tv", name: "Picture Box", sprite: "tv", tx: 15, ty: 3 },
      { id: "shoes", name: "Shoes", sprite: "shoes", tx: 2, ty: 8 },
    ],
    vacuum: { tx: 11, ty: 7, minX: 8 * TILE, maxX: 16 * TILE },
    spawns: {
      default: { tx: 10, ty: 9 },
      n: { tx: 9, ty: 2 },
      e: { tx: 17, ty: 6 },
      s: { tx: 10, ty: 9 },
      w: { tx: 2, ty: 6 },
    },
  },
  kitchen: {
    id: "kitchen",
    title: "Kitchen",
    map: [
      "####################",
      "#..................#",
      "#..................#",
      "#..................#",
      "#..................#",
      "#..................#",
      "w..................#",
      "#..................#",
      "#..................#",
      "#..................#",
      "#..................#",
      "####################",
    ],
    furniture: [
      { id: "fridge", name: "Cold Box", sprite: "fridge", tx: 3, ty: 4 },
      { id: "trash", name: "Forbidden Bowl", sprite: "trash", tx: 15, ty: 7 },
      { id: "bowl", name: "Water Bowl", sprite: "bowl", tx: 8, ty: 8 },
    ],
    spawns: {
      default: { tx: 4, ty: 6 },
      n: { tx: 10, ty: 2 },
      e: { tx: 17, ty: 6 },
      s: { tx: 10, ty: 9 },
      w: { tx: 2, ty: 6 },
    },
  },
  bedroom: {
    id: "bedroom",
    title: "The Nest",
    map: [
      "####################",
      "#..................#",
      "#..................#",
      "#..................#",
      "#..................#",
      "#..................#",
      "#..................#",
      "#..................#",
      "#..................#",
      "#..................#",
      "#..................#",
      "#########s##########",
    ],
    furniture: [
      { id: "bed", name: "The Nest", sprite: "bed", tx: 5, ty: 4 },
      { id: "sock", name: "Sacred Sock", sprite: "sock", tx: 14, ty: 8 },
    ],
    spawns: {
      default: { tx: 10, ty: 8 },
      n: { tx: 10, ty: 2 },
      e: { tx: 17, ty: 6 },
      s: { tx: 9, ty: 9 },
      w: { tx: 2, ty: 6 },
    },
  },
};

export function doorTarget(
  from: RoomId,
  dir: "n" | "e" | "s" | "w",
): { room: RoomId; spawn: SpawnId } | null {
  if (from === "living" && dir === "e") return { room: "kitchen", spawn: "w" };
  if (from === "living" && dir === "n") return { room: "bedroom", spawn: "s" };
  if (from === "kitchen" && dir === "w") return { room: "living", spawn: "e" };
  if (from === "bedroom" && dir === "s") return { room: "living", spawn: "n" };
  return null;
}

export function tileToWorld(tx: number, ty: number) {
  return {
    x: tx * TILE + TILE / 2,
    y: HUD_H + ty * TILE + TILE / 2,
  };
}
