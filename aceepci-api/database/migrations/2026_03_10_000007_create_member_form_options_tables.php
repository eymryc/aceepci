<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tables de paramètres pour le formulaire membre :
 * niveaux membre, niveaux académiques, sources de connaissance.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('member_levels', function (Blueprint $table) {
            $table->id();
            $table->string('value', 50)->unique();
            $table->string('label', 255);
            $table->string('code', 20)->nullable();
            $table->foreignId('member_type_id')->constrained('member_types')->cascadeOnDelete();
            $table->foreignId('family_id')->nullable()->constrained('families')->nullOnDelete();
            $table->unsignedInteger('display_order')->default(0);
            $table->timestamps();
            $table->auditColumns();
        });

        Schema::create('academic_levels', function (Blueprint $table) {
            $table->id();
            $table->string('value', 50)->unique();
            $table->string('label', 255);
            $table->string('code', 20)->nullable();
            $table->foreignId('member_type_id')->constrained('member_types')->cascadeOnDelete();
            $table->unsignedInteger('display_order')->default(0);
            $table->timestamps();
            $table->auditColumns();
        });

        Schema::create('heard_about_sources', function (Blueprint $table) {
            $table->id();
            $table->string('value', 50)->unique();
            $table->string('label', 255);
            $table->string('code', 20)->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->timestamps();
            $table->auditColumns();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('heard_about_sources');
        Schema::dropIfExists('academic_levels');
        Schema::dropIfExists('member_levels');
    }
};
