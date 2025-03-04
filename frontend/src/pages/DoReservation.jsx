import React, { useContext, useEffect, useState } from "react";
import Lottie from "react-lottie-player";
import axios from "axios";
import ReservationContext from "../Context/ReservationContext";

import "../scss/reservation.scss";

import mailError from "../assets/LottieFiles/EmailError.json";
import PrimaryButton from "../components/buttons/PrimaryButton";
import SecondaryButton from "../components/buttons/SecondaryButton";
import "../scss/doReservation.scss";

function DoReservation() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [date, setDate] = useState({ date: "", heure: "" });
  const [userId, setUserId] = useState("");

  // import des data sur les bornes
  const { reservation, setReservation, borneId } =
    useContext(ReservationContext);

  const handleChange = (e) => {
    setDate({ ...date, [e.target.name]: e.target.value });
  };
  let minute = parseInt(date.heure.slice(3, 5), 10) + 30;

  let heure = parseInt(date.heure.slice(0, 2), 10);
  heure += Math.floor(minute / 60);
  minute %= 60;
  const newHeure = `${heure < 10 ? "0" : ""}${heure}:${
    minute < 10 ? "0" : ""
  }${minute}`;

  const reservationData = {
    date: date.date,
    heure: date.heure,
    heure_fin: newHeure,
    borne_id: borneId.borne_id,
    vehicule_id: reservation,
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/checktoken`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.message === "OK") {
          setIsLoggedIn(true);
          setUserId(res.data.id);
        } else {
          setIsLoggedIn(false);
          setTimeout(() => {
            window.location.href = "/sign-in";
          }, 3800);
        }
        setIsLoading(false);
      });

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/checkVehicule/${userId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setReservation(res.data[0].id);
      })
      .catch((err) => console.error(err));
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/reservations`,
        reservationData
      )
      .catch((err) => console.error(err));
    setTimeout(() => {
      window.location.href = "/reservationSuccess";
    }, 1000);
  };

  if (isLoading) {
    return null;
  }
  if (!isLoggedIn) {
    return (
      <section>
        <div className="containererror">
          <Lottie
            loop
            animationData={mailError}
            play
            style={{ width: 120, height: 120 }}
          />
          <h1>Accès Impossible</h1>
          <p className="message">
            {`
        Vous devez vous connecter pour acceder à cette page.  `}
            <br /> {` Vous allez être redirigé(e) vers la page de connexion. `}
          </p>
          <PrimaryButton btnText="Se connecter" btnLink="/sign-in" />
        </div>
      </section>
    );
  }
  return (
    <div className="makeReservation">
      <h1>Réserver</h1>
      <div className="BorneInfo">Nom de la borne : {borneId.borne_name}</div>
      <div className="formulaire_Resa">
        <form className="formulaire">
          <div className="form_placeholder">
            <p className="form_placeholder_title">Date</p>
            <input
              className="form_placeholder_input"
              name="date"
              id="date"
              placeholder="2024-01-22"
              onChange={handleChange}
              type="date"
            />
          </div>
          <div className="form_placeholder">
            <p className="form_placeholder_title">Heure</p>
            <input
              className="form_placeholder_input"
              name="heure"
              id="heure"
              placeholder="00:00:00"
              onChange={handleChange}
              type="time"
            />
          </div>
          <div className="submitButton">
            <button type="submit" onClick={handleSubmit} className="submit">
              Réserver
            </button>
            <SecondaryButton btnLink="/" btnText="Annuler" />
          </div>
        </form>
      </div>
    </div>
  );
}
export default DoReservation;
