<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lesson extends Model
{
    protected $appends = ['video_url'];

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    /**
     * Retourne l'URL de la vidéo selon le type :
     * - upload   → URL locale du fichier uploadé
     * - youtube  → URL externe stockée dans video_url_external
     * - vimeo    → URL externe stockée dans video_url_external
     */
    public function getVideoUrlAttribute(): string
    {
        if ($this->video_type === 'youtube' || $this->video_type === 'vimeo') {
            return $this->video_url_external ?? '';
        }

        // type 'upload' (défaut)
        if (!$this->video) return '';
        return asset('uploads/course/videos/' . $this->video);
    }
}
