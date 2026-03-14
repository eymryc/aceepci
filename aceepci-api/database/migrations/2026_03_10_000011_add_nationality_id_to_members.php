<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Ajoute la FK nationality_id sur la table members.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('members')) {
            return;
        }

        Schema::table('members', function (Blueprint $table) {
            if (! Schema::hasColumn('members', 'nationality_id')) {
                $table->foreignId('nationality_id')->nullable()->after('nationality')->constrained('nationalities')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('members')) {
            return;
        }

        Schema::table('members', function (Blueprint $table) {
            if (Schema::hasColumn('members', 'nationality_id')) {
                $table->dropForeign(['nationality_id']);
                $table->dropColumn('nationality_id');
            }
        });
    }
};
