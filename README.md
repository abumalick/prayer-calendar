# Prayer Times iCal Generator

A web application that generates iCalendar (.ics) files for Islamic prayer times, allowing users to easily add prayer schedules to Google Calendar, Apple Calendar, and other calendar applications.

## Features

- Generate personalized prayer time calendars based on location and calculation method
- Support for multiple Islamic prayer time calculation methods
- Automatic iCal file generation for seamless calendar integration
- Responsive design with mobile and desktop screenshots
- Step-by-step instructions for adding to Google Calendar
- Troubleshooting guide for common issues (e.g., iPhone sync)

## Tech Stack

- **Framework**: [Astro](https://astro.build/) - Static site generator
- **Frontend**: [React](https://reactjs.org/) - Interactive components
- **Styling**: [Picnic CSS](https://picnicss.com/documentation) - Lightweight CSS framework
- **Prayer Calculations**: [Adhan](https://github.com/batoulapps/adhan-js) - Islamic prayer times library
- **Date Handling**: [date-fns](https://date-fns.org/) - Modern JavaScript date utility library
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

## 🚀 Project Structure

```
/
├── public/
│   ├── favicon.svg
│   └── images/
│       └── (screenshots and assets)
├── src/
│   ├── assets/
│   │   └── images/
│   │       └── (optimized images)
│   ├── components/
│   │   ├── PrayerTimeForm.tsx
│   │   └── (other components)
│   ├── hooks/
│   │   └── useStoredState.ts
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── ical.ts
│   └── utils/
│       ├── Calendar.ts
│       └── ical-generator.ts
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

Components are placed in `src/components/`, and static assets like images are stored in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun run dev`             | Starts local dev server at `localhost:4321`      |
| `bun run build`           | Build your production site to `./dist/`          |
| `bun run preview`         | Preview your build locally, before deploying     |
| `bun run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun run astro -- --help` | Get help using the Astro CLI                     |

## Deployment

This project is deployed on Cloudflare Pages and is publicly available at: [https://prayer-calendar.com/](https://prayer-calendar.com/)

## Contributing

This project is open source. Feel free to submit issues, feature requests, or pull requests.

For feedback, contact us at [contact@prayer-calendar.com](mailto:contact@prayer-calendar.com)
