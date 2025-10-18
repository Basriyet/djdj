# Fantasia Farm RPG (Godot 4, Mobile)

A 2D top-down farming RPG with light fantasy combat. Everything is code-generated: world tiles, foliage, crops, time-of-day, HUD, virtual joystick, monsters.

## Features
- Procedural world tiles (grass, water) and foliage (trees, rocks)
- Farming loop: hoe, water, plant, harvest; crops grow daily when watered
- Day/Night cycle with smooth color modulation
- Night-time monster spawns and basic melee combat
- Mobile-friendly HUD with on-screen joystick and action buttons

## Directory Layout
- `scenes/Main.tscn`: Root scene wiring systems together
- `scripts/`: All game code
  - `world/World.gd`: Terrain, crops, interactions, drawing
  - `actors/Player.gd`: Movement, tools, interactions, combat
  - `actors/Monster.gd`: Simple chaser enemy
  - `systems/TimeSystem.gd`: Time-of-day and day transitions
  - `systems/MonsterSpawner.gd`: Spawns monsters at night
  - `ui/HUD.gd`: HUD controls and labels
  - `ui/VirtualJoystick.gd`: Touch/mouse joystick

## Run Locally
1. Install Godot 4.2+.
2. Open the project folder in Godot (`/workspace`).
3. Ensure `Project -> Project Settings -> Application -> Run -> Main Scene` is `scenes/Main.tscn` (already set in `project.godot`).
4. Press Play.

## Controls
- Move: On-screen joystick (bottom-left)
- Interact/Use Tool: "Use" button (bottom-right)
- Attack (when Sword equipped): "Attack" button
- Change tool: `<` and `>` buttons
- Desktop fallback: Arrow keys + E (interact) + A (attack)

## Mobile Export
- Install export templates for your Godot version (Editor -> Manage Export Templates).
- Project -> Export -> Add Android/iOS.
- For Android:
  - Install Android SDK/Java and configure in `Editor -> Editor Settings -> Export -> Android`.
  - Set package name, version, icons.
  - Click "Export Project" or "Export All".
- For iOS:
  - Use Xcode on macOS; set team, bundle id, signing.

## Notes / Next Steps
- Replace debug-drawn shapes with sprites/tilesets and animations.
- Add inventory, crafting, quests, seasons, NPCs, dungeons.
- Balance monster spawn and damage; add loot.

## License
MIT
