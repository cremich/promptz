import { ImageResponse } from "next/og";
import { ServerSideAppsyncRepository } from "@/repositories/ServerSideAppsyncRepository";

export const alt =
  "An image describing a prompt of the PROMPTZ prompt library for Amazon Q Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const repository = new ServerSideAppsyncRepository();

export default async function Image({ params }: { params: { id: string } }) {
  const prompt = await repository.getPrompt(params.id);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #6d6de5, #630d78)",
          padding: "40px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: "3em",
              fontWeight: 600,
              color: "white",
              width: "75%",
              lineHeight: 1.2,
            }}
          >
            {prompt.name.toUpperCase()}
          </h1>
          <h2
            style={{
              fontSize: "2em",
              color: "white",
              width: "100%",

              lineHeight: 1.4,
            }}
          >
            {prompt.description}
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                fontSize: "1.5em",
                color: "#c6c6cd",
                width: "75%",
                lineHeight: 1.4,
              }}
            >
              👤 {prompt.createdBy()}
            </p>
            <img
              style={{ marginLeft: "100px" }}
              src="https://promptz.dev/images/promptz_logo.png"
              width="120"
              alt="Amazon Q Developer Logo"
            ></img>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
