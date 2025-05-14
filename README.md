# Suggestion Bot – Challenge

This bot implements a complete suggestion system using interactive components and commands on Discord.

## Features

- `/suggest` command with a dropdown menu for category selection.
- Categories are defined in a `config.example.json` file.
- After selecting a category, a modal is shown for the user to enter their suggestion.
- Suggestions are sent to the respective category channel in an embed.
- Embed includes interactive upvote and downvote buttons.
- Vote counts are dynamically displayed and updated.
- Admin commands to accept or deny suggestions:
  - `/suggestion approve <id>`
  - `/suggestion reject <id>`
- Accepted or denied status is updated directly in the suggestion embed.

## Technologies Used

- [TypeScript](https://www.typescriptlang.org/)
- [Bun](https://bun.sh/)
- [Oceanic.js](https://oceanic.ws/)

## How to Use

Make sure you have [Bun](https://bun.sh/docs/installation) installed.

Clone the repository and run the following commands:

```bash
# Install dependencies
bun install

# Start the bot
bun start
```

Replace the `.env.example` to `.env` and put the bot token
Replace the `config.example.json` to `config.json` and configure the bot.
