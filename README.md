# <h1 align="center">SPM</h1>
> Simple Password Manager

Yet another "Simple" Password Manager.

## Objective

This one aims to provide an API that can be hosted by anyone so their passwords are under their concern.

## Why not a simple DB?

Well if you think enough this is just a simple DB, but with a abstraction layer wrapper which allow you to do some pretty cool things.

## Features

- [X] API Wrapper Provider.
- [ ] (WIP) Mobile Interface.
- [ ] Web Interface
- [ ] Shared Clipboard dependency (plugin)

## How to setup

Clone the API Wrapper to your local server or machine, then quickly setup with docker compose.

```bash
docker compose up -d
```

You can watch the logs of the containers `app`, `mongodb`, `express` through docker compose as well.

```bash
docker compose logs <container_name> -f
```
