<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration : pivot entre members et service_domains.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('member_service_domain', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->cascadeOnDelete();
            $table->foreignId('service_domain_id')->constrained('service_domains')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['member_id', 'service_domain_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('member_service_domain');
    }
};
