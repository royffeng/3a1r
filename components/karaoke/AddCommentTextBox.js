import { Button, Flex, LoadingOverlay, Space, Textarea } from "@mantine/core";
import { useCallback, useContext, useState } from "react";
import UserAvatar from "./UserAvatar";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { UserContext } from "../../utils/UserContext";

export default function AddCommentTextBox({
  placeholder,
  vid,
  avatar_url,
  initialShowButtons,
  handleNewComment,
}) {
  const [value, setValue] = useState("");
  const [showButtons, setShowButtons] = useState(initialShowButtons ?? true);
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const user = useContext(UserContext);

  const handleCommentSubmit = useCallback(
    async (vid, uid, content) => {
      const { data, error } = await supabase
        .from("comments")
        .insert({ vid: vid, uid: uid, content: content })
        .select(
          `
        cid, 
        uid,
          content,
          created_at,
          likes,
          dislikes,
          profiles(
            username,
            avatar_url
          )
        `
        );

      if (error) {
        console.log(error);
      } else {
        handleNewComment({
          ...data[0],
          profiles: { avatar_url: user.avatarUrl, username: user.username },
        });
        setValue("");
      }

      setLoading(false);
    },
    [user, handleNewComment]
  );

  return (
    <div>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <div className="flex justify-center items-center w-full">
        <UserAvatar avatarUrl={avatar_url} />

        <div className="w-full flex justify-center items-start flex-col">
          <>
            {user ? (
              <textarea
                className="rounded-3xl px-4 py-3 font-lexend text-xl w-full m-2"
                onFocus={() => setShowButtons(true)}
                sx={{ width: "100%" }}
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                placeholder={placeholder}
                autosize
                minRows={1}
              />
            ) : (
              <textarea
                className="rounded-3xl px-4 py-3 font-lexend text-xl w-full m-2"
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
        </div>
      </div>
      <div>
        {showButtons && (
          <Flex justify="flex-end">
            <Button
              size="xs"
              radius="xl"
              variant="subtle"
              onClick={() => {
                setValue("");
                if (initialShowButtons !== undefined) setShowButtons(false);
              }}
            >
              Cancel
            </Button>
            <Space w="xs" />
            {value === "" ? (
              <Button size="xs" radius="xl" disabled>
                Comment
              </Button>
            ) : (
              <Button
                className="bg-micdrop-green"
                onClick={() => {
                  setLoading(true);
                  handleCommentSubmit(vid, user.id, value);
                }}
                size="xs"
                radius="xl"
              >
                Comment
              </Button>
            )}
          </Flex>
        )}
      </div>
    </div>
  );
}
