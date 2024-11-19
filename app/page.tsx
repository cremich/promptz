"use client";

import "@aws-amplify/ui-react/styles.css";
import "./app.css";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

import {
  Box,
  ColumnLayout,
  Container,
  ContentLayout,
  Grid,
  Header,
  SpaceBetween,
} from "@cloudscape-design/components";
import PromptCollection from "@/components/PromptCollection";
import HomeHeader from "@/components/HomeHeader/HomeHeader";

Amplify.configure(outputs);

export default function App() {
  return (
    <ContentLayout
      defaultPadding
      disableOverlap
      headerVariant="high-contrast"
      maxContentWidth={1024}
      header={<HomeHeader />}
    >
      <Box margin={{ top: "xxl" }}>
        <SpaceBetween size="xxl">
          <Grid
            gridDefinition={[
              { colspan: { xxs: 12, xs: 12, s: 4, m: 4, xl: 4 } },
              { colspan: { xxs: 12, xs: 12, s: 4, m: 4, xl: 4 } },
              { colspan: { xxs: 12, xs: 12, s: 4, m: 4, xl: 4 } },
            ]}
          >
            <div>
              <Container
                header={<Header variant="h2">One home for all prompts</Header>}
              >
                <strong>PROMPTZ</strong> is here to help you discover, create,
                and perfect your prompts for Amazon Q Developer for every step
                of the software development lifecycle.
              </Container>
            </div>
            <div>
              <Container
                header={
                  <Header variant="h2">Explore the Prompt Library </Header>
                }
              >
                Browse through a rich collection of prompts, categorized by the
                stages of the SDLC. From requirements gathering to code
                deployment.
              </Container>
            </div>
            <div>
              <Container header={<Header variant="h2">Create & Share </Header>}>
                Have a unique use case or a clever prompt trick? Share it with
                the community! Create new prompts and templates, so others can
                benefit from your expertise.
              </Container>
            </div>
          </Grid>
        </SpaceBetween>
      </Box>

      <Box textAlign="center" margin={{ top: "xxxl" }}>
        <h2>Prompt Spotlight</h2>
        <PromptCollection
          limit={3}
          promptsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 3 }]}
          showLoadMore={false}
          showFilters={false}
        />
      </Box>
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
    </ContentLayout>
  );
}
