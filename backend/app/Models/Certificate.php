<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Certificate extends Model
{
    protected $fillable = ['user_id', 'course_id', 'certificate_number', 'issued_at'];

    protected $casts = [
        'issued_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function ($cert) {
            if (empty($cert->certificate_number)) {
                $year = now()->year;
                $cert->certificate_number = 'CERT-' . $year . '-' . strtoupper(Str::random(8));
            }
            if (empty($cert->issued_at)) {
                $cert->issued_at = now();
            }
        });
    }

    public function user()   { return $this->belongsTo(User::class); }
    public function course() { return $this->belongsTo(Course::class); }
}
