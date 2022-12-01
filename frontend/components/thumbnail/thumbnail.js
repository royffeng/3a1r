import React from 'react';
import tn_styles from './thumbnail.module.css'
import { Row, Col } from 'react-bootstrap'
import Link from 'next/link'


const Thumbnail = ({name, artist, views}) => {
  return (
    <div className={tn_styles.thumbnail}>
    <Link target='_blank' href="/karaoke">
        <div className={tn_styles.info}>
            <img src='https://pbs.twimg.com/media/Fa-oG2gaIAEL6po.jpg:large' className={tn_styles.vid_img} />
              <Row>
                <Col>
                  <div className = {tn_styles.title}>{name}</div>
                  <div>{artist}</div>
                  <div>{views}</div>
                </Col>
                <Col>
                </Col>
              </Row>
        </div>
    </Link>
</div>
  )
}

export default Thumbnail