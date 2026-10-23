import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from "react";
import type { Film } from "../films";
import { readReservation, type Errors, type Reservation } from "../reservation";

type BookingDialogProps = {
  film: Film;
  onConfirm: (film: Film, reservation: Reservation) => void;
  onClose: () => void;
};

export default function BookingDialog({ film, onConfirm, onClose }: BookingDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const confirmedRef = useRef(false);
  const prefix = useId();
  const id = (part: string) => `${prefix}-${part}`;
  const [errors, setErrors] = useState<Errors>({});

  const [attempt, setAttempt] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const errorList = Object.entries(errors) as [keyof Errors, string][];
  const describedBy = (field: keyof Errors) =>
    errors[field] ? `${id(field)}-help ${id(field)}-error` : `${id(field)}-help`;
  const focusField = (event: MouseEvent<HTMLAnchorElement>, field: keyof Errors) => {
    event.preventDefault();
    document.getElementById(id(field))?.focus();
  };

  useEffect(() => {
    if (attempt > 0 && errorList.length > 0) summaryRef.current?.focus();
  }, [attempt, errors]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    confirmedRef.current = false;
    if (!dialog.open) dialog.showModal();
    titleRef.current?.focus();
  }, [film.id]);


  const closeBooking = () => dialogRef.current?.close();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!film.available || confirmedRef.current) return;
    const result = readReservation(event.currentTarget);
    setErrors(result.errors);
    setAttempt((count) => count + 1);
    if (Object.keys(result.errors).length > 0) return;
    confirmedRef.current = true;
    onConfirm(film, result.values);
    closeBooking();
  };

  return (
    <dialog ref={dialogRef} aria-labelledby={id("title")} onClose={onClose}>
      <div className="dialog-heading">
        <h2 id={id("title")} ref={titleRef} tabIndex={-1}>Réserver {film.title}</h2>
        <button type="button" className="close" aria-label="Fermer la réservation" onClick={closeBooking}>×</button>
      </div>
      <p>{film.genre} · Séance de {film.time}</p>
      <p className={"availability " + (film.available ? "available" : "unavailable")}>
        {film.available ? "Places disponibles" : "Séance complète"}
      </p>
      {film.available ? (
        <>
          <p>Une place par réservation. Tous les champs du formulaire sont obligatoires.</p>
          <p className="demo-note">Démonstration : aucun billet réel ni envoi de courriel.</p>
          <form noValidate onSubmit={submit}>
            {errorList.length > 0 && (
              <div className="error-summary" ref={summaryRef} tabIndex={-1} role="group" aria-labelledby={id("summary-title")}>
                <h3 id={id("summary-title")}>
                  {errorList.length} {errorList.length > 1 ? "erreurs empêchent" : "erreur empêche"} la réservation
                </h3>
                <ul>
                  {errorList.map(([field, message]) => (
                    <li key={field}>
                      <a href={`#${id(field)}`} onClick={(event) => focusField(event, field)}>{message}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <fieldset className="form-group" aria-describedby={describedBy("tariff")}>
              <legend>Type de place (obligatoire)</legend>
              <p className="field-help" id={id("tariff-help")}>Choisissez un type de place pour ce billet.</p>
              <div className="radio-options">
                <label><input id={id("tariff")} name="tariff" type="radio" value="standard" required aria-invalid={errors.tariff ? true : undefined} /> Standard</label>
                <label><input name="tariff" type="radio" value="student" required aria-invalid={errors.tariff ? true : undefined} /> Étudiant</label>
              </div>
              {errors.tariff && <p className="field-error" id={id("tariff-error")}>{errors.tariff}</p>}
            </fieldset>
            <div className="field">
              <label htmlFor={id("name")}>Nom de réservation (obligatoire)</label>
              <p className="field-help" id={id("name-help")}>Indiquez le nom de la personne qui réserve.</p>
              <input id={id("name")} name="name" autoComplete="name" required
                aria-invalid={errors.name ? true : undefined} aria-describedby={describedBy("name")} />
              {errors.name && <p className="field-error" id={id("name-error")}>{errors.name}</p>}
            </div>
            <div className="field">
              <label htmlFor={id("email")}>Adresse électronique (obligatoire)</label>
              <p className="field-help" id={id("email-help")}>Format attendu : nom@exemple.fr.</p>
              <input id={id("email")} name="email" type="email" autoComplete="email" required
                aria-invalid={errors.email ? true : undefined} aria-describedby={describedBy("email")} />
              {errors.email && <p className="field-error" id={id("email-error")}>{errors.email}</p>}
            </div>
            <div className="dialog-actions">
              <button className="dialog-action" type="submit">Confirmer la réservation</button>
              <button className="dialog-action dialog-secondary" type="button" onClick={closeBooking}>Revenir aux films</button>
            </div>
          </form>
        </>
      ) : (
        <>
          <p>Cette séance est complète : aucune réservation ne peut être confirmée.</p>
          <button className="dialog-action" type="button" onClick={closeBooking}>Revenir aux films</button>
        </>
      )}
    </dialog>
  );
}
