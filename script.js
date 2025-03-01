document.addEventListener("DOMContentLoaded", () => {

  Promise.all([
    fetch("vagas.json").then((res) => res.json()),
    fetch("banco.json").then((res) => res.json()),
  ])
    .then(([vagasData, bancoData]) => {
      // Renderiza os cartões para vagas e banco de talentos
      renderCards(
        vagasData.vagas,
        "vagas-container",
        "", 
        "Olá! Gostaria de tirar dúvidas sobre a vaga de:"
      );
      renderCards(
        bancoData.bancodetalentos,
        "banco-container",
        "banco-", // prefixo para diferenciar os IDs
        "Olá! Gostaria de tirar dúvidas sobre a vaga do banco de talentos:"
      );
    })
    .catch((error) =>
      console.error("Erro ao carregar os dados:", error)
    );

  // Delegação de eventos para os botões do WhatsApp
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".btnwha");
    if (!btn) return;

    const phoneNumber = "+5527989025190";
    const titulo = btn.getAttribute("data-title");
    const msgPrefix = btn.getAttribute("data-msg-prefix");
    const message = encodeURIComponent(`${msgPrefix} ${titulo}`);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappURL, "_blank");
  });
});

/**
 * Função genérica para renderizar os cartões
 * @param {Array} cards - Array de objetos com os dados da vaga/banco
 * @param {string} containerId - ID do elemento container
 * @param {string} collapsiblePrefix - Prefixo para os IDs dos elementos colapsáveis
 * @param {string} whatsappMsgPrefix - Texto que será usado no início da mensagem do WhatsApp
 */

function renderCards(cards, containerId, collapsiblePrefix = "", whatsappMsgPrefix = "") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const fragment = document.createDocumentFragment();

  cards.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2><strong>${item.titulo}</strong></h2>
      <p><strong>Quantidade de vagas: </strong>${item.QuantidaDeVagas}.</p>
      <p>
        <i class="fa-solid fa-location-dot"></i>
        <strong>Localização:<br></strong>
        ${item.localizacao.cidade} / ${item.localizacao.estado}.
      </p>

       ${item.infoExtra ? ` ${item.infoExtra}.</p>` : ""}

      <div class="wrap-collabsible">
        <input id="${collapsiblePrefix}collapsible-${index}" class="toggle" type="checkbox" /> 
        <label for="${collapsiblePrefix}collapsible-${index}" class="lbl-toggle">
          <i class="fa-solid fa-clipboard"></i> Requisitos
        </label>

        <div class="collapsible-content">
          <div class="content-inner">
            <ul>
              ${item.requisitos.map((req) => `<li>${req}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>

      <div class="contatos">
        <p><strong>Contatos:</strong></p>
        <i class="fa-solid fa-envelope"></i>
        <a href="mailto:rh@nexify.com.br<">rh@nexify.com.br<</a><br>
        <p><i class="fa-solid fa-phone"></i> (27) 98902-5190</p>
      </div>

      <div class="linkBtn">
        <a class="btn" href="${item.link}" target="_blank">
          <i class="fa-solid fa-file-lines"></i>
          Fazer inscrição!
        </a>
      </div>

      <div class="linkBtn">
        <button class="btnwha" data-title="${item.titulo}" data-msg-prefix="${whatsappMsgPrefix}">
          <i class="fa-brands fa-whatsapp"></i>
          Tirar dúvidas no WhatsApp
        </button>
      </div>
    `;
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}
