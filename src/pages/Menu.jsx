import React, { useState } from "react";
import FormularioPAS from "../components/FormularioPAS";
import FormularioPsicoterapia from "../components/FormularioPsicoterapia";
import Mensalidades from "../components/Mensalidades";

export default function Menu() {
  const [screen, setScreen] = useState("menu");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-10">

        {screen === "menu" && (
          <div className="space-y-8 text-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Centro de Recuperação Átrio</h1>
              <p className="text-sm text-gray-400 mt-1">Sistema de Gestão</p>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <button
                onClick={() => setScreen("pas")}
                className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
              >
                📋 Relatório PAS
              </button>

              <button
                onClick={() => setScreen("psicoterapia")}
                className="bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-medium"
              >
                🧠 Psicoterapia Individual / Sessão Rotina
              </button>

              <button
                onClick={() => setScreen("mensalidades")}
                className="bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-700 transition font-medium"
              >
                💰 Controle de Mensalidades
              </button>
            </div>
          </div>
        )}

        {screen === "pas" && (
          <FormularioPAS onBack={() => setScreen("menu")} />
        )}

        {screen === "psicoterapia" && (
          <FormularioPsicoterapia onBack={() => setScreen("menu")} />
        )}

        {screen === "mensalidades" && (
          <Mensalidades onBack={() => setScreen("menu")} />
        )}

      </div>
    </div>
  );
}
