# The MacBook of Bogdan Starogorodtsev

Интерактивный персональный сайт в виде «цифрового MacBook»: рабочий стол macOS, Finder, Dock, окна, Safari, Terminal — внутри которых рассказана карьера и история Богдана Старогородцева.

## Запуск

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production-сборка в dist/
npm run preview    # посмотреть сборку
```

Стек: **React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion** (бывш. Framer Motion), иконки — Lucide и собственные SVG, шрифты — self-hosted через `@fontsource` (Inter, Cormorant Garamond, JetBrains Mono — с кириллицей). Vite выбран как самый быстрый и простой сборщик для SPA без серверной части — сайт собирается в статику и хостится где угодно (Vercel, Netlify, GitHub Pages, любой CDN).

## Как обновлять контент

**Весь контент — в одном файле: [`src/data/content.ts`](src/data/content.ts).** Компоненты ничего не знают о конкретных фактах.

- Карьера — `employers` (записи как в выписке СФР: дата, должность, подразделение), `stages` (этапы для Career Timeline), `segments` / `growthArc` (траектория роста).
- Отсутствующие данные помечены `NEED` (`'[NEED FROM BOGDAN]'`) или пустыми значениями (`[]`, `null`, `''`). На сайте они показываются жёлтой пометкой «нужны данные». Перед публикацией можно скрыть все пометки: `SHOW_NEED_MARKERS = false`.
- Поиск всех пробелов: `grep -n "NEED" src/data/content.ts`.
- Список того, что нужно прислать: [`CONTENT_CHECKLIST.md`](CONTENT_CHECKLIST.md).

### Фотографии

Положите файлы в `public/photos/` (см. [`public/photos/README.md`](public/photos/README.md)). Пока файла нет — показывается аккуратная заглушка с подсказкой пути.

### Резюме (PDF)

Кнопка **Download CV** скачивает `public/Bogdan_Starogorodtsev_Resume.pdf`. Сейчас это PDF, сгенерированный из данных сайта. Чтобы заменить — просто положите свой PDF с тем же именем. Страница резюме отдельно доступна по `/?print=resume` (удобно для печати в PDF из браузера).

## Структура

```
src/
  data/content.ts        ← весь контент
  data/fs.ts             ← «файловая система» Finder (папки и файлы)
  store/windows.tsx      ← централизованный менеджер окон (open/close/minimize/focus/zoom)
  store/system.tsx       ← тема, обои, Wi‑Fi, яркость, Spotlight
  components/            ← MacBook, Desktop, MenuBar, Dock, Window, WindowManager, Spotlight, Boot, иконки
  apps/                  ← Finder, Safari, Mail, Photos, Calendar, Notes, Music, Terminal,
                           Resume, Company (Career), Timeline, Contact, Consulting, About, Doc, AboutMac
  apps/registry.tsx      ← реестр приложений (иконка, размер окна, тип заголовка)
```

## Возможности

- Boot-анимация → появление MacBook → включение экрана → рабочий стол, иконки, Dock.
- Окна: открытие/закрытие/сворачивание в Dock/увеличение, перетаскивание, изменение размера, фокус и z-order.
- Dock с macOS-эффектом увеличения, индикаторы запущенных приложений.
- Menu bar: меню , File/Edit/View/Window/Help, RU/EN, Wi‑Fi, батарея, Spotlight (⌘/Ctrl + Space или K), Control Center (тема, обои, яркость), календарь по клику на время.
- Мобильная версия: без рамки MacBook, полноэкранные окна, адаптированный Dock, тап вместо двойного клика.
- Пасхалка: Terminal (`help`, `whoami`, `career`, `sber`, `route`, `neofetch`, `open <app>`…).
