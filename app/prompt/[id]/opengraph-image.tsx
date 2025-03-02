import { fetchPrompt } from "@/app/lib/actions/prompts";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "PROMPTZ - The Ultimate Prompt Hub for Amazon Q Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const prompt = await fetchPrompt(params.id);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          backgroundColor: "#121212",
          padding: 50,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 40 }}
        >
          <img
            style={{ marginRight: "20px" }}
            src="https://promptz.dev/images/promptz_logo.png"
            width="40"
            alt="Amazon Q Developer Logo"
          ></img>
          <div style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
            PROMPTZ
          </div>
        </div>

        {/* Content */}
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: "white",
              marginBottom: 16,
              width: "100%",
              textWrap: "balance",
              lineHeight: 1.2,
            }}
          >
            {prompt.title?.toUpperCase()}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 24,
              color: "#a1a1aa",
              marginBottom: 32,
              width: "100%",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            {prompt.description}
          </div>

          {/* Author and Tags */}
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "auto" }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#27272a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <div style={{ color: "white", fontSize: 16 }}>@</div>
            </div>
            <div style={{ color: "white", fontSize: 20 }}>{prompt.author}</div>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", marginTop: 16, gap: 8 }}>
            {prompt.tags?.map((tag, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#8b5cf6",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: 16,
                  fontSize: 16,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 1200,
            height: 630,
            borderRadius: "50%",
            background:
              "linear-gradient(to right, rgba(139, 92, 246, 0.2), rgba(109, 40, 217, 0.1))",
            filter: "blur(60px)",
            zIndex: 0,
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
