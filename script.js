const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const header = $("[data-header]");
const menuButton = $("[data-menu-button]");
const siteNav = $("[data-site-nav]");
const panel = $("[data-panel]");
const contactForm = $("[data-contact-form]");

const industryContent = {
  retail: {
    eyebrow: "Retail mode",
    title: "Inventory, barcode checkout, purchase orders, and customer rewards.",
    copy:
      "Create a clean sales story for boutiques, markets, convenience stores, beauty supply shops, and growing retail brands.",
    bullets: [
      "Barcode-ready product lookup",
      "Variants, categories, and vendor tracking",
      "Returns, exchanges, and loyalty credit",
    ],
  },
  restaurant: {
    eyebrow: "Restaurant mode",
    title: "Menus, modifiers, table flow, tips, and kitchen-ready order handling.",
    copy:
      "Present a POS experience for cafes, food trucks, quick-service counters, bakeries, and full-service restaurants.",
    bullets: [
      "Menu modifiers and combos",
      "Table, pickup, and order status views",
      "Tips, split payments, and shift closeout",
    ],
  },
  service: {
    eyebrow: "Service mode",
    title: "Bookings, memberships, staff commissions, and repeat customer history.",
    copy:
      "Show how the platform can support salons, barbershops, gyms, repair shops, studios, and service teams.",
    bullets: [
      "Customer profiles and appointment notes",
      "Membership packages and store credit",
      "Staff roles, commissions, and reports",
    ],
  },
};

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 12);
});

menuButton?.addEventListener("click", () => {
  const isOpen = siteNav?.classList.toggle("open") || false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.addEventListener("click", (event) => {
  if (!event.target.matches("a")) return;
  siteNav.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
});

$$("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    const content = industryContent[button.dataset.tab];
    if (!content || !panel) return;

    $$("[data-tab]").forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-selected", String(item === button));
    });

    panel.innerHTML = `
      <div>
        <p class="eyebrow">${content.eyebrow}</p>
        <h3>${content.title}</h3>
        <p>${content.copy}</p>
      </div>
      <ul>
        ${content.bullets.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    `;
  });
});

$$("[data-billing]").forEach((button) => {
  button.addEventListener("click", () => {
    const isAnnual = button.dataset.billing === "annual";

    $$("[data-billing]").forEach((item) => item.classList.toggle("active", item === button));
    $$("[data-price]").forEach((price) => {
      const monthly = Number(price.dataset.price);
      const value = isAnnual ? Math.round(monthly * 10) : monthly;
      price.textContent = `$${value}`;
      price.nextElementSibling.textContent = isAnnual ? "/yr" : "/mo";
    });
  });
});

const transactions = $("[data-transactions]");
const minutes = $("[data-minutes]");
const transactionsValue = $("[data-transactions-value]");
const minutesValue = $("[data-minutes-value]");
const savings = $("[data-savings]");

function updateCalculator() {
  if (!transactions || !minutes || !transactionsValue || !minutesValue || !savings) return;

  const transactionsPerDay = Number(transactions.value);
  const minutesSaved = Number(minutes.value);
  const monthlyHours = Math.round((transactionsPerDay * minutesSaved * 30) / 60);

  transactionsValue.textContent = String(transactionsPerDay);
  minutesValue.textContent = String(minutesSaved);
  savings.textContent = `${monthlyHours} hours`;
}

transactions?.addEventListener("input", updateCalculator);
minutes?.addEventListener("input", updateCalculator);
updateCalculator();

$$(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    if (answer) answer.hidden = isOpen;
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(contactForm));
  const subject = encodeURIComponent("ClainerPOS demo request");
  const body = encodeURIComponent(
    `Name: ${data.name || ""}\nEmail: ${data.email || ""}\nBusiness type: ${data.business || ""}\n\n${data.message || ""}`
  );

  window.location.href = `mailto:v.clainer11@gmail.com?subject=${subject}&body=${body}`;
  $(".form-status", contactForm).textContent = "Opening your email app...";
});
