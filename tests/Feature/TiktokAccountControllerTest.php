<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\TiktokAccount;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TiktokAccountControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /** @test */
    public function it_can_list_tiktok_accounts()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/tiktok-accounts');

        $response->assertStatus(200);
    }

    /** @test */
    public function it_can_create_tiktok_account()
    {
        $this->actingAs($this->user);

        $data = [
            'username' => 'testuser123',
            'email' => 'test@example.com',
            'password' => 'password123',
            'status' => 'active',
        ];

        $response = $this->postJson('/api/tiktok-accounts', $data);

        $response->assertStatus(201);
        $this->assertDatabaseHas('tiktok_accounts', [
            'username' => 'testuser123',
            'email' => 'test@example.com',
        ]);
    }

    /** @test */
    public function it_can_show_tiktok_account()
    {
        $this->actingAs($this->user);

        $tiktokAccount = TiktokAccount::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $response = $this->getJson("/api/tiktok-accounts/{$tiktokAccount->id}");

        $response->assertStatus(200);
    }
}
