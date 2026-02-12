(() => {
  const form = document.querySelector(".form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector('input[placeholder="Name"]')?.value || "";
    const email = form.querySelector('input[placeholder="Email"]')?.value || "";
    const company = form.querySelector('input[placeholder="Company"]')?.value || "";
    const budget = form.querySelector("select")?.value || "";
    const message = form.querySelector("textarea")?.value || "";

    const subject = encodeURIComponent("Signal Arc — Quote Request");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nMonthly Budget: ${budget}\n\nMessage:\n${message}\n\n— Sent from signalarc.io`
    );

    window.location.href = `mailto:joshua@signalarc.io?subject=${subject}&body=${body}`;
  });
})();
