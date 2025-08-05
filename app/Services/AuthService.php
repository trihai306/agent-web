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

        $token = $user->createToken('api-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
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
        $token = $user->createToken('api-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function logout(): void
    {
        Auth::user()->currentAccessToken()->delete();
    }

    public function getProfile(): User
    {
        return Auth::user();
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
}
