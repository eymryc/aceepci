<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            GeographyParameterSeeder::class,
            MemberParameterSeeder::class,
            NationalitySeeder::class,
            AcademicParameterSeeder::class,
            ServiceParameterSeeder::class,
            EventParameterSeeder::class,
            OfferParameterSeeder::class,
            ContentCategorySeeder::class,
            BlogCategorySeeder::class,
            MottoSectionSeeder::class,
            VisionMissionValueSeeder::class,
            DocumentSectionSeeder::class,
            OrganizationSectionSeeder::class,
            HistorySeeder::class,
            PresidentMessageSeeder::class,
            ContactInfoSeeder::class,
            SlideSeeder::class,
            DailyVerseSeeder::class,
            NewsSeeder::class,
            BlogSeeder::class,
            SermonSeeder::class,
            EventSeeder::class,
            OfferSeeder::class,
        ]);

        $user = User::factory()->create([
            'name' => 'Admin',
            'firstname' => 'Admin',
            'lastname' => 'ACEEPCI',
            'email' => 'admin@aceepci.com',
        ]);
        $user->assignRole('admin');
    }
}
