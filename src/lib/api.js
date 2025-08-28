// src/lib/api.js

const BASE_URL = "http://localhost:5000"; // Sem "/api", pois o server.js não adiciona prefixo

// Buscar todos os quartos e transformar os dados
export async function getRooms() {
  try {
    const res = await fetch(`${BASE_URL}/rooms`);
    if (!res.ok) throw new Error("Erro ao buscar quartos: " + res.statusText);
    const rooms = await res.json();

    return rooms.map((r) => ({
      id: r.id, // Adicionando o ID
      number: Number(r.number),
      status: r.guestName ? "occupied" : "available",
      reminder: r.reminder ? { time: r.reminder } : null,
      guest: r.guestName
        ? {
            name: r.guestName,
            photoUrl: r.guestPhotoUrl || undefined,
            checkInDate: r.checkIn,
            checkOutDate: r.checkOut,
            notes: r.reminder || undefined,
          }
        : null,
    }));
  } catch (err) {
    console.error("Erro no getRooms:", err);
    throw err;
  }
}

// Fazer check-in de um quarto (atualizando os dados do hóspede)
export async function checkInRoom(roomId, guestData) {
  try {
    const res = await fetch(`${BASE_URL}/rooms/${roomId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guestData),
    });
    if (!res.ok) throw new Error("Erro ao fazer check-in do quarto: " + res.statusText);
    return res.json();
  } catch (err) {
    console.error("Erro no checkInRoom:", err);
    throw err;
  }
}

// Fazer check-out de um quarto
export async function checkoutRoom(number) {
  try {
    const res = await fetch(`${BASE_URL}/rooms/${number}/checkout`, {
      method: "PUT",
    });
    if (!res.ok) throw new Error("Erro ao fazer check-out do quarto: " + res.statusText);
    return res.json();
  } catch (err) {
    console.error("Erro no checkoutRoom:", err);
    throw err;
  }
}
