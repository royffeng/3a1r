import React from 'react';
import tn_styles from './thumbnail.module.css'
import { Row, Col } from 'react-bootstrap'
import Link from 'next/link'


const Thumbnail = ({id, name, artist, views, thumbnail}) => {
  return (
    <div className={tn_styles.thumbnail}>
    <Link target='_blank' href={`/karaoke?vid=${id}`}>
        <div className={tn_styles.info}>
            <img src={thumbnail} className={tn_styles.vid_img} />
              <Row>
                <Col>
                  <div className = {tn_styles.title}>{name}</div>
                  <div>{artist}</div>
                  <div>{views}</div>
                </Col>
              </Row>
        </div>
    </Link>
</div>
  )
}

export default Thumbnail