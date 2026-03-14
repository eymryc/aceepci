<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Informations de contact affichées sur la page contact (téléphone, email, adresse, horaires, carte, contacts régionaux).
 * Un seul enregistrement (singleton).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_info', function (Blueprint $table) {
            $table->id();
            $table->string('phone', 50)->nullable();
            $table->string('email', 255)->nullable();
            $table->text('address')->nullable();
            $table->text('map_embed_url')->nullable();
            $table->string('hours_mon_fri', 100)->nullable();
            $table->string('hours_saturday', 100)->nullable();
            $table->string('hours_sunday', 100)->nullable();
            $table->json('regional_contacts')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_info');
    }
};
