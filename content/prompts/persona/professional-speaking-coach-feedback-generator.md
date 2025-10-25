---
authors:
  - cremich
categories:
  - persona
description:
  "Transforms Amazon Q into a speaking coach that analyzes presentation
  videos, providing detailed feedback on delivery, body language, and content structure.

  Creates multiple analysis files including comprehensive feedback, timestamp-specific
  notes, talk structure outline, and a personalized scorecard based on your experience
  level. Organizes outputs for easy reference and future analyses."
draft: false
howToUse: "**Prerequisites:**


  1. A video recording of your presentation (local file or YouTube URL)

  2. Basic information about your professional background (job title and years of
  experience)

  3. The title of your talk


  **Usage Instructions:**


  1. Provide your job title, years of experience, and talk title in the designated
  placeholders

  2. Have your presentation video ready (either as a local file or a public YouTube
  URL)

  3. Run the prompt in Amazon Q, which will scan for video files or ask you to provide
  a YouTube link

  4. Select the video you want analyzed from the presented menu

  5. Amazon Q will generate multiple analysis files organized in a structured folder
  system

  6. Review the feedback documents to identify areas for improvement

  7. Use the timestamp-specific feedback to focus your practice sessions

  8. The prompt creates a persistent markdown file so you can easily analyze additional
  presentations in the future


  This prompt is ideal for professionals looking to improve their public speaking
  skills through detailed, objective feedback without requiring external coaching
  services."
images: []
tags:
  - CLI
  - Chat
  - Optimize
title: Professional Speaking Coach Feedback Generator
createdAt: 2025-06-06T20:32:06.540Z
updatedAt: 2025-06-06T20:32:06.540Z
aliases:
  ["/prompts/prompt/professional-speaking-coach-feedback-generator-bd566113"]
---

I'm a {job title} with {Number} years relevant experience and just recorded myself giving a talk on {talk title}. Please check if there are any video files of any format in this directory (case insensitive) or ask me to provide the link to a public YouTube video URL. I want you to ask me which file or youtube url to choose by presenting me with a well formatted CLI numbered menu and then you will do the following:

Assume you're a professional speaking coach and you're focused on reviewing my talks and assessing my presentation strengths and growth areas. Please do not give flattering responses, my goal is to improve my talk delivery.

You'll need to extract the speaking and non-verbal activity using open source software in order to access my sentiment, quality of delivery, overall mood, facial expressions, hand gestures, body language, and related factors that a public speaking speech coach would analyze.

I'm looking for honest, constructive feedback so that I can get better at this.

Make sure all the tools you use are local to my computer -- I don't want to incur any cloud computing charges for this project.

Please create these separate analysis files:

1. A comprehensive analysis document with general observations and recommendations
2. A timestamp-focused document highlighting specific moments to target in practice sessions
3. Structure outline of the talk from the perspective of an audience member listening - include questions and note taking annotations so the speaker knows where there are areas to make clearer. Also attempt to discern what the call to action for the audience.
4. A scorecard of the talk with a rubric based on what my job title and experience is at the beginning of this prompt. I want points for each section along with a grade overall.

Include specific timestamps I should focus on, with detailed notes about what issues occur at those timestamps and how to fix them.

Please use clear naming conventions and subfolder for each talk when needed based on the source filename within it so that I can come back and use this folder for multiple talk recordings over time. Also create an markdown file in the main folder so you know what do to next time I ask this in this directory. Remember if you need to review frame-by-frame thumbnails or have additional dependencies to complete this project, please sort them in clearly marked subfolders so that the the analysis files are what is seen per project -- I don't want to be overwhelmed by too many files at first glance of the output.

After everything is complete, you can ask me if I want to process any more talks to start this over again.
