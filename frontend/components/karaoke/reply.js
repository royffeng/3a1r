import {
  Avatar,
  Button,
  Flex,
  LoadingOverlay,
  Space,
  Textarea,
} from "@mantine/core";
import { useContext, useState } from "react";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { UserContext } from "../../utils/UserContext";

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
  const user = useContext(UserContext);

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
    <Flex sx={{ position: "relative" }}>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Flex direction="row" gap="md" sx={{ width: "100%" }}>
        <>
          {avatar_url !== undefined ? (
            <Avatar src={avatar_url} radius="xl" alt="no image here" />
          ) : (
            <Avatar radius="xl" alt="no image here" />
          )}
        </>
        <Flex direction="column" gap="sm" sx={{ width: "100%" }}>
          <Textarea
            onFocus={() => setShowButtons(true)}
            sx={{ width: "100%" }}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            placeholder={placeholder}
            autosize
            minRows={1}
          />
          {showButtons && (
            <Flex justify="flex-end">
              <Button
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
              <Space w="xs" />
              {value === "" ? (
                <Button size="xs" radius="xl" disabled>
                  {type}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setLoading(true);
                    type === "Comment"
                      ? handleCommentSubmit(vid, user.id, value)
                      : handleReplySubmit(pid, user.id, value);
                  }}
                  size="xs"
                  radius="xl"
                >
                  {type}
                </Button>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
