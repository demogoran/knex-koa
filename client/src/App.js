import React, { useState } from "react";

import all from './tools/api';


import styles from './App.css';


const { Serials } = all;

export default () => {
  const [str, setStr] = useState('друзья');
  const [list, setList] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [series, setSeries] = useState([]);

  let currentContent = <div></div>;

  if (series.length) {
    currentContent = series
      .map(x => <a key={x.url} target="_blank" href={x.file}>{x.title.replace('<br>', '')}</a>);
  }
  else if (seasons.length) {
    currentContent = seasons
      .map(x => <a key={x.url} onClick={async () => {
        const r = await Serials.series(x.url);
        setSeries(r);
        setSeasons([]);
      }}>{x.name}</a>);
  }
  else if (list.length) {
    currentContent = list
      .map(x => <a key={x.href} onClick={async () => {
        const r = await Serials.seasons(x.href);
        setSeasons(r);
        setList([]);
      }}>{x.name}</a>);
  }


  return <div>
    <input type="text" value={str} onChange={(e) => setStr(e.target.valuee)}></input>

    <div onClick={async () => {
      const result = await Serials.search(str);
      setList(result);
    }}>Submit</div>

    <div className='outputContainer'>
      {currentContent}
    </div>
  </div>
};