export const verificationEmailTemplate = (createCode: () => string) => `
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Welcome to the Akkodis Prompt Hub</h2>
    <p>Thank you for joining the ultimate platform for AI agents and tool prompts!</p>
    
    <h3>Verify Your Account</h3>
    <p>To complete your signup and start exploring, please use the following verification code:</p>
    
    <div style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 24px; font-weight: bold;">
      ${createCode()}
    </div>
    
    <p>Enter this code on the website to activate your account.</p>
    
    <h3>What's Next?</h3>
    <ul>
      <li>Explore our library of categorized prompts across all stages of the software development lifecycle</li>
      <li>Create and share your own prompts and templates with the community</li>
    </ul>
    
    <p><strong>Note:</strong> If you didn't sign up for the Akkodis Prompt Hub, please disregard this email.</p>
    
    <h3>We Value Your Feedback</h3>
    <p>
      Encountered a bug? Have a feature request? Want to share your thoughts?
      Visit our <a href="https://github.com/akkodis-aws/akkodis-prompt-hub">GitHub Issues page</a> to provide feedback or report bugs.
    </p>
    
    <p>Thanks for joining, and welcome to the community! We're looking forward to seeing what you'll create and share.</p>
    <p>The perfect prompt is just one click away!</p>
  </body>
</html>
`;
