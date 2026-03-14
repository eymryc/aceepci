<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('offers', function (Blueprint $table) {
            $table->string('external_link')->nullable()->change();
        });
    }

    public function down(): void
    {
        DB::table('offers')->whereNull('external_link')->update(['external_link' => '']);

        Schema::table('offers', function (Blueprint $table) {
            $table->string('external_link')->nullable(false)->change();
        });
    }
};
