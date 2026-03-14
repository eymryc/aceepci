<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Ajoute le champ certificat de scolarité / carte d'étudiant sur members.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('members')) {
            return;
        }

        Schema::table('members', function (Blueprint $table) {
            if (! Schema::hasColumn('members', 'student_certificate_url')) {
                $table->string('student_certificate_url', 2048)->nullable()->after('pastor_attestation_url');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('members')) {
            return;
        }

        Schema::table('members', function (Blueprint $table) {
            if (Schema::hasColumn('members', 'student_certificate_url')) {
                $table->dropColumn('student_certificate_url');
            }
        });
    }
};
