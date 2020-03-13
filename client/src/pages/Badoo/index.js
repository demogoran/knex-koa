import React, { useEffect, useState } from 'react';
import { GridList, GridListTile, Button, Typography } from '@material-ui/core';
import { Carousel } from 'react-responsive-carousel';
import Pagination from '@material-ui/lab/Pagination';

import all from '../../tools/api';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from './index.css';

const { Badoo } = all;

const amount = 20;
export default () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        (async () => {
            const count = await Badoo.count();
            setPageCount(Math.ceil(count / amount));

            const result = await Badoo.get(page * amount, amount);
            console.log(result);
            setData(result);
        })();
    }, [page]);


    return <div className={styles.root}>
        <Pagination count={pageCount} page={page} siblingCount={9} onChange={(e, value) => setPage(value)} />

        <GridList cellHeight={160} className={styles.gridList} cols={3}>
            {data.map(tile => (
                <GridListTile className={tile.liked ? 'liked' : ''} key={tile.userid} cols={1} style={{ height: 'auto' }}>
                    <Typography>
                        <span className="cellTitle">Name: </span>
                        <span className="cellValue">{tile.name}</span>
                    </Typography>

                    {tile.info.map((key, value) => (<Typography>
                        <span className="cellTitle">{key}</span>
                        <span className="cellValue">{value}</span>
                    </Typography>))}

                    <Typography>
                        <span className="cellTitle">Networks: </span>
                        <span className="cellValue">{tile.networks.join('\n')}</span>
                    </Typography>
                    <Typography>
                        <span className="cellTitle">Age: </span>
                        <span className="cellValue">{tile.age}</span>
                    </Typography>
                    <Typography>
                        {
                            /* tile.liked ? '' :
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="submit"
                                    onClick={async () => {
                                        console.log(tile._id);
                                        console.log(await Badoo.like(tile._id, tile.s_number));
                                        setData(data.map(x => x._id === tile._id
                                            ? {
                                                ...x,
                                                liked: 1
                                            }
                                            : x))
                                    }}>
                                    Submit</Button> */
                        }
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