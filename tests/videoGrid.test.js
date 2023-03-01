import { render, screen } from "@testing-library/react";
import { VideoGrid } from "../components/home/videoGrid";

let videoMockData = [
  {
    title: "title1",
    description: "description",
    videoUrl: "http://video.com",
    views: 0,
  },
  {
    title: "title2",
    description: "description",
    videoUrl: "http://video.com",
    views: 0,
  },
  {
    title: "title3",
    description: "description",
    videoUrl: "http://video.com",
    views: 0,
  },
  {
    title: "title4",
    description: "description",
    videoUrl: "http://video.com",
    views: 0,
  },
  {
    title: "title5",
    description: "description",
    videoUrl: "http://video.com",
    views: 0,
  },
  {
    title: "title6",
    description: "description",
    videoUrl: "http://video.com",
    views: 0,
  },
];

test("handles 0 videos", () => {
  render(<VideoGrid videos={[]} />);
  const videoCount = screen.queryByLabelText("video count").textContent;
  const videoGrid = screen.queryAllByLabelText("video-thumbnail-grid");
  const videoThumbnail = screen.queryAllByLabelText("one-video-thumbnail");
  expect(videoCount).toEqual("0 videos");
  expect(videoGrid).toHaveLength(0);
  expect(videoThumbnail).toHaveLength(0);
});

test("handles one videos", () => {
  render(<VideoGrid videos={[videoMockData[0]]} />);
  const videoCount = screen.queryByLabelText("video count").textContent;
  expect(videoCount).toEqual("1 video");
});

test("handles multiple videos", () => {
  render(<VideoGrid videos={videoMockData} />);
  const videoCount = screen.queryByLabelText("video count").textContent;
  const videoGrid = screen.queryAllByLabelText("video-thumbnail-grid");
  const videoThumbnail = screen.queryAllByLabelText("one-video-thumbnail");
  expect(videoCount).toEqual("6 videos");
  expect(videoGrid).toHaveLength(1);
  expect(videoThumbnail).toHaveLength(6);
});
