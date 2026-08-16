import kaplay, { type GameObj, type PosComp } from "kaplay";
import { narrate } from "./narrator";
import { verbsFor } from "./actions";
import {
  TILE,
  HUD_H,
  doorTarget,
  rooms,
  tileToWorld,
  type RoomId,
  type SpawnId,
} from "./rooms";
import { getStats, isVacuumLethal, resetStats, takeHeart } from "./stats";
import { detectEnding, endings, type EndingId } from "./endings";
import { spriteUrls } from "./sprites";
import { createDialogue, createHud, createPrompt } from "./ui";

const SPEED = 110;
const INTERACT_RANGE = 42;

const k = kaplay({
  width: 640,
  height: 480,
  letterbox: true,
  background: [18, 14, 12],
  global: false,
  texFilter: "nearest",
  buttons: {
    interact: { keyboard: ["space", "e", "z", "enter"] },
  },
});

k.setGravity(0);

k.loadSprite("wall", spriteUrls.wall);
k.loadSprite("floorA", spriteUrls.floorA);
k.loadSprite("floorB", spriteUrls.floorB);
k.loadSprite("rug", spriteUrls.rug);
k.loadSprite("couch", spriteUrls.couch);
k.loadSprite("shoes", spriteUrls.shoes);
k.loadSprite("tv", spriteUrls.tv);
k.loadSprite("fridge", spriteUrls.fridge);
k.loadSprite("trash", spriteUrls.trash);
k.loadSprite("bowl", spriteUrls.bowl);
k.loadSprite("bed", spriteUrls.bed);
k.loadSprite("sock", spriteUrls.sock);
k.loadSprite("vacuum", spriteUrls.vacuum);
k.loadSprite("treat", spriteUrls.treat);
k.loadSprite("heart", spriteUrls.heart);
k.loadSprite("heartEmpty", spriteUrls.heartEmpty);
k.loadSprite("dog", spriteUrls.dog, {
  sliceX: 2,
  sliceY: 4,
  anims: {
    "walk-down": { from: 0, to: 1, speed: 8, loop: true },
    "walk-left": { from: 2, to: 3, speed: 8, loop: true },
    "walk-right": { from: 4, to: 5, speed: 8, loop: true },
    "walk-up": { from: 6, to: 7, speed: 8, loop: true },
  },
});

type Facing = "down" | "left" | "right" | "up";
type InteractObj = GameObj<PosComp & { objectId: string; objectName: string }>;
const idleFrame: Record<Facing, number> = {
  down: 0,
  left: 2,
  right: 4,
  up: 6,
};

k.scene("title", () => {
  k.add([k.rect(k.width(), k.height()), k.color(12, 10, 8)]);
  k.add([
    k.text("THE VACUUM APPROACHES", {
      size: 28,
      font: "monospace",
    }),
    k.color(244, 234, 212),
    k.anchor("center"),
    k.pos(k.center().x, 130),
  ]);
  k.add([
    k.text("you live here. it does not.", {
      size: 14,
      font: "monospace",
    }),
    k.color(196, 92, 74),
    k.anchor("center"),
    k.pos(k.center().x, 168),
  ]);
  k.add([
    k.sprite("dog"),
    k.anchor("center"),
    k.pos(k.center().x - 80, 258),
    k.scale(2),
  ]);
  k.add([
    k.sprite("vacuum"),
    k.anchor("center"),
    k.pos(k.center().x + 80, 268),
    k.scale(3),
  ]);
  k.add([
    k.text(
      "ARROWS / WASD  walk\nSPACE  interact  ·  UP/DOWN  pick a verb\nCHAOS 50+  the vacuum hunts  ·  five hearts\n\nENTER to go inside",
      {
        size: 14,
        font: "monospace",
        align: "center",
        lineSpacing: 6,
      },
    ),
    k.color(180, 160, 130),
    k.anchor("center"),
    k.pos(k.center().x, 390),
  ]);

  k.onButtonPress("interact", () => startGame());
  k.onKeyPress("enter", () => startGame());
});

k.scene("ending", (id: EndingId) => {
  const ending = endings[id];
  k.add([k.rect(k.width(), k.height()), k.color(12, 10, 8)]);
  k.add([k.rect(k.width(), 4), k.color(...ending.accent), k.pos(0, 0)]);
  k.add([
    k.rect(k.width(), 4),
    k.color(...ending.accent),
    k.pos(0, k.height() - 4),
  ]);
  k.add([
    k.text(ending.title, { size: 28, font: "monospace", align: "center" }),
    k.color(...ending.accent),
    k.anchor("center"),
    k.pos(k.center().x, 110),
  ]);
  k.add([
    k.text(ending.subtitle, { size: 14, font: "monospace", align: "center" }),
    k.color(180, 160, 130),
    k.anchor("center"),
    k.pos(k.center().x, 150),
  ]);
  k.add([
    k.text(ending.body, {
      size: 16,
      font: "monospace",
      width: 480,
      lineSpacing: 8,
      align: "center",
    }),
    k.color(244, 234, 212),
    k.anchor("center"),
    k.pos(k.center().x, 280),
  ]);
  k.add([
    k.text("SPACE / ENTER  ·  credits", {
      size: 12,
      font: "monospace",
    }),
    k.color(110, 96, 80),
    k.anchor("center"),
    k.pos(k.center().x, 430),
  ]);

  const goCredits = () => k.go("credits");
  k.onButtonPress("interact", goCredits);
  k.onKeyPress("enter", goCredits);
});

k.scene("credits", () => {
  k.add([k.rect(k.width(), k.height()), k.color(12, 10, 8)]);
  k.add([k.rect(k.width(), 4), k.color(212, 160, 23), k.pos(0, 0)]);
  k.add([
    k.rect(k.width(), 4),
    k.color(212, 160, 23),
    k.pos(0, k.height() - 4),
  ]);
  k.add([
    k.text("THE VACUUM APPROACHES", {
      size: 22,
      font: "monospace",
      align: "center",
    }),
    k.color(244, 234, 212),
    k.anchor("center"),
    k.pos(k.center().x, 140),
  ]);
  k.add([
    k.text(
      "Built by Shwetha Adiraj\nfor the Weekend Challenge:\nDog Days Edition",
      {
        size: 16,
        font: "monospace",
        align: "center",
        lineSpacing: 10,
      },
    ),
    k.color(212, 160, 23),
    k.anchor("center"),
    k.pos(k.center().x, 250),
  ]);
  k.add([
    k.text("you live here. it does not.", {
      size: 14,
      font: "monospace",
    }),
    k.color(180, 160, 130),
    k.anchor("center"),
    k.pos(k.center().x, 340),
  ]);
  k.add([
    k.text("SPACE / ENTER  ·  title", {
      size: 12,
      font: "monospace",
    }),
    k.color(110, 96, 80),
    k.anchor("center"),
    k.pos(k.center().x, 430),
  ]);

  const goTitle = () => k.go("title");
  k.onButtonPress("interact", goTitle);
  k.onKeyPress("enter", goTitle);
});

function startGame() {
  resetStats();
  k.go("house", { room: "living" as RoomId, spawn: "default" as SpawnId });
}

k.scene("house", (opts: { room: RoomId; spawn: SpawnId }) => {
  const room = rooms[opts.room];
  const hud = createHud(k);
  const dialog = createDialogue(k);
  const prompt = createPrompt(k);
  hud.setRoom(room.title);
  hud.refresh();

  let facing: Facing = "down";
  let changingRoom = false;

  k.addLevel(room.map, {
    tileWidth: TILE,
    tileHeight: TILE,
    pos: k.vec2(0, HUD_H),
    tiles: {
      "#": () => [
        k.sprite("wall"),
        k.area(),
        k.body({ isStatic: true }),
        k.anchor("topleft"),
      ],
      ".": (pos) => [
        k.sprite(
          (Math.floor(pos.x / TILE) + Math.floor(pos.y / TILE)) % 2 === 0
            ? "floorA"
            : "floorB",
        ),
        k.anchor("topleft"),
      ],
      n: () => doorTile("n"),
      e: () => doorTile("e"),
      s: () => doorTile("s"),
      w: () => doorTile("w"),
    },
  });

  function doorTile(dir: "n" | "e" | "s" | "w") {
    return [k.sprite("floorA"), k.area(), k.anchor("topleft"), "door", { dir }];
  }

  for (const item of room.furniture) {
    const { x, y } = tileToWorld(item.tx, item.ty);
    k.add([
      k.sprite(item.sprite),
      k.pos(x, y),
      k.anchor("center"),
      k.area(),
      k.body({ isStatic: true }),
      k.z(y),
      "interact",
      { objectId: item.id, objectName: item.name },
    ]);
  }

  let vacuum: GameObj | null = null;
  if (room.vacuum) {
    const { x, y } = tileToWorld(room.vacuum.tx, room.vacuum.ty);
    let dir = 1;
    vacuum = k.add([
      k.sprite("vacuum"),
      k.pos(x, y),
      k.anchor("center"),
      k.area(),
      k.z(y),
      "interact",
      "beast",
      { objectId: "vacuum", objectName: "The Beast" },
    ]);
    const minX = room.vacuum.minX;
    const maxX = room.vacuum.maxX;
    vacuum.onUpdate(() => {
      if (dialog.isOpen) return;
      const speed = isVacuumLethal() ? 95 : 40;
      vacuum!.pos.x += dir * speed * k.dt();
      if (vacuum!.pos.x < minX || vacuum!.pos.x > maxX) dir *= -1;
      vacuum!.z = vacuum!.pos.y;
    });
  }

  const spawn = room.spawns[opts.spawn] ?? room.spawns.default;
  const start = tileToWorld(spawn.tx, spawn.ty);
  const player = k.add([
    k.sprite("dog", { anim: "walk-down" }),
    k.pos(start.x, start.y),
    k.anchor("center"),
    k.area({ scale: 0.42 }),
    k.body(),
    k.opacity(1),
    k.z(start.y),
    "player",
  ]);
  player.stop();
  player.frame = idleFrame.down;

  let invulnUntil = 0;

  player.onCollide("beast", () => {
    if (dialog.isOpen || changingRoom) return;
    if (!isVacuumLethal()) return;
    if (k.time() < invulnUntil) return;
    invulnUntil = k.time() + 1.2;
    const result = takeHeart();
    hud.refresh();
    if (vacuum) {
      const away = player.pos.sub(vacuum.pos).unit().scale(80);
      player.pos = player.pos.add(away);
    }
    if (result === "dead") k.go("ending", "vacuumDeath");
  });

  player.onCollide("door", (door) => {
    if (changingRoom || dialog.isOpen) return;
    const dir = (door as GameObj<{ dir: "n" | "e" | "s" | "w" }>).dir;
    const next = doorTarget(room.id, dir);
    if (!next) return;
    changingRoom = true;
    k.go("house", next);
  });

  k.onUpdate(() => {
    hud.refresh();
    player.z = player.pos.y;
    if (k.time() < invulnUntil) {
      player.opacity = Math.floor(k.time() * 12) % 2 === 0 ? 0.35 : 1;
    } else {
      player.opacity = 1;
    }
    if (dialog.isOpen) {
      prompt.hide();
      return;
    }

    const dir = k.vec2(0, 0);
    if (k.isKeyDown("left") || k.isKeyDown("a")) dir.x -= 1;
    if (k.isKeyDown("right") || k.isKeyDown("d")) dir.x += 1;
    if (k.isKeyDown("up") || k.isKeyDown("w")) dir.y -= 1;
    if (k.isKeyDown("down") || k.isKeyDown("s")) dir.y += 1;

    if (dir.x !== 0 || dir.y !== 0) {
      const moved = dir.unit().scale(SPEED);
      player.move(moved.x, moved.y);
      facing =
        Math.abs(dir.x) > Math.abs(dir.y)
          ? dir.x < 0
            ? "left"
            : "right"
          : dir.y < 0
            ? "up"
            : "down";
      const anim = `walk-${facing}`;
      if (player.getCurAnim()?.name !== anim) player.play(anim);
    } else {
      player.stop();
      player.frame = idleFrame[facing];
    }

    const near = closestInteractable(player);
    if (near) prompt.showAt(near, near.objectName);
    else prompt.hide();
  });

  k.onButtonPress("interact", () => {
    if (dialog.isMenu) {
      const verb = dialog.confirmMenu();
      const near = closestInteractable(player);
      if (!verb || !near) return;
      const before = getStats();
      const result = narrate(
        {
          objectId: near.objectId,
          objectName: near.objectName,
          actionId: verb.id,
          actionLabel: verb.label,
        },
        verb,
      );
      hud.refresh();
      const endingId = detectEnding(before, getStats());
      dialog.play(result, () => {
        if (endingId) k.go("ending", endingId);
      });
      return;
    }
    if (dialog.advance()) {
      hud.refresh();
      return;
    }
    const near = closestInteractable(player);
    if (!near || dialog.isBusy) return;
    dialog.openMenu(near.objectName, verbsFor(near.objectId));
  });

  function closestInteractable(who: GameObj<PosComp>) {
    let best: InteractObj | null = null;
    let bestDist = INTERACT_RANGE;
    for (const obj of k.get("interact") as InteractObj[]) {
      const d = who.pos.dist(obj.pos);
      if (d < bestDist) {
        bestDist = d;
        best = obj;
      }
    }
    return best;
  }
});

k.onLoad(() => k.go("title"));
