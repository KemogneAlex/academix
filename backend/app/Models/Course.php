<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Course extends Model
{
    protected $appends = ['course_small_image'];

    // Auto-génère le slug depuis le titre
    protected static function booted(): void
    {
        static::creating(function ($course) {
            if (empty($course->slug)) {
                $course->slug = static::generateUniqueSlug($course->title);
            }
        });

        static::updating(function ($course) {
            if ($course->isDirty('title') && empty($course->slug)) {
                $course->slug = static::generateUniqueSlug($course->title);
            }
        });

        // Recalcule duration_total après sauvegarde
        static::saved(function ($course) {
            static::recalculateDuration($course->id);
        });
    }

    public static function generateUniqueSlug(string $title): string
    {
        $slug = Str::slug($title);
        $original = $slug;
        $count = 1;
        while (static::where('slug', $slug)->exists()) {
            $slug = "{$original}-{$count}";
            $count++;
        }
        return $slug;
    }

    public static function recalculateDuration(int $courseId): void
    {
        $total = Lesson::whereHas('chapter', fn($q) => $q->where('course_id', $courseId))
            ->where('status', 1)
            ->sum('duration');

        static::withoutEvents(function () use ($courseId, $total) {
            static::where('id', $courseId)->update(['duration_total' => $total ?? 0]);
        });
    }

    public function getCourseSmallImageAttribute(): string
    {
        if (!$this->image) return '';
        return asset('uploads/course/small/' . $this->image);
    }

    // Vérifie si le prix promo est encore valide
    public function getActivePriceAttribute(): float
    {
        if ($this->cross_price && $this->discount_end_date && now()->lt($this->discount_end_date)) {
            return (float) $this->price;
        }
        return (float) ($this->cross_price ?? $this->price ?? 0);
    }

    public function chapters()     { return $this->hasMany(Chapter::class)->orderBy('sort_order', 'asc'); }
    public function outcomes()     { return $this->hasMany(Outcome::class)->orderBy('sort_order', 'asc'); }
    public function requirements() { return $this->hasMany(Requirement::class)->orderBy('sort_order', 'asc'); }
    public function level()        { return $this->belongsTo(Level::class); }
    public function category()     { return $this->belongsTo(Category::class); }
    public function language()     { return $this->belongsTo(Language::class); }
    public function reviews()      { return $this->hasMany(Review::class); }
    public function enrollments()  { return $this->hasMany(Enrollment::class); }
    public function orders()       { return $this->hasMany(Order::class); }
    public function certificates() { return $this->hasMany(Certificate::class); }
    public function instructor()   { return $this->belongsTo(User::class, 'user_id'); }
}
