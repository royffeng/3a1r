import { Textarea, Button, LoadingOverlay, Avatar } from "@mantine/core";
import { useState, useMemo } from "react";

import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Reply({
  placeholder,
  type,
  vid,
  pid,
  avatar_url,
  closeReply,
  initialShowButtons,
}) {
  const [value, setValue] = useState("");
  const [showButtons, setShowButtons] = useState(initialShowButtons ?? true);
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const uid = useMemo(() => {
    return "753b8a89-0624-4dd5-9592-89c664a806c3";
  }, []);

  const handleCommentSubmit = async (vid, uid, content) => {
    const { error } = await supabase
      .from("comments")
      .insert({ vid: vid, uid: uid, content: content });

    if (error) {
      console.log(error);
    } else {
      setValue("");
    }

    setLoading(false);
  };

  const handleReplySubmit = async (pid, uid, content) => {
    const { error } = await supabase
      .from("replies")
      .insert({ pid: pid, uid: uid, content: content });

    if (error) {
      console.log(error);
    }

    if (closeReply !== undefined) closeReply();
    setLoading(false);
  };

  return (
    <div style={{ marginBottom: "0.375rem" }}>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>
          {avatar_url !== undefined ? (
            <Avatar
              src={avatar_url}
              style={{ marginRight: "1rem" }}
              radius="xl"
              alt="no image here"
            />
          ) : (
            <Avatar
              style={{ marginRight: "1rem" }}
              radius="xl"
              alt="no image here"
            />
          )}
        </div>
        <div style={{ width: "100%" }}>
          <Textarea
            onFocus={() => setShowButtons(true)}
            style={{
              marginBottom: "0.375rem",
            }}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            placeholder={placeholder}
            autosize
            minRows={1}
          />
          {showButtons && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                style={{ marginRight: "0.5rem" }}
                size="xs"
                radius="xl"
                variant="subtle"
                onClick={() => {
                  setValue("");
                  if (closeReply !== undefined) closeReply();
                  if (initialShowButtons !== undefined) setShowButtons(false);
                }}
              >
                Cancel
              </Button>
              {value === "" ? (
                <Button size="xs" radius="xl" disabled>
                  {type}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setLoading(true);
                    type === "Comment"
                      ? handleCommentSubmit(vid, uid, value)
                      : handleReplySubmit(pid, uid, value);
                  }}
                  size="xs"
                  radius="xl"
                >
                  {type}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
