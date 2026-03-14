<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Allège les contraintes NOT NULL sur la table members
 * et ajoute les colonnes manquantes du formulaire front.
 *
 * Idempotent : ne modifie que ce qui n'a pas déjà été appliqué par 000005.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('members')) {
            return;
        }

        Schema::table('members', function (Blueprint $table) {
            $table->date('birth_date')->nullable()->change();
            $table->string('birth_place')->nullable()->change();
            $table->string('nationality', 100)->nullable()->change();
            $table->text('address')->nullable()->change();
            $table->foreignId('city_id')->nullable()->change();
            $table->foreignId('desired_service_department_id')->nullable()->change();
            $table->string('emergency_contact_name')->nullable()->change();
            $table->string('emergency_contact_phone', 20)->nullable()->change();
            $table->string('pastor_name')->nullable()->change();
            $table->boolean('is_born_again')->nullable()->change();
            $table->boolean('is_baptized')->nullable()->change();
            $table->string('heard_about_aceepci', 255)->nullable()->change();
            $table->text('motivation')->nullable()->change();
        });

        Schema::table('members', function (Blueprint $table) {
            if (! Schema::hasColumn('members', 'district_id')) {
                $table->foreignId('district_id')->nullable()->after('city_id')->constrained('districts')->nullOnDelete();
            }
            if (! Schema::hasColumn('members', 'institution')) {
                $table->string('institution')->nullable()->after('academic_level_id');
            }
            if (! Schema::hasColumn('members', 'field_of_study')) {
                $table->string('field_of_study')->nullable()->after('institution');
            }
            if (! Schema::hasColumn('members', 'profession')) {
                $table->string('profession')->nullable()->after('field_of_study');
            }
            if (! Schema::hasColumn('members', 'company')) {
                $table->string('company')->nullable()->after('profession');
            }
            if (! Schema::hasColumn('members', 'accept_charter')) {
                $table->boolean('accept_charter')->default(false)->after('pastor_attestation_url');
            }
            if (! Schema::hasColumn('members', 'accept_payment')) {
                $table->boolean('accept_payment')->default(false)->after('accept_charter');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('members')) {
            return;
        }

        Schema::table('members', function (Blueprint $table) {
            $columns = [];

            if (Schema::hasColumn('members', 'district_id')) {
                $table->dropForeign(['district_id']);
                $columns[] = 'district_id';
            }

            foreach (['institution', 'field_of_study', 'profession', 'company', 'accept_charter', 'accept_payment'] as $col) {
                if (Schema::hasColumn('members', $col)) {
                    $columns[] = $col;
                }
            }

            if ($columns) {
                $table->dropColumn($columns);
            }
        });
    }
};
