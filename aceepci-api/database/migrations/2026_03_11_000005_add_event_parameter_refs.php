<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->foreignId('event_category_id')->nullable()->after('category')->constrained('event_categories')->nullOnDelete();
        });

        Schema::table('event_registrations', function (Blueprint $table) {
            $table->foreignId('member_type_id')->nullable()->after('member_status')->constrained('member_types')->nullOnDelete();
            $table->foreignId('service_department_id')->nullable()->after('department')->constrained('service_departments')->nullOnDelete();
            $table->foreignId('accommodation_type_id')->nullable()->after('accommodation_type')->constrained('accommodation_types')->nullOnDelete();
            $table->foreignId('meal_preference_id')->nullable()->after('meal_preference')->constrained('meal_preferences')->nullOnDelete();
        });

        Schema::create('event_registration_workshop_option', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_registration_id')->constrained('event_registrations')->cascadeOnDelete();
            $table->foreignId('workshop_option_id')->constrained('workshop_options')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['event_registration_id', 'workshop_option_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_registration_workshop_option');

        Schema::table('event_registrations', function (Blueprint $table) {
            $table->dropForeign(['member_type_id']);
            $table->dropForeign(['service_department_id']);
            $table->dropForeign(['accommodation_type_id']);
            $table->dropForeign(['meal_preference_id']);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign(['event_category_id']);
        });
    }
};
