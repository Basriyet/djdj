extends Node2D

@onready var world = $World
@onready var player = $Player
@onready var time_system = $TimeSystem
@onready var monster_spawner = $MonsterSpawner
@onready var hud = $HUD
@onready var day_night_overlay := $DayNightOverlay

func _ready() -> void:
	# Wire up systems
	time_system.set_overlay(day_night_overlay)
	hud.set_player(player)
	hud.set_time_system(time_system)
	player.set_world(world)
	player.set_hud(hud)
	monster_spawner.setup(world, player, time_system)
    time_system.new_day.connect(func(_day_index: int): world.on_new_day())

	# Center camera or adjust as needed later
	if player.has_node("Camera2D"):
		player.get_node("Camera2D").make_current()
