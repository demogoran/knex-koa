import React, { useEffect, useState } from 'react';
import { GridList, GridListTile, Button, Typography } from '@material-ui/core';
import { Carousel } from 'react-responsive-carousel';
import Pagination from '@material-ui/lab/Pagination';

import all from '../../tools/api';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from './index.css';

const { Tinder } = all;

const amount = 20;
export default () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        (async () => {
            const count = await Tinder.count();
            setPageCount(Math.ceil(count / amount));

            const result = await Tinder.get(page * amount, amount);
            console.log(result);
            setData(result);
        })();
    }, [page]);


    return <div className={styles.root}>
        <Pagination count={pageCount} page={page} siblingCount={9} onChange={(e, value) => setPage(value)} />

        <GridList cellHeight={160} className={styles.gridList} cols={3}>
            {data.map(tile => (
                <GridListTile className={tile.liked ? 'liked' : ''} key={tile._id} cols={1} style={{ height: 'auto' }}>
                    <Typography>
                        <span className="cellTitle">Name: </span>
                        <span className="cellValue">{tile.name}</span>
                    </Typography>
                    <Typography>
                        <span className="cellTitle">Bio: </span>
                        <span className="cellValue">{tile.bio}</span>
                    </Typography>
                    <Typography>
                        <span className="cellTitle">Teasers: </span>
                        <span className="cellValue">{tile.teasers}</span>
                    </Typography>
                    <Typography>
                        <span className="cellTitle">Birthday: </span>
                        <span className="cellValue">{tile.birth_date}</span>
                    </Typography>
                    <Typography>
                        <span className="cellTitle">Distance: </span>
                        <span className="cellValue">{tile.distance_mi}</span>
                    </Typography>
                    <Typography>
                        <span className="cellTitle">s_number: </span>
                        <span className="cellValue">{tile.s_number}</span>
                    </Typography>
                    <Typography>
                        {
                            tile.liked ? '' :
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="submit"
                                    onClick={async () => {
                                        console.log(tile._id);
                                        console.log(await Tinder.like(tile._id, tile.s_number));
                                        setData(data.map(x => x._id === tile._id
                                            ? {
                                                ...x,
                                                liked: 1
                                            }
                                            : x))
                                    }}>
                                    Submit
                        </Button>}
                    </Typography>
                    <div>
                        <Carousel>
                            {tile.photos
                                .map(x =>
                                    <img key={x} src={x} alt={x} />
                                )}
                        </Carousel>
                    </div>
                </GridListTile>
            ))}
        </GridList>

        <Pagination count={pageCount} page={page} siblingCount={9} onChange={(e, value) => setPage(value)} />
    </div >
}