import type { KAPLAYCtx } from "kaplay";

export type SfxId =
  | "step"
  | "sniff"
  | "chew"
  | "bark"
  | "soft"
  | "crash"
  | "vacuum";

const VOL: Record<SfxId, number> = {
  step: 0.45,
  sniff: 0.7,
  chew: 0.7,
  bark: 0.75,
  soft: 0.65,
  crash: 0.7,
  vacuum: 0.35,
};

/** Verb id → shared family. Unknown verbs fall back to soft. */
const familyByVerb: Record<string, SfxId> = {
  sniff: "sniff",
  chew: "chew",
  steal: "chew",
  raid: "chew",
  claim: "chew",
  bark: "bark",
  hide: "soft",
  nap: "soft",
  watch: "soft",
  wait: "soft",
  drink: "soft",
  guard: "soft",
  burrow: "soft",
  flee: "soft",
  believe: "soft",
  block: "crash",
  scratch: "crash",
  tip: "crash",
  splash: "crash",
  shed: "crash",
  bury: "crash",
};

const SFX_IDS = Object.keys(VOL) as SfxId[];

let muted = false;
const muteListeners = new Set<() => void>();

export function isMuted(): boolean {
  return muted;
}

export function onMuteChange(fn: () => void): () => void {
  muteListeners.add(fn);
  return () => muteListeners.delete(fn);
}

export function toggleMute(k: KAPLAYCtx): void {
  muted = !muted;
  k.volume(muted ? 0 : 1);
  for (const fn of muteListeners) fn();
}

export function loadSounds(k: KAPLAYCtx): void {
  for (const id of SFX_IDS) {
    k.loadSound(id, `/sfx/${id}.ogg`);
  }
}

export function playSfx(k: KAPLAYCtx, id: SfxId): void {
  if (muted) return;
  k.play(id, { volume: VOL[id] });
}

export function playVerbSfx(k: KAPLAYCtx, verbId: string): void {
  playSfx(k, familyByVerb[verbId] ?? "soft");
}
