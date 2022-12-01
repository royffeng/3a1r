import React from 'react'
import styles from './landing.module.css'
import Thumbnail from '../thumbnail/thumbnail';
import { Row, Col } from "react-bootstrap";

const songs = [
  {name: "Talk that Talk", artist: "TWICE", views: "20 million"}, 
  {name: "Perfect World", artist: "TWICE", views: "20 million"}, 
  {name: "Cry for Me", artist: "TWICE", views: "20 million"},
  {name: "Feel Special", artist: "TWICE", views: "20 million"}
]

const landing = () => {
  return (
    <div className = {styles.liked_songs_header}>
      <p className={styles.liked_songs}>Liked Songs</p>
      <Row>
        {
          songs.map((song, index) => (
            <Col xl = {3} key = {index}>
              <Thumbnail name= {song.name} artist = {song.artist} views = {song.views} />
            </Col>
          ))
        }
      </Row>
    </div>
  )
}

export default landing