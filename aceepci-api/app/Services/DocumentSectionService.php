<?php

namespace App\Services;

use App\Models\DocumentSection;
use Illuminate\Support\Facades\Storage;

/**
 * Service de gestion de la section Documents officiels.
 *
 * Un seul bloc éditable : enregistrer simple (brouillon) ou enregistrer et publier.
 */
class DocumentSectionService
{
    /** Récupère le bloc pour édition (le plus récent, publié ou non) */
    public function getCurrent(): ?DocumentSection
    {
        return DocumentSection::query()->orderByDesc('updated_at')->first();
    }

    /** Récupère le bloc publié (affiché sur le site) */
    public function getPublished(): ?DocumentSection
    {
        return DocumentSection::query()
            ->where('is_published', true)
            ->first();
    }

    /** Enregistre (simple ou avec publication) */
    public function save(array $data, array $uploadedFiles, array $removedFiles, bool $publish = false): DocumentSection
    {
        // Supprimer les fichiers marqués pour suppression
        foreach ($removedFiles as $filePath) {
            if ($filePath && ! str_starts_with($filePath, 'http')) {
                Storage::disk('public')->delete($filePath);
            }
        }

        // Traiter les documents et les fichiers uploadés
        $documents = [];
        foreach ($data['documents'] ?? [] as $index => $doc) {
            $document = [
                'title' => $doc['title'],
                'description' => $doc['description'] ?? null,
                'file_url' => $doc['file_url'] ?? null,
            ];

            // Si un nouveau fichier a été uploadé pour ce document
            if (isset($uploadedFiles[$index])) {
                // Supprimer l'ancien fichier s'il existe
                if ($document['file_url'] && ! str_starts_with($document['file_url'], 'http')) {
                    Storage::disk('public')->delete($document['file_url']);
                }
                $document['file_url'] = $uploadedFiles[$index]->store('documents', 'public');
            }

            $documents[] = $document;
        }

        $data['documents'] = $documents;

        $current = $this->getCurrent();

        if ($current) {
            $current->update($data);
            $record = $current->fresh();
        } else {
            $record = DocumentSection::create($data);
        }

        if ($publish) {
            DocumentSection::query()
                ->where('id', '!=', $record->id)
                ->update(['is_published' => false, 'published_at' => null]);

            $record->update([
                'is_published' => true,
                'published_at' => now(),
            ]);
            $record = $record->fresh();
        }

        return $record;
    }
}
