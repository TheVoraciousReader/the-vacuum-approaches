import { applyDelta, formatDelta, type Stats } from "./stats";
import type { Verb } from "./actions";

export type NarrateRequest = {
  objectId: string;
  objectName: string;
  actionId: string;
  actionLabel: string;
};

export type NarrateResult = {
  speaker: string;
  text: string;
  delta: Partial<Stats>;
};

const punchlines: Record<string, string[]> = {
  "couch:hide": [
    "The undersides accept you. Dust lives here. Dust is family. The roaring beast cannot know this place.",
  ],
  "couch:nap": [
    "You perform a circle, then another, then a third because two is for cats. You collapse. This is a throne.",
  ],
  "couch:chew": [
    "The arm tastes like years of hands. You improve it. The humans will call this a crime. You call it interior design.",
  ],
  "shoes:sniff": [
    "Outside is still on them. Grass. Street. A dog you have not met. You file the report.",
  ],
  "shoes:steal": [
    "One shoe is a pair if you believe. You take it to a place of honor: under the furniture.",
  ],
  "shoes:chew": [
    "You taste the remaining one to confirm it is still a shoe. It is. You make sure it stays interesting.",
  ],
  "tv:watch": [
    "Tiny animals appear. You watch with the dignity of a critic who cannot change the channel.",
  ],
  "tv:bark": [
    "A tiny animal does not respect you. You bark. It does not respect you louder. You respect yourself.",
  ],
  "tv:block": [
    "You sit in the glowing. The humans make the noise that means they can no longer see. This is correct. You were here first.",
  ],
  "vacuum:sniff": [
    "Plastic and thunder. You back up one step, then two, then you consider a third for science.",
  ],
  "vacuum:bark": [
    "THE BEAST IS AWAKE or it will be. You inform it, at volume, that this house has a king.",
  ],
  "vacuum:flee": [
    "A strategic retreat. The hallway is a kingdom. You will return when the roaring is a rumor.",
  ],
  "fridge:wait": [
    "Someone left a smell in here last Thursday. You remember. Waiting is a kind of hunting.",
  ],
  "fridge:scratch": [
    "The cold box does not open. You explain, with claws, that this is a design flaw.",
  ],
  "fridge:believe": [
    "You cannot open it. You can believe you could. Belief is almost a treat.",
  ],
  "trash:sniff": [
    "Notes of chicken, shame, and a napkin that once knew gravy. You take the meeting.",
  ],
  "trash:raid": [
    "The forbidden buffet is open. For science. You emerge with knowledge and a little gravy.",
  ],
  "trash:tip": [
    "Gravity is your intern. The bowl becomes a landscape. You are the mayor of scraps.",
  ],
  "bowl:drink": [
    "Water. You drink as if you have crossed a desert, which you have: the hallway.",
  ],
  "bowl:splash": [
    "The water was too still. You fix this. The floor is now also a bowl.",
  ],
  "bowl:guard": [
    "This is your water. You lie beside it in case of thieves, which include you, later.",
  ],
  "bed:claim": [
    "You find the exact center, which is a crime, which is also love. You sigh the sigh of a landlord.",
  ],
  "bed:burrow": [
    "The nest smells like safety and the soap they use when they leave you. You tunnel. It was always yours.",
  ],
  "bed:shed": [
    "You leave a signature in fur. Future-you will find it and know: I was comfortable here.",
  ],
  "sock:sniff": [
    "Still warm with the memory of a foot. This is culture. You take notes with your nose.",
  ],
  "sock:claim": [
    "The sacred sock is yours. You will keep it. You will hide it. This is the law.",
  ],
  "sock:bury": [
    "You present it to the empty room, extremely proud. Nobody is here. Under the bed, then.",
  ],
};

const seen: Record<string, number> = {};

export function narrate(req: NarrateRequest, verb: Verb): NarrateResult {
  const punchline = punchlineFor(req);
  applyDelta(verb.delta);
  const change = formatDelta(verb.delta);
  return {
    speaker: "You",
    text: change ? `${punchline}\n\n${change}` : punchline,
    delta: verb.delta,
  };
}

function punchlineFor(req: NarrateRequest): string {
  const key = `${req.objectId}:${req.actionId}`;
  const options = punchlines[key] ?? [
    `You ${req.actionLabel.toLowerCase()}. The ${req.objectName.toLowerCase()} allows this. You are qualified.`,
  ];
  const n = seen[key] ?? 0;
  seen[key] = n + 1;
  return options[n % options.length];
}
