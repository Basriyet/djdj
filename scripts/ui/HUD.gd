extends CanvasLayer

signal attack_pressed
signal interact_pressed
signal tool_prev
signal tool_next

@onready var _attack_button: Button = %AttackButton
@onready var _interact_button: Button = %InteractButton
@onready var _tool_prev_button: Button = %ToolPrev
@onready var _tool_next_button: Button = %ToolNext
@onready var _tool_label: Label = %ToolLabel
@onready var _clock_label: Label = %Clock
@onready var _stats_label: Label = %Stats
@onready var _joystick: Node = %Joystick

var _player: Node = null
var _time_system: Node = null
var _joystick_vector: Vector2 = Vector2.ZERO
var _current_tool_name: String = "Hoe"

func _ready() -> void:
	_attack_button.pressed.connect(func(): emit_signal("attack_pressed"))
	_interact_button.pressed.connect(func(): emit_signal("interact_pressed"))
	_tool_prev_button.pressed.connect(func(): emit_signal("tool_prev"))
	_tool_next_button.pressed.connect(func(): emit_signal("tool_next"))
    if _joystick and _joystick.has_signal("vector_changed"):
        _joystick.vector_changed.connect(set_move_vector)

func set_player(player: Node) -> void:
	_player = player
	_player.stats_changed.connect(_on_player_stats_changed)
	_player.tool_changed.connect(_on_player_tool_changed)

func set_time_system(time_system: Node) -> void:
	_time_system = time_system
	_time_system.time_changed.connect(_on_time_changed)

func _on_player_stats_changed(hp: int, energy: int) -> void:
	_stats_label.text = "HP %d | EN %d" % [hp, energy]

func _on_player_tool_changed(tool_name: String) -> void:
	_current_tool_name = tool_name
	_tool_label.text = "Tool: %s" % tool_name

func _on_time_changed(clock_text: String) -> void:
	_clock_label.text = clock_text

func get_move_vector() -> Vector2:
	# Placeholder until VirtualJoystick is wired; returns Vector2.ZERO by default
	return _joystick_vector

func set_move_vector(vec: Vector2) -> void:
	_joystick_vector = vec
