# SONALIERPEXT Angular 19 Application

This is a **modular Angular 19 application** designed for enterprise resource planning (ERP) functionalities. It uses **lazy-loaded modules**, **component-specific models/services/data services**, a **shared module** for reusable code, and **PrimeNG** for UI components and styles.

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
   (Accounting, Admin, Dashboard,           +--------------------+
      Default, Login, etc.)                 |  Services          |
                                             |  Pipes             |
                                             |  Directives        |
                                             |  Models            |
                                             +--------------------+
                                  |
                             PrimeNG Styles
                       (UI components, themes, CSS)
```

**Key Points:**

- Each main feature is **lazy-loaded**.
- Modules contain **component-specific **``**, **``**, and **``.
- Shared module provides **global services, pipes, directives, and models**.
- PrimeNG is used for **UI components, table/grid styling, dropdowns, buttons, dialogs**.

---

## Project Structure

```
src/
└── app/
    ├── accounting/           # Lazy-loaded accounting module
    │   ├── models/           # Component-specific models
    │   ├── services/         # Component-specific services
    │   └── voucher-approval/ # Feature components with their own model, modelSvc, dataSvc
    │   ├── accounting-module.ts
    │   └── accounting-routing-module.ts
    ├── admin/                # Lazy-loaded admin module
    ├── dashboard/            # Lazy-loaded dashboard module
    ├── default/              # Lazy-loaded default views
    ├── login/                # Lazy-loaded login/auth module
    └── shared/               # Shared module with common services, models, pipes, directives

Root files:
- app.config.ts      # Application configuration
- app.routes.ts      # Routing configuration
- main.ts / app.ts   # Bootstrap Angular application
- styles.css         # Global styles (PrimeNG themes included)
```

---

## Modules

Each lazy-loaded module contains **component-specific files**:

- `model.ts` → Component-specific data models
- `modelSvc.ts` → Component-specific business logic and operations
- `dataSvc.ts` → Component-specific HTTP API calls

This ensures each component's data, logic, and API handling is encapsulated and maintainable.

---

## Shared Module

Provides reusable functionalities across modules:

- **Services:** Global utilities, auth, state management
- **Models:** Shared TypeScript interfaces
- **Pipes:** Custom formatting & transformation
- **Directives:** DOM manipulation & validations

**Note:** Angular 19 recommends using `providedIn: 'root'` for services instead of importing the SharedModule in lazy-loaded modules.

---

## Services

- Component-specific services (`modelSvc`, `dataSvc`) handle local business logic & HTTP calls
- Shared services provide cross-module utilities (e.g., logging, notifications)

---

## Models

- Component-specific models encapsulate module data
- Shared models are used across modules

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