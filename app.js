// Gift -> Message -> Black screen -> Album
(() => {
  const clickCheckbox = document.getElementById("click");
  const wishes = document.getElementById("wishesText");
  const blackout = document.getElementById("blackout");
  const giftScreen = document.getElementById("giftScreen");
  const albumScreen = document.getElementById("albumScreen");
  const giftWrap = document.getElementById("giftWrap");

  const openedMessage = "Happy birthday, you are the most beautiful princess";
  let alreadyTriggered = false;

  function showAlbumFlow() {
    if (alreadyTriggered) return;
    alreadyTriggered = true;

    // set message immediately when opened
    wishes.textContent = openedMessage;

    // allow the lid animation to start, then fade to black
    window.setTimeout(() => {
      blackout.classList.add("is-on");

      window.setTimeout(() => {
        giftScreen.hidden = true;
        albumScreen.hidden = false;

        // scroll to Memories section
        const memories = document.getElementById('memories');
        if (memories) memories.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // fade out black overlay
        window.setTimeout(() => blackout.classList.remove("is-on"), 250);
      }, 550);
    }, 650);
  }

  // when checkbox changes (label click)
  clickCheckbox?.addEventListener("change", () => {
    if (clickCheckbox.checked) showAlbumFlow();
  });

  // make the whole gift area clickable
  function forceOpen() {
    if (!clickCheckbox) return;
    clickCheckbox.checked = true;
    clickCheckbox.dispatchEvent(new Event("change"));
  }

  giftWrap?.addEventListener("click", (e) => {
    // avoid double toggle when clicking the label
    if (e.target.closest("label.click")) return;
    forceOpen();
  });

  // keyboard support
  giftWrap?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      forceOpen();
    }
  });
})();


// ====== Background music autoplay attempt ======
(() => {
  const audio = document.getElementById("bgAudio");
  const gate = document.getElementById("audioGate");
  if (!audio) return;

  async function tryPlay() {
    try {
      const p = audio.play();
      if (p && typeof p.then === "function") await p;
      if (gate) gate.hidden = true;
    } catch (e) {
      // Autoplay likely blocked (common on mobile). Show a tap button.
      if (gate) gate.hidden = false;
    }
  }

  // Try once on load
  window.addEventListener("load", tryPlay, { once: true });

  // If blocked, user can tap the gate
  gate?.addEventListener("click", async () => {
    await tryPlay();
  });
})();
