(() => {
  // Smooth scrolling for section links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;

      const el = document.querySelector(id);
      if (!el) return;

      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Quote form mailto submission
  const form = document.querySelector(".form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector('input[placeholder="Name"]')?.value?.trim() || "";
    const email = form.querySelector('input[placeholder="Email"]')?.value?.trim() || "";
    const company = form.querySelector('input[placeholder="Company"]')?.value?.trim() || "";
    const budget = form.querySelector("select")?.value?.trim() || "";
    const message = form.querySelector("textarea")?.value?.trim() || "";

    const subject = encodeURIComponent("Signal Arc — Quote Request");
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company}`,
        `Monthly budget: ${budget}`,
        "",
        "What do you need help with?",
        message,
        "",
        "— Sent from signalarc.io"
      ].join("\n")
    );

    window.location.href = `mailto:hello@signalarc.com?subject=${subject}&body=${body}`;
  });
})();
