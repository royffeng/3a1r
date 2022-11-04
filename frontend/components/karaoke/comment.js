import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { Avatar } from "@mantine/core";
import { Button } from "@mantine/core";
import { rectifyFormat } from "../../utils/formatUTC";
import { COMMENTS } from "./twiceDemo";

/* todo: 
  - recursive comments
  - format likes, dislikes and likes, dislike onclick
*/

function Comment({ props }) {
  let { content, authorUsername, date, likes, dislikes } = props;
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div>
        <Avatar
          style={{ marginRight: "1rem" }}
          radius="xl"
          alt="no image here"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "flex-start",
            marginBottom: "0.5rem",
          }}
        >
          <p style={{ marginBottom: 0, marginTop: 0, marginRight: "0.5rem" }}>
            {authorUsername}
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              marginTop: 0,
              marginBottom: 0,
              marginRight: "0.5rem",
            }}
          >
            {rectifyFormat(date)}
          </p>
        </div>
        <p style={{ margin: 0 }}>{content}</p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Button
            style={{ marginRight: "0.25rem" }}
            color="gray"
            compact
            size="xs"
            variant="light"
            radius="xl"
          >
            <AiFillLike size={12} />
          </Button>
          <p style={{ marginRight: "1rem" }}>{likes}</p>
          <Button
            style={{ marginRight: "0.25rem" }}
            color="gray"
            compact
            size="xs"
            variant="light"
            radius="xl"
          >
            <AiFillDislike size={12} />{" "}
          </Button>
          <p>{dislikes}</p>
        </div>
      </div>
    </div>
  );
}

export default function Comments() {
  return (
    <>
      {COMMENTS.map((comment) => (
        <Comment key={comment.authorUsername} props={comment} />
      ))}
    </>
  );
}
