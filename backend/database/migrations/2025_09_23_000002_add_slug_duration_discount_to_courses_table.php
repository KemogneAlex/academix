<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('title');
            $table->integer('duration_total')->default(0)->after('cross_price'); // en minutes
            $table->timestamp('discount_end_date')->nullable()->after('duration_total');
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['slug', 'duration_total', 'discount_end_date']);
        });
    }
};
