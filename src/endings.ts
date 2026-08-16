import type { Stats } from "./stats";

export type EndingId =
  | "chaosHigh"
  | "chaosLow"
  | "goodHigh"
  | "treatsMax"
  | "vacuumDeath";

export type Ending = {
  id: EndingId;
  title: string;
  subtitle: string;
  body: string;
  accent: [number, number, number];
};

export const endings: Record<EndingId, Ending> = {
  chaosHigh: {
    id: "chaosHigh",
    title: "MAXIMUM CHAOS",
    subtitle: "the house has fallen",
    body: "Shoes have been relocated. The forbidden bowl is a landscape. The vacuum files a complaint it cannot bark. You sit in the exact center of the wreckage and sigh the sigh of a landlord. You have won at being a dog.",
    accent: [196, 92, 74],
  },
  chaosLow: {
    id: "chaosLow",
    title: "ZERO CHAOS",
    subtitle: "nothing is happening, on purpose",
    body: "No sock is out of place. The cold box is unscratch. The beast sleeps, cheated of dirt. You lie very still. The humans will call this a good day. You call it a rumor. You might be broken. You might be plotting.",
    accent: [180, 160, 130],
  },
  goodHigh: {
    id: "goodHigh",
    title: "GOOD BOY LEVEL MAX",
    subtitle: "certificates, theoretically",
    body: "You have sat. You have waited. You have drunk water like a professional. The humans do not know about the sock. They do not need to. You are the goodest. The vacuum, for once, is not about you.",
    accent: [106, 158, 109],
  },
  treatsMax: {
    id: "treatsMax",
    title: "TREAT HOARD",
    subtitle: "twenty-five, and not one fewer",
    body: "The biscuits have become a geography. You cannot lie down without crushing wealth. This is a problem for future-you, who is also you, who is currently chewing. The vacuum can wait. The vacuum has always waited.",
    accent: [212, 160, 23],
  },
  vacuumDeath: {
    id: "vacuumDeath",
    title: "THE BEAST EATS",
    subtitle: "you were fur. it was enough.",
    body: "The roaring found you. Five chances. None left. The hose does not care about Good Boy. It does not care about biscuits. It cares about dirt, and today you qualified. The undersides of the couch will remember you.",
    accent: [196, 92, 74],
  },
};

export function detectEnding(before: Stats, after: Stats): EndingId | null {
  if (before.chaos < 100 && after.chaos >= 100) return "chaosHigh";
  if (before.chaos > 0 && after.chaos <= 0) return "chaosLow";
  if (before.goodBoy < 100 && after.goodBoy >= 100) return "goodHigh";
  if (before.treats < 25 && after.treats >= 25) return "treatsMax";
  return null;
}
