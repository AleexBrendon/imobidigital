import { useEffect, useRef, useState } from "react";
import { Building2, MessageCircle, Send, X } from "lucide-react";
import { sendBotMessage } from "../../services/botService";

type PropertyItem = {
  id: number;
  title?: string;
  name?: string;
  address?: string;
  location?: string;
  price?: number | string;
  status?: string;
};

type BotMetadata = {
  options?: string[];
  type?: string;
  available_properties?: PropertyItem[];
  contract_properties?: PropertyItem[];
};

type BotMessage = {
  sender: "user" | "bot";
  message: string;
  metadata?: BotMetadata;
};

type PropertyListProps = {
  title: string;
  properties: PropertyItem[];
};

function PropertyList({ title, properties }: PropertyListProps) {
  if (!properties.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
      <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className="rounded-2xl border border-white/10 bg-slate-950/10 p-3"
          >
            <div className="text-sm font-medium text-slate-100">
              {property.title || property.name || "Imóvel"}
            </div>
            {(property.address || property.location) && (
              <div className="text-xs text-slate-400">
                {property.address || property.location}
              </div>
            )}
            {property.price !== undefined && (
              <div className="text-xs text-slate-300">
                {typeof property.price === "number"
                  ? property.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                  : property.price}
              </div>
            )}
            {property.status && (
              <div className="text-xs text-cyan-200">{property.status}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PublicBotWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      sender: "bot",
      message: "Olá! Informe seu CPF para iniciar o atendimento.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "ask_document" | "client_phone" | "client_email" | string
  >("ask_document");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  function onlyNumbers(value: string) {
    return value.replace(/\D/g, "");
  }

  function maskCpfCnpj(value: string) {
    const numbers = onlyNumbers(value).slice(0, 14);

    // CPF
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
    }

    // CNPJ
    return numbers
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  function maskPhone(value: string) {
    const numbers = onlyNumbers(value).slice(0, 11);

    return numbers
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = e.target.value;

    if (currentStep === "ask_document") {
      setInput(maskCpfCnpj(value));
      return;
    }

    if (currentStep === "client_phone") {
      setInput(maskPhone(value));
      return;
    }

    setInput(value);
  }

  async function handleSend(customMessage?: string) {
    const text = customMessage || input;

    if (!text.trim() || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        message: text,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const data = await sendBotMessage(text, conversationId);

      setConversationId(data.conversation_id);
      setCurrentStep(data.current_step);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          message: data.message,
          metadata: data.metadata,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          message:
            "Não consegui processar sua mensagem agora. Tente novamente em alguns instantes.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function resetConversation() {
    setConversationId(null);
    setMessages([
      {
        sender: "bot",
        message: "Olá! Informe seu CPF para iniciar o atendimento.",
      },
    ]);
    setInput("");
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  const lastBotMessage = [...messages]
    .reverse()
    .find((item) => item.sender === "bot");

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed bottom-6 right-6 z-50
            flex h-14 w-14 items-center justify-center
            rounded-full bg-cyan-400 text-slate-950
            shadow-[0_20px_45px_rgba(34,211,238,.35)]
            transition hover:scale-105 hover:bg-cyan-300
          "
        >
          <MessageCircle size={26} />
        </button>
      )}

      {open && (
        <div
          className="
            fixed bottom-6 right-6 z-50
            flex h-[560px] w-[370px] flex-col
            overflow-hidden rounded-3xl
            border border-white/10
            bg-[#0f1725]
            shadow-[0_30px_90px_rgba(0,0,0,.55)]
          "
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                <Building2 size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-white">ImobiDigital Bot</h3>
                <p className="text-xs text-slate-400">Atendimento público</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetConversation}
                className="rounded-full px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white"
              >
                Reiniciar
              </button>

              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((item, index) => (
              <div key={index} className="space-y-2">
                <div
                  className={`
                    max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2 text-sm leading-relaxed
                    ${item.sender === "bot"
                      ? "bg-white/10 text-slate-100"
                      : "ml-auto bg-cyan-400 text-slate-950"
                    }
                  `}
                >
                  {item.message}
                </div>

                {item.sender === "bot" &&
                  item.metadata?.type === "properties" && (
                    <div className="space-y-3">
                      <PropertyList
                        title="Imóveis disponíveis"
                        properties={item.metadata.available_properties || []}
                      />

                      <PropertyList
                        title="Seus imóveis com contrato"
                        properties={item.metadata.contract_properties || []}
                      />
                    </div>
                  )}
              </div>
            ))}

            {loading && (
              <div className="max-w-[70%] rounded-2xl bg-white/10 px-4 py-2 text-sm text-slate-300">
                Digitando...
              </div>
            )}

            {lastBotMessage?.metadata?.options && !loading && (
              <div className="space-y-2">
                {lastBotMessage.metadata.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSend(option)}
                    className="
                      block w-full rounded-xl
                      border border-white/10
                      bg-white/[0.03]
                      px-3 py-2
                      text-left text-sm text-slate-200
                      transition hover:bg-white/10
                    "
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              disabled={loading}
              placeholder={
                currentStep === "ask_document"
                  ? "Digite seu CPF ou CNPJ"
                  : currentStep === "client_phone"
                    ? "Digite seu telefone"
                    : currentStep === "client_email"
                      ? "Digite seu e-mail"
                      : "Digite sua mensagem..."
              }
              className="
                flex-1 rounded-xl
                border border-white/10
                bg-white/5
                px-3 py-2
                text-sm text-white
                outline-none
                placeholder:text-slate-500
                disabled:cursor-not-allowed disabled:opacity-50
              "
            />

            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="
                rounded-xl bg-cyan-400 px-3
                text-slate-950 transition hover:bg-cyan-300
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}