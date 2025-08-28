"use client";

import { state } from "@/state/state";
import { useSnapshot } from "valtio";
import { Flex, Text, Button } from "@radix-ui/themes";

export default function Header() {
  const snap = useSnapshot(state);

  return (
    <Flex direction="column" gap="2" align="center" style={{ padding: "1rem" }}>
      <Text as="div" size="4">Header</Text>
      <Text>Count: {snap.count}</Text>
      <Button onClick={() => state.count++}>Increase</Button>
    </Flex>
  );
}
