<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration : ajout de la colonne code à tous les paramètres.
 */
return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'service_departments',
            'districts',
            'member_types',
            'academic_years',
            'fields_of_study',
            'service_domains',
            'member_statuses',
            'families',
            'groups',
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName) && ! Schema::hasColumn($tableName, 'code')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->string('code', 20)->nullable()->after('name');
                });
            }
        }

        // cities a déjà la colonne code
    }

    public function down(): void
    {
        $tables = [
            'service_departments',
            'districts',
            'member_types',
            'academic_years',
            'fields_of_study',
            'service_domains',
            'member_statuses',
            'families',
            'groups',
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, 'code')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->dropColumn('code');
                });
            }
        }
    }
};
