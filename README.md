[![cybrosys-assista](https://snapcraft.io/cybrosys-assista/badge.svg)](https://snapcraft.io/cybrosys-assista)


# Cybrosys Assista IDE

**Cybrosys Assista IDE** is the first Integrated Development Environment (IDE) specifically designed for **Odoo fullstack developers**.\
Built on top of [**Code - OSS**](https://github.com/microsoft/vscode), the open-source foundation of Visual Studio Code, it enhances the VS Code experience with powerful, Odoo-specific features for backend, frontend (OWL/website), and deployment workflows.

![image](https://github.com/user-attachments/assets/5115271a-e990-4c32-8022-468132aca627)

---

## Overview

Cybrosys Assista IDE streamlines Odoo development by providing built-in tooling, automation, and integrations tailored for Odoo projects. From intelligent code completion to integrated deployment helpers, it allows developers to focus on building features rather than setting up environments or repeating manual tasks.

**Powered by Code - OSS**\
Assista IDE is a customized fork of Microsoft's Code - OSS project, enriched with deep Odoo integration for an optimized and efficient development workflow.

---

## Key Features

### Odoo-Centric Development

- Native support for Odoo **models, views, controllers, OWL components, QWeb templates**, and website modules.
- **Smart Odoo snippets** to quickly scaffold boilerplate code.
- Built-in **module generators** for:
  - Basic modules
  - Advanced modules
  - OWL (Odoo Web Library) modules
  - Website modules

---

## Expert AI Modes

Cybrosys Assista includes multiple expert modes tailored to specific development needs:

- **Code** — General programming assistance.
- **Odoo Technical Expert** — Backend development (models, controllers, views).
- **Odoo Functional Expert** — Guidance on Odoo flows and business logic.
- **Odoo OWL JS Expert** — Specialized frontend help (OWL components, QWeb templates).
- **Debug** — Assist in error tracking and issue resolution.
- **Ask** — Open-ended queries.

---

## Why Choose Cybrosys Assista IDE?

- Boost productivity with Odoo-ready templates and snippets.
- Minimize errors through real-time linting and smart validation.
- Simplify deployments with integrated configuration and management tools.
- Reduce setup time by using pre-configured environments and automation.
- Work within a single, consistent interface for backend, frontend, and deployment tasks.

---

## Installation Guide

### Install on Ubuntu/Debian

```bash
sudo snap install cybrosys-assista --classic
```

### Update to the Latest Version

```bash
sudo snap refresh cybrosys-assista
```

### Launch

From the applications menu or terminal:

```bash
cybrosys-assista
```

---

## Configuration Guide

After installation, the **Welcome Screen** provides two options:

1. **Open Existing Project** — Load an existing Odoo project.
2. **Download Odoo** — Clone the Odoo source code directly from GitHub.

### Download Odoo Source

1. Choose the desired Odoo version (e.g., 18.0, 17.0, 16.0).
2. Select a destination folder.
3. Assista automatically downloads and sets up the source code.

### Create `odoo.conf`

- Enter:
  - Database user
  - Database password
  - XMLRPC port
  - Addons path (if required)

### Python Virtual Environment

- Select Odoo version and Python version.
- The IDE will set up the environment and dependencies.

### Debugger Configuration

- Python executable path
- Odoo bin path
- Odoo configuration path


---

## Development Workflow

### Module Generation

Use built-in generators to scaffold:

- Basic modules
- Advanced modules
- OWL modules
- Website modules

---

## Documentation & Support

- [Installation Guide](https://docs.cybrosys.com/assista-ide/installation)
- [Contact Support](https://assista.cybrosys.com/contact)
- [Snap Store Page](https://snapcraft.io/cybrosys-assista)

---

**Cybrosys Assista IDE** is continuously updated to serve the Odoo developer community with precision, performance, and reliability.


[![Get it from the Snap Store](https://snapcraft.io/en/dark/install.svg)](https://snapcraft.io/cybrosys-assista)

