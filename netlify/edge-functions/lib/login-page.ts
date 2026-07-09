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
    --orange: #F4581F;
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
  .logo { width: 86px; height: auto; }
  .wordmark {
    margin-top: 8px;
    color: var(--orange);
    font-size: 15px;
    font-weight: 800;
    letter-spacing: .45em;
    padding-left: .45em; /* visually recenters letter-spaced text */
  }
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
  <svg class="logo" viewBox="0 0 120 90" fill="#F4581F" aria-hidden="true">
    <polygon points="0,0 30,0 75,45 30,90 0,90 45,45"/>
    <polygon points="120,0 90,0 45,45 90,90 120,90 75,45"/>
  </svg>
  <div class="wordmark">LIFTREX</div>
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
