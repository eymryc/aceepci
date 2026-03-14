<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informations de connexion - ACEEPCI</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f8fafc;
            padding: 40px 20px;
        }
        .container {
            max-width: 520px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        }
        .header {
            padding: 32px 32px 24px;
            border-bottom: 1px solid #f1f5f9;
        }
        h1 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1e293b;
            letter-spacing: -0.02em;
        }
        .subtitle {
            margin-top: 8px;
            font-size: 0.9375rem;
            color: #64748b;
        }
        .content {
            padding: 24px 32px 32px;
        }
        .credentials {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border: 1px solid #e2e8f0;
        }
        .credential-row {
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .credential-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
        .credential-row:first-child {
            padding-top: 0;
        }
        .credential-label {
            font-size: 0.75rem;
            font-weight: 500;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
        }
        .credential-value {
            font-size: 0.9375rem;
            color: #1e293b;
            font-weight: 500;
        }
        .credential-value a {
            color: #2563eb;
            text-decoration: none;
        }
        .credential-value a:hover {
            text-decoration: underline;
        }
        .instruction {
            font-size: 0.9375rem;
            color: #64748b;
            margin: 20px 0;
        }
        .notice {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 8px;
            padding: 16px;
            font-size: 0.875rem;
            color: #92400e;
        }
        .notice strong {
            color: #78350f;
        }
        .footer {
            padding: 24px 32px;
            border-top: 1px solid #f1f5f9;
            font-size: 0.8125rem;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bienvenue sur ACEEPCI</h1>
            <p class="subtitle">Votre compte a été créé avec succès. Voici vos informations de connexion :</p>
        </div>

        <div class="content">
            <div class="credentials">
                @if($user->email)
                <div class="credential-row">
                    <div class="credential-label">Identifiant (email)</div>
                    <div class="credential-value">
                        <a href="mailto:{{ $user->email }}">{{ $user->email }}</a>
                    </div>
                </div>
                @endif

                @if($user->username)
                <div class="credential-row">
                    <div class="credential-label">Identifiant (nom d'utilisateur)</div>
                    <div class="credential-value">{{ $user->username }}</div>
                </div>
                @endif

                <div class="credential-row">
                    <div class="credential-label">Mot de passe temporaire</div>
                    <div class="credential-value">{{ $plainPassword }}</div>
                </div>
            </div>

            <p class="instruction">
                Vous pouvez vous connecter avec votre <strong>email</strong> ou votre <strong>nom d'utilisateur</strong> (si défini).
            </p>

            <div class="notice">
                <strong>Important :</strong> Pour des raisons de sécurité, nous vous recommandons de modifier votre mot de passe après votre première connexion.
            </div>
        </div>

        <div class="footer">
            — L'équipe ACEEPCI
        </div>
    </div>
</body>
</html>
