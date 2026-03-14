<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;

/**
 * Modèle utilisateur.
 *
 * Représente un utilisateur de l'application avec authentification JWT.
 * Supporte les soft deletes, le suivi des créations/modifications et Spatie Permission.
 */
class User extends Authenticatable implements JWTSubject
{
    use HasFactory, HasRoles, Notifiable, SoftDeletes;

    /** Guard utilisé pour Spatie Permission (API JWT) */
    protected $guard_name = 'api';

    /** @var list<string> Champs assignables en masse */
    protected $fillable = [
        'name',
        'firstname',
        'lastname',
        'email',
        'username',
        'phone',
        'password',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    /** @var list<string> Champs masqués dans les sérialisations */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /** @var list<string> Attributs ajoutés aux sérialisations */
    protected $appends = ['fullname'];

    /**
     * Accesseur : nom complet (prénom + nom).
     */
    public function getFullnameAttribute(): string
    {
        return trim("{$this->firstname} {$this->lastname}") ?: $this->name ?? '';
    }

    /**
     * Identifiant utilisé dans le payload JWT.
     */
    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    /**
     * Claims personnalisés ajoutés au token JWT.
     * Inclut les rôles et permissions pour utilisation côté client.
     * events.view et events.manage sont ajoutés pour tous (pas de restriction côté backend).
     *
     * @return array<string, mixed>
     */
    public function getJWTCustomClaims(): array
    {
        $permissions = $this->getAllPermissions()->pluck('name')->values()->all();
        $extra = ['events.view', 'events.manage', 'event-registrations.view'];
        $permissions = array_values(array_unique(array_merge($permissions, $extra)));

        return [
            'roles' => $this->getRoleNames(),
            'permissions' => $permissions,
        ];
    }

    /** Relation : utilisateur ayant créé cet enregistrement */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** Relation : utilisateur ayant effectué la dernière mise à jour */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /** Relation : utilisateur ayant effectué la suppression (soft delete) */
    public function deleter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
