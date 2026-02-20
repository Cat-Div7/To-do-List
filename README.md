# To-Do List

A vanilla TypeScript to-do list app with filtering, theme toggling, and local storage persistence.

---

## Project Structure

```
├── src
│   ├── services
│   │   ├── filterService.ts
│   │   ├── taskActions.ts
│   │   └── taskService.ts
│   ├── storage
│   │   └── tasks.ts
│   ├── types
│   │   ├── DOM.ts
│   │   ├── filter.ts
│   │   ├── index.ts
│   │   └── task.ts
│   ├── utils
│   │   ├── alert.ts
│   │   ├── createTaskElement.ts
│   │   ├── icons.ts
│   │   ├── theme.ts
│   │   └── validation.ts
│   ├── index.html
│   ├── main.css
│   └── main.ts
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

You need **Node.js** installed. You can check with:

```bash
node -v
```

If not installed, download it from [nodejs.org](https://nodejs.org).

---

### 1. Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/Cat-Div7/To-do-List.git

# Using SSH
git clone git@github.com:Cat-Div7/To-do-List.git

cd To-do-List
```

---

### 2. Compile TypeScript

You need to compile the `.ts` source files into `.js` before running the app.

#### Scenario A — TypeScript installed globally

Check if you have it:

```bash
tsc -v
```

If you see a version number, you're good. Just run:

```bash
tsc
```

#### Scenario B — TypeScript NOT installed globally

You'll get `tsc: command not found`. Fix it by installing TypeScript globally:

```bash
npm install -g typescript
```

Then compile:

```bash
tsc
```

#### Scenario C — Don't want to install globally

Use `npx` to run TypeScript without installing it:

```bash
npx tsc
```

> In all cases, the compiled output will appear in the `dist/` folder.

---

### 3. Serve the App

> You **cannot** open `index.html` directly in your browser (via `file://`). ES modules require a local server.

#### Option A — Using `npx serve` (recommended, no install needed)

From the project root:

```bash
npx serve .
```

Then open: [http://localhost:3000/src/index.html](http://localhost:3000/src/index.html)

#### Option B — VS Code Live Server extension

1. Install the **Live Server** extension in VS Code
2. Make sure Live Server is rooted at the **project root**, not the `src/` folder
3. Right-click `src/index.html` → **Open with Live Server**

#### Option C — Python (if you have it installed)

```bash
python3 -m http.server 3000
```

Then open: [http://localhost:3000/src/index.html](http://localhost:3000/src/index.html)

---

## Development Workflow

Every time you make changes to `.ts` files, recompile before refreshing:

```bash
tsc
```

Or watch for changes automatically:

```bash
tsc --watch
```

---

## Features

- Add, complete, and delete tasks
- Filter tasks by: All / Completed / Uncompleted
- Light/Dark theme toggle
- Tasks and filter state persist via `localStorage`
- Input persists across page refreshes via `sessionStorage`

---

## Tech Stack

- **TypeScript** — strictly typed source
- **Vanilla JS** — no frameworks
- **HTML/CSS** — no build tools or bundlers
- **ES Modules** — native browser module system
