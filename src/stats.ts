export type Stats = {
  chaos: number;
  treats: number;
  goodBoy: number;
};

const MAX_CHAOS = 100;
const MAX_TREATS = 25;
const MAX_GOOD_BOY = 100;

const state: Stats = {
  chaos: 12,
  treats: 0,
  goodBoy: 28,
};

export function getStats(): Stats {
  return { ...state };
}

export function getGoodBoyLevel(xp = state.goodBoy): number {
  return Math.min(10, Math.floor(xp / 10) + 1);
}

export function applyDelta(delta: Partial<Stats>): Stats {
  const wasLethal = state.chaos >= CHAOS_LETHAL;
  if (delta.chaos != null) {
    state.chaos = clamp(state.chaos + delta.chaos, 0, MAX_CHAOS);
  }
  if (delta.treats != null) {
    state.treats = clamp(state.treats + delta.treats, 0, MAX_TREATS);
  }
  if (delta.goodBoy != null) {
    state.goodBoy = clamp(state.goodBoy + delta.goodBoy, 0, MAX_GOOD_BOY);
  }
  if (!wasLethal && state.chaos >= CHAOS_LETHAL) {
    hearts = MAX_HEARTS;
  }
  return getStats();
}

export function resetStats() {
  state.chaos = 12;
  state.treats = 0;
  state.goodBoy = 28;
  hearts = MAX_HEARTS;
}

export const CHAOS_LETHAL = 50;
export const MAX_HEARTS = 5;

let hearts = MAX_HEARTS;

export function getHearts() {
  return hearts;
}

export function isVacuumLethal() {
  return state.chaos >= CHAOS_LETHAL;
}

export function takeHeart(): "safe" | "hurt" | "dead" {
  if (!isVacuumLethal()) return "safe";
  hearts = Math.max(0, hearts - 1);
  return hearts <= 0 ? "dead" : "hurt";
}

export function formatDelta(delta: Partial<Stats>): string {
  const parts: string[] = [];
  if (delta.chaos) parts.push(`CHAOS ${signed(delta.chaos)}`);
  if (delta.treats) parts.push(`TREATS ${signed(delta.treats)}`);
  if (delta.goodBoy) parts.push(`GOOD BOY ${signed(delta.goodBoy)}`);
  return parts.join("   ");
}

function signed(n: number) {
  return n > 0 ? `+${n}` : `${n}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
