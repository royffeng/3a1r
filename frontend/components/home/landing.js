import React, { useEffect, useState } from 'react'
import styles from './landing.module.css'
import Thumbnail from '../thumbnail/thumbnail';
import { Row, Col } from "react-bootstrap";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const landing = () => {
  const supabase = useSupabaseClient();
  const [videos, setVideos] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase
        .from("video")
        .select(
          `
            id,
            title,
            thumbnail, 
            views
          `
        ).filter("title", "neq", null);
      if(error) {
        console.log(error)
        return
      } else {
        setVideos(data)
        console.log(data)
      }
      
  }

  fetchData()

}, [])

  return (
    <div className = {styles.liked_songs_header}>
      <p className={styles.liked_songs}>Liked Songs</p>
      <Row>
        {
          videos?.slice(0, 1).map((song, index) => (
            <Col xl = {3} key = {index}>
              <Thumbnail id = {song.id} thumbnail = {song.thumbnail} name= {song.title?.substring(song.title?.indexOf('\"') + 1, song.title?.indexOf('\"', song.title?.indexOf('\"') + 1))} artist = {song.title?.split(" ")[0]} views = {song.views} />
            </Col>
          ))
        }
      </Row>
    </div>
  )
}

export default landing