"use client";

import Image from "next/image";
import Header from "../components/Header";
import { Flex, Text, Button } from "@radix-ui/themes";

export default function Home() {
  return (
    <Flex direction="column" className="min-h-screen" align="center" gap="6" style={{ padding: "2rem" }}>
      {/* Header */}
      <Header />

      {/* Main content */}
      <Flex direction="column" gap="4" align="center">
        <Text size="7" weight="bold">
          Welcome to Next.js 🚀
        </Text>

        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <Flex direction="column" gap="2" align="start">
          <Text>
            Get started by editing <code>src/app/page.tsx</code>.
          </Text>
        </Flex>

        <Button onClick={() => alert("Radix Button clicked!")}>
          Try a Radix Button
        </Button>
      </Flex>

      {/* Footer */}
      <Flex justify="center" style={{ marginTop: "auto" }}>
        <Text>Built with ❤️ using Next.js</Text>
      </Flex>
    </Flex>
  );
}
