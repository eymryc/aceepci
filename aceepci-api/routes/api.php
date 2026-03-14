<?php

use App\Http\Controllers\Api\V1\AcademicLevelController;
use App\Http\Controllers\Api\V1\AcademicYearController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CityController;
use App\Http\Controllers\Api\V1\DistrictController;
use App\Http\Controllers\Api\V1\FamilyController;
use App\Http\Controllers\Api\V1\FieldOfStudyController;
use App\Http\Controllers\Api\V1\GroupController;
use App\Http\Controllers\Api\V1\HeardAboutSourceController;
use App\Http\Controllers\Api\V1\MemberLevelController;
use App\Http\Controllers\Api\V1\NationalityController;
use App\Http\Controllers\Api\V1\MemberStatusController;
use App\Http\Controllers\Api\V1\MemberTypeController;
use App\Http\Controllers\Api\V1\MemberController;
use App\Http\Controllers\Api\V1\PermissionController;
use App\Http\Controllers\Api\V1\HistoryController;
use App\Http\Controllers\Api\V1\PresidentMessageController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\ServiceDepartmentController;
use App\Http\Controllers\Api\V1\ServiceDomainController;
use App\Http\Controllers\Api\V1\AccommodationTypeController;
use App\Http\Controllers\Api\V1\DailyVerseController;
use App\Http\Controllers\Api\V1\DocumentSectionController;
use App\Http\Controllers\Api\V1\EventCategoryController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\EventRegistrationController;
use App\Http\Controllers\Api\V1\MealPreferenceController;
use App\Http\Controllers\Api\V1\OfferCategoryController;
use App\Http\Controllers\Api\V1\OfferController;
use App\Http\Controllers\Api\V1\OfferTypeController;
use App\Http\Controllers\Api\V1\OrganizationSectionController;
use App\Http\Controllers\Api\V1\SlideController;
use App\Http\Controllers\Api\V1\VisionMissionValueController;
use App\Http\Controllers\Api\V1\MottoSectionController;
use App\Http\Controllers\Api\V1\WorkshopOptionController;
use App\Http\Controllers\Api\V1\BlogCategoryController;
use App\Http\Controllers\Api\V1\BlogController;
use App\Http\Controllers\Api\V1\ContactInfoController;
use App\Http\Controllers\Api\V1\ContactMessageController;
use App\Http\Controllers\Api\V1\NewsCategoryController;
use App\Http\Controllers\Api\V1\NewsController;
use App\Http\Controllers\Api\V1\DevotionalCategoryController;
use App\Http\Controllers\Api\V1\DevotionalController;
use App\Http\Controllers\Api\V1\SermonController;
use App\Http\Controllers\Api\V1\GalleryMediaController;
use App\Http\Controllers\Api\V1\GalleryMediaCategoryController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - ACEEPCI
|--------------------------------------------------------------------------
|
| Routes pour l'API RESTful de l'application ACEEPCI.
| Endpoints : membres, départements, contenus, authentification JWT.
|
| Paramètres (parameters.view / parameters.manage) :
| - service-departments, cities, districts, member-types, academic-years
| - fields-of-study, service-domains, member-statuses, families, groups
| - member-levels, academic-levels, heard-about-sources, nationalities
|
*/

Route::prefix('v1')->group(function () {
    // Route de santé (sans authentification)
    Route::get('/health', fn () => \App\Http\Responses\ApiResponse::success(['service' => 'ACEEPCI API'], 'Service opérationnel'));

    // Rôles : liste publique (sélection à l'inscription)
    Route::get('/roles', [RoleController::class, 'index']);

    // Slides publiés (public, sans authentification)
    Route::get('/slides/published', [SlideController::class, 'published']);

    // Galerie média publiée (public, pour page d'accueil / galerie)
    Route::get('/gallery-media/published', [GalleryMediaController::class, 'published']);

    // Verset du jour publié (public, sans authentification)
    Route::get('/daily-verses/published', [DailyVerseController::class, 'published']);

    // Mot du président publié (public, sans authentification)
    Route::get('/president-message/published', [PresidentMessageController::class, 'published']);

    // Histoire publiée (public, sans authentification)
    Route::get('/history/published', [HistoryController::class, 'published']);

    // Paramètres publics (pour les select du site, sans authentification)
    Route::get('/service-departments/options', [ServiceDepartmentController::class, 'options']);
    Route::get('/cities/options', [CityController::class, 'options']);
    Route::get('/districts/options', [DistrictController::class, 'options']);
    Route::get('/member-types/options', [MemberTypeController::class, 'options']);
    Route::get('/academic-years/options', [AcademicYearController::class, 'options']);
    Route::get('/fields-of-study/options', [FieldOfStudyController::class, 'options']);
    Route::get('/service-domains/options', [ServiceDomainController::class, 'options']);
    Route::get('/member-statuses/options', [MemberStatusController::class, 'options']);
    Route::get('/families/options', [FamilyController::class, 'options']);
    Route::get('/groups/options', [GroupController::class, 'options']);
    Route::get('/member-levels/options', [MemberLevelController::class, 'options']);
    Route::get('/academic-levels/options', [AcademicLevelController::class, 'options']);
    Route::get('/heard-about-sources/options', [HeardAboutSourceController::class, 'options']);
    Route::get('/nationalities/options', [NationalityController::class, 'options']);
    Route::get('/event-categories/options', [EventCategoryController::class, 'options']);
    Route::get('/accommodation-types/options', [AccommodationTypeController::class, 'options']);
    Route::get('/meal-preferences/options', [MealPreferenceController::class, 'options']);
    Route::get('/workshop-options/options', [WorkshopOptionController::class, 'options']);
    Route::get('/offer-categories/options', [OfferCategoryController::class, 'options']);
    Route::get('/offer-types/options', [OfferTypeController::class, 'options']);
    Route::get('/news-categories/options', [NewsCategoryController::class, 'options']);
    Route::get('/blog-categories/options', [BlogCategoryController::class, 'options']);
    Route::get('/devotional-categories/options', [DevotionalCategoryController::class, 'options']);
    Route::get('/gallery-media-categories/options', [GalleryMediaCategoryController::class, 'options']);

    // Modèle Excel pour import membres (public, pour téléchargement direct)
    Route::get('/members/import/template', [MemberController::class, 'importTemplate']);

    // Soumission publique membre depuis le site
    Route::post('/site/members', [MemberController::class, 'publicStore']);

    // Événements (public : liste publiés + détail)
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{event}', [EventController::class, 'show']);

    // Inscription à un événement (public)
    Route::post('/event-registrations', [EventRegistrationController::class, 'store']);

    // Offres (public : liste + détail)
    Route::get('/offers', [OfferController::class, 'index']);
    Route::get('/offers/{offer}', [OfferController::class, 'show']);

    // Actualités (public : liste publiées + détail, interactions)
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/site/{slugOrId}', [NewsController::class, 'showForSite']);
    Route::get('/news/site/{slugOrId}/comments', [NewsController::class, 'comments']);
    Route::post('/news/site/{slugOrId}/comments', [NewsController::class, 'addComment'])->middleware('throttle:5,1');
    Route::post('/news/site/{slugOrId}/react', [NewsController::class, 'react'])->middleware('throttle:30,1');

    // Blogs (public : liste publiées + détail, interactions)
    Route::get('/blogs', [BlogController::class, 'index']);
    Route::get('/blogs/site/{slugOrId}', [BlogController::class, 'showForSite']);
    Route::get('/blogs/site/{slugOrId}/comments', [BlogController::class, 'comments']);
    Route::post('/blogs/site/{slugOrId}/comments', [BlogController::class, 'addComment'])->middleware('throttle:5,1');
    Route::post('/blogs/site/{slugOrId}/react', [BlogController::class, 'react'])->middleware('throttle:30,1');

    // Dévotionnels (public : liste publiées + détail + interactions)
    Route::get('/devotionals', [DevotionalController::class, 'index']);
    Route::get('/devotionals/site/{slugOrId}', [DevotionalController::class, 'showForSite']);
    Route::get('/devotionals/site/{slugOrId}/comments', [DevotionalController::class, 'comments']);
    Route::post('/devotionals/site/{slugOrId}/comments', [DevotionalController::class, 'addComment'])->middleware('throttle:5,1');
    Route::post('/devotionals/site/{slugOrId}/react', [DevotionalController::class, 'react'])->middleware('throttle:30,1');

    // Sermons (public : liste publiées + détail)
    Route::get('/sermons', [SermonController::class, 'index']);
    Route::get('/sermons/site/{slugOrId}', [SermonController::class, 'showForSite']);

    // Organisation publiée (public)
    Route::get('/organization/published', [OrganizationSectionController::class, 'published']);

    // Devise publiée (public)
    Route::get('/motto/published', [MottoSectionController::class, 'published']);

    // Vision, Mission & Valeurs publiées (public)
    Route::get('/vision-mission-values/published', [VisionMissionValueController::class, 'published']);

    // Documents officiels publiés (public)
    Route::get('/documents/published', [DocumentSectionController::class, 'published']);

    // Formulaire de contact (public, sans authentification)
    Route::post('/contact', [ContactMessageController::class, 'store']);

    // Informations de contact (public, pour la page contact)
    Route::get('/contact-info/published', [ContactInfoController::class, 'published']);

    // Authentification : login et register (publiques)
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    // Refresh token : accepte un token expiré (dans la fenêtre JWT_REFRESH_TTL)
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('jwt.refresh');

    // Routes protégées : token JWT requis dans le header Authorization
    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'me']);
        Route::put('/user', [UserController::class, 'updateProfile']);
        Route::patch('/user', [UserController::class, 'updateProfile']);

        // Utilisateurs (permission users.update pour modifier un autre user)
        Route::put('/users/{user}', [UserController::class, 'update'])->middleware('permission:users.update');
        Route::patch('/users/{user}', [UserController::class, 'update'])->middleware('permission:users.update');

        // CRUD Rôles (permission roles.view / roles.manage)
        Route::get('/roles/{role}', [RoleController::class, 'show'])->middleware('permission:roles.view');
        Route::post('/roles', [RoleController::class, 'store'])->middleware('permission:roles.manage');
        Route::put('/roles/{role}', [RoleController::class, 'update'])->middleware('permission:roles.manage');
        Route::patch('/roles/{role}', [RoleController::class, 'update'])->middleware('permission:roles.manage');
        Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->middleware('permission:roles.manage');

        // Permissions (pour formulaire création/édition de rôle)
        Route::get('/permissions', [PermissionController::class, 'index'])->middleware('permission:roles.view');

        // Parameters (parameters.view / parameters.manage)
        Route::get('/service-departments', [ServiceDepartmentController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/service-departments/{service_department}', [ServiceDepartmentController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/service-departments', [ServiceDepartmentController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/service-departments/{service_department}', [ServiceDepartmentController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/service-departments/{service_department}', [ServiceDepartmentController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/service-departments/{service_department}', [ServiceDepartmentController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/cities', [CityController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/cities/{city}', [CityController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/cities', [CityController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/cities/{city}', [CityController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/cities/{city}', [CityController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/cities/{city}', [CityController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/districts', [DistrictController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/districts/{district}', [DistrictController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/districts', [DistrictController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/districts/{district}', [DistrictController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/districts/{district}', [DistrictController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/districts/{district}', [DistrictController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/member-types', [MemberTypeController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/member-types/{member_type}', [MemberTypeController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/member-types', [MemberTypeController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/member-types/{member_type}', [MemberTypeController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/member-types/{member_type}', [MemberTypeController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/member-types/{member_type}', [MemberTypeController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/academic-years', [AcademicYearController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/academic-years/{academic_year}', [AcademicYearController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/academic-years', [AcademicYearController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/academic-years/{academic_year}', [AcademicYearController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/academic-years/{academic_year}', [AcademicYearController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/academic-years/{academic_year}', [AcademicYearController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/fields-of-study', [FieldOfStudyController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/fields-of-study/{field_of_study}', [FieldOfStudyController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/fields-of-study', [FieldOfStudyController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/fields-of-study/{field_of_study}', [FieldOfStudyController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/fields-of-study/{field_of_study}', [FieldOfStudyController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/fields-of-study/{field_of_study}', [FieldOfStudyController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/service-domains', [ServiceDomainController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/service-domains/{service_domain}', [ServiceDomainController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/service-domains', [ServiceDomainController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/service-domains/{service_domain}', [ServiceDomainController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/service-domains/{service_domain}', [ServiceDomainController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/service-domains/{service_domain}', [ServiceDomainController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/member-statuses', [MemberStatusController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/member-statuses/{member_status}', [MemberStatusController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/member-statuses', [MemberStatusController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/member-statuses/{member_status}', [MemberStatusController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/member-statuses/{member_status}', [MemberStatusController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/member-statuses/{member_status}', [MemberStatusController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/families', [FamilyController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/families/{family}', [FamilyController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/families', [FamilyController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/families/{family}', [FamilyController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/families/{family}', [FamilyController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/families/{family}', [FamilyController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/groups', [GroupController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/groups/{group}', [GroupController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/groups', [GroupController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/groups/{group}', [GroupController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/groups/{group}', [GroupController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/groups/{group}', [GroupController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/member-levels', [MemberLevelController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/member-levels/{member_level}', [MemberLevelController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/member-levels', [MemberLevelController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/member-levels/{member_level}', [MemberLevelController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/member-levels/{member_level}', [MemberLevelController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/member-levels/{member_level}', [MemberLevelController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/academic-levels', [AcademicLevelController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/academic-levels/{academic_level}', [AcademicLevelController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/academic-levels', [AcademicLevelController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/academic-levels/{academic_level}', [AcademicLevelController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/academic-levels/{academic_level}', [AcademicLevelController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/academic-levels/{academic_level}', [AcademicLevelController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/heard-about-sources', [HeardAboutSourceController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/heard-about-sources/{heard_about_source}', [HeardAboutSourceController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/heard-about-sources', [HeardAboutSourceController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/heard-about-sources/{heard_about_source}', [HeardAboutSourceController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/heard-about-sources/{heard_about_source}', [HeardAboutSourceController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/heard-about-sources/{heard_about_source}', [HeardAboutSourceController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/nationalities', [NationalityController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/nationalities/{nationality}', [NationalityController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/nationalities', [NationalityController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/nationalities/{nationality}', [NationalityController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/nationalities/{nationality}', [NationalityController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/nationalities/{nationality}', [NationalityController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/event-categories', [EventCategoryController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/event-categories/{event_category}', [EventCategoryController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/event-categories', [EventCategoryController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/event-categories/{event_category}', [EventCategoryController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/event-categories/{event_category}', [EventCategoryController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/event-categories/{event_category}', [EventCategoryController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/accommodation-types', [AccommodationTypeController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/accommodation-types/{accommodation_type}', [AccommodationTypeController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/accommodation-types', [AccommodationTypeController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/accommodation-types/{accommodation_type}', [AccommodationTypeController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/accommodation-types/{accommodation_type}', [AccommodationTypeController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/accommodation-types/{accommodation_type}', [AccommodationTypeController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/meal-preferences', [MealPreferenceController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/meal-preferences/{meal_preference}', [MealPreferenceController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/meal-preferences', [MealPreferenceController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/meal-preferences/{meal_preference}', [MealPreferenceController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/meal-preferences/{meal_preference}', [MealPreferenceController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/meal-preferences/{meal_preference}', [MealPreferenceController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/workshop-options', [WorkshopOptionController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/workshop-options/{workshop_option}', [WorkshopOptionController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/workshop-options', [WorkshopOptionController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/workshop-options/{workshop_option}', [WorkshopOptionController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/workshop-options/{workshop_option}', [WorkshopOptionController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/workshop-options/{workshop_option}', [WorkshopOptionController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/offer-categories', [OfferCategoryController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/offer-categories/{offer_category}', [OfferCategoryController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/offer-categories', [OfferCategoryController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/offer-categories/{offer_category}', [OfferCategoryController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/offer-categories/{offer_category}', [OfferCategoryController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/offer-categories/{offer_category}', [OfferCategoryController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/news-categories', [NewsCategoryController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/news-categories/{news_category}', [NewsCategoryController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/news-categories', [NewsCategoryController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/news-categories/{news_category}', [NewsCategoryController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/news-categories/{news_category}', [NewsCategoryController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/news-categories/{news_category}', [NewsCategoryController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/blog-categories', [BlogCategoryController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/blog-categories/{blog_category}', [BlogCategoryController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/blog-categories', [BlogCategoryController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/blog-categories/{blog_category}', [BlogCategoryController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/blog-categories/{blog_category}', [BlogCategoryController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/blog-categories/{blog_category}', [BlogCategoryController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/devotional-categories', [DevotionalCategoryController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/devotional-categories/{devotional_category}', [DevotionalCategoryController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/devotional-categories', [DevotionalCategoryController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/devotional-categories/{devotional_category}', [DevotionalCategoryController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/devotional-categories/{devotional_category}', [DevotionalCategoryController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/devotional-categories/{devotional_category}', [DevotionalCategoryController::class, 'destroy'])->middleware('permission:parameters.manage');

        // Catégories galerie média (parameters.view, parameters.manage)
        Route::get('/gallery-media-categories', [GalleryMediaCategoryController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/gallery-media-categories/{gallery_media_category}', [GalleryMediaCategoryController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/gallery-media-categories', [GalleryMediaCategoryController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/gallery-media-categories/{gallery_media_category}', [GalleryMediaCategoryController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/gallery-media-categories/{gallery_media_category}', [GalleryMediaCategoryController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/gallery-media-categories/{gallery_media_category}', [GalleryMediaCategoryController::class, 'destroy'])->middleware('permission:parameters.manage');

        Route::get('/offer-types', [OfferTypeController::class, 'index'])->middleware('permission:parameters.view');
        Route::get('/offer-types/{offer_type}', [OfferTypeController::class, 'show'])->middleware('permission:parameters.view');
        Route::post('/offer-types', [OfferTypeController::class, 'store'])->middleware('permission:parameters.manage');
        Route::put('/offer-types/{offer_type}', [OfferTypeController::class, 'update'])->middleware('permission:parameters.manage');
        Route::patch('/offer-types/{offer_type}', [OfferTypeController::class, 'update'])->middleware('permission:parameters.manage');
        Route::delete('/offer-types/{offer_type}', [OfferTypeController::class, 'destroy'])->middleware('permission:parameters.manage');

        // Slides (slides.view, slides.manage, slides.publish)
        Route::get('/slides', [SlideController::class, 'index'])->middleware('permission:slides.view');
        Route::get('/slides/{slide}', [SlideController::class, 'show'])->middleware('permission:slides.view');
        Route::post('/slides', [SlideController::class, 'store'])->middleware('permission:slides.manage');
        Route::put('/slides/{slide}', [SlideController::class, 'update'])->middleware('permission:slides.manage');
        Route::patch('/slides/{slide}', [SlideController::class, 'update'])->middleware('permission:slides.manage');
        Route::post('/slides/{slide}/publish', [SlideController::class, 'publish'])->middleware('permission:slides.publish');
        Route::delete('/slides/{slide}', [SlideController::class, 'destroy'])->middleware('permission:slides.manage');

        // Galerie média (gallery.view, gallery.manage)
        Route::get('/gallery-media', [GalleryMediaController::class, 'index'])->middleware('permission:gallery.view');
        Route::get('/gallery-media/{gallery_media}', [GalleryMediaController::class, 'show'])->middleware('permission:gallery.view');
        Route::post('/gallery-media', [GalleryMediaController::class, 'store'])->middleware('permission:gallery.manage');
        Route::put('/gallery-media/{gallery_media}', [GalleryMediaController::class, 'update'])->middleware('permission:gallery.manage');
        Route::patch('/gallery-media/{gallery_media}', [GalleryMediaController::class, 'update'])->middleware('permission:gallery.manage');
        Route::delete('/gallery-media/{gallery_media}', [GalleryMediaController::class, 'destroy'])->middleware('permission:gallery.manage');
        Route::post('/gallery-media/{gallery_media}/publish', [GalleryMediaController::class, 'publish'])->middleware('permission:gallery.manage');
        Route::post('/gallery-media/{gallery_media}/unpublish', [GalleryMediaController::class, 'unpublish'])->middleware('permission:gallery.manage');

        // Verset du jour (daily-verses.view, daily-verses.manage, daily-verses.publish)
        Route::get('/daily-verses', [DailyVerseController::class, 'index'])->middleware('permission:daily-verses.view');
        Route::get('/daily-verses/{daily_verse}', [DailyVerseController::class, 'show'])->middleware('permission:daily-verses.view');
        Route::post('/daily-verses', [DailyVerseController::class, 'store'])->middleware('permission:daily-verses.manage');
        Route::put('/daily-verses/{daily_verse}', [DailyVerseController::class, 'update'])->middleware('permission:daily-verses.manage');
        Route::patch('/daily-verses/{daily_verse}', [DailyVerseController::class, 'update'])->middleware('permission:daily-verses.manage');
        Route::post('/daily-verses/{daily_verse}/publish', [DailyVerseController::class, 'publish'])->middleware('permission:daily-verses.publish');
        Route::delete('/daily-verses/{daily_verse}', [DailyVerseController::class, 'destroy'])->middleware('permission:daily-verses.manage');

        // Mot du président (president-message.view, president-message.manage)
        Route::get('/president-message', [PresidentMessageController::class, 'show'])->middleware('permission:president-message.view');
        Route::post('/president-message', [PresidentMessageController::class, 'save'])->middleware('permission:president-message.manage');
        Route::put('/president-message', [PresidentMessageController::class, 'save'])->middleware('permission:president-message.manage');
        Route::patch('/president-message', [PresidentMessageController::class, 'save'])->middleware('permission:president-message.manage');

        // Histoire (history.view, history.manage)
        Route::get('/history', [HistoryController::class, 'show'])->middleware('permission:history.view');
        Route::post('/history', [HistoryController::class, 'save'])->middleware('permission:history.manage');
        Route::put('/history', [HistoryController::class, 'save'])->middleware('permission:history.manage');
        Route::patch('/history', [HistoryController::class, 'save'])->middleware('permission:history.manage');

        // Membres (members.view, members.manage)
        Route::get('/members', [MemberController::class, 'index'])->middleware('permission:members.view');
        Route::post('/members/import', [MemberController::class, 'import'])->middleware('permission:members.manage');
        Route::get('/members/{member}', [MemberController::class, 'show'])->middleware('permission:members.view');
        Route::patch('/members/{member}/status', [MemberController::class, 'updateStatus'])->middleware('permission:members.manage');
        Route::post('/members', [MemberController::class, 'store'])->middleware('permission:members.manage');
        Route::put('/members/{member}', [MemberController::class, 'update'])->middleware('permission:members.manage');
        Route::patch('/members/{member}', [MemberController::class, 'update'])->middleware('permission:members.manage');
        Route::delete('/members/{member}', [MemberController::class, 'destroy'])->middleware('permission:members.manage');

        // Inscriptions aux événements
        Route::get('/event-registrations', [EventRegistrationController::class, 'index']);
        Route::get('/event-registrations/{event_registration}', [EventRegistrationController::class, 'show']);

        // Messages du formulaire de contact (contact.view)
        Route::get('/contact-messages', [ContactMessageController::class, 'index'])->middleware('permission:contact.view');
        Route::get('/contact-messages/{contact_message}', [ContactMessageController::class, 'show'])->middleware('permission:contact.view');
        Route::patch('/contact-messages/{contact_message}/read', [ContactMessageController::class, 'markRead'])->middleware('permission:contact.view');

        // Informations de contact (contact.view, contact.manage)
        Route::get('/contact-info', [ContactInfoController::class, 'show'])->middleware('permission:contact.view');
        Route::put('/contact-info', [ContactInfoController::class, 'save'])->middleware('permission:contact.manage');
        Route::patch('/contact-info', [ContactInfoController::class, 'save'])->middleware('permission:contact.manage');

        // Événements CRUD
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{event}', [EventController::class, 'update']);
        Route::patch('/events/{event}', [EventController::class, 'update']);
        Route::delete('/events/{event}', [EventController::class, 'destroy']);

        // Actualités CRUD (admin)
        Route::get('/news/admin', [NewsController::class, 'adminIndex']);
        Route::get('/news/{news}', [NewsController::class, 'show']);
        Route::post('/news', [NewsController::class, 'store']);
        Route::put('/news/{news}', [NewsController::class, 'update']);
        Route::patch('/news/{news}', [NewsController::class, 'update']);
        Route::delete('/news/{news}', [NewsController::class, 'destroy']);
        Route::post('/news/{news}/publish', [NewsController::class, 'publish']);
        Route::post('/news/{news}/unpublish', [NewsController::class, 'unpublish']);
        Route::get('/news/{news}/comments', [NewsController::class, 'adminComments']);
        Route::patch('/news-comments/{newsComment}/approve', [NewsController::class, 'approveComment']);
        Route::delete('/news-comments/{newsComment}', [NewsController::class, 'destroyComment']);

        // Blogs CRUD (admin)
        Route::get('/blogs/admin', [BlogController::class, 'adminIndex']);
        Route::get('/blogs/{blog}', [BlogController::class, 'show']);
        Route::post('/blogs', [BlogController::class, 'store']);
        Route::put('/blogs/{blog}', [BlogController::class, 'update']);
        Route::patch('/blogs/{blog}', [BlogController::class, 'update']);
        Route::delete('/blogs/{blog}', [BlogController::class, 'destroy']);
        Route::post('/blogs/{blog}/publish', [BlogController::class, 'publish']);
        Route::post('/blogs/{blog}/unpublish', [BlogController::class, 'unpublish']);
        Route::get('/blogs/{blog}/comments', [BlogController::class, 'adminComments']);
        Route::patch('/blog-comments/{blogComment}/approve', [BlogController::class, 'approveComment']);
        Route::delete('/blog-comments/{blogComment}', [BlogController::class, 'destroyComment']);

        // Dévotionnels CRUD (admin)
        Route::get('/devotionals/admin', [DevotionalController::class, 'adminIndex']);
        Route::get('/devotionals/{devotional}', [DevotionalController::class, 'show']);
        Route::post('/devotionals', [DevotionalController::class, 'store']);
        Route::put('/devotionals/{devotional}', [DevotionalController::class, 'update']);
        Route::patch('/devotionals/{devotional}', [DevotionalController::class, 'update']);
        Route::delete('/devotionals/{devotional}', [DevotionalController::class, 'destroy']);
        Route::post('/devotionals/{devotional}/publish', [DevotionalController::class, 'publish']);
        Route::post('/devotionals/{devotional}/unpublish', [DevotionalController::class, 'unpublish']);
        Route::get('/devotionals/{devotional}/comments', [DevotionalController::class, 'adminComments']);
        Route::patch('/devotional-comments/{devotionalComment}/approve', [DevotionalController::class, 'approveComment']);
        Route::delete('/devotional-comments/{devotionalComment}', [DevotionalController::class, 'destroyComment']);

        // Sermons CRUD (admin)
        Route::get('/sermons/admin', [SermonController::class, 'adminIndex']);
        Route::get('/sermons/{sermon}', [SermonController::class, 'show']);
        Route::post('/sermons', [SermonController::class, 'store']);
        Route::put('/sermons/{sermon}', [SermonController::class, 'update']);
        Route::patch('/sermons/{sermon}', [SermonController::class, 'update']);
        Route::delete('/sermons/{sermon}', [SermonController::class, 'destroy']);
        Route::post('/sermons/{sermon}/publish', [SermonController::class, 'publish']);
        Route::post('/sermons/{sermon}/unpublish', [SermonController::class, 'unpublish']);

        // Offres CRUD
        Route::post('/offers', [OfferController::class, 'store']);
        Route::put('/offers/{offer}', [OfferController::class, 'update']);
        Route::patch('/offers/{offer}', [OfferController::class, 'update']);
        Route::delete('/offers/{offer}', [OfferController::class, 'destroy']);
        Route::post('/offers/{offer}/publish', [OfferController::class, 'publish']);
        Route::post('/offers/{offer}/unpublish', [OfferController::class, 'unpublish']);

        // Vision, Mission & Valeurs (vision-mission-values.view, vision-mission-values.manage)
        Route::get('/vision-mission-values', [VisionMissionValueController::class, 'show'])->middleware('permission:vision-mission-values.view');
        Route::post('/vision-mission-values', [VisionMissionValueController::class, 'save'])->middleware('permission:vision-mission-values.manage');
        Route::put('/vision-mission-values', [VisionMissionValueController::class, 'save'])->middleware('permission:vision-mission-values.manage');
        Route::patch('/vision-mission-values', [VisionMissionValueController::class, 'save'])->middleware('permission:vision-mission-values.manage');

        // Documents officiels (documents.view, documents.manage)
        Route::get('/documents', [DocumentSectionController::class, 'show'])->middleware('permission:documents.view');
        Route::post('/documents', [DocumentSectionController::class, 'save'])->middleware('permission:documents.manage');
        Route::put('/documents', [DocumentSectionController::class, 'save'])->middleware('permission:documents.manage');
        Route::patch('/documents', [DocumentSectionController::class, 'save'])->middleware('permission:documents.manage');

        // Organisation (organization.view, organization.manage)
        Route::get('/organization', [OrganizationSectionController::class, 'show'])->middleware('permission:organization.view');
        Route::post('/organization', [OrganizationSectionController::class, 'save'])->middleware('permission:organization.manage');
        Route::put('/organization', [OrganizationSectionController::class, 'save'])->middleware('permission:organization.manage');
        Route::patch('/organization', [OrganizationSectionController::class, 'save'])->middleware('permission:organization.manage');

        // Devise (motto.view, motto.manage)
        Route::get('/motto', [MottoSectionController::class, 'show'])->middleware('permission:motto.view');
        Route::post('/motto', [MottoSectionController::class, 'save'])->middleware('permission:motto.manage');
        Route::put('/motto', [MottoSectionController::class, 'save'])->middleware('permission:motto.manage');
        Route::patch('/motto', [MottoSectionController::class, 'save'])->middleware('permission:motto.manage');
    });
});
