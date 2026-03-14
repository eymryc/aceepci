<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class CaptchaService
{
    public function verify(string $token, ?string $ip = null): bool
    {
        $provider = config('services.news_captcha.provider', env('NEWS_CAPTCHA_PROVIDER', 'recaptcha'));

        if ($provider === 'hcaptcha') {
            return $this->verifyHCaptcha($token, $ip);
        }

        return $this->verifyRecaptcha($token, $ip);
    }

    private function verifyRecaptcha(string $token, ?string $ip): bool
    {
        $secret = config('services.news_captcha.recaptcha_secret', env('RECAPTCHA_SECRET_KEY'));
        if (! $secret) {
            return false;
        }

        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => $secret,
            'response' => $token,
            'remoteip' => $ip,
        ]);

        if (! $response->ok()) {
            return false;
        }

        $data = $response->json();

        return (bool) ($data['success'] ?? false);
    }

    private function verifyHCaptcha(string $token, ?string $ip): bool
    {
        $secret = config('services.news_captcha.hcaptcha_secret', env('HCAPTCHA_SECRET_KEY'));
        if (! $secret) {
            return false;
        }

        $response = Http::asForm()->post('https://hcaptcha.com/siteverify', [
            'secret' => $secret,
            'response' => $token,
            'remoteip' => $ip,
        ]);

        if (! $response->ok()) {
            return false;
        }

        $data = $response->json();

        return (bool) ($data['success'] ?? false);
    }
}

