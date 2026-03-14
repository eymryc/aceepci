<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Ajout du workflow publication (brouillon / publié) pour la galerie média.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gallery_media', function (Blueprint $table) {
            $table->boolean('is_published')->default(false)->after('display_order');
            $table->timestamp('published_at')->nullable()->after('is_published');
        });
        // Photos existantes : considérées comme publiées
        \Illuminate\Support\Facades\DB::table('gallery_media')->update([
            'is_published' => true,
            'published_at' => \Illuminate\Support\Facades\DB::raw('COALESCE(published_at, created_at)'),
        ]);
    }

    public function down(): void
    {
        Schema::table('gallery_media', function (Blueprint $table) {
            $table->dropColumn(['is_published', 'published_at']);
        });
    }
};
