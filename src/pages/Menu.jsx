import React, { useState } from "react";
import FormularioPAS from "../components/FormularioPAS";
import FormularioPsicoterapia from "../components/FormularioPsicoterapia";

export default function Menu() {
  const [screen, setScreen] = useState("menu");

  return (
     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-10">

        {screen === "menu" && (
          <div className="space-y-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Escolha o tipo de relatório
            </h1>

            <div className="flex flex-col gap-6 mt-6">
              <button
                onClick={() => setScreen("pas")}
                className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
              >
                Relatório PAS
              </button>

              <button
                onClick={() => setScreen("psicoterapia")}
                className="bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
              >
                Psicoterapia Individual / sessão rotina
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

      </div>
    </div>
  );
}