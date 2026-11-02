const services = {
  personal: {
    title: "Личный код",
    description: "Разбор личности, талантов, ресурсов и жизненных задач по дате рождения.",
  },
  relationship: {
    title: "Код отношений",
    description: "Разбор совместимости, сценариев пары и точек взаимопонимания.",
  },
  finance: {
    title: "Финансовый код",
    description: "Разбор финансовых сценариев, способов реализации и точек роста.",
  },
  school: {
    title: "Школа нумерологии",
    description: "Обучение в мини-группе или личное наставничество с Еленой.",
  },
};

const numberMeanings = {
  1: ["Инициатор", "Ваша сила — начинать, вести и создавать собственный путь. Важно развивать самостоятельность, не превращая её в одиночество."],
  2: ["Дипломат", "Вы тонко чувствуете людей и умеете создавать гармонию. Ваш рост начинается там, где мягкость сочетается с личными границами."],
  3: ["Творец", "Ваш ресурс — идеи, общение и самовыражение. Важно не распыляться и давать таланту устойчивую форму."],
  4: ["Созидатель", "Вы умеете превращать хаос в систему. Надёжность — ваш дар, а гибкость помогает ему не стать ограничением."],
  5: ["Исследователь", "Движение, свобода и новый опыт заряжают вас. Главная задача — сохранять внутреннюю опору среди перемен."],
  6: ["Хранитель", "Вы создаёте красоту, близость и пространство заботы. Помните: забота о себе так же важна, как поддержка других."],
  7: ["Аналитик", "Вам важно добираться до сути и доверять внутреннему знанию. Ваш путь — соединять глубину анализа с живым опытом."],
  8: ["Стратег", "Вы чувствуете масштаб, ресурсы и закономерности результата. Сила раскрывается через честное управление и баланс контроля."],
  9: ["Гуманист", "Вы видите широкую картину и умеете вдохновлять. Ваша задача — помогать миру, сохраняя собственные силы и границы."],
  11: ["Проводник", "Вы чувствительны к идеям и людям, умеете вдохновлять и подсвечивать новые смыслы. Интуиции нужна земная опора."],
  22: ["Архитектор", "Вы способны воплощать большие идеи в работающие системы. Масштаб раскрывается через дисциплину и сотрудничество."],
};

const body = document.body;
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const serviceModal = document.querySelector("#service-modal");
const legalModal = document.querySelector("#legal-modal");
const paymentLink = document.querySelector("#payment-link");
const paymentNote = document.querySelector("#payment-note");
const serviceField = document.querySelector("#service-field");
let lastFocusedElement = null;

document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#birthdate").max = new Date().toISOString().slice(0, 10);

const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

window.addEventListener("scroll", () => {
  const maximum = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maximum > 0 ? (window.scrollY / maximum) * 100 : 0;
  document.querySelector(".page-progress").style.width = `${progress}%`;
});

menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }),
);

function openModal(modal) {
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  body.classList.add("modal-open");
  modal.querySelector(".modal-close").focus();
}

function closeModal(modal) {
  modal.hidden = true;
  body.classList.remove("modal-open");
  lastFocusedElement?.focus();
}

document.querySelectorAll("[data-service]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.service;
    const service = services[key];
    const link = window.SITE_CONFIG?.paymentLinks?.[key]?.trim();
    document.querySelector("#modal-title").textContent = service.title;
    document.querySelector("#modal-description").textContent = service.description;
    serviceField.value = service.title;

    if (link) {
      paymentLink.textContent = "Перейти к оплате";
      paymentLink.href = link;
      paymentLink.target = "_blank";
      paymentLink.rel = "noopener noreferrer";
      paymentNote.textContent = "Оплата откроется на защищённой странице платёжного сервиса.";
    } else {
      paymentLink.textContent = "Оставить заявку";
      paymentLink.href = "#contact";
      paymentLink.removeAttribute("target");
      paymentLink.removeAttribute("rel");
      paymentNote.textContent = "Платёжная ссылка появится после подключения мерчант-аккаунта. Сейчас можно отправить заявку.";
    }
    openModal(serviceModal);
  });
});

document.querySelectorAll("[data-close-modal]").forEach((element) =>
  element.addEventListener("click", () => closeModal(serviceModal)),
);
document.querySelector("#modal-request").addEventListener("click", () => {
  closeModal(serviceModal);
  document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
});
paymentLink.addEventListener("click", () => {
  if (paymentLink.getAttribute("href") === "#contact") closeModal(serviceModal);
});

document.querySelector("[data-open-legal]").addEventListener("click", () => openModal(legalModal));
document.querySelectorAll("[data-close-legal]").forEach((element) =>
  element.addEventListener("click", () => closeModal(legalModal)),
);

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!serviceModal.hidden) closeModal(serviceModal);
  if (!legalModal.hidden) closeModal(legalModal);
});

function reduceNumber(total) {
  if (total === 11 || total === 22) return total;
  while (total > 9) {
    total = String(total)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
    if (total === 11 || total === 22) return total;
  }
  return total;
}

document.querySelector("#number-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = document.querySelector("#birthdate").value;
  if (!value) return;
  const total = value.replaceAll("-", "").split("").reduce((sum, digit) => sum + Number(digit), 0);
  const number = reduceNumber(total);
  const [title, text] = numberMeanings[number];
  document.querySelector("#result-number").textContent = number;
  document.querySelector("#result-title").textContent = title;
  document.querySelector("#result-text").textContent = text;
  document.querySelector("#number-form").hidden = true;
  document.querySelector("#number-result").hidden = false;
});

const contactForm = document.querySelector("#contact-form");
contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = document.querySelector("#form-status");
  const button = contactForm.querySelector("button[type='submit']");
  status.textContent = "Отправляем…";
  button.disabled = true;

  try {
    const isLocalPreview = location.protocol === "file:" || ["127.0.0.1", "localhost"].includes(location.hostname);
    if (isLocalPreview) {
      await new Promise((resolve) => setTimeout(resolve, 450));
    } else {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(contactForm)).toString(),
      });
      if (!response.ok) throw new Error("form-submit-failed");
    }
    status.textContent = "Спасибо! Заявка принята. Мы свяжемся с вами.";
    contactForm.reset();
  } catch {
    status.textContent = "Не удалось отправить. Напишите Елене в Instagram — ссылка слева.";
  } finally {
    button.disabled = false;
  }
});
