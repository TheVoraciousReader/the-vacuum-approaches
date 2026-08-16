import type { Stats } from "./stats";

export type Verb = {
  id: string;
  label: string;
  delta: Partial<Stats>;
};

export const verbsByObject: Record<string, Verb[]> = {
  couch: [
    { id: "hide", label: "Hide under", delta: { goodBoy: 6, chaos: -2 } },
    { id: "nap", label: "Nap", delta: { goodBoy: 4 } },
    { id: "chew", label: "Chew", delta: { chaos: 12, goodBoy: -6 } },
  ],
  shoes: [
    { id: "sniff", label: "Sniff", delta: { goodBoy: 2 } },
    { id: "steal", label: "Steal one", delta: { chaos: 14, goodBoy: -8 } },
    { id: "chew", label: "Chew", delta: { chaos: 10, goodBoy: -4 } },
  ],
  tv: [
    { id: "watch", label: "Watch", delta: { goodBoy: 3 } },
    { id: "bark", label: "Bark at it", delta: { chaos: 8 } },
    { id: "block", label: "Sit in front", delta: { chaos: 6, goodBoy: -2 } },
  ],
  vacuum: [
    { id: "sniff", label: "Sniff the snout", delta: { chaos: 4, goodBoy: 2 } },
    { id: "bark", label: "Bark", delta: { chaos: 12, goodBoy: -4 } },
    { id: "flee", label: "Flee", delta: { goodBoy: 5, chaos: 2 } },
  ],
  fridge: [
    { id: "wait", label: "Wait (hunting)", delta: { goodBoy: 3 } },
    { id: "scratch", label: "Scratch", delta: { chaos: 8, goodBoy: -3 } },
    { id: "believe", label: "Believe you can open it", delta: { chaos: 4 } },
  ],
  trash: [
    { id: "sniff", label: "Sniff", delta: { chaos: 4 } },
    { id: "raid", label: "Raid", delta: { chaos: 16, treats: 5, goodBoy: -10 } },
    { id: "tip", label: "Tip it", delta: { chaos: 18, treats: 4, goodBoy: -8 } },
  ],
  bowl: [
    { id: "drink", label: "Drink", delta: { goodBoy: 4 } },
    { id: "splash", label: "Splash", delta: { chaos: 6, goodBoy: -2 } },
    { id: "guard", label: "Guard it", delta: { goodBoy: 5 } },
  ],
  bed: [
    { id: "claim", label: "Claim the middle", delta: { chaos: 5, goodBoy: 4 } },
    { id: "burrow", label: "Burrow", delta: { goodBoy: 8, chaos: 3 } },
    { id: "shed", label: "Shed", delta: { chaos: 10, goodBoy: -2 } },
  ],
  sock: [
    { id: "sniff", label: "Sniff", delta: { goodBoy: 2 } },
    { id: "claim", label: "Claim it", delta: { chaos: 12, goodBoy: -6 } },
    { id: "bury", label: "Bury it", delta: { chaos: 8, goodBoy: 2 } },
  ],
};

export function verbsFor(objectId: string): Verb[] {
  return (
    verbsByObject[objectId] ?? [
      { id: "sniff", label: "Sniff", delta: { chaos: 2 } },
    ]
  );
}
