when you do exploratory test follow below steps:

1. dump xml for every new ui page by uiautomator dump, name as step1_dump.xml, step2_dump.xml, etc
2. detect all clickable element
3. if click successful, mark the click position with `magick input.png -fill "rgba(255,0,0,0.5)" -draw "circle 100,100 125,100" output.png`
4. after finished the session. output a document `android_exploratory_test_report.md` with use cases. each step contain screenshot with click area highlighted.
5. IMPORTANT: ALL screenshots in android_exploratory_test_report.md MUST use <img> tag format with width="120"
6. sample markdown step:

```markdown
   <img src="step1.png" alt="step1: home page" width="120">
   **actions**: launch app
   **detected element**: 
[step1_dump.xml](..%2F..%step1_dump.xml)
- main menu button
- category button
```

when you generate function test script follow below steps:

1. read android_exploratory_test_report.md, and understand test cases
2. create `tests_suite` folder with standard pytest structure:
   - `conftest.py` for shared fixtures and setup
   - `test_*.py` files for each test case
   - `__init__.py` to make it a package
3. IMPORTANT: use consistent naming convention:
   - test files: `test_[feature_name].py`
   - test functions: `test_[action_description]()`
   - fixtures: `setup_app()`, `teardown_app()`
4. MANDATORY: add checkpoint after every action using `assert exists()` or `wait()`
5. structure each test function as:
   ```python
   def test_feature_name():
       # setup
       start_app(package_name)

       # action 1
       touch(element)
       assert exists(expected_element), "checkpoint failed"

       # action 2
       touch(next_element)
       wait(next_expected_element, timeout=10)

       # cleanup
       stop_app(package_name)
   ```
6. generate `pytest.ini` configuration file
7. run `pytest tests_suite/` to validate all tests
