<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'avatar', 'bio', 'phone',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $appends = ['avatar_url'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getAvatarUrlAttribute(): string
    {
        if (!$this->avatar) return '';
        return asset('uploads/avatars/' . $this->avatar);
    }

    public function isAdmin(): bool     { return $this->role === 'admin'; }
    public function isInstructor(): bool { return $this->role === 'instructor'; }
    public function isStudent(): bool   { return $this->role === 'student'; }

    public function courses()       { return $this->hasMany(Course::class); }
    public function enrollments()   { return $this->hasMany(Enrollment::class); }
    public function orders()        { return $this->hasMany(Order::class); }
    public function certificates()  { return $this->hasMany(Certificate::class); }
}
