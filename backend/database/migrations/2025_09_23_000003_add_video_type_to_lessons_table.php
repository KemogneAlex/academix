<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            // type: 'upload' | 'youtube' | 'vimeo'
            $table->enum('video_type', ['upload', 'youtube', 'vimeo'])->default('upload')->after('video');
            // Pour YouTube/Vimeo : stocker l'URL externe directement
            $table->string('video_url_external')->nullable()->after('video_type');
        });
    }

    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn(['video_type', 'video_url_external']);
        });
    }
};
