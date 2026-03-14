<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('devotionals', function (Blueprint $table) {
            $table->unsignedInteger('amen_count')->default(0)->after('views_count');
            $table->unsignedInteger('beni_count')->default(0)->after('amen_count');
            $table->unsignedInteger('edifiant_count')->default(0)->after('beni_count');
        });
    }

    public function down(): void
    {
        Schema::table('devotionals', function (Blueprint $table) {
            $table->dropColumn(['amen_count', 'beni_count', 'edifiant_count']);
        });
    }
};
