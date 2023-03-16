import { Button, Flex, LoadingOverlay, Space, Textarea } from "@mantine/core";
import { useCallback, useContext, useState } from "react";
import UserAvatar from "./UserAvatar";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { UserContext } from "../../utils/UserContext";

export default function AddReplyTextBox({
  placeholder,
  ogAuthor,
  pid,
  closeReply,
  avatar_url,
  handleNewReply,
}) {
  const [value, setValue] = useState("");
  const [showButtons, setShowButtons] = useState(true);
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const user = useContext(UserContext);

  const handleReplySubmit = useCallback(
    async (user, handleNewReply, pid, uid, content) => {
      const { data, error } = await supabase
        .from("replies")
        .insert({
          pid: pid,
          uid: uid,
          content: ogAuthor !== undefined ? `@${ogAuthor} ${content}` : content,
        })
        .select();

      if (error) {
        console.log(error);
      } else {
        console.log({
          ...data[0],
          profiles: { avatar_url: user.avatarUrl, username: user.username },
        });
        handleNewReply({
          ...data[0],
          profiles: { avatar_url: user.avatarUrl, username: user.username },
        });
      }

      closeReply();
      setLoading(false);
    },
    []
  );

  return (
    <Flex sx={{ position: "relative" }}>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Flex direction="row" gap="md" sx={{ width: "100%" }}>
        <UserAvatar avatarUrl={avatar_url} />
        <Flex direction="column" gap="sm" sx={{ width: "100%" }}>
          <>
            {user ? (
              <Textarea
                onFocus={() => setShowButtons(true)}
                sx={{ width: "100%" }}
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                placeholder={placeholder}
                autosize
                minRows={1}
              />
            ) : (
              <Textarea
                onFocus={() => setShowButtons(true)}
                sx={{ width: "100%" }}
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                placeholder={"Sign in to Comment"}
                autosize
                minRows={1}
                disabled
              />
            )}
          </>
          {showButtons && (
            <Flex justify="flex-end">
              <Button
                size="xs"
                radius="xl"
                variant="subtle"
                onClick={() => {
                  setValue("");
                  closeReply();
                  setShowButtons(false);
                }}
              >
                Cancel
              </Button>
              <Space w="xs" />
              {user ? (
                value === "" ? (
                  <Button size="xs" radius="xl" disabled>
                    Reply
                  </Button>
                ) : (
                  <Button
                    className="bg-micdrop-green"
                    onClick={() => {
                      setLoading(true);
                      handleReplySubmit(
                        user,
                        handleNewReply,
                        pid,
                        user.id,
                        value
                      );
                    }}
                    size="xs"
                    radius="xl"
                  >
                    Reply
                  </Button>
                )
              ) : (
                <Button size="xs" radius="xl" disabled>
                  Sign in to Reply
                </Button>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
