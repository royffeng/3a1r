import { Grid, Text } from "@mantine/core";
import Thumbnail from "../thumbnail";

export const VideoGrid = ({ videos }) => {
  return (
    <div className="z-0 p-0">
      {videos && (
        <>
          <Text aria-label="video count" fz={16} fw={500} className="py-2">
            {videos.length} {`video${videos.length == 1 ? "" : "s"}`}
          </Text>
          {videos.length > 0 && (
            <Grid
              aria-label="video-thumbnail-grid"
              gutter="md"
              className="flex justify-start items-start w-full m-0"
            >
              {videos?.map((video, index) => (
                <Grid.Col
                  aria-label="one-video-thumbnail"
                  xs={6}
                  sm={6}
                  md={6}
                  lg={3}
                  key={index}
                  className="m-0 p-2"
                >
                  <Thumbnail
                    id={video.id}
                    thumbnail={video.thumbnail}
                    title={video.title}
                    username={video.profiles?.username}
                    views={video.views}
                    avatar_url={video.profiles?.avatar_url}
                    date={video.created_at}
                    userid={video.profiles?.id}
                  />
                </Grid.Col>
              ))}
            </Grid>
          )}
        </>
      )}
    </div>
  );
};
