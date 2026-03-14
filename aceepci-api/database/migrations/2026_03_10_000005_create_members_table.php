<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration : création de la table members.
 *
 * Champs critiques (NOT NULL) : firstname, lastname, sex, phone, member_type_id.
 * Tous les autres champs sont nullable.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();

            // Identité (critique)
            $table->string('firstname');
            $table->string('lastname');
            $table->string('fullname')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('birth_place')->nullable();
            $table->string('sex', 20);
            $table->string('nationality', 100)->nullable();
            $table->string('identity_photo_url', 2048)->nullable();

            // Contact (critique : phone)
            $table->string('phone', 20);
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->foreignId('city_id')->nullable()->constrained('cities')->nullOnDelete();
            $table->foreignId('district_id')->nullable()->constrained('districts')->nullOnDelete();
            $table->foreignId('desired_service_department_id')->nullable()->constrained('service_departments')->nullOnDelete();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone', 20)->nullable();

            // Type / niveau (critique)
            $table->foreignId('member_type_id')->constrained('member_types')->restrictOnDelete();
            $table->string('member_level', 50)->nullable();

            // Académique / professionnel
            $table->string('institution')->nullable();
            $table->string('field_of_study')->nullable();
            $table->string('profession')->nullable();
            $table->string('company')->nullable();

            // Spirituel
            $table->string('local_church')->nullable();
            $table->string('pastor_name')->nullable();
            $table->boolean('is_born_again')->nullable();
            $table->boolean('is_baptized')->nullable();
            $table->text('church_service_experience')->nullable();

            // Divers
            $table->string('heard_about_aceepci', 255)->nullable();
            $table->text('motivation')->nullable();

            // Documents
            $table->string('identity_document_url', 2048)->nullable();
            $table->string('pastor_attestation_url', 2048)->nullable();
            $table->string('student_certificate_url', 2048)->nullable();
            $table->boolean('accept_charter')->default(false);
            $table->boolean('accept_payment')->default(false);

            // Gestion
            $table->foreignId('member_status_id')->nullable()->constrained('member_statuses')->nullOnDelete();
            $table->foreignId('family_id')->nullable()->constrained('families')->nullOnDelete();
            $table->foreignId('group_id')->nullable()->constrained('groups')->nullOnDelete();
            $table->string('source', 20)->default('admin');

            $table->timestamps();
            $table->auditColumns();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
