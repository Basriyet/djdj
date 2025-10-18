extends Node

@export var max_monsters: int = 10
@export var spawn_interval_seconds: float = 3.5

var _world: World
var _player: CharacterBody2D
var _time: Node
var _timer: Timer
var _container: Node2D

func _ready() -> void:
	_container = Node2D.new()
	_container.name = "Monsters"
	add_child(_container)

func setup(world: World, player: CharacterBody2D, time_system: Node) -> void:
	_world = world
	_player = player
	_time = time_system
	_time.night_started.connect(_on_night_started)
	_time.day_started.connect(_on_day_started)
	_time.new_day.connect(_on_new_day)

func _on_night_started() -> void:
	if _timer == null:
		_timer = Timer.new()
		_timer.wait_time = spawn_interval_seconds
		_timer.timeout.connect(_try_spawn)
		add_child(_timer)
	_timer.start()

func _on_day_started() -> void:
	if _timer:
		_timer.stop()
	# Despawn remaining monsters at dawn
	for child in _container.get_children():
		child.queue_free()

func _on_new_day(_day_index: int) -> void:
	# Could scale difficulty or loot here
	pass

func _try_spawn() -> void:
	if _container.get_child_count() >= max_monsters:
		return
	if not _world or not _player:
		return
	var pos := _world.get_random_spawn_position_away_from(_player.position, 260.0)
	var monster := preload("res://scripts/actors/Monster.gd").new()
	monster.position = pos
	monster.set_target(_player)
	_container.add_child(monster)
	monster.add_to_group("monsters")
