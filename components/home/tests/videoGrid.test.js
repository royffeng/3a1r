import { render, screen } from "@testing-library/react";
import { VideoGrid } from "../videoGrid";

// describe(VideoGrid, () => {
//     it("handles 0 videos", () => {
//         const {} = render(<VideoGrid videos={[]}/>)
//         // const 
//         expect().toHaveLength
//     });
// })
test("handles 0 videos", () => {
    render(<VideoGrid videos={[]}/>)
    const videoCount = screen.queryByLabelText('video count').textContent;
    const videoGrid = screen.queryAllByLabelText('video thumbnail');
    expect(videoCount).toEqual("0 videos")
    expect(videoGrid).toHaveLength(0);
})