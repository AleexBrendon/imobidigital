<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Client;
use App\Models\Document;
use App\Models\Property;
use App\Models\BotMessage;
use App\Models\BotConversation;
use App\Models\PublicBotNotification;
use Illuminate\Http\Request;

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
            "Olá! Você está falando com {$company->name}. Informe seu CPF ou CNPJ para iniciar o atendimento."
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
            ? BotConversation::where('company_id', $company->id)->findOrFail($request->conversation_id)
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
            'client_email' => $this->handleClientEmail($conversation, $message),
            'client_phone' => $this->handleClientPhone($conversation, $message),
            'menu' => $this->handleMenu($conversation, $message),
            'document_type' => $this->handleDocumentType($conversation, $message),
            default => $this->showMenu($conversation),
        };
    }

    private function handleDocument(BotConversation $conversation, string $message)
    {
        $documentNumbers = preg_replace('/\D/', '', $message);

        if (!in_array(strlen($documentNumbers), [11, 14])) {
            return $this->botReply(
                $conversation,
                'Documento inválido. Informe um CPF com 11 números ou CNPJ com 14 números.'
            );
        }

        $document = $this->formatCpfCnpj($documentNumbers);

        $client = Client::where('company_id', $conversation->company_id)
            ->where(function ($query) use ($document, $documentNumbers) {
                $query
                    ->where('document', $document)
                    ->orWhere('document', $documentNumbers)
                    ->orWhereRaw("REPLACE(REPLACE(REPLACE(REPLACE(document, '.', ''), '-', ''), '/', ''), ' ', '') = ?", [
                        $documentNumbers,
                    ]);
            })
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
        if (strlen($message) < 3) {
            return $this->botReply(
                $conversation,
                'Nome inválido. Informe seu nome completo.'
            );
        }

        $payload = $conversation->payload ?? [];
        $payload['name'] = trim($message);

        $conversation->update([
            'current_step' => 'client_email',
            'payload' => $payload,
        ]);

        return $this->botReply(
            $conversation,
            'Perfeito. Agora informe seu e-mail.'
        );
    }

    private function handleClientEmail(BotConversation $conversation, string $message)
    {
        $email = trim($message);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->botReply(
                $conversation,
                'E-mail inválido. Informe um e-mail válido.'
            );
        }

        $payload = $conversation->payload ?? [];
        $payload['email'] = $email;

        $conversation->update([
            'current_step' => 'client_phone',
            'payload' => $payload,
        ]);

        return $this->botReply(
            $conversation,
            'Ótimo. Agora informe seu telefone com DDD. Exemplo: (11) 99999-9999.'
        );
    }

    private function handleClientPhone(BotConversation $conversation, string $message)
    {
        $phoneNumbers = preg_replace('/\D/', '', $message);

        if (strlen($phoneNumbers) !== 11) {
            return $this->botReply(
                $conversation,
                'Telefone inválido. Informe no formato (xx) xxxxx-xxxx.'
            );
        }

        $payload = $conversation->payload ?? [];
        $payload['phone'] = $this->formatPhone($phoneNumbers);

        $client = Client::create([
            'company_id' => $conversation->company_id,
            'name' => $payload['name'],
            'email' => $payload['email'],
            'document' => $payload['document'],
            'phone' => $payload['phone'],
            'status' => 'Ativo',
        ]);

        $conversation->update([
            'client_id' => $client->id,
            'company_id' => $client->company_id,
            'current_step' => 'menu',
            'payload' => [],
        ]);

        PublicBotNotification::create([
            'company_id' => $client->company_id,
            'client_id' => $client->id,
            'conversation_id' => $conversation->id,
            'category' => 'cadastro',
            'title' => 'Novo cadastro pelo bot',
            'message' => "{$client->name} realizou um cadastro pelo atendimento público.",
            'data' => [
                'name' => $client->name,
                'email' => $client->email,
                'phone' => $client->phone,
                'document' => $client->document,
                'status' => $client->status,
            ],
            'read' => false,
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

    private function formatPhone(string $phone): string
    {
        return preg_replace(
            '/^(\d{2})(\d{5})(\d{4})$/',
            '($1) $2-$3',
            $phone
        );
    }

    private function formatCpfCnpj(string $document): string
    {
        if (strlen($document) === 11) {
            return preg_replace(
                '/^(\d{3})(\d{3})(\d{3})(\d{2})$/',
                '$1.$2.$3-$4',
                $document
            );
        }

        return preg_replace(
            '/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/',
            '$1.$2.$3/$4-$5',
            $document
        );
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
            'current_step' => $conversation->current_step,
            'message' => $message,
            'metadata' => $metadata,
        ]);
    }
}
