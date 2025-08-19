# SONALIERPEXT Angular 19 Application

This is a **modular Angular 19 application** designed for enterprise resource planning (ERP) functionalities. It uses **lazy-loaded modules**, a **shared module** for reusable code, and **PrimeNG** for UI components and styles.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Modules](#modules)
- [Shared Module](#shared-module)
- [Services](#services)
- [Models](#models)
- [Pipes & Directives](#pipes--directives)
- [Setup & Installation](#setup--installation)
- [Build & Serve](#build--serve)
- [Contributing](#contributing)
- [License](#license)

---

## Architecture Overview

The application follows a **modular architecture** with clear separation of concerns:

```
                        +--------------------+
                        |    App Component   |
                        +--------------------+
                                  |
                 +----------------+----------------+
                 |                                 |
           Lazy-loaded Modules                Shared Module
    (Accounting, Admin, Dashboard,          +--------------------+
       Default, Login, etc.)                |  Services          |
                                            |  Pipes             |
                                            |  Directives        |
                                            |  Models            |
                                            +--------------------+
                                  |
                             PrimeNG Styles
                       (UI components, themes, CSS)
```

**Key Points:**

- Each main feature is **lazy-loaded** to reduce initial bundle size.
- Shared module contains **services, pipes, directives, and models** used across modules.
- PrimeNG is used for **UI components, table/grid styling, dropdowns, buttons, dialogs**, and global CSS.
- Services are divided into:
  - `modelSvc.ts` → module-specific business logic
  - `dataSvc.ts` → HTTP API calls

---

## Project Structure

```
src/
└── app/
    ├── accounting/     # Lazy-loaded accounting module
    ├── admin/          # Lazy-loaded admin module
    ├── dashboard/      # Lazy-loaded dashboard module
    ├── default/        # Lazy-loaded default views
    ├── login/          # Lazy-loaded login/auth module
    └── shared/         # Shared module with common services, models, pipes, directives

Root files:
- app.config.ts      # Application configuration
- app.routes.ts      # Routing configuration
- main.ts / app.ts   # Bootstrap Angular application
- styles.css         # Global styles (PrimeNG themes included)
```

---

## Modules

Each lazy-loaded module has **component-specific** files:

- `model.ts` → Component-specific data models within the module
- `modelSvc.ts` → Component-specific business logic and operations
- `dataSvc.ts` → Component-specific HTTP calls to backend APIs

This structure ensures each component's data, logic, and API handling is encapsulated within its module, making the code maintainable, scalable, and testable.

---

## Shared Module

Contains reusable functionalities:

- **Services:** Global utilities, auth, state management
- **Models:** Shared TypeScript interfaces
- **Pipes:** Custom formatting & transformation
- **Directives:** DOM manipulation & validations

---

## Services

- Module-specific services (`modelSvc`, `dataSvc`) handle business logic & HTTP calls
- Shared services provide cross-module utilities (e.g., logging, notifications)

---

## Models

- Each module has **own models** for encapsulating its data
- Shared models are used across multiple modules

---

## Pipes & Directives

- **Custom Pipes** for formatting, filtering, transformations
- **Reusable Directives** for validations and DOM behavior

---

## Setup & Installation

```bash
git clone <repository-url>
cd SONALIERPEXT
npm install
```

---

## Build & Serve

**Development Mode:**

```bash
ng serve
```

**Production Build:**

```bash
ng build --prod
```

---

## Contributing

- Create a feature branch
- Follow Angular best practices
- Submit a pull request for review

---

## License

This project is licensed under the **MIT License**.

