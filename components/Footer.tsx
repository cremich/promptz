// components/TopNav.tsx

"use client";

import { Box, Link, SpaceBetween } from "@cloudscape-design/components";

export default function Footer() {
  return (
    <div>
      <Box textAlign="center" margin={"xxl"}>
        <SpaceBetween size="m">
          <div>
            Stay connected with PROMPTZ! ⭐ us on{" "}
            <Link
              external
              href="https://github.com/cremich/promptz"
              variant="secondary"
            >
              Github
            </Link>{" "}
            and join the conversation.
          </div>
          <div>
            Made with 💜 by{" "}
            <Link
              external
              href="https://www.linkedin.com/in/christian-bonzelet/"
              variant="secondary"
            >
              Christian Bonzelet
            </Link>{" "}
            with a lot of help by{" "}
            <Link
              external
              href="https://aws.amazon.com/q/developer/"
              variant="secondary"
            >
              Amazon Q Developer
            </Link>
          </div>
        </SpaceBetween>
      </Box>
    </div>
  );
}
