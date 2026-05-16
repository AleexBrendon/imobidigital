<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Client;
use App\Models\Document;
use App\Models\Property;
use App\Models\BotMessage;
use App\Models\BotConversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BotController extends Controller
{
    public function start(Request $request)
    {
        $request->validate([
            'company_name' => ['required', 'exists:companies,name'],
        ]);

        $company = Company::where('name', $request->company_name)->firstOrFail();

        $conversation = BotConversation::create([
            'company_id' => $company->id,
            'status' => 'open',
            'current_step' => 'ask_document',
            'payload' => [],
        ]);

        return $this->botReply(
            $conversation,
            "Olá! Você está falando com {$company->name}. Informe seu CPF para iniciar o atendimento."
        );
    }

    public function message(Request $request)
    {
        $request->validate([
            'company_name' => ['required', 'exists:companies,name'],
            'conversation_id' => ['nullable', 'exists:bot_conversations,id'],
            'message' => ['required', 'string'],
        ]);

        $company = Company::where('name', $request->company_name)->firstOrFail();

        $conversation = $request->conversation_id
            ? BotConversation::where('company_id', $company->id)
            ->findOrFail($request->conversation_id)
            : BotConversation::create([
                'company_id' => $company->id,
                'status' => 'open',
                'current_step' => 'ask_document',
                'payload' => [],
            ]);

        $message = trim($request->message);

        BotMessage::create([
            'bot_conversation_id' => $conversation->id,
            'sender' => 'user',
            'message' => $message,
        ]);

        return match ($conversation->current_step) {
            'ask_document' => $this->handleDocument($conversation, $message),
            'client_name' => $this->handleClientName($conversation, $message),
            'client_phone' => $this->handleClientPhone($conversation, $message),
            'menu' => $this->handleMenu($conversation, $message),
            'document_type' => $this->handleDocumentType($conversation, $message),
            default => $this->showMenu($conversation),
        };
    }

    private function handleDocument(BotConversation $conversation, string $message)
    {
        $document = preg_replace('/\D/', '', $message);

        if (strlen($document) !== 11) {
            return $this->botReply(
                $conversation,
                'CPF inválido. Informe um CPF com 11 números.'
            );
        }

        $client = Client::where('company_id', $conversation->company_id)
            ->where('document', $document)
            ->first();

        if (!$client) {
            $conversation->update([
                'document' => $document,
                'current_step' => 'client_name',
                'payload' => [
                    'document' => $document,
                ],
            ]);

            return $this->botReply(
                $conversation,
                'Não encontrei seu cadastro. Vamos criar agora. Qual é o seu nome completo?'
            );
        }

        $conversation->update([
            'client_id' => $client->id,
            'company_id' => $client->company_id,
            'document' => $document,
            'current_step' => 'menu',
            'payload' => [],
        ]);

        return $this->botReply(
            $conversation,
            "Olá, {$client->name}! Como posso ajudar?",
            $this->menuOptions()
        );
    }

    private function handleClientName(BotConversation $conversation, string $message)
    {
        $payload = $conversation->payload ?? [];
        $payload['name'] = $message;

        $conversation->update([
            'current_step' => 'client_phone',
            'payload' => $payload,
        ]);

        return $this->botReply(
            $conversation,
            'Perfeito. Agora informe seu telefone.'
        );
    }

    private function handleClientPhone(BotConversation $conversation, string $message)
    {
        $payload = $conversation->payload ?? [];
        $payload['phone'] = $message;

        $client = Client::create([
            'company_id' => $conversation->company_id,
            'name' => $payload['name'],
            'document' => $payload['document'],
            'phone' => $payload['phone'],
            'status' => 'Novo lead',
        ]);

        $conversation->update([
            'client_id' => $client->id,
            'company_id' => $client->company_id,
            'current_step' => 'menu',
            'payload' => [],
        ]);

        return $this->botReply(
            $conversation,
            "Cadastro realizado com sucesso, {$client->name}! Como posso ajudar?",
            $this->menuOptions()
        );
    }

    private function handleMenu(BotConversation $conversation, string $message)
    {
        $text = mb_strtolower($message);

        if (str_contains($text, 'imóveis') || str_contains($text, 'imoveis')) {
            return $this->showProperties($conversation);
        }

        if (str_contains($text, 'documento')) {
            $conversation->update([
                'current_step' => 'document_type',
                'payload' => [],
            ]);

            return $this->botReply(
                $conversation,
                'Qual tipo de documento você deseja enviar? Exemplo: RG, CPF, Comprovante de renda, Comprovante de residência.'
            );
        }

        if (str_contains($text, 'atendente')) {
            $conversation->update([
                'status' => 'human',
                'current_step' => 'menu',
            ]);

            return $this->botReply(
                $conversation,
                'Certo. Um atendente irá continuar seu atendimento em breve.'
            );
        }

        return $this->showMenu($conversation);
    }

    private function handleDocumentType(BotConversation $conversation, string $message)
    {
        $conversation->update([
            'current_step' => 'menu',
            'payload' => [
                'document_type' => $message,
            ],
        ]);

        return $this->botReply(
            $conversation,
            'Certo. Agora envie o arquivo pelo botão de upload.'
        );
    }

    public function uploadDocument(Request $request)
    {
        $request->validate([
            'conversation_id' => ['required', 'exists:bot_conversations,id'],
            'file' => ['required', 'file', 'max:10240'],
        ]);

        $conversation = BotConversation::findOrFail($request->conversation_id);

        if (!$conversation->client_id) {
            return response()->json([
                'message' => 'Cliente não identificado.',
            ], 422);
        }

        $payload = $conversation->payload ?? [];
        $type = $payload['document_type'] ?? 'Documento';

        $file = $request->file('file');

        $path = $file->store('documents', 'public');

        Document::create([
            'company_id' => $conversation->company_id,
            'client_id' => $conversation->client_id,
            'name' => $file->getClientOriginalName(),
            'type' => $type,
            'status' => 'Pendente',
            'file_path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        $conversation->update([
            'current_step' => 'menu',
            'payload' => [],
        ]);

        return $this->botReply(
            $conversation,
            'Documento enviado com sucesso! Nossa equipe irá analisar.'
        );
    }

    private function showProperties(BotConversation $conversation)
    {
        $client = $conversation->client;

        $availableProperties = Property::where('company_id', $conversation->company_id)
            ->where('status', 'Disponível')
            ->latest()
            ->limit(5)
            ->get();

        $contractProperties = collect();

        if ($client) {
            $contractProperties = Property::whereHas('contracts', function ($query) use ($client) {
                $query->where('client_id', $client->id);
            })->get();
        }

        return $this->botReply(
            $conversation,
            'Encontrei os imóveis para você.',
            [
                'type' => 'properties',
                'available_properties' => $availableProperties,
                'contract_properties' => $contractProperties,
                ...$this->menuOptions(),
            ]
        );
    }

    private function showMenu(BotConversation $conversation)
    {
        return $this->botReply(
            $conversation,
            'Escolha uma opção:',
            $this->menuOptions()
        );
    }

    private function menuOptions()
    {
        return [
            'options' => [
                'Ver imóveis',
                'Enviar documento',
                'Falar com atendente',
            ],
        ];
    }

    private function botReply(BotConversation $conversation, string $message, array $metadata = [])
    {
        BotMessage::create([
            'bot_conversation_id' => $conversation->id,
            'sender' => 'bot',
            'message' => $message,
            'metadata' => $metadata,
        ]);

        return response()->json([
            'conversation_id' => $conversation->id,
            'message' => $message,
            'metadata' => $metadata,
        ]);
    }
}
