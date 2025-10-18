# ArcaneAscent - Minecraft Forge 1.20.1 Mod

ArcaneAscent is a magical Minecraft mod that introduces wizard towers, spell scrolls, and a leveling system for aspiring wizards.

## Features

- **Wizard Towers**: Special blocks that spawn wizards when interacted with
- **Magic Scrolls**: Items that can transform players into Level 1 wizards
- **Wizard NPCs**: Friendly entities that trade magic scrolls for emeralds
- **Wizard Level System**: Player capability system to track wizard progression

## How to Play

1. Find or craft a Wizard Tower block
2. Right-click the Wizard Tower to spawn a Wizard NPC
3. Trade with the Wizard (5 emeralds for 1 Magic Scroll)
4. Use the Magic Scroll to become a Level 1 Wizard

## Development Setup

This mod is built for Minecraft 1.20.1 with Forge 47.2.0.

### Prerequisites
- Java 17
- Gradle

### Building the Mod
```bash
./gradlew build
```

### Running in Development
```bash
./gradlew runClient  # For client testing
./gradlew runServer  # For server testing
```

## File Structure

- `src/main/java/com/arcaneascent/mod/` - Main mod source code
  - `ArcaneAscent.java` - Main mod class
  - `init/` - Registration classes for items, blocks, and entities
  - `item/` - Custom items (Magic Scroll)
  - `block/` - Custom blocks (Wizard Tower)
  - `entity/` - Custom entities (Wizard NPC)
  - `capability/` - Player wizard level system
  - `event/` - Event handlers
- `src/main/resources/` - Assets and data files
  - `assets/arcaneascent/` - Textures, models, and language files
  - `META-INF/mods.toml` - Mod metadata

## Current Implementation

This is the basic skeleton of the mod with the core wizard interaction system. The mod currently includes:

- ✅ Magic Scroll item that grants wizard level
- ✅ Wizard Tower block for spawning wizards
- ✅ Wizard NPC entity with trading capability
- ✅ Player wizard level capability system
- ✅ Basic interaction flow: Tower → Wizard → Trade → Scroll → Level 1 Wizard

## Future Enhancements

- Additional spell scrolls and magic items
- More wizard levels with unique abilities
- Spell casting system
- Magic research and progression
- Additional wizard tower variants
- Custom wizard tower structures in world generation

## License

MIT License
