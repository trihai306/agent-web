<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Services\UserService;

class AuthService
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function register(array $data): array
    {
        $user = $this->userService->createUser([
            'name' => $data['first_name'] . ' ' . $data['last_name'],
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'phone_number' => $data['phone_number'],
            'password' => Hash::make($data['password']),
        ]);

        // Auto-generate login token on registration (default 24h expiry)
        $user->generateLoginToken();

        $tokenResult = $user->createToken('api-token');
        $token = $tokenResult->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
            'expires_in' => config('sanctum.expiration'),
        ];
    }

    public function login(array $data): array
    {
        $login = $data['login'];
        $password = $data['password'];

        $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone_number';

        $credentials = [
            $field => $login,
            'password' => $password
        ];

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'login' => ['Invalid login details'],
            ]);
        }

        $user = $this->userService->findUserByEmailOrPhone($login);

        // Auto-regenerate login token on successful login (default 24h expiry)
        $user->generateLoginToken();

        $tokenResult = $user->createToken('api-token');
        $token = $tokenResult->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
            'expires_in' => config('sanctum.expiration'),
        ];
    }

    public function logout(): void
    {
        Auth::user()->currentAccessToken()->delete();
    }

    public function getProfile(): User
    {
        $user = Auth::user();
        $user->balance = $user->balance; 
        return $user;
    }

    public function forgotPassword(string $email): string
    {
        $status = Password::sendResetLink(['email' => $email]);

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }
        return __($status);
    }

    public function resetPassword(array $data): string
    {
        $status = Password::reset($data, function ($user, $password) {
            $this->userService->updateUser($user, ['password' => Hash::make($password)]);
        });

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }
        return __($status);
    }

    /**
     * Generate login token for user
     *
     * @param string $login
     * @param int $expirationHours
     * @return array
     */
    public function generateLoginToken(string $login, int $expirationHours = 24): array
    {
        $user = $this->userService->findUserByEmailOrPhone($login);
        
        if (!$user) {
            throw ValidationException::withMessages([
                'login' => ['User not found'],
            ]);
        }

        $loginToken = $user->generateLoginToken($expirationHours);

        return [
            'user' => $user,
            'login_token' => $loginToken,
            'expires_at' => $user->login_token_expires_at,
        ];
    }

    /**
     * Login with token
     *
     * @param string $token
     * @return array
     */
    public function loginWithToken(string $token): array
    {
        $user = User::where('login_token', $token)->first();

        if (!$user || !$user->isValidLoginToken($token)) {
            throw ValidationException::withMessages([
                'token' => ['Invalid or expired login token'],
            ]);
        }

        // Clear the login token after successful use
        $user->clearLoginToken();

        // Create API token for the session
        $tokenResult = $user->createToken('api-token');
        $apiToken = $tokenResult->plainTextToken;

        return [
            'user' => $user,
            'token' => $apiToken,
            'expires_in' => config('sanctum.expiration'),
        ];
    }
}
