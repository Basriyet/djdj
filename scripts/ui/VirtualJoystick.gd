extends Control

signal vector_changed(new_vector: Vector2)

@export var base_radius: float = 90.0
@export var knob_radius: float = 32.0
@export_range(0.0, 1.0, 0.01) var deadzone: float = 0.15

var _is_dragging: bool = false
var _touch_index: int = -1
var _origin: Vector2
var _current_vector: Vector2 = Vector2.ZERO

func _ready() -> void:
    mouse_filter = Control.MOUSE_FILTER_PASS
    _origin = size * 0.5
    set_process(true)
    if has_signal("resized"):
        resized.connect(func(): _origin = size * 0.5)

func _gui_input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		var e := event as InputEventScreenTouch
		if e.pressed and not _is_dragging:
			_is_dragging = true
			_touch_index = e.index
			_origin = to_local(e.position)
			_update_vector(_origin)
			update()
		elif not e.pressed and _is_dragging and e.index == _touch_index:
			_is_dragging = false
			_touch_index = -1
			_set_vector(Vector2.ZERO)
			update()
	elif event is InputEventScreenDrag:
		var d := event as InputEventScreenDrag
		if _is_dragging and d.index == _touch_index:
			_update_vector(to_local(d.position))
			update()
	elif event is InputEventMouseButton:
		var mb := event as InputEventMouseButton
		if mb.button_index == MOUSE_BUTTON_LEFT:
			if mb.pressed:
				_is_dragging = true
				_origin = get_local_mouse_position()
				_update_vector(_origin)
				update()
			else:
				_is_dragging = false
				_set_vector(Vector2.ZERO)
				update()
	elif event is InputEventMouseMotion and _is_dragging:
		_update_vector(get_local_mouse_position())
		update()

func _set_vector(v: Vector2) -> void:
	var processed := v
	if processed.length() < deadzone:
		processed = Vector2.ZERO
	_current_vector = processed
	emit_signal("vector_changed", _current_vector)

func _update_vector(pointer_pos: Vector2) -> void:
	var delta := pointer_pos - _origin
	var vec := delta / base_radius
	if vec.length() > 1.0:
		vec = vec.normalized()
	_set_vector(vec)

func get_vector() -> Vector2:
	return _current_vector

func _draw() -> void:
	var origin := _origin
	# Base circle
	draw_circle(origin, base_radius, Color(0.1, 0.1, 0.1, 0.35))
	draw_circle(origin, base_radius * 0.5, Color(0.2, 0.2, 0.2, 0.35))
	# Knob
	var knob_pos := origin + (_current_vector * base_radius)
	draw_circle(knob_pos, knob_radius, Color(0.8, 0.8, 0.9, 0.8))

func _process(_delta: float) -> void:
	# Keep redrawing while dragging for smooth visuals
	if _is_dragging:
		update()
