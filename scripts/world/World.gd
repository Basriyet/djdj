extends Node2D

class_name World

enum Ground { GRASS, FARMLAND_DRY, FARMLAND_WET, WATER }

enum ObjectType { NONE, TREE, ROCK, CROP }

@export var world_width: int = 64
@export var world_height: int = 64
@export var tile_size: int = 24

var ground: Array = [] # 2D array [x][y] of Ground
var objects: Dictionary = {} # key Vector2i -> ObjectType
var crops: Dictionary = {} # key Vector2i -> { stage:int, watered:bool }

var _obstacles_node: Node2D
var _noise_terrain := FastNoiseLite.new()
var _noise_foliage := FastNoiseLite.new()

func _ready() -> void:
	_noise_terrain.seed = randi()
	_noise_terrain.noise_type = FastNoiseLite.TYPE_SIMPLEX
	_noise_terrain.frequency = 0.05
	_noise_foliage.seed = randi() + 1337
	_noise_foliage.noise_type = FastNoiseLite.TYPE_SIMPLEX
	_noise_foliage.frequency = 0.09
	_obstacles_node = Node2D.new()
	_obstacles_node.name = "Obstacles"
	add_child(_obstacles_node)
	_generate_world()
	update()

func get_world_bounds_rect() -> Rect2:
	return Rect2(Vector2.ZERO, Vector2(world_width * tile_size, world_height * tile_size))

func clamp_position_to_world(p: Vector2) -> Vector2:
	var r := get_world_bounds_rect()
	return Vector2(clamp(p.x, r.position.x, r.end.x), clamp(p.y, r.position.y, r.end.y))

func _generate_world() -> void:
	ground.resize(world_width)
	for x in world_width:
		ground[x] = []
		ground[x].resize(world_height)
	for x in world_width:
		for y in world_height:
			var n := _noise_terrain.get_noise_2d(x, y)
			if n < -0.25:
				ground[x][y] = Ground.WATER
			else:
				ground[x][y] = Ground.GRASS
	# Place foliage (trees/rocks)
	for x in world_width:
		for y in world_height:
			if ground[x][y] == Ground.GRASS:
				var f := _noise_foliage.get_noise_2d(x, y)
				if f > 0.55 and randi() % 3 == 0:
					_place_object(Vector2i(x, y), ObjectType.TREE)
				elif f < -0.6 and randi() % 5 == 0:
					_place_object(Vector2i(x, y), ObjectType.ROCK)

func _place_object(cell: Vector2i, obj: int) -> void:
	objects[cell] = obj
	if obj in [ObjectType.TREE, ObjectType.ROCK]:
		var body := StaticBody2D.new()
		var shape := CollisionShape2D.new()
		var circle := CircleShape2D.new()
		circle.radius = tile_size * 0.45
		shape.shape = circle
		body.add_child(shape)
		body.position = tile_to_world_center(cell)
		_obstacles_node.add_child(body)

func tile_to_world_center(cell: Vector2i) -> Vector2:
	return Vector2((cell.x + 0.5) * tile_size, (cell.y + 0.5) * tile_size)

func world_to_tile(p: Vector2) -> Vector2i:
	return Vector2i(clampi(int(floor(p.x / tile_size)), 0, world_width - 1), clampi(int(floor(p.y / tile_size)), 0, world_height - 1))

func is_cell_blocked(cell: Vector2i) -> bool:
	if ground[cell.x][cell.y] == Ground.WATER:
		return true
	if objects.get(cell, ObjectType.NONE) in [ObjectType.TREE, ObjectType.ROCK]:
		return true
	return false

func _draw() -> void:
	for x in world_width:
		for y in world_height:
			var rect := Rect2(Vector2(x * tile_size, y * tile_size), Vector2(tile_size, tile_size))
			var g := ground[x][y]
			var col := Color(0.3, 0.8, 0.35) # grass
			if g == Ground.WATER:
				col = Color(0.2, 0.4, 0.9)
			elif g == Ground.FARMLAND_DRY:
				col = Color(0.45, 0.32, 0.2)
			elif g == Ground.FARMLAND_WET:
				col = Color(0.35, 0.25, 0.17)
			draw_rect(rect, col)
			# Grid line subtle
			draw_rect(rect, Color(0,0,0,0.04), false)
			var cell := Vector2i(x, y)
			if objects.get(cell, ObjectType.NONE) == ObjectType.TREE:
				_draw_tree(rect)
			elif objects.get(cell, ObjectType.NONE) == ObjectType.ROCK:
				_draw_rock(rect)
			elif objects.get(cell, ObjectType.NONE) == ObjectType.CROP:
				_draw_crop(rect, crops[cell])

func _draw_tree(rect: Rect2) -> void:
	var c := rect.get_center()
	draw_circle(c, rect.size.x * 0.45, Color(0.1, 0.5, 0.1))
	draw_circle(c + Vector2(0, rect.size.x * 0.2), rect.size.x * 0.2, Color(0.35, 0.2, 0.1))

func _draw_rock(rect: Rect2) -> void:
	var c := rect.get_center()
	draw_circle(c, rect.size.x * 0.35, Color(0.6, 0.6, 0.65))

func _draw_crop(rect: Rect2, crop: Dictionary) -> void:
	var c := rect.get_center()
	var stage := int(crop.get("stage", 0))
	var watered := bool(crop.get("watered", false))
	var base_col := Color(0.55, 0.9, 0.3)
	var col := base_col.darkened(0.2 * float(max(0, 3 - stage)))
	draw_circle(c, rect.size.x * (0.15 + 0.08 * stage), col)
	if watered:
		draw_rect(Rect2(rect.position + Vector2(6, rect.size.y - 8), Vector2(rect.size.x - 12, 4)), Color(0.2, 0.4, 0.9, 0.8))

func till_at_world(p: Vector2) -> bool:
	var cell := world_to_tile(p)
	if is_cell_blocked(cell):
		return false
	if ground[cell.x][cell.y] == Ground.GRASS:
		ground[cell.x][cell.y] = Ground.FARMLAND_DRY
		update()
		return true
	return false

func water_at_world(p: Vector2) -> bool:
	var cell := world_to_tile(p)
	if ground[cell.x][cell.y] == Ground.FARMLAND_DRY:
		ground[cell.x][cell.y] = Ground.FARMLAND_WET
		if crops.has(cell):
			var crop := crops[cell]
			crop["watered"] = true
			crops[cell] = crop
		update()
		return true
	elif ground[cell.x][cell.y] == Ground.FARMLAND_WET:
		if crops.has(cell):
			var crop2 := crops[cell]
			crop2["watered"] = true
			crops[cell] = crop2
			update()
			return true
	return false

func plant_at_world(p: Vector2) -> bool:
	var cell := world_to_tile(p)
	if ground[cell.x][cell.y] in [Ground.FARMLAND_DRY, Ground.FARMLAND_WET] and not crops.has(cell):
		crops[cell] = {"stage": 0, "watered": ground[cell.x][cell.y] == Ground.FARMLAND_WET}
		objects[cell] = ObjectType.CROP
		update()
		return true
	return false

func harvest_at_world(p: Vector2) -> bool:
	var cell := world_to_tile(p)
	if crops.has(cell):
		var crop := crops[cell]
		if int(crop.get("stage", 0)) >= 3:
			crops.erase(cell)
			objects.erase(cell)
			ground[cell.x][cell.y] = Ground.FARMLAND_DRY
			update()
			return true
	return false

func on_new_day() -> void:
	# Progress crops and dry farmland
	for x in world_width:
		for y in world_height:
			var cell := Vector2i(x, y)
			if crops.has(cell):
				var crop := crops[cell]
				if bool(crop.get("watered", false)):
					crop["stage"] = min(3, int(crop.get("stage", 0)) + 1)
				crop["watered"] = false
				crops[cell] = crop
			if ground[x][y] == Ground.FARMLAND_WET:
				ground[x][y] = Ground.FARMLAND_DRY
	update()

func get_random_spawn_position_away_from(origin: Vector2, min_distance: float = 300.0, max_tries: int = 100) -> Vector2:
	var tries := 0
	while tries < max_tries:
		var cell := Vector2i(randi() % world_width, randi() % world_height)
		if not is_cell_blocked(cell) and objects.get(cell, ObjectType.NONE) != ObjectType.CROP and ground[cell.x][cell.y] != Ground.WATER:
			var pos := tile_to_world_center(cell)
			if pos.distance_to(origin) >= min_distance:
				return pos
		tries += 1
	return tile_to_world_center(Vector2i(world_width - 2, world_height - 2))
