import React, { useEffect, useState } from "react";

import css from "./card.module.scss";
import {
  URL_POKEMON,
  URL_ESPECIES,
  URL_EVOLUCIONES,
} from "../../../api/apiRest";
import axios from "axios";

export default function Card({ card }) {
  const [itemPokemon, setitemPokemon] = useState({});
  const [especiePokemon, setespeciePokemon] = useState({});
  const [evolucionesPokemon, setevolucionesPokemon] = useState([]);


  useEffect(() => {
    const dataPokemon = async () => {
      const api = await axios.get(`${URL_POKEMON}/${card.name}`);

      setitemPokemon(api.data);
    };

    dataPokemon();
  }, [card]);

  useEffect(() => {
    const dataEspecie = async () => {
      const URL = card.url.split("/");

      const api = await axios.get(`${URL_ESPECIES}/${URL[6]}`);
      setespeciePokemon({
        url_especie: api?.data?.evolution_chain,
        data: api?.data,
      });
    };
    dataEspecie();
  }, [card]);

  useEffect(() => {
    async function getPokemonImagen(id) {
      const response = await axios.get(`${URL_POKEMON}/${id}`);
      return response?.data?.sprites?.other["official-artwork"]?.front_default;
    }

    if (especiePokemon?.url_especie) {
      const getEvolutions = async () => {
        const arrayEvolutions = [];

        const URL = especiePokemon?.url_especie?.url.split("/");

        const api = await axios.get(`${URL_EVOLUCIONES}/${URL[6]}`);

        const URL2 = api?.data?.chain?.species?.url?.split("/");

        const img1 = await getPokemonImagen(URL2[6]);

        arrayEvolutions.push({
          img: img1,
          name: api?.data?.chain?.species?.name,
        });

        if (api?.data?.chain.evolves_to?.length != 0) {
          const DATA2 = api?.data?.chain?.evolves_to[0]?.species;
          const ID = DATA2?.url?.split("/");
          const img2 = await getPokemonImagen(ID[6]);

          arrayEvolutions.push({
            img: img2,
            name: DATA2?.name,
          });

          if (api?.data?.chain.evolves_to[0].evolves_to.length != 0) {
            const DATA3 =
              api?.data?.chain?.evolves_to[0]?.evolves_to[0]?.species;
            const ID = DATA3?.url?.split("/");
            const img3 = await getPokemonImagen(ID[6]);

            arrayEvolutions.push({
              img: img3,
              name: DATA3?.name,
            });
          }
        }

        setevolucionesPokemon(arrayEvolutions);
      };

      getEvolutions();
    }
  }, [especiePokemon]);

  let pokeid = itemPokemon?.id?.toString();
  if (pokeid?.length == 1) {
    pokeid = "00" + pokeid;
  } else if (pokeid?.length == 2) {
    pokeid = "0" + pokeid;
  }

  return (
    <div className={css.card}>
      
      <img
        className={css.img_poke}
        src={itemPokemon?.sprites?.other["official-artwork"]?.front_default}
        alt="pokemon"
      />
      
      <div
        className={`sub_card-${especiePokemon?.data?.color?.name} bg-${especiePokemon?.data?.color?.name}`}
      >
        <strong className={css.id_card}>#{pokeid}</strong>
        <strong className={css.name_card}>{itemPokemon.name}</strong>
        <h4 className={css.altura_poke}>Height: {itemPokemon.height}0 cm</h4>
        <h4 className={css.peso_poke}>Weight: {itemPokemon.weight} Kg</h4>
        <h4 className={css.habitat_poke}>
          Habitat: {especiePokemon?.data?.habitat?.name}
        </h4>

        <div className={css.div_stats}>
          {itemPokemon?.stats?.map((sta, index) => {
            return (
              <h6 key={index} className={css.item_stats}>
                <spam className={css.name}>{sta.stat.name}</spam>
                <progress value={sta.base_stat} max={110}></progress>
                <spam className={css.numero}>{sta.base_stat}</spam>
              </h6>
            );
          })}
        </div>
        <div className={css.div_type_color}>
          {itemPokemon?.types?.map((ti, index) => {
            return (
              <h6
                key={index}
                className={`color-${ti.type.name} ${css.color_type}`}
              >
                {" "}
                {ti.type.name}{" "}
              </h6>
            );
          })}
        </div>
        <div className={css.div_evolution}>{evolucionesPokemon.map(((evo, index) => {
          return(
            <div key={index} className={css.item_evo}>
              <img src={evo.img} alt="evo" className={css.img} />
              <h6>{evo.name}</h6>
            </div>
          )
        }))}</div>
      </div>
    </div>
  );
}
