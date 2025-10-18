extends Node

signal time_changed(clock_text: String)
signal night_started
signal day_started
signal new_day(day_index: int)

@export var minutes_per_second: float = 10.0 # 1s real-time = 10 in-game minutes
@export var start_hour: int = 6
@export var start_minute: int = 0

var _minutes_total: int = 0
var _day_index: int = 1
var _is_night: bool = false
var _overlay: CanvasModulate

func _ready() -> void:
	_minutes_total = start_hour * 60 + start_minute
	_emit_time_changed()
	_update_night_state()
	set_process(true)

func set_overlay(overlay: CanvasModulate) -> void:
	_overlay = overlay
	_update_overlay_color()

func is_night() -> bool:
	return _is_night

func get_clock_text() -> String:
	var h := int(floor(_minutes_total / 60) % 24)
	var m := int(_minutes_total % 60)
	return "%02d:%02d" % [h, m]

func _process(delta: float) -> void:
	var add_minutes := int(round(minutes_per_second * delta))
	if add_minutes == 0:
		return
	var prev_hour := int(floor(_minutes_total / 60) % 24)
	_minutes_total += add_minutes
	if _minutes_total >= 24 * 60:
		_minutes_total -= 24 * 60
		_day_index += 1
		emit_signal("new_day", _day_index)
	_emit_time_changed()
	_update_overlay_color()
	var current_hour := int(floor(_minutes_total / 60) % 24)
	if _is_night != _compute_is_night(current_hour):
		_update_night_state()

func _emit_time_changed() -> void:
	emit_signal("time_changed", get_clock_text())

func _compute_is_night(hour: int) -> bool:
	# Night between 20:00 and 6:00
	return hour >= 20 or hour < 6

func _update_night_state() -> void:
	var hour := int(floor(_minutes_total / 60) % 24)
	var prev := _is_night
	_is_night = _compute_is_night(hour)
	if _is_night and not prev:
		emit_signal("night_started")
	elif not _is_night and prev:
		emit_signal("day_started")

func _update_overlay_color() -> void:
	if _overlay == null:
		return
	var hour := int(floor(_minutes_total / 60) % 24)
	var t: float
	var col: Color
	# Smooth transitions: dawn(5-7), day(7-18), dusk(18-20), night(20-5)
	if hour >= 7 and hour < 18:
		col = Color(1,1,1,1) # Day
	elif hour >= 5 and hour < 7:
		t = float(_minutes_total - 5*60) / float(2*60)
		col = Color(0.2,0.25,0.4,1).lerp(Color(1,1,1,1), t)
	elif hour >= 18 and hour < 20:
		t = float(_minutes_total - 18*60) / float(2*60)
		col = Color(1,1,1,1).lerp(Color(0.2,0.25,0.4,1), t)
	else:
		col = Color(0.12,0.14,0.24,1) # Night
	_overlay.color = col
