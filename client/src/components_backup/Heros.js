import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

export const Heros = () => {
  const [herosList, setHerosList] = useState();
  const [heroDetail, setHeroDetail] = useState();
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    addHero({ name: data.heroName, alias: data.heroAlias });
    console.log(data);
  };
  // const heroNew = { name: "Aazam", alias: "A" };

  // const sendPostRequest = async () => {
  const getHero = async (heroIndex) => {
    const apiUrl =
      "https://helphelper.thoushif.repl.co/heroes/" + heroIndex + "/";
    console.log(heroIndex);
    await axios
      .get(apiUrl)
      .then((response) => response.data)
      .then((data) => {
        console.log("This is your data", data);
        setHeroDetail(data);
      })
      .catch((err) => console.log(err));
  };
  const getHeros = async () => {
    const apiUrl = "https://helphelper.thoushif.repl.co/heroes/?active=true";
    await axios
      .get(apiUrl)
      .then((response) => response.data)
      .then((data) => {
        console.log("This is your data", data);
        setHerosList(data);
      })
      .catch((err) => console.log(err));
  };
  const addHero = async (heroNew) => {
    const apiUrl = "https://helphelper.thoushif.repl.co/heroes/";
    await axios
      .post(apiUrl, heroNew)
      .then((response) => response.data)
      .then((data) => {
        getHeros();
      })
      .catch((err) => console.log(err));
  };
  const deActivateHero = async (heroIndex) => {
    const apiUrl =
      "https://helphelper.thoushif.repl.co/heroes/" + heroIndex + "/";
    let updatingHero = {};
    // await axios
    //   .get(apiUrl)
    //   .then((response) => response.data)
    //   .then((data) => {
    //     console.log("This is your data", data);
    //     updatingHero = data;
    //   })
    //   .catch((err) => console.log(err));
    updatingHero.active = false;
    await axios
      .patch(apiUrl, updatingHero)
      .then((response) => response.data)
      .then((data) => {
        getHeros();
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <button onClick={() => getHeros()}>load heros</button>
      Selected Hero
      {heroDetail && (
        <div>
          <li>Name: {heroDetail.name}</li>
          <li>Alias: {heroDetail.alias}</li>
          <li>Active: {heroDetail.active ? "Yes" : "No"}</li>
        </div>
      )}
      Heros are..
      {herosList
        ? herosList.map((hero, i) => (
            <p key={hero.name + i}>
              {i + 1}. {hero.name}({hero.alias}, {hero.id}){" "}
              <button onClick={() => getHero(hero.id)}>load hero</button>
              <button onClick={() => deActivateHero(hero.id)}>X</button>
            </p>
          ))
        : "loading..."}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control">
          <label>Hero Name</label>
          <input
            type="text"
            name="hero-name"
            {...register("heroName", {
              required: "Required",
            })}
          />
        </div>
        <div className="form-control">
          <label>Hero Alias</label>
          <input
            type="text"
            name="hero-alias"
            {...register("heroAlias", {
              required: "Required",
            })}
          />
        </div>
        <div className="form-control">
          <label></label>
          <button type="submit">Add this hero</button>
        </div>
      </form>
    </div>
  );
};
