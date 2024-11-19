// components/TopNav.tsx

"use client";

import {
  Box,
  ColumnLayout,
  Link,
  SpaceBetween,
} from "@cloudscape-design/components";

export default function Footer() {
  return (
    <div>
      <div style={{ backgroundColor: "#f9f9fa" }}>
        <Box margin={"xxl"} textAlign="center">
          <ColumnLayout columns={3}>
            <Box textAlign="center">
              <h3>Why Use PROMPTZ?</h3>
              Simplify software development with ready-to-use solutions.
              Collaborate with the community to refine and share your ideas.
              Learn prompt engineering best practices for every stage of the
              SDLC.
            </Box>
            <Box textAlign="center">
              <h3>About PROMPTZ</h3>
              <p>
                PROMPTZ is your ultimate resource for Amazon Q Developer prompt
                engineering. Discover, create, and share high-quality prompts to
                tackle real-world software development challenges. From
                generating AWS architecture blueprints to automating workflows
                and beyond, PROMPTZ empowers developers to get the most out of
                Amazon Q Developer with a rich library of prompt templates and
                community contributions.
              </p>
            </Box>
            <Box textAlign="center">
              <h3>Contribute to PROMPTZ</h3>
              PROMPTZ is a community-first platform. The source code is open on
              GitHub, and we welcome contributions from developers and
              enthusiasts. If you want to share your ideas, join us on{" "}
              <a href="https://github.com/cremich/promptz">Github</a>.
            </Box>
          </ColumnLayout>
        </Box>
      </div>
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
