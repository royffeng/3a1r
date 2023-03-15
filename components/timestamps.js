import { Flex, NumberInput, Text } from "@mantine/core";
import { useState } from "react";

export const TimestampInput = ({ lyric, index, handleTimestampChange }) => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  return (
    <Flex>
      <Flex direction="column" sx={{ width: "40%" }}>
        <Text>Lyric:</Text>
        <Text>{`${lyric}`}</Text>
      </Flex>
      <Flex direction="column" sx={{ width: "100%" }}>
        <NumberInput
          placeholder="Start Time"
          label="Enter the start time in seconds"
          value={start}
          precision={5}
          onChange={(e) => {
            setStart(e);
            handleTimestampChange(e, end, index);
          }}
          size="xs"
          withAsterisk
          error={start === null ? "start time required" : null}
        />
        <NumberInput
          placeholder="End Time"
          label="Enter the end time in seconds"
          value={end}
          precision={5}
          onChange={(e) => {
            setEnd(e);
            handleTimestampChange(start, e, index);
          }}
          size="xs"
          withAsterisk
          error={
            end === null
              ? "end time required"
              : end < start
              ? "end time must come after start time"
              : null
          }
        />
      </Flex>
    </Flex>
  );
};
