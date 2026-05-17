import React, { useState, useMemo } from "react";

// ── Helpers ────────────────────────────────────────────────────────────────
const hoje = () => new Date().toISOString().split("T")[0];

const diasParaVencer = (dataVenc) => {
  if (!dataVenc) return null;
  const diff = (new Date(dataVenc) - new Date(hoje())) / (1000 * 60 * 60 * 24);
  return Math.ceil(diff);
};

const statusFatura = (fatura) => {
  if (fatura.pago) return "pago";
  const dias = diasParaVencer(fatura.vencimento);
  if (dias === null) return "sem_data";
  if (dias < 0) return "vencida";
  if (dias <= 5) return "urgente";
  return "ok";
};

const STATUS_CONFIG = {
  pago:     { label: "Pago",      cor: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  ok:       { label: "Em dia",    cor: "bg-blue-100 text-blue-700 border-blue-200" },
  urgente:  { label: "Vence em breve", cor: "bg-amber-100 text-amber-700 border-amber-200" },
  vencida:  { label: "Vencida",   cor: "bg-red-100 text-red-700 border-red-200" },
  sem_data: { label: "Sem data",  cor: "bg-gray-100 text-gray-500 border-gray-200" },
};

const fmtData = (d) => {
  if (!d) return "—";
  const [y, m, dia] = d.split("-");
  return `${dia}/${m}/${y}`;
};

const fmtMoeda = (v) =>
  Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const novoAluno = () => ({
  id: Date.now(),
  nome: "",
  cpf: "",
  dataNasc: "",
  turma: "",
  responsavel: {
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    parentesco: "",
  },
  faturas: [],
});

const novaFatura = (diaVenc) => ({
  id: Date.now() + Math.random(),
  descricao: "Mensalidade",
  valor: "",
  vencimento: diaVenc || "",
  pago: false,
  dataPagamento: "",
});

// ── Componentes utilitários ────────────────────────────────────────────────
const Input = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{label}</label>}
    <input
      {...props}
      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent bg-white placeholder-gray-300"
    />
  </div>
);

const Badge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.sem_data;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.cor}`}>
      {cfg.label}
    </span>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

// ── Tela: Lista de Alunos ──────────────────────────────────────────────────
function ListaAlunos({ alunos, onSelecionar, onNovo, onBack }) {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const lista = useMemo(() => {
    return alunos.filter((a) => {
      const matchBusca =
        a.nome.toLowerCase().includes(busca.toLowerCase()) ||
        a.responsavel.nome.toLowerCase().includes(busca.toLowerCase());

      if (!matchBusca) return false;
      if (filtroStatus === "todos") return true;

      const ultimaFatura = a.faturas[a.faturas.length - 1];
      if (!ultimaFatura) return filtroStatus === "sem_data";
      return statusFatura(ultimaFatura) === filtroStatus;
    });
  }, [alunos, busca, filtroStatus]);

  // Resumo geral
  const resumo = useMemo(() => {
    let vencidas = 0, urgentes = 0, pagas = 0, emDia = 0;
    alunos.forEach((a) => {
      const f = a.faturas[a.faturas.length - 1];
      if (!f) return;
      const s = statusFatura(f);
      if (s === "vencida") vencidas++;
      else if (s === "urgente") urgentes++;
      else if (s === "pago") pagas++;
      else if (s === "ok") emDia++;
    });
    return { vencidas, urgentes, pagas, emDia };
  }, [alunos]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button onClick={onBack} className="text-xs text-gray-400 hover:text-gray-700 mb-1 block transition">
            ← Voltar ao menu
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Controle de Mensalidades</h1>
          <p className="text-sm text-gray-500">{alunos.length} alunos cadastrados</p>
        </div>
        <button
          onClick={onNovo}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition"
        >
          + Novo Aluno
        </button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Vencidas",    valor: resumo.vencidas,  cor: "border-l-red-400",     bg: "bg-red-50" },
          { label: "Vence em breve", valor: resumo.urgentes, cor: "border-l-amber-400", bg: "bg-amber-50" },
          { label: "Em dia",      valor: resumo.emDia,     cor: "border-l-blue-400",    bg: "bg-blue-50" },
          { label: "Pagas",       valor: resumo.pagas,     cor: "border-l-emerald-400", bg: "bg-emerald-50" },
        ].map((r) => (
          <div key={r.label} className={`${r.bg} border-l-4 ${r.cor} rounded-xl p-4`}>
            <p className="text-2xl font-bold text-gray-800">{r.valor}</p>
            <p className="text-xs text-gray-500 mt-0.5">{r.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          placeholder="Buscar aluno ou responsável..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 bg-white"
        />
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 bg-white"
        >
          <option value="todos">Todos os status</option>
          <option value="vencida">Vencidas</option>
          <option value="urgente">Vence em breve</option>
          <option value="ok">Em dia</option>
          <option value="pago">Pagas</option>
        </select>
      </div>

      {/* Lista */}
      {lista.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-4xl mb-3">🎓</p>
          <p className="text-gray-500 text-sm">Nenhum aluno encontrado.</p>
          <button onClick={onNovo} className="mt-4 text-sm text-gray-800 font-medium underline">
            Cadastrar primeiro aluno
          </button>
        </Card>
      ) : (
        <div className="space-y-3">
          {lista.map((aluno) => {
            const ultima = aluno.faturas[aluno.faturas.length - 1];
            const st = ultima ? statusFatura(ultima) : "sem_data";
            const dias = ultima ? diasParaVencer(ultima.vencimento) : null;

            return (
              <Card key={aluno.id}>
                <button
                  onClick={() => onSelecionar(aluno.id)}
                  className="w-full text-left p-4 hover:bg-gray-50 rounded-2xl transition"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {aluno.nome ? aluno.nome[0].toUpperCase() : "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{aluno.nome || "Sem nome"}</p>
                        <p className="text-xs text-gray-400 truncate">
                          Resp.: {aluno.responsavel.nome || "—"} · {aluno.turma || "Sem turma"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge status={st} />
                      {ultima && !ultima.pago && dias !== null && (
                        <p className="text-xs text-gray-400">
                          {dias < 0
                            ? `Venceu há ${Math.abs(dias)} dia(s)`
                            : dias === 0
                            ? "Vence hoje"
                            : `Vence em ${dias} dia(s)`}
                        </p>
                      )}
                      {ultima && (
                        <p className="text-xs font-medium text-gray-600">{fmtMoeda(ultima.valor)}</p>
                      )}
                    </div>
                  </div>
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Tela: Detalhe do Aluno ─────────────────────────────────────────────────
function DetalheAluno({ aluno, onChange, onVoltar }) {
  const [aba, setAba] = useState("dados");
  const [editando, setEditando] = useState(!aluno.nome);

  const update = (campo, valor) => onChange({ ...aluno, [campo]: valor });
  const updateResp = (campo, valor) =>
    onChange({ ...aluno, responsavel: { ...aluno.responsavel, [campo]: valor } });

  const adicionarFatura = () => {
    const faturas = [...aluno.faturas, novaFatura()];
    onChange({ ...aluno, faturas });
  };

  const updateFatura = (id, campo, valor) => {
    const faturas = aluno.faturas.map((f) =>
      f.id === id ? { ...f, [campo]: valor } : f
    );
    onChange({ ...aluno, faturas });
  };

  const marcarPago = (id) => {
    const faturas = aluno.faturas.map((f) =>
      f.id === id ? { ...f, pago: !f.pago, dataPagamento: !f.pago ? hoje() : "" } : f
    );
    onChange({ ...aluno, faturas });
  };

  const excluirFatura = (id) => {
    onChange({ ...aluno, faturas: aluno.faturas.filter((f) => f.id !== id) });
  };

  const totalDevido = aluno.faturas
    .filter((f) => !f.pago)
    .reduce((acc, f) => acc + Number(f.valor || 0), 0);

  const totalPago = aluno.faturas
    .filter((f) => f.pago)
    .reduce((acc, f) => acc + Number(f.valor || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onVoltar} className="text-gray-400 hover:text-gray-700 transition text-xl">←</button>
          <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
            {aluno.nome ? aluno.nome[0].toUpperCase() : "?"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{aluno.nome || "Novo Aluno"}</h2>
            <p className="text-xs text-gray-400">{aluno.turma || "Sem turma"}</p>
          </div>
        </div>
        <button
          onClick={() => setEditando(!editando)}
          className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
        >
          {editando ? "✓ Salvar" : "✏ Editar"}
        </button>
      </div>

      {/* Abas */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {[["dados", "👤 Dados"], ["responsavel", "🤝 Responsável"], ["faturas", "💰 Mensalidades"]].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setAba(k)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              aba === k ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Aba: Dados do Aluno */}
      {aba === "dados" && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Dados do Aluno</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nome completo" value={aluno.nome} disabled={!editando}
              onChange={(e) => update("nome", e.target.value)} placeholder="Nome do aluno" />
            <Input label="CPF" value={aluno.cpf} disabled={!editando}
              onChange={(e) => update("cpf", e.target.value)} placeholder="000.000.000-00" />
            <Input label="Data de Nascimento" type="date" value={aluno.dataNasc} disabled={!editando}
              onChange={(e) => update("dataNasc", e.target.value)} />
            <Input label="Turma / Série" value={aluno.turma} disabled={!editando}
              onChange={(e) => update("turma", e.target.value)} placeholder="Ex: 3º Ano A" />
          </div>
        </Card>
      )}

      {/* Aba: Responsável */}
      {aba === "responsavel" && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Responsável Financeiro</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nome do Responsável" value={aluno.responsavel.nome} disabled={!editando}
              onChange={(e) => updateResp("nome", e.target.value)} placeholder="Nome completo" />
            <Input label="Parentesco" value={aluno.responsavel.parentesco} disabled={!editando}
              onChange={(e) => updateResp("parentesco", e.target.value)} placeholder="Ex: Mãe, Pai, Avó..." />
            <Input label="CPF" value={aluno.responsavel.cpf} disabled={!editando}
              onChange={(e) => updateResp("cpf", e.target.value)} placeholder="000.000.000-00" />
            <Input label="Telefone / WhatsApp" value={aluno.responsavel.telefone} disabled={!editando}
              onChange={(e) => updateResp("telefone", e.target.value)} placeholder="(00) 00000-0000" />
            <div className="sm:col-span-2">
              <Input label="E-mail" value={aluno.responsavel.email} disabled={!editando}
                onChange={(e) => updateResp("email", e.target.value)} placeholder="email@exemplo.com" />
            </div>
          </div>
        </Card>
      )}

      {/* Aba: Mensalidades */}
      {aba === "faturas" && (
        <div className="space-y-4">
          {/* Resumo financeiro */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="text-xs text-red-500 font-medium uppercase tracking-wide">Em aberto</p>
              <p className="text-xl font-bold text-red-700 mt-1">{fmtMoeda(totalDevido)}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Total pago</p>
              <p className="text-xl font-bold text-emerald-700 mt-1">{fmtMoeda(totalPago)}</p>
            </div>
          </div>

          {/* Lista de faturas */}
          {aluno.faturas.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-3xl mb-2">🧾</p>
              <p className="text-sm text-gray-400">Nenhuma mensalidade cadastrada.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {aluno.faturas.map((f) => {
                const st = statusFatura(f);
                const dias = diasParaVencer(f.vencimento);
                return (
                  <Card key={f.id} className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge status={st} />
                          {!f.pago && dias !== null && (
                            <span className={`text-xs ${dias < 0 ? "text-red-500 font-semibold" : "text-gray-400"}`}>
                              {dias < 0 ? `Venceu há ${Math.abs(dias)} dia(s)` : dias === 0 ? "Vence hoje!" : `Vence em ${dias} dia(s)`}
                            </span>
                          )}
                          {f.pago && f.dataPagamento && (
                            <span className="text-xs text-gray-400">Pago em {fmtData(f.dataPagamento)}</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <Input label="Descrição" value={f.descricao}
                            onChange={(e) => updateFatura(f.id, "descricao", e.target.value)}
                            placeholder="Mensalidade" />
                          <Input label="Valor (R$)" type="number" value={f.valor}
                            onChange={(e) => updateFatura(f.id, "valor", e.target.value)}
                            placeholder="0,00" />
                          <Input label="Vencimento" type="date" value={f.vencimento}
                            onChange={(e) => updateFatura(f.id, "vencimento", e.target.value)} />
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <button
                          onClick={() => marcarPago(f.id)}
                          className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs font-medium transition ${
                            f.pago
                              ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              : "bg-emerald-600 text-white hover:bg-emerald-700"
                          }`}
                        >
                          {f.pago ? "↩ Desfazer" : "✓ Marcar pago"}
                        </button>
                        <button
                          onClick={() => excluirFatura(f.id)}
                          className="flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 border border-red-100 transition"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          <button
            onClick={adicionarFatura}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition"
          >
            + Adicionar mensalidade
          </button>
        </div>
      )}
    </div>
  );
}

// ── App Principal ──────────────────────────────────────────────────────────
export default function Mensalidades({ onBack }) {
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState(null);

  const alunoAtual = alunos.find((a) => a.id === alunoSelecionadoId);

  const handleNovoAluno = () => {
    const a = novoAluno();
    setAlunos((prev) => [...prev, a]);
    setAlunoSelecionadoId(a.id);
  };

  const handleChangeAluno = (alunoAtualizado) => {
    setAlunos((prev) =>
      prev.map((a) => (a.id === alunoAtualizado.id ? alunoAtualizado : a))
    );
  };

  if (alunoAtual) {
    return (
      <DetalheAluno
        aluno={alunoAtual}
        onChange={handleChangeAluno}
        onVoltar={() => setAlunoSelecionadoId(null)}
      />
    );
  }

  return (
    <ListaAlunos
      alunos={alunos}
      onSelecionar={setAlunoSelecionadoId}
      onNovo={handleNovoAluno}
      onBack={onBack}
    />
  );
}
