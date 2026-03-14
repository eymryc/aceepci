<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->string('event_name')->nullable();

            // Identité
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone', 20);
            $table->date('birth_date');
            $table->string('gender', 50);

            // Statut membre ACEEPCI
            $table->string('member_status')->nullable();
            $table->string('membership_number', 50)->nullable();
            $table->string('department')->nullable();
            $table->string('local_church')->nullable();

            // Options logistiques
            $table->string('needs_accommodation', 10)->default('Non');
            $table->string('accommodation_type')->nullable();
            $table->string('needs_transport', 10)->default('Non');
            $table->string('transport_departure')->nullable();
            $table->string('meal_preference')->default('Standard');
            $table->text('dietary_restrictions')->nullable();

            // Contact d'urgence
            $table->string('emergency_contact');
            $table->string('emergency_phone', 20);
            $table->string('emergency_relation', 100);

            // Informations médicales
            $table->text('medical_conditions')->nullable();
            $table->text('allergies')->nullable();
            $table->text('medication')->nullable();
            $table->text('special_needs')->nullable();

            // Participation
            $table->json('workshop_choice')->nullable();
            $table->text('motivation')->nullable();

            // Engagement
            $table->boolean('accept_terms')->default(false);
            $table->boolean('accept_rules')->default(false);
            $table->boolean('payment_confirm')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_registrations');
    }
};
