# JWT Tool

This repo is a CLI for
[auth0/node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken).

## Usage

Use it with docker:

```bash
docker run --rm plotter/jwt-tool
```

**Secrets** need to be given as base64-encoded strings, regardless of
what they are. For example, if using a file:

```bash
docker run --rm plotter/jwt-tool \
       sign \
       '{"whatever":"foobar"}' \
       "$(cat /path/to/my/secret/holding/file | base64 -w 0)"
```
