---
title: "Build a UI for a votingapp"
description: "This prompt allows for creating a complete Flask-based user interface from scratch on top of this application that only exposes APIs (https://github.com/aws-containers/votingapp). I often use this for demoing Amazon Q Developer capabilities but hopefully can inspire for other type of real usage."
author: "mreferre"
tags: ["Enhance", "IDE", "Dev Agent"]
---

# Build a UI for a votingapp

/dev Create a new Flask route in a dedicated web page at the following path: "/votes". This page should be password protected. The page will show a table (in a grid format) with the four restaurants and the vote for each restaurant. The page will also allow a user to vote for the restaurant of their choosing. This page should be modern, rich and following all the latest standards of web user interface developments.

## How to Use

The prerequisite would be to create the infrastructure to run the application locally. There is a script [here](https://github.com/aws-containers/votingapp/blob/master/preparation/prepare.sh) that allows to do that. You can then run the Python application in your IDE (which requires proper IAM permissions to have the app connect to DynamoDB etc.). It's a bit of work to setup initially but for me the ROI is worth because I use this app frequently to experiment with Q. I often use this for demoing Amazon Q Developer capabilities but hopefully can inspire for other type of real usage.
