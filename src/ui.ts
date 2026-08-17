import type { KAPLAYCtx, GameObj, PosComp } from "kaplay";
import type { Verb } from "./actions";
import { isMuted, onMuteChange, toggleMute } from "./audio";
import { getGoodBoyLevel, getHearts, getStats, isVacuumLethal, MAX_HEARTS } from "./stats";

const HUD_Z = 200;
const DIALOG_Z = 220;

export function createHud(k: KAPLAYCtx) {
  const root = k.add([k.pos(0, 0), k.fixed(), k.z(HUD_Z)]);

  root.add([
    k.rect(k.width(), 48),
    k.color(20, 16, 12),
    k.pos(0, 0),
    k.opacity(0.94),
  ]);
  root.add([k.rect(k.width(), 2), k.color(212, 160, 23), k.pos(0, 46)]);

  const chaosLabel = root.add([
    k.text("CHAOS 12", { size: 10, font: "monospace" }),
    k.color(196, 92, 74),
    k.pos(12, 8),
  ]);
  root.add([
    k.rect(88, 8),
    k.color(60, 32, 28),
    k.pos(90, 10),
    k.anchor("left"),
  ]);
  const chaosBar = root.add([
    k.rect(88, 8),
    k.scale(1, 1),
    k.color(196, 92, 74),
    k.pos(90, 10),
    k.anchor("left"),
  ]);

  const treatLabel = root.add([
    k.text("TREATS 0", { size: 10, font: "monospace" }),
    k.color(212, 160, 23),
    k.pos(200, 8),
  ]);

  const goodLabel = root.add([
    k.text("GOOD BOY 28", { size: 10, font: "monospace" }),
    k.color(106, 158, 109),
    k.pos(300, 8),
  ]);
  root.add([
    k.rect(88, 8),
    k.color(28, 44, 30),
    k.pos(410, 10),
    k.anchor("left"),
  ]);
  const goodBar = root.add([
    k.rect(88, 8),
    k.scale(1, 1),
    k.color(106, 158, 109),
    k.pos(410, 10),
    k.anchor("left"),
  ]);

  const roomLabel = root.add([
    k.text("", { size: 10, font: "monospace" }),
    k.color(244, 234, 212),
    k.pos(12, 28),
  ]);

  const heartFullIcons = Array.from({ length: MAX_HEARTS }, (_, i) =>
    root.add([
      k.sprite("heart"),
      k.pos(520 + i * 22, 26),
      k.anchor("center"),
    ]),
  );
  const heartEmptyIcons = Array.from({ length: MAX_HEARTS }, (_, i) =>
    root.add([
      k.sprite("heartEmpty"),
      k.pos(520 + i * 22, 26),
      k.anchor("center"),
    ]),
  );

  return {
    setRoom(name: string) {
      roomLabel.text = name.toUpperCase();
    },
    refresh() {
      const s = getStats();
      chaosLabel.text = `CHAOS ${s.chaos}`;
      chaosBar.scale = k.vec2(Math.max(0.02, s.chaos / 100), 1);
      treatLabel.text = `TREATS ${s.treats}/25`;
      const level = getGoodBoyLevel(s.goodBoy);
      goodLabel.text = `GOOD BOY ${s.goodBoy}  LV.${level}`;
      goodBar.scale = k.vec2(Math.max(0.02, s.goodBoy / 100), 1);

      const lethal = isVacuumLethal();
      const hp = getHearts();
      for (let i = 0; i < MAX_HEARTS; i++) {
        heartFullIcons[i].hidden = !lethal || i >= hp;
        heartEmptyIcons[i].hidden = !lethal || i < hp;
      }
    },
  };
}

export function createDialogue(k: KAPLAYCtx) {
  let mode: "off" | "menu" | "text" = "off";
  let full = "";
  let shown = 0;
  let busy = false;
  let onDone: (() => void) | null = null;
  let verbs: Verb[] = [];
  let index = 0;
  let menuTitle = "";

  const box = k.add([
    k.rect(616, 118),
    k.outline(3, k.rgb(244, 234, 212)),
    k.color(16, 12, 10),
    k.pos(12, 350),
    k.fixed(),
    k.z(DIALOG_Z),
  ]);
  const speaker = k.add([
    k.text("", { size: 14, font: "monospace" }),
    k.color(212, 160, 23),
    k.pos(28, 362),
    k.fixed(),
    k.z(DIALOG_Z + 1),
  ]);
  const body = k.add([
    k.text("", { size: 14, font: "monospace", width: 580, lineSpacing: 6 }),
    k.color(244, 234, 212),
    k.pos(28, 384),
    k.fixed(),
    k.z(DIALOG_Z + 1),
  ]);
  const hint = k.add([
    k.text("SPACE", { size: 10, font: "monospace" }),
    k.color(140, 120, 96),
    k.pos(600, 450),
    k.anchor("right"),
    k.fixed(),
    k.z(DIALOG_Z + 1),
  ]);

  hide();

  function hide() {
    mode = "off";
    box.hidden = true;
    speaker.hidden = true;
    body.hidden = true;
    hint.hidden = true;
  }

  function show() {
    box.hidden = false;
    speaker.hidden = false;
    body.hidden = false;
    hint.hidden = false;
  }

  function renderMenu() {
    speaker.text = menuTitle;
    body.text = verbs
      .map((verb, i) => `${i === index ? ">" : " "} ${verb.label}`)
      .join("\n");
    hint.text = "UP/DOWN  SPACE";
  }

  k.onUpdate(() => {
    if (mode !== "text") return;
    if (shown < full.length) {
      shown = Math.min(full.length, shown + 60 * k.dt());
      body.text = full.slice(0, Math.floor(shown));
    }
  });

  k.onKeyPress("up", () => {
    if (mode !== "menu" || verbs.length === 0) return;
    index = (index - 1 + verbs.length) % verbs.length;
    renderMenu();
  });
  k.onKeyPress("down", () => {
    if (mode !== "menu" || verbs.length === 0) return;
    index = (index + 1) % verbs.length;
    renderMenu();
  });
  k.onKeyPress("w", () => {
    if (mode !== "menu" || verbs.length === 0) return;
    index = (index - 1 + verbs.length) % verbs.length;
    renderMenu();
  });
  k.onKeyPress("s", () => {
    if (mode !== "menu" || verbs.length === 0) return;
    index = (index + 1) % verbs.length;
    renderMenu();
  });
  k.onKeyPress("escape", () => {
    if (mode !== "menu") return;
    hide();
    busy = false;
  });

  return {
    get isOpen() {
      return mode !== "off";
    },
    get isMenu() {
      return mode === "menu";
    },
    get isBusy() {
      return busy;
    },
    openMenu(title: string, options: Verb[]) {
      verbs = options;
      index = 0;
      menuTitle = title.toUpperCase();
      mode = "menu";
      busy = true;
      renderMenu();
      show();
    },
    confirmMenu(): Verb | null {
      if (mode !== "menu") return null;
      const picked = verbs[index] ?? null;
      hide();
      busy = false;
      return picked;
    },
    async play(
      result: { speaker: string; text: string },
      after?: () => void,
    ) {
      busy = true;
      onDone = after ?? null;
      speaker.text = result.speaker;
      full = result.text;
      shown = 0;
      body.text = "";
      hint.text = "SPACE";
      mode = "text";
      show();
    },
    advance() {
      if (mode !== "text") return false;
      if (shown < full.length) {
        shown = full.length;
        body.text = full;
        return true;
      }
      hide();
      busy = false;
      onDone?.();
      onDone = null;
      return true;
    },
  };
}

export function createPrompt(k: KAPLAYCtx) {
  const label = k.add([
    k.text("", { size: 10, font: "monospace" }),
    k.color(244, 234, 212),
    k.pos(0, 0),
    k.anchor("center"),
    k.z(HUD_Z),
  ]);
  label.hidden = true;

  return {
    showAt(obj: GameObj<PosComp>, name: string) {
      label.hidden = false;
      label.text = `SPACE · ${name.toUpperCase()}`;
      label.pos = obj.pos.add(0, -28);
    },
    hide() {
      label.hidden = true;
    },
  };
}

const MUTE_ON = "SOUND ON";
const MUTE_OFF = "SOUND OFF";

let soundToggleMade = false;

/** Stays across scenes. Click or press M. Default is on. */
export function createSoundToggle(k: KAPLAYCtx) {
  if (soundToggleMade) return;
  soundToggleMade = true;
  const onColor = k.rgb(180, 160, 130);
  const offColor = k.rgb(110, 96, 80);
  const hoverColor = k.rgb(244, 234, 212);

  const label = k.add([
    k.text(MUTE_ON, { size: 10, font: "monospace" }),
    k.pos(k.width() - 12, 10),
    k.anchor("topright"),
    k.color(onColor),
    k.area(),
    k.fixed(),
    k.stay(),
    k.z(400),
  ]);

  function paint(hovering: boolean) {
    label.text = isMuted() ? MUTE_OFF : MUTE_ON;
    label.color = hovering ? hoverColor : isMuted() ? offColor : onColor;
  }

  let hovering = false;
  label.onHover(() => {
    hovering = true;
    paint(true);
  });
  label.onHoverEnd(() => {
    hovering = false;
    paint(false);
  });
  label.onClick(() => toggleMute(k));
  onMuteChange(() => paint(hovering));
}
