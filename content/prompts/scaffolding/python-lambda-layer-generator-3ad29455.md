---
title: "Python Lambda Layer Generator"
description: "Creates a Lambda layer zip file, given a list of Python libraries. Checks for vulnerabilities."
author: "Nathaniel Ng"
tags: ["Implement", "IDE", "Dev Agent"]
---

# Python Lambda Layer Generator

/dev Create a html javascript app that automatically generates the required code to build a Python Lambda layer zip file. The app should allow the user to specify the Python version and the libraries to be installed.

For example, if the Python version is 3.12 and the library specification is `requests==2.32.3`, the code generated from the app should be:

```bash
mkdir test/
pyenv local 3.12
pyenv which python

cat << EOF > requirements.txt
requests==2.32.3
EOF

python -m venv create_layer
source create_layer/bin/activate
pip install -r requirements.txt
mkdir python
cp -r create_layer/lib python/
zip -r requests-py312.zip python

# Cleanup
deactivate
rm -rf create_layer/ python/
```

The app should include a text box displaying the generated code with syntax highlighting. There should be a copy to clipboard button as well as a download button. Use shadcn and dark mode. Use a library or API, such as Snyk, to check for library vulnerabilities.

## How to Use

Open the generated html file in a browser. Enter the required Python libraries and hit the copy to clipboard button. Paste the contents in a terminal window and run it. The code should generate a zip file that you can use as a Python Lambda layer. It is assumed that you have Python and pyenv running on your machine.
