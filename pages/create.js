import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import {
  Button,
  Flex,
  JsonInput,
  Notification,
  SegmentedControl,
  Space,
  Textarea,
  MultiSelect,
} from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import S3 from "aws-sdk/clients/s3";
import axios from "axios";
import "filepond/dist/filepond.min.css";
import { AiFillCheckCircle } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import { TimestampInput } from "../components/timestamps";
import { UserContext } from "../utils/UserContext";
import { GENRE_LIST } from "../utils/genres";
import Navbar from "../components/navbar";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

const s3 = new S3({
  region: "us-west-2",
  accessKeyId: process.env.NEXT_PUBLIC_AWS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
  signatureVersion: "v4",
});

export default function Create({ searchContext }) {
  const user = useContext(UserContext);
  const supabase = useSupabaseClient();
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [inputStyle, setInputStyle] = useState("default");
  const [jsonTimestamps, setJsonTimeStamps] = useState("");
  const [timestamps, setTimestamps] = useState(null);
  const [success, setSuccess] = useState(false);
  const [genres, setGenres] = useState([]);
  const [searchValue, onSearchChange] = useState("");
  const uuid = useMemo(() => uuidv4(), []);

  const insertVideo = useCallback(
    async (user, title, description, uuid, lyrics, timestamps) => {
      let lyricTimestamp = lyrics.split("\n").map((l, i) => {
        return { lyrics: l, ...timestamps[i] };
      });
      if (lyricTimestamp[0].start !== 0) {
        lyricTimestamp = [
          { lyrics: "", start: 0, end: lyricTimestamp[0].start },
          ...lyricTimestamp,
        ];
      }
      if (lyricTimestamp[0].start !== 0) {
        console.log("yo");
      }
      let { data, error } = await supabase
        .from("video")
        .insert([
          {
            uid: user.id,
            title: title,
            description: description,
            thumbnail: `${process.env.NEXT_PUBLIC_THUMBNAIL_BASE}${uuid}/Thumbnails/${uuid}.0000000.jpg`,
            lyrics: lyricTimestamp,
            videourl: `${process.env.NEXT_PUBLIC_URL_BASE}HLS/${uuid}_720.m3u8`,
          },
        ])
        .select();

      if (error) {
        console.log("insert video likes error: ", error);
      } else {
        console.log(data);
        console.log(
          genres.map((g) => {
            return { genre: g, vid: data[0].id };
          })
        );
        genres.forEach(async (g) => {
          if (data.length > 0 && data[0]) {
            let { data, error } = await supabase.from("videoGenres").insert(
              genres.map((g) => {
                return { genre: g, vid: data[0].id };
              })
            );
            if (error) {
              console.log("insert video genres error: ", error);
            }
          }
        });
        setSuccess(true);
      }
    },
    []
  );

  useEffect(() => {
    console.log(files);
  }, [files]);

  useEffect(() => {
    if (timestamps !== null) {
      console.log(
        lyrics.split("\n").map((l, i) => {
          return { lyrics: l, ...timestamps[i] };
        })
      );
    }
  }, [timestamps, lyrics]);

  function handleTimestampChange(start, end, index) {
    const newTimestamps = timestamps.map((t, i) => {
      if (i == index) {
        return {
          start: start,
          end: end,
        };
      } else return t;
    });

    setTimestamps(newTimestamps);
  }

  return (
    <>
      <Navbar searchContext={searchContext} />
      <Flex
        direction="column"
        className="pt-20"
        sx={{
          padding: "0 2rem",
        }}
        gap="xl"
      >
        <FilePond
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={false}
          allowFileTypeValidation
          labelFileTypeNotAllowed
          acceptedFileTypes={["video/*", "image/*"]}
          maxFiles={1}
          server={{
            process: (
              fieldName,
              file,
              metadata,
              load,
              error,
              progress,
              abort
            ) => {
              const controller = new AbortController();
              try {
                const ext =
                  file.name.substring(
                    file.name.lastIndexOf(".") + 1,
                    file.name.length
                  ) || file.name;
                let newFileName = `${uuid}.${ext}`;
                const fileParams = {
                  Bucket: process.env.NEXT_PUBLIC_BUCKET,
                  Key: newFileName,
                  Expires: 600,
                  ContentType: file.type,
                };
                (async () => {
                  const url = await s3.getSignedUrlPromise(
                    "putObject",
                    fileParams
                  );
                  await axios.put(url, file, {
                    headers: {
                      "Content-type": String(file.type),
                    },
                    onUploadProgress: (e) => {
                      progress(e.event.lengthComputable, e.loaded, e.total);
                    },
                  });
                })();
              } catch (err) {
                error(err);
              }
              return {
                abort: () => {
                  controller.abort();
                  abort();
                },
              };
            },
          }}
          name="files"
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        />
        <Textarea
          placeholder="Title"
          label="Add a title that describes your video"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          size="xl"
          withAsterisk
          error={title == "" ? "Title is required" : null}
        />
        <Textarea
          placeholder="Description"
          label="Describe your video"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          size="xl"
        />
        <MultiSelect
          data={GENRE_LIST}
          placeholder="Genre(s)"
          label="Choose all that apply"
          searchable
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onChange={setGenres}
          error={genres.length === 0 ? "genre is required" : null}
        />
        <Textarea
          placeholder="Lyrics"
          label="Enter your lyrics"
          value={lyrics}
          onChange={(e) => {
            setLyrics(
              e.currentTarget.value.replace(/(\r\n\r\n|\n\n|\r\r)/gm, "\n")
            );
            setTimestamps([...Array(e.currentTarget.value.split("\n").length)]);
          }}
          size="xl"
          withAsterisk
          error={lyrics == "" ? "lyrics are required" : null}
        />
        <SegmentedControl
          data={[
            { label: "Default Timestamp Input", value: "default" },
            { label: "Json Timestamp Input", value: "json" },
          ]}
          color="green"
          onChange={(e) => setInputStyle(e)}
        />
        {inputStyle === "default" ? (
          lyrics
            .split("\n")
            .map((l, i) => (
              <TimestampInput
                key={`${l} ${i}`}
                index={i}
                lyric={l}
                handleTimestampChange={handleTimestampChange}
              />
            ))
        ) : (
          <JsonInput
            label="Your Timestamps in json"
            placeholder="Input your timestamps as json[], each object will look like this: {start: [your start here], end: [your end here]}"
            validationError="Invalid json"
            value={jsonTimestamps}
            onChange={setJsonTimeStamps}
            formatOnBlur
            autosize
            minRows={4}
          />
        )}
        {success ? (
          <Notification
            icon={<AiFillCheckCircle size={20} />}
            sx={{ backgroundColor: "white" }}
            radius="md"
            color="teal"
            title="Upload Complete"
          >
            You can return to the home page
          </Notification>
        ) : (
          <Button
            size="xl"
            disabled={
              title !== "" &&
              lyrics !== "" &&
              timestamps.length !== 0 &&
              genres.length !== 0
                ? null
                : true
            }
            className="bg-micdrop-green"
            onClick={() =>
              insertVideo(user, title, description, uuid, lyrics, timestamps)
            }
          >
            Upload Video
          </Button>
        )}
        <Space h={32} />
      </Flex>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};