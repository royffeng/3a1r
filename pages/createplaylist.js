import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Thumbnail from "../components/thumbnail";
import { Row, Col } from "react-bootstrap";
import { AiFillHeart } from "react-icons/ai";
import Navbar from "../components/navbar";

const createplaylist = ({ searchContext }) => {
  return (
    <div>
      <Navbar searchContext={searchContext} />
      <div className="pt-20 px-4">
        <Row className="flex justify-center items-center">
          {playlist && (
            <>
              {" "}
              <Col xl={2} className="flex justify-center items-center">
                <img src={playlist.thumbnail_url} className="rounded-xl" />
              </Col>
              <Col xl={10}>
                <div className="flex flex-col justify-center items-start">
                  <div className="font-bold text-6xl my-2">{playlist.name}</div>
                  <div className="font-semibold text-3xl my-4">
                    public playlist
                  </div>
                  <div className="mb-2">{videos.length} videos</div>
                </div>
                {profile && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <img
                        src={profile.avatar_url}
                        className="rounded-full w-10 aspect-square object-cover mr-2"
                      />
                      <p className="mb-0">{profile.username}</p>
                    </div>
                    <div className="flex items-center mr-3">
                      <p className="text-2xl mb-0 mx-1">{playlist.likes}</p>
                      <AiFillHeart className="text-2xl" />
                    </div>
                  </div>
                )}
              </Col>
            </>
          )}
        </Row>
        </div>
    </div>
  );
};

export default createplaylist;
