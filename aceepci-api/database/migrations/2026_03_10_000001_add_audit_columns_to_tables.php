<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration : ajout des colonnes d'audit (deleted_at, created_by, updated_by, deleted_by)
 * à toutes les tables métier.
 */
return new class extends Migration
{
    /** Tables auxquelles ajouter les colonnes d'audit */
    private array $tables = [
        'service_departments',
        'cities',
        'districts',
        'member_types',
        'academic_years',
        'fields_of_study',
        'service_domains',
        'member_statuses',
        'families',
        'groups',
        'slides',
    ];

    public function up(): void
    {
        foreach ($this->tables as $tableName) {
            if (! Schema::hasTable($tableName)) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                if (! Schema::hasColumn($tableName, 'deleted_at')) {
                    $table->softDeletes();
                }
                if (! Schema::hasColumn($tableName, 'created_by')) {
                    $table->unsignedBigInteger('created_by')->nullable();
                    $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
                }
                if (! Schema::hasColumn($tableName, 'updated_by')) {
                    $table->unsignedBigInteger('updated_by')->nullable();
                    $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
                }
                if (! Schema::hasColumn($tableName, 'deleted_by')) {
                    $table->unsignedBigInteger('deleted_by')->nullable();
                    $table->foreign('deleted_by')->references('id')->on('users')->nullOnDelete();
                }
            });
        }
    }

    public function down(): void
    {
        foreach ($this->tables as $tableName) {
            if (! Schema::hasTable($tableName)) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                if (Schema::hasColumn($tableName, 'deleted_by')) {
                    $table->dropForeign(['deleted_by']);
                }
                if (Schema::hasColumn($tableName, 'updated_by')) {
                    $table->dropForeign(['updated_by']);
                }
                if (Schema::hasColumn($tableName, 'created_by')) {
                    $table->dropForeign(['created_by']);
                }
                if (Schema::hasColumn($tableName, 'deleted_at')) {
                    $table->dropSoftDeletes();
                }
            });
        }
    }
};
