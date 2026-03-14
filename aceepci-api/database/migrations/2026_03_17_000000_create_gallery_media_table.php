<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration : création de la table gallery_media (galerie photos page d'accueil / actualités).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_media', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category', 100)->nullable();
            $table->string('image_path', 2048)->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->timestamps();
            $table->auditColumns();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_media');
    }
};
