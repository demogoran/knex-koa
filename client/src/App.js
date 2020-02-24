import React, { useState } from "react";
import { TextField, Button, List, ListItem, ListItemText, Modal } from '@material-ui/core';

import all from './tools/api';

import './App.css';


const { Serials } = all;

const useLocalState = (name, defaultValue = []) => {
  let item;
  try {
    item = JSON.parse(localStorage.getItem(name)) || defaultValue;
  }
  catch (ex) {
    item = defaultValue;
  }

  const [state, setState] = useState(item);
  return [state, (val) => {
    localStorage.setItem(name, JSON.stringify(val));
    return setState(val);
  }]
}

let visited
try {
  visited = JSON.parse(localStorage.getItem('visited'));
}
catch (ex) {

}
if (!visited) {
  visited = {
    links: [],
    seasons: [],
    series: [],
  };
}

const setVisited = (type, value) => {
  visited[type].push(value);
  localStorage.setItem('visited', JSON.stringify(visited));
}

export default () => {
  const [str, setStr] = useLocalState('str', 'Друзья');
  const [list, setList] = useLocalState('list');
  const [seasons, setSeasons] = useLocalState('seasons');
  const [series, setSeries] = useLocalState('series');
  const [currentVideo, setCurrentVideo] = useState([]);

  const [open, setOpen] = useState(false);

  console.log(visited);
  let currentContent = <div></div>;

  if (series.length) {
    currentContent = <List component="nav" aria-label="secondary mailbox folders">
      {series
        .map(x => <ListItem
          button
          key={x.file}
          className={visited.series.indexOf(x.vars) > -1 ? 'visited' : ''}
          onClick={async () => {
            setCurrentVideo(x.file);
            setOpen(true);
            setVisited('series', x.vars);
          }}>
          <ListItemText primary={x.title.replace('<br>', '')} />
        </ListItem>)
      }
    </List >
  }
  else if (seasons.length) {
    currentContent = <List component="nav" aria-label="secondary mailbox folders">
      {seasons
        .map(x => <ListItem
          button
          key={x.url}
          className={visited.seasons.indexOf(x.id) > -1 ? 'visited' : ''}
          onClick={async () => {
            const r = await Serials.series(x.url);
            setSeries(r);
            setVisited('seasons', x.id);
          }}>
          <ListItemText primary={x.name} />
        </ListItem>)}
    </List>
  }
  else if (list.length) {
    currentContent = <List component="nav" aria-label="secondary mailbox folders">
      {list
        .map(x => <ListItem
          button
          key={x.href}
          className={visited.links.indexOf(x.id) > -1 ? 'visited' : ''}
          onClick={async () => {
            const r = await Serials.seasons(x.href);
            setSeasons(r);
            setVisited('links', x.id);
          }}>
          <ListItemText primary={x.name} />
        </ListItem>)}
    </List>
  }

  return <div>
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClose={() => setOpen(false)}
    >
      <video controls autoPlay className="modal" src={currentVideo}></video>
    </Modal>

    <TextField label="Search" value={str} onChange={(e) => setStr(e.target.value)} />


    <Button
      variant="contained"
      color="primary"
      className="submit"
      onClick={async () => {
        const result = await Serials.search(str);
        setList(result);
      }}>
      Submit
    </Button>

    <Button
      variant="contained"
      color="secondary"
      className="submit"
      onClick={async () => {
        if (series.length) {
          setSeries([]);
        }
        else if (seasons.length) {
          setSeasons([]);
        }
        else if (list.length) {
          setList([]);
        }
      }}>
      Back
    </Button>

    <div className='outputContainer'>
      {currentContent}
    </div>
  </div>
};