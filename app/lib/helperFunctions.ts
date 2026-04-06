export function isValidName(firstname: string, lastname: string): boolean {
   const ok = (s: string) => {
     if (s.length < 2) return false;
     // letters and hyphens only
     if (!/^[A-Za-z-]+$/.test(s)) return false;
     // no leading/trailing hyphen, no double hyphen
     if (s.startsWith("-") || s.endsWith("-") || s.includes("--")) return false;
     return true;
   };
  return ok(firstname) && ok(lastname);
}

export function isValidEmail(email: string) {
  const e = email.trim();
  if (e.length < 6 || e.length > 254) return false; // reasonable bounds
  if (e.includes(" ")) return false;

  // regex: local@domain.tld
  // - local: letters, numbers, plus . _ % + -
  // - domain: labels of letters/numbers/hyphens separated by dots
  // - tld: at least 2 letters
  const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!re.test(e)) return false;

  // extra guard: domain labels can't start/end with hyphen
  const [, domain] = e.split("@");
  if (domain.startsWith("-") || domain.endsWith("-")) return false;
  if (domain.includes("..")) return false;

  return true;
}

export function isValidPassword(password: string): boolean {
  const hasLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

  return hasLength && hasNumber && hasSpecial;
}
