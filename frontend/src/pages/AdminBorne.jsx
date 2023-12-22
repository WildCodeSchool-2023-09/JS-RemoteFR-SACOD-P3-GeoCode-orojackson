import "../scss/admin-borne.scss";
import { Link } from "react-router-dom";

import { useState } from "react";
import BorneCard from "../components/BorneCard";
import ScrollToTop from "./ResetScrollOnPage";
import data from "../data/BorneDataTest.json";

export default function AdminBorne() {
  const [searchForm, setSearchForm] = useState("");

  function updateForm(e) {
    e.preventDefault();
    setSearchForm(e.target[0].value);
  }

  return (
    <main className="admin-borne backgroundImageMain">
      <ScrollToTop />
      <Link to="/admin">Retour</Link>
      <h1>Liste des Bornes</h1>
      <div className="borneSearch">
        <form onSubmit={updateForm}>
          <div className="search-bar">
            <div className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Recherche"
            />
          </div>
          <input className="search-button" type="submit" value="Rechercher" />
        </form>
      </div>

      <div className="card-container">
        <div className="card-list">
          {data
            .filter((borne) =>
              borne.name.toLowerCase().includes(searchForm.toLowerCase())
            )
            .map((borne) => (
              <BorneCard name={borne.name} adresse={borne.adresse} />
            ))}
        </div>
      </div>
    </main>
  );
}
