<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TokenAuthenticationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a test user
        $this->user = User::factory()->create([
            'email' => 'test@example.com',
            'phone_number' => '0987654321',
            'first_name' => 'Test',
            'last_name' => 'User',
        ]);
    }

    /** @test */
    public function it_can_generate_login_token_with_email()
    {
        $response = $this->postJson('/api/generate-login-token', [
            'login' => $this->user->email,
            'expiration_hours' => 24
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'user' => ['id', 'name', 'email', 'first_name', 'last_name'],
                    'login_token',
                    'expires_at'
                ]);

        // Check if token was saved to database
        $this->user->refresh();
        $this->assertNotNull($this->user->login_token);
        $this->assertNotNull($this->user->login_token_expires_at);
    }

    /** @test */
    public function it_can_generate_login_token_with_phone()
    {
        $response = $this->postJson('/api/generate-login-token', [
            'login' => $this->user->phone_number,
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'user',
                    'login_token',
                    'expires_at'
                ]);
    }

    /** @test */
    public function it_fails_to_generate_token_for_nonexistent_user()
    {
        $response = $this->postJson('/api/generate-login-token', [
            'login' => 'nonexistent@example.com',
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['login']);
    }

    /** @test */
    public function it_can_login_with_valid_token()
    {
        // Generate a token first
        $token = $this->user->generateLoginToken(24);

        $response = $this->postJson('/api/login-with-token', [
            'token' => $token
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'user',
                    'token'
                ]);

        // Check if login token was cleared after use
        $this->user->refresh();
        $this->assertNull($this->user->login_token);
        $this->assertNull($this->user->login_token_expires_at);
    }

    /** @test */
    public function it_fails_to_login_with_invalid_token()
    {
        $response = $this->postJson('/api/login-with-token', [
            'token' => 'invalid-token'
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['token']);
    }

    /** @test */
    public function it_fails_to_login_with_expired_token()
    {
        // Generate a token that expires in the past
        $token = $this->user->generateLoginToken(24);
        
        // Manually set expiration to past
        $this->user->update([
            'login_token_expires_at' => now()->subHour()
        ]);

        $response = $this->postJson('/api/login-with-token', [
            'token' => $token
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['token']);
    }

    /** @test */
    public function it_validates_required_fields_for_generate_token()
    {
        $response = $this->postJson('/api/generate-login-token', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['login']);
    }

    /** @test */
    public function it_validates_required_fields_for_login_with_token()
    {
        $response = $this->postJson('/api/login-with-token', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['token']);
    }

    /** @test */
    public function it_validates_expiration_hours_range()
    {
        // Test minimum value
        $response = $this->postJson('/api/generate-login-token', [
            'login' => $this->user->email,
            'expiration_hours' => 0
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['expiration_hours']);

        // Test maximum value
        $response = $this->postJson('/api/generate-login-token', [
            'login' => $this->user->email,
            'expiration_hours' => 200 // More than 168 (7 days)
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['expiration_hours']);
    }

    /** @test */
    public function token_is_unique_and_secure()
    {
        $token1 = $this->user->generateLoginToken(24);
        
        $user2 = User::factory()->create();
        $token2 = $user2->generateLoginToken(24);

        $this->assertNotEquals($token1, $token2);
        $this->assertEquals(64, strlen($token1)); // 32 bytes = 64 hex characters
        $this->assertEquals(64, strlen($token2));
    }
}