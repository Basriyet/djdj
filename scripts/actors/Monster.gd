extends CharacterBody2D

@export var speed: float = 90.0
@export var hp: int = 50

var _target: CharacterBody2D

func set_target(t: CharacterBody2D) -> void:
	_target = t
	set_physics_process(true)

func _physics_process(_delta: float) -> void:
	if _target == null:
		velocity = Vector2.ZERO
		return
	var dir := (_target.position - position).normalized()
	velocity = dir * speed
	move_and_slide()

func apply_damage(dmg: int) -> void:
	hp -= dmg
	if hp <= 0:
		queue_free()
