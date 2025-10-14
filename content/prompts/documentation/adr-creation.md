---
title: "ADR Creation"
description: "Given an ADR template, provide context so Q can quickly generate the ADR"
author: "Wes Eklund"
tags: ["Design", "IDE", "Chat"]
---

# ADR Creation

Use this ADR template to generate an ADR:
<adr>

Title: (What is the decision that needs to be made)
Status: (Proposed, Accepted, Rejected, Deprecated, Superseded)
Context
What is the issue that we're seeing that is motivating this decision or change?

Decision

What is the change that we're proposing and/or doing?

Additional Info 1

Additional Info 2

Additional Info N

Consequences

What becomes easier or more difficult to do because of this change?

Customer impact (if any)

Alternative Designs Considered

What other designs were considered? What are the tradeoffs?

Alternative 1

Alternative 2

Alternative N

</adr> 
I need a ADR to decide to use QuickSight as our primary metrics display option on a web app as opposed to creating a custom react components to display the same metric data.

## How to Use

You can tune the output depending on new considerations:

"Update the above ADR that using either QuickSight capacity pricing by session or user pricing can come become cost prohibitive. It's $.50 per 30 session for capacity pricing and $15 per user per month"
