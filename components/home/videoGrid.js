import { Grid, Text } from "@mantine/core";
import Thumbnail from "../thumbnail/thumbnail";

export const VideoGrid = ({ videos }) => {
  return (
    <>
      {videos && (
        <>
          <Text fz={16} fw={500}>
            {videos.length} videos
          </Text>
          <Grid gutter="md" sx={{ width: "100%" }}>
            {videos?.map((video, index) => (
              <Grid.Col xs={6} sm={6} md={6} lg={3} key={index}>
                <Thumbnail
                  id={video.id}
                  thumbnail={video.thumbnail}
                  title={video.title}
                  username={video.profiles?.username}
                  views={video.views}
                  avatar_url={video.profiles.avatar_url}
                  date={video.created_at}
                />
              </Grid.Col>
            ))}
          </Grid>
        </>
      )}
    </>
  );
};
