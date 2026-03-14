<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('organization');
            $table->foreignId('offer_category_id')->constrained('offer_categories')->cascadeOnDelete();
            $table->foreignId('offer_type_id')->nullable()->constrained('offer_types')->nullOnDelete();
            $table->string('location', 255)->nullable();
            $table->date('deadline');
            $table->text('description')->nullable();
            $table->json('requirements')->nullable();
            $table->string('salary', 100)->nullable();
            $table->string('duration', 100)->nullable();
            $table->string('external_link');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
