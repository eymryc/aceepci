<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('title')->nullable()->after('id');
            $table->string('category', 100)->nullable()->after('slug');
            $table->string('expected_attendees', 50)->nullable()->after('end_date');
            $table->string('image_url', 2048)->nullable()->after('expected_attendees');
            $table->string('price', 100)->nullable()->after('image_url');
            $table->boolean('registration_open')->default(true)->after('is_published');
        });

        // Copier name vers title pour les enregistrements existants
        foreach (\DB::table('events')->get(['id', 'name']) as $row) {
            \DB::table('events')->where('id', $row->id)->update(['title' => $row->name]);
        }
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn([
                'title',
                'category',
                'expected_attendees',
                'image_url',
                'price',
                'registration_open',
            ]);
        });
    }
};
