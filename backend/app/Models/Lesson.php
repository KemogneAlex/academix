<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lesson extends Model
{
    protected $appends = ['video_url'];

    /**
     * Get the chapter that owns the lesson.
     */
    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function getVideoUrlAttribute()
    {
        if ($this->video == '') {
            return '';
        }
        return asset('uploads/course/videos/' . $this->video);
    }
}
