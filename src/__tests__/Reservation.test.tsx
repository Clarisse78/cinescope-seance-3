import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";

afterEach(cleanup);

describe("Les erreurs du formulaire", () => {
  it("relie aide et erreur au champ invalide", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", {
        name: "Réserver Après l’aube",
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: "Confirmer la réservation",
      })
    );

    const email = screen.getByRole("textbox", {
      name: /adresse électronique/i,
    });

    const descriptionIds = (
      email.getAttribute("aria-describedby") ?? ""
    )
      .split(/\s+/)
      .filter(Boolean);

    expect(descriptionIds).toHaveLength(2);

    const help = document.getElementById(descriptionIds[0]);
    const error = document.getElementById(descriptionIds[1]);

    expect(help).toHaveTextContent("Format attendu");
    expect(error).toHaveTextContent(
      "Saisissez une adresse électronique"
    );
  });

  it("marque l’email invalide et donne le focus au résumé", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Réserver Après l’aube" }));
    await user.click(screen.getByRole("button", { name: "Confirmer la réservation" }));

    expect(screen.getByRole("textbox", { name: /adresse électronique/i })).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("group", { name: /3 erreurs/i })).toHaveFocus();
  });

  it("conserve la saisie et rejoint le champ depuis le résumé", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Réserver Après l’aube" }));
    await user.type(screen.getByRole("textbox", { name: /nom de réservation/i }), "Zoé");
    await user.click(screen.getByRole("button", { name: "Confirmer la réservation" }));
    await user.click(screen.getByRole("link", { name: /adresse électronique/i }));

    expect(screen.getByRole("textbox", { name: /adresse électronique/i })).toHaveFocus();
    expect(screen.getByRole("textbox", { name: /nom de réservation/i })).toHaveValue("Zoé");
  });
});
