import { isAuthed, getRole, DASH } from "./portal.js";
(async () => {
  if (!(await isAuthed())) return location.replace("login.html");
  const p = await getRole();
  location.replace((p && DASH[p.role]) || "login.html");
})();
