extends CharacterBody2D

signal stats_changed(hp: int, energy: int)
signal tool_changed(tool_name: String)

@export var move_speed: float = 160.0

var hp: int = 100
var energy: int = 100

enum Tool { HOE, WATERING_CAN, SEEDS, SWORD }
var _tool: int = Tool.HOE
var _tool_names := ["Hoe", "Watering Can", "Seeds", "Sword"]

var _world: World
var _hud: CanvasLayer
var _facing: Vector2 = Vector2.RIGHT

func _ready() -> void:
	if not has_node("Camera2D"):
		var cam := Camera2D.new()
		cam.zoom = Vector2(0.7, 0.7)
		add_child(cam)
		cam.make_current()
    if not has_node("CollisionShape2D"):
        var cs := CollisionShape2D.new()
        var circ := CircleShape2D.new()
        circ.radius = 10.0
        cs.shape = circ
        add_child(cs)
	emit_signal("stats_changed", hp, energy)
	emit_signal("tool_changed", _tool_names[_tool])
	set_physics_process(true)

func set_world(world: World) -> void:
	_world = world

func set_hud(hud: CanvasLayer) -> void:
	_hud = hud
	_hud.attack_pressed.connect(_on_attack_pressed)
	_hud.interact_pressed.connect(_on_interact_pressed)
	_hud.tool_prev.connect(prev_tool)
	_hud.tool_next.connect(next_tool)

func next_tool() -> void:
	_tool = int((_tool + 1) % _tool_names.size())
	emit_signal("tool_changed", _tool_names[_tool])

func prev_tool() -> void:
	_tool = int((_tool - 1 + _tool_names.size()) % _tool_names.size())
	emit_signal("tool_changed", _tool_names[_tool])

func _get_input_vector() -> Vector2:
	var v := Vector2.ZERO
	if _hud and _hud.has_method("get_move_vector"):
		v = _hud.get_move_vector()
	if v == Vector2.ZERO:
		v.x = Input.get_action_strength("ui_right") - Input.get_action_strength("ui_left")
		v.y = Input.get_action_strength("ui_down") - Input.get_action_strength("ui_up")
	return v.normalized()

func _physics_process(_delta: float) -> void:
	var input_vec := _get_input_vector()
	if input_vec.length() > 0.0:
		_facing = input_vec
	var speed := move_speed * (0.5 if energy <= 0 else 1.0)
	velocity = input_vec * speed
	move_and_slide()
	if _world:
		position = _world.clamp_position_to_world(position)

func _on_attack_pressed() -> void:
	if _tool == Tool.SWORD:
		_do_attack()

func _on_interact_pressed() -> void:
	if _world == null:
		return
	var target := position + _facing.normalized() * 24.0
	match _tool:
		Tool.HOE:
			if _world.till_at_world(target):
				_consume_energy(2)
		Tool.WATERING_CAN:
			if _world.water_at_world(target):
				_consume_energy(1)
		Tool.SEEDS:
			if _world.plant_at_world(target):
				_consume_energy(1)
		Tool.SWORD:
			_do_attack()

func _do_attack() -> void:
	var reach: float = 42.0
	var center := position + _facing.normalized() * 28.0
	var hits := []
	for node in get_tree().get_nodes_in_group("monsters"):
		if not node is CharacterBody2D:
			continue
		var d := (node.position - center)
		if d.length() <= reach and d.normalized().dot(_facing.normalized()) > -0.3:
			hits.append(node)
	for h in hits:
		if h.has_method("apply_damage"):
			h.apply_damage(25)
	_consume_energy(1)

func _consume_energy(amount: int) -> void:
	energy = max(0, energy - amount)
	emit_signal("stats_changed", hp, energy)

func heal(amount: int) -> void:
	hp = clamp(hp + amount, 0, 100)
	emit_signal("stats_changed", hp, energy)
