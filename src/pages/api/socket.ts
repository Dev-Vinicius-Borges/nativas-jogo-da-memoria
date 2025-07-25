/* eslint-disable @typescript-eslint/no-explicit-any */
import { TPartida } from '@/utils/types/TPartida';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from "uuid";

const partidas: { [key: string]: TPartida } = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const socketServer = (res.socket as any).server;
  if (res.socket && !socketServer.io) {

    const io = new Server(socketServer, {
      path: '/api/socket',
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      socket.on("criarPartida", ({ colunas, linhas, cartas }) => {
        const partidaId = uuidv4();
        const partida = {
          id: partidaId,
          jogadores: [],
          cartasViradas: [],
          cartasEncontradas: [],
          turnoAtual: 0,
          configuracao: { colunas, linhas, cartas },
          status: { execucao: "aguardando", bloqueado: false },
          espectadores: []
        };

        partidas[partidaId] = partida;
        socket.join(partidaId);
        socket.emit("partidaCriada", { partidaId, partida });
      });

      socket.on("buscarPartida", ({ partidaId }) => {
        const partida = partidas[partidaId];
        if (!partida) {
          socket.emit("erro", { mensagem: "Partida não encontrada" });
          return;
        }
        socket.emit("partidaEncontrada", partida);
      });

      socket.on("entrarPartida", ({ partidaId, nomeJogador }) => {
        const partida = partidas[partidaId];
        if (!partida) {
          socket.emit("erro", { mensagem: "Partida não encontrada" });
          return;
        }

        if (partida.jogadores.length >= 2) {
          socket.emit("erro", { mensagem: "Partida cheia!" });
          return;
        }

        const jogadorExistente = partida.jogadores.find((jogador: { nome: string }) => jogador.nome === nomeJogador);
        if (jogadorExistente) {
          socket.emit("erro", { mensagem: "Nome de jogador já em uso nesta partida." });
          return;
        }

        const jogador = {
          id: socket.id,
          nome: nomeJogador,
          pontuacao: 0,
          conectado: true,
        };
        partida.jogadores.push(jogador);
        socket.join(partidaId);

        io.to(partidaId).emit("partidaAtualizada", partida);

        if (partida.jogadores.length === 2) {
          partida.status.execucao = "esperando jogadores";
          io.to(partidaId).emit("partidaAtualizada", partida);
        }
      });

      socket.on("entrarComoEspectador", ({ partidaId, nomeEspectador }) => {
        const partida = partidas[partidaId];
        if (!partida) {
          socket.emit("erro", { mensagem: "Partida não encontrada." });
          return;
        }

        const buscarNome = partida.espectadores.find((espectador: { nome: string }) => espectador.nome === nomeEspectador);
        if (buscarNome) {
          io.to(partidaId).emit("erro", { mensagem: "Escolha outro nome de usuário." });
        }

        partida.espectadores.push();
      });

      socket.on("virarCarta", ({ partidaId, indiceCarta }) => {
        const partida = partidas[partidaId];
        if (!partida) {
          socket.emit("erro", { mensagem: "Partida não encontrada" });
          return;
        }
        if (
          partida.cartasViradas.includes(indiceCarta) ||
          partida.cartasEncontradas.includes(indiceCarta)
        ) {
          io.to(partidaId).emit("erro", { mensagem: "Carta já virada" });
          return;
        }

        if (partida.status.bloqueado) return;

        partida.cartasViradas.push(indiceCarta);
        io.to(partidaId).emit("cartaVirada", { indiceCarta, jogadorId: socket.id });

        if (partida.cartasViradas.length === 2) {
          partida.status.bloqueado = true;
          setTimeout(() => {
            const [carta1, carta2] = partida.cartasViradas;
            const cartaObj1 = partida.configuracao.cartas[carta1];
            const cartaObj2 = partida.configuracao.cartas[carta2];

            if (cartaObj1.id === cartaObj2.id) {
              partida.cartasEncontradas.push(carta1, carta2);
              io.to(partidaId).emit("parEncontrado", {
                cartas: [carta1, carta2],
                jogadorId: socket.id,
              });

              const jogadorAtual = partida.jogadores.find((j: { id: string }) => j.id === socket.id);
              if (jogadorAtual) {
                jogadorAtual.pontuacao += 1;
              }
              partida.cartasViradas = [];

              if (partida.cartasEncontradas.length === partida.configuracao.cartas.length) {
                const [jogador1, jogador2] = partida.jogadores;
                if (jogador1.pontuacao > jogador2.pontuacao) {
                  io.to(partidaId).emit("fimDeJogo", jogador1);
                } else if (jogador1.pontuacao < jogador2.pontuacao) {
                  io.to(partidaId).emit("fimDeJogo", jogador2);
                } else {
                  io.to(partidaId).emit("fimDeJogo", "empate");
                }
              }
            } else {
              io.to(partidaId).emit("cartasVirarDeVolta", partida.cartasViradas);
              partida.cartasViradas = [];
              partida.turnoAtual = (partida.turnoAtual + 1) % partida.jogadores.length;
            }
            partida.status.bloqueado = false;

            io.to(partidaId).emit("partidaAtualizada", partida);
          }, 1000);
        } else {
          io.to(partidaId).emit("partidaAtualizada", partida);
        }
      });

      socket.on("disconnect", () => {
        for (const partidaId in partidas) {
          const partida = partidas[partidaId];
          const jogadorIndex = partida.jogadores.findIndex((jogador: { id: string }) => jogador.id === socket.id);
          if (jogadorIndex !== -1) {
            partida.jogadores.splice(jogadorIndex, 1);
            io.to(partidaId).emit("partidaAtualizada", partida);
            if (partida.jogadores.length === 0 && partida.espectadores.length === 0) {
              delete partidas[partidaId];
            }
            break;
          }
          const espectadorIndex = partida.espectadores.findIndex((e: { nome: string }) => e.nome === socket.id);
          if (espectadorIndex !== -1) {
            partida.espectadores.splice(espectadorIndex, 1);
            io.to(partidaId).emit("partidaAtualizada", partida);
            if (partida.jogadores.length === 0 && partida.espectadores.length === 0) {
              delete partidas[partidaId];
            }
            break;
          }
        }
      });
    });

    if (res.socket) {
      (res.socket as any).server.io = io;
    }
  } else {
    console.log('Socket.IO já está rodando');
  }
  res.end();
}

