<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Ajoute les FK vers member_levels, academic_levels, heard_about_sources sur la table members.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('members')) {
            return;
        }

        Schema::table('members', function (Blueprint $table) {
            $table->foreignId('member_level_id')->nullable()->after('member_level')->constrained('member_levels')->nullOnDelete();
            $table->foreignId('academic_level_id')->nullable()->after('member_level_id')->constrained('academic_levels')->nullOnDelete();
            $table->foreignId('heard_about_source_id')->nullable()->after('heard_about_aceepci')->constrained('heard_about_sources')->nullOnDelete();
            $table->string('member_level', 50)->nullable()->change();
            $table->string('heard_about_aceepci', 255)->nullable()->change();
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('members')) {
            return;
        }

        Schema::table('members', function (Blueprint $table) {
            $table->dropForeign(['member_level_id']);
            $table->dropForeign(['academic_level_id']);
            $table->dropForeign(['heard_about_source_id']);
            $table->dropColumn(['member_level_id', 'academic_level_id', 'heard_about_source_id']);
        });
    }
};
