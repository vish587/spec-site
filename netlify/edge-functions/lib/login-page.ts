// The branded login page served by auth.ts. Pure presentation — no secrets here.

export function loginPage({ error = false } = {}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Liftrex — Employee Login</title>
<style>
  :root {
    --bg: #3B2FD0;
    --orange: #E4581D; /* sampled from the LIFTREX brand logo */
    --field: #D9DBE0;
    --ink: #1C1C1E;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: var(--bg);
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    color: #fff;
  }
  main {
    width: min(420px, 90vw);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 48px 0;
  }
  .brand-logo { width: min(300px, 72vw); height: auto; }
  h1 {
    margin: 26px 0 0;
    font-size: 34px;
    font-weight: 700;
    letter-spacing: .5px;
  }
  form { width: 100%; margin-top: 64px; }
  .error {
    margin: 0 0 16px;
    padding: 11px 14px;
    background: rgba(180, 30, 30, .45);
    border-radius: 8px;
    font-size: 14px;
  }
  .field {
    width: 100%;
    background: var(--field);
    border: 0;
    border-radius: 8px;
    padding: 15px 16px;
    font-size: 15px;
    color: var(--ink);
    margin-bottom: 16px;
  }
  .field::placeholder { color: #3F4147; }
  .field:focus { outline: 2px solid var(--orange); }
  /* Suppress the browser's built-in reveal eye (Edge) — we render our own toggle. */
  .field::-ms-reveal, .field::-ms-clear { display: none; }
  .password-wrap { position: relative; }
  .password-wrap .field { padding-right: 46px; }
  .toggle svg[hidden] { display: none; }
  .toggle {
    position: absolute;
    right: 6px;
    top: 0;
    height: calc(100% - 16px); /* minus the field's margin-bottom */
    border: 0;
    background: none;
    padding: 0 8px;
    cursor: pointer;
    color: #4B4D55;
    display: flex;
    align-items: center;
  }
  .submit {
    width: 100%;
    margin-top: 6px;
    padding: 14px;
    border: 0;
    border-radius: 8px;
    background: var(--orange);
    color: #fff;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
  }
  .submit:disabled { opacity: .55; cursor: default; }
  .submit:not(:disabled):hover { background: #DD4C15; }
</style>
</head>
<body>
<main>
  <img class="brand-logo" src="data:image/png;base64,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" alt="LIFTREX">
  <h1>LOGIN</h1>

  <form method="POST" action="/login" novalidate>
    ${error ? `<p class="error">Invalid email or password.</p>` : ""}
    <input class="field" type="text" inputmode="email" name="email" id="email"
           placeholder="Enter Email" autocomplete="username" autofocus>
    <div class="password-wrap">
      <input class="field" type="password" name="password" id="password"
             placeholder="Enter Password" autocomplete="current-password">
      <button class="toggle" type="button" id="toggle" aria-label="Show password">
        <svg id="eye-open" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
        </svg>
        <svg id="eye-closed" hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
          <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88"/><line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      </button>
    </div>
    <button class="submit" id="submit" type="submit" disabled>Login</button>
  </form>
</main>
<script>
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const submit = document.getElementById("submit");
  const sync = () => { submit.disabled = !(email.value.trim() && password.value); };
  email.addEventListener("input", sync);
  password.addEventListener("input", sync);
  sync();

  const toggle = document.getElementById("toggle");
  toggle.addEventListener("click", () => {
    const show = password.type === "password";
    password.type = show ? "text" : "password";
    // toggleAttribute, not .hidden — SVG elements don't reflect the hidden property.
    document.getElementById("eye-open").toggleAttribute("hidden", show);
    document.getElementById("eye-closed").toggleAttribute("hidden", !show);
    toggle.setAttribute("aria-label", show ? "Hide password" : "Show password");
  });
</script>
</body>
</html>`;
}
