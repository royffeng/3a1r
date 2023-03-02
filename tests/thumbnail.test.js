import { render, screen } from "@testing-library/react";
import Thumbnail from "../components/thumbnail";

let thumbnailMockData = {
  id: "",
  title: "",
  thumbnail: "",
  username: "",
  views: 12,
  thumbnail: "",
  avatar_url: "",
  created_at: "2022-10-23 20:07:44+00",
};

test("handles missing avatar", () => {
  render(
    <Thumbnail
      id={thumbnailMockData.id}
      thumbnail={thumbnailMockData.thumbnail}
      title={thumbnailMockData.title}
      username={thumbnailMockData.username}
      views={thumbnailMockData.views}
      avatar_url={null}
      date={thumbnailMockData.created_at}
    />
  );
  const avatar = screen.queryAllByLabelText(
    "avatar of user who created this video"
  );
  expect(avatar).toHaveLength(1);
});

test("handles 1 view", () => {
  render(
    <Thumbnail
      id={thumbnailMockData.id}
      thumbnail={thumbnailMockData.thumbnail}
      title={thumbnailMockData.title}
      username={thumbnailMockData.username}
      views={1}
      avatar_url={null}
      date={thumbnailMockData.created_at}
    />
  );
  const views = screen.queryByLabelText("video views").textContent;
  expect(views).toEqual("1 view");
});

test("handles multiple views", () => {
  render(
    <Thumbnail
      id={thumbnailMockData.id}
      thumbnail={thumbnailMockData.thumbnail}
      title={thumbnailMockData.title}
      username={thumbnailMockData.username}
      views={thumbnailMockData.views}
      avatar_url={null}
      date={thumbnailMockData.created_at}
    />
  );
  const views = screen.queryByLabelText("video views").textContent;
  expect(views).toEqual(`${thumbnailMockData.views} views`);
});

test("handles no username", () => {
  render(
    <Thumbnail
      id={thumbnailMockData.id}
      thumbnail={thumbnailMockData.thumbnail}
      title={thumbnailMockData.title}
      username={null}
      views={thumbnailMockData.views}
      avatar_url={null}
      date={thumbnailMockData.created_at}
    />
  );
  const thumbnail = screen.queryAllByLabelText("video thumbnail");
  expect(thumbnail).toHaveLength(0);
});
