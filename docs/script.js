const messageData = [
  {
    "author": "CONTRIBUTOR 1",
    "lang": "en",
    "text": "This is a fictional sample birthday message used to demonstrate the accordion interface. Personal messages from the original project are not included."
  },
  {
    "author": "CONTRIBUTOR 2",
    "lang": "en",
    "text": "This is a fictional sample birthday message used to demonstrate the accordion interface. Personal messages from the original project are not included."
  },
  {
    "author": "CONTRIBUTOR 3",
    "lang": "en",
    "text": "This is a fictional sample birthday message used to demonstrate the accordion interface. Personal messages from the original project are not included."
  },
  {
    "author": "CONTRIBUTOR 4",
    "lang": "en",
    "text": "This is a fictional sample birthday message used to demonstrate the accordion interface. Personal messages from the original project are not included."
  }
];
const stack = document.querySelector("#message-stack");
messageData.forEach((message, index) => {
  const details = document.createElement("details");
  details.className = "message";
  details.setAttribute("translate", "no");
  details.lang = message.lang;
  const summary = document.createElement("summary");
  const number = document.createElement("span");
  number.className = "message-number";
  number.textContent = `0${index + 1}`;
  const author = document.createElement("strong");
  author.textContent = message.author;
  const plus = document.createElement("span");
  plus.className = "plus";
  plus.textContent = "+";
  plus.setAttribute("aria-hidden", "true");
  summary.append(number, author, plus);
  const text = document.createElement("p");
  text.textContent = message.text;
  if (message.lang) text.lang = message.lang;
  details.append(summary, text);
  stack.append(details);
});
const dialog = document.querySelector("#lightbox");
let lastTrigger;
const photoCaption = (button) =>
  button.dataset.caption ||
  button.closest("figure")?.querySelector("figcaption")?.textContent ||
  "";
document.querySelectorAll(".photo-open").forEach((button) =>
  button.addEventListener("click", () => {
    lastTrigger = button;
    const image = button.querySelector("img");
    document.querySelector("#expanded-photo").src = image.currentSrc || image.src;
    document.querySelector("#expanded-photo").alt = image.alt;
    document.querySelector("#expanded-caption").textContent = photoCaption(button);
    dialog.showModal();
    document.body.style.overflow = "hidden";
  }),
);
document
  .querySelector(".close-dialog")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => {
  document.body.style.overflow = "";
  lastTrigger?.focus({ preventScroll: true });
});
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!reduceMotion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.13 },
  );
  document
    .querySelectorAll(".story .panel, .album .panel")
    .forEach((panel) => observer.observe(panel));
}
let birthdayTimer;
document.querySelector("#celebrate").addEventListener("click", () => {
  const impact = document.querySelector("#birthday-impact");
  clearTimeout(birthdayTimer);
  impact.classList.remove("pop");
  void impact.offsetWidth;
  impact.textContent =
    language === "pt-PT" ? "50! VIVA O PAI!" : "50! HERE’S TO YOU!";
  impact.classList.add("pop");
  birthdayTimer = setTimeout(() => {
    impact.classList.remove("pop");
    impact.textContent = "";
  }, 2600);
});

// Keep original interface text so switching back never depends on reverse translation.
let language = "en";
try {
  if (localStorage.getItem("birthday-demo-language") === "pt-PT") language = "pt-PT";
} catch {}
const textTranslations = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (walker.nextNode()) {
  const node = walker.currentNode;
  if (
    node.parentElement.closest(
      "script, style, .message, .language-switch button, #opening-caption, #birthday-impact",
    )
  )
    continue;
  const original = node.textContent;
  if (portuguese[original.trim()])
    textTranslations.push({
      node,
      original,
      translated: original.replace(
        original.trim(),
        portuguese[original.trim()],
      ),
    });
}
const attributeTranslations = [];
document
  .querySelectorAll("[alt], [aria-label], [data-caption]")
  .forEach((element) => {
    if (element.closest(".message")) return;
    for (const attribute of ["alt", "aria-label", "data-caption"]) {
      const original = element.getAttribute(attribute);
      if (portuguese[original])
        attributeTranslations.push({
          element,
          attribute,
          original,
          translated: portuguese[original],
        });
    }
  });
function setLanguage(next) {
  language = next === "pt-PT" ? next : "en";
  document.documentElement.lang = language;
  textTranslations.forEach(
    (t) => (t.node.textContent = language === "en" ? t.original : t.translated),
  );
  attributeTranslations.forEach((t) =>
    t.element.setAttribute(
      t.attribute,
      language === "en" ? t.original : t.translated,
    ),
  );
  document
    .querySelectorAll("[data-language]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.language === language),
      ),
    );
  document.title =
    language === "en"
      ? "Issue 50 — Happy Birthday, Dad"
      : "Edição 50 — Parabéns, Pai";
  document.querySelector('meta[name="description"]').content =
    language === "en"
      ? "A lifetime of memories. One very special Dad. A birthday comic made with love."
      : "Uma vida de memórias. Um Pai muito especial. Uma banda desenhada de aniversário feita com amor.";
  try {
    localStorage.setItem("birthday-demo-language", language);
  } catch {}
  if (opening.open) updateOpeningText();
  if (dialog.open && lastTrigger) {
    document.querySelector("#expanded-caption").textContent =
      photoCaption(lastTrigger);
    document.querySelector("#expanded-photo").alt =
      lastTrigger.querySelector("img").alt;
  }
  const impact = document.querySelector("#birthday-impact");
  if (impact.textContent)
    impact.textContent =
      language === "pt-PT" ? "50! VIVA O PAI!" : "50! HERE’S TO YOU!";
}
document
  .querySelectorAll("[data-language]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      setLanguage(button.dataset.language),
    ),
  );

const opening = document.querySelector("#opening");
const openingCaption = document.querySelector("#opening-caption");
const openingImage = document.querySelector("#opening-image");
const openingPhoto = document.querySelector(".opening-photo");
const frames = [
  { en: "YEAR: 1976", pt: "ANO: 1976", duration: 1800, style: "year" },
  {
    en: "A HERO WAS BORN.",
    pt: "NASCEU UM HERÓI.",
    image: "early-days.jpg",
    duration: 2600,
    style: "memory",
  },
  {
    en: "He grew up…",
    pt: "Cresceu…",
    image: "sun-city.jpeg",
    duration: 2300,
    style: "memory",
  },
  {
    en: "He became a husband…",
    pt: "Tornou-se marido…",
    image: "young-couple.jpeg",
    duration: 2300,
    style: "memory",
  },
  {
    en: "He became a father…",
    pt: "Tornou-se pai…",
    image: "family2.jpeg",
    duration: 2600,
    style: "memory",
  },
  {
    en: "And somehow…",
    pt: "E, de alguma maneira…",
    duration: 2000,
    style: "pause",
  },
  {
    en: "HE MADE IT TO 50.",
    pt: "CHEGOU AOS 50.",
    duration: 1900,
    style: "fifty-seven",
  },
  { en: "SUPER DAD!!!", pt: "SUPER DAD!!!", duration: 1100, style: "super-dad" },
];
let frameIndex = 0;
let openingTimer;
let openingReturnFocus;
function updateOpeningText() {
  const frame = frames[frameIndex];
  openingCaption.textContent = language === "en" ? frame.en : frame.pt;
  if (frame.image) openingImage.alt = openingCaption.textContent;
}
function queueNextFrame() {
  clearTimeout(openingTimer);
  if (!document.hidden)
    openingTimer = setTimeout(() => {
      if (frameIndex < frames.length - 1) {
        frameIndex++;
        showFrame();
      } else finishOpening();
    }, frames[frameIndex].duration);
}
function showFrame() {
  const frame = frames[frameIndex];
  opening.dataset.scene = frame.style;
  openingPhoto.hidden = !frame.image;
  if (frame.image) openingImage.src = `assets/${frame.image}`;
  updateOpeningText();
  document.querySelector(".opening-page").textContent =
    `${String(frameIndex + 1).padStart(2, "0")} / 08`;
  document.querySelector(".opening-progress").style.transform =
    `scaleX(${(frameIndex + 1) / frames.length})`;
  const stage = document.querySelector(".opening-stage");
  stage.classList.remove("scene-enter");
  void stage.offsetWidth;
  stage.classList.add("scene-enter");
  queueNextFrame();
}
function startOpening(replay = false) {
  clearTimeout(openingTimer);
  openingReturnFocus = replay ? document.querySelector(".replay-intro") : null;
  frameIndex = 0;
  opening.showModal();
  document.body.style.overflow = "hidden";
  showFrame();
  document.querySelector("#skip-opening").focus({ preventScroll: true });
}
function finishOpening() {
  clearTimeout(openingTimer);
  if (!opening.open) return;
  opening.close();
}
opening.addEventListener("close", () => {
  clearTimeout(openingTimer);
  document.body.style.overflow = "";
  if (openingReturnFocus) openingReturnFocus.focus({ preventScroll: true });
  else {
    const title = document.querySelector("#cover-title");
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
  }
});
opening.addEventListener("cancel", (event) => {
  event.preventDefault();
  finishOpening();
});
document
  .querySelector("#skip-opening")
  .addEventListener("click", finishOpening);
document
  .querySelector(".replay-intro")
  .addEventListener("click", () => startOpening(true));
document.addEventListener("visibilitychange", () => {
  if (opening.open) {
    clearTimeout(openingTimer);
    if (!document.hidden) queueNextFrame();
  }
});
// Preload only the four opening photos, without making the opening depend on the network.
for (const { image: filename } of frames) {
  if (!filename) continue;
  const image = new Image();
  image.src = `assets/${filename}`;
}
setLanguage(language);
// Deep links go straight to their chapter; a fresh visit starts with the origin story.
if (!location.hash) startOpening();
