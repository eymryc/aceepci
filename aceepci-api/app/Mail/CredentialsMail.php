<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Email envoyé à la création d'un compte avec les informations de connexion.
 * Envoyé en arrière-plan via la file d'attente.
 */
class CredentialsMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $plainPassword
    ) {}

    /** Définit l'objet de l'email */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'ACEEPCI - Vos informations de connexion',
        );
    }

    /** Définit la vue du contenu de l'email */
    public function content(): Content
    {
        return new Content(
            view: 'emails.credentials',
        );
    }
}
