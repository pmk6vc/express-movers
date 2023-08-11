# express-movers

Marketplace for movers

# TODO
- Secure DB by using private IPs
- Set up authenticated routes with roles and permissions
- Set up integration test suite and make passing tests a prerequisite of deploying to prod
- Configure pre-commit hook to prettify code
- Gracefully close all DB connections in test environment and run down migrations
- Figure out how to assign query results to custom types
- Set up logging
- Consider document database instead of relational before going too deep

- Use setup script in jest (TODO about concurrency) - make sure to have proper beforeEach, beforeAll, afterEach, afterAll
- Update github actions to run tests as prereq
- Update test suite to cover middleware and actual body of response
- Update test suite to run down migrations (could be used in afterAll)
- Knock out TODOs about DI and interfaces
- Prettify
