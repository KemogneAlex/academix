<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Course;

class GenerateMissingSlugs extends Command
{
    protected $signature   = 'courses:generate-slugs';
    protected $description = 'Génère les slugs manquants pour tous les cours existants';

    public function handle(): void
    {
        $courses = Course::whereNull('slug')->orWhere('slug', '')->get();

        if ($courses->isEmpty()) {
            $this->info('Tous les cours ont déjà un slug.');
            return;
        }

        foreach ($courses as $course) {
            $slug = Course::generateUniqueSlug($course->title);
            Course::withoutEvents(function () use ($course, $slug) {
                Course::where('id', $course->id)->update(['slug' => $slug]);
            });
            $this->line("✓ [{$course->id}] {$course->title} → {$slug}");
        }

        $this->info("✅ {$courses->count()} slug(s) générés.");
    }
}
