import React, { useState } from "react";
import { List, ListItem, ListItemText, Modal } from '@material-ui/core';

import all from './tools/api';


import styles from './App.css';


const { Serials } = all;

const ListItemLink = (props) => <ListItem button component="a" {...props} />;

export default () => {
  const [str, setStr] = useState('друзья');
  const [list, setList] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [series, setSeries] = useState([]);
  const [currentVideo, setCurrentVideo] = useState([]);

  const [open, setOpen] = useState(false);

  let currentContent = <div></div>;

  if (series.length) {
    currentContent = <List component="nav" aria-label="secondary mailbox folders">
      {series
        .map(x => <ListItem
          button
          key={x.file}
          onClick={async () => {
            setCurrentVideo(x.file);
            setOpen(true);
          }}>
          <ListItemText primary={x.title.replace('<br>', '')} />
        </ListItem>)}
    </List>
  }
  else if (seasons.length) {
    currentContent = <List component="nav" aria-label="secondary mailbox folders">
      {seasons
        .map(x => <ListItem
          button
          key={x.url}
          onClick={async () => {
            const r = await Serials.series(x.url);
            setSeries(r);
            setSeasons([]);
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
          onClick={async () => {
            const r = await Serials.seasons(x.href);
            setSeasons(r);
            setList([]);
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