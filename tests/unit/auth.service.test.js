import bcrypt from "bcrypt";

describe("auth.service - bcrypt", () => {
  test("hashea una contraseña y no la deja en texto plano", async () => {
    const password = "password123";
    const hash = await bcrypt.hash(password, 10);

    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(20);
  });

  test("compara correctamente una contraseña válida", async () => {
    const password = "password123";
    const hash = await bcrypt.hash(password, 10);

    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);
  });

  test("rechaza una contraseña incorrecta", async () => {
    const hash = await bcrypt.hash("password123", 10);

    const isValid = await bcrypt.compare("otraPassword", hash);
    expect(isValid).toBe(false);
  });
});