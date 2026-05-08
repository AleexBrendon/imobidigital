<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Activity;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return User::where('company_id', auth()->user()->company_id)
            ->latest()
            ->get()
            ->map(fn ($user) => $this->formatUser($user));
    }

    public function store(Request $request)
    {
        abort_if(! auth()->user()->isAdmin(), 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'document' => ['nullable', 'string', 'max:50'],
            'role' => ['required', 'in:admin,corretor,usuario'],
            'password' => ['required', 'string', 'min:6'],
            'status' => ['sometimes', 'in:active,blocked'],
        ]);

        $user = User::create([
            'company_id' => auth()->user()->company_id,
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'document' => $data['document'] ?? null,
            'role' => $data['role'],
            'password' => Hash::make($data['password']),
            'status' => 'active',
        ]);

        $this->createUserActivity($user, 'Usuário adicionado', 'created');

        return response()->json($this->formatUser($user), 201);
    }

    public function update(Request $request, User $user)
    {
        abort_if(! auth()->user()->isAdmin(), 403);
        abort_if($user->company_id !== auth()->user()->company_id, 403);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:30'],
            'document' => ['nullable', 'string', 'max:50'],
            'role' => ['sometimes', 'in:admin,corretor,usuario'],
            'password' => ['nullable', 'string', 'min:6'],
            'status' => ['sometimes', 'in:active,blocked'],
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        $this->createUserActivity($user, 'Usuário atualizado', 'updated');

        return response()->json($this->formatUser($user));
    }

    public function destroy(User $user)
    {
        abort_if(! auth()->user()->isAdmin(), 403);
        abort_if($user->company_id !== auth()->user()->company_id, 403);

        $this->createUserActivity($user, 'Usuário excluído', 'deleted');

        $user->delete();

        return response()->json([
            'message' => 'Usuário removido com sucesso.',
        ]);
    }

    private function createUserActivity(User $subjectUser, string $title, string $type): void
    {
        Activity::create([
            'company_id' => auth()->user()->company_id,
            'user_id' => auth()->id(),
            'title' => $title,
            'description' => "{$title}: {$subjectUser->name}.",
            'type' => $type,
            'subject_type' => User::class,
            'subject_id' => $subjectUser->id,
            'properties' => [
                'user_id' => $subjectUser->id,
                'user_name' => $subjectUser->name,
            ],
        ]);
    }

    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'document' => $user->document,
            'role' => $user->role,
            'status' => $user->status,
            'avatar' => $user->id,
        ];
    }
}