# Techno Landing — Design Spec

**Date:** 2026-07-08
**Owner:** wersomd (serdivergent@gmail.com)
**Site:** wersomd.github.io (GitHub Pages, static, RU)

## Goal
Полностью переписать существующий одностраничный сайт digital-агентства в мощном
neon-cyberpunk / techno стиле с богатой анимацией. Zero-build, деплой на GitHub Pages.

## Approach
Vanilla `index.html` + CSS + JS. Без фреймворков и сборщиков. Canvas-фон,
IntersectionObserver для scroll-анимаций. Прогрессивная деградация под
`prefers-reduced-motion`. Полная адаптивность (burger на мобилке).

## Visual language
- Фон `#05060a`, панели `#0b0e16`, текст `#e8ecf4`, muted `#7d869c`
- Неон: cyan `#00e5ff` (основной), magenta `#ff2d95` (акцент)
- Шрифты: Space Grotesk (заголовки) + IBM Plex Mono (лейблы/техно) + Inter (текст)
- Живой canvas-фон: перспективная сетка + частицы + курсор-параллакс
- Эффекты: glitch-текст, typewriter, scroll-reveal, hover-glow, magnetic buttons,
  animated counters, smooth anchor scroll

## Sections (single page)
1. **Header** — sticky nav, glow активной секции, burger на мобилке
2. **Hero** — glitch-заголовок, typewriter услуг, CTA: WhatsApp + «Оставить заявку»
3. **Услуги** — bento-сетка, 9 услуг, neon-border hover:
   - Разработка: Сайты · Интернет-магазины
   - CRM: amoCRM · Bitrix24
   - Коммуникации/телефония: Wazzup · ChatApp · Binotel · Sipuni
   - Недвижимость: Flatris (установка и настройка шахматки)
4. **Процесс** — 4 шага: Заявка → Аналитика → Внедрение → Поддержка
5. **Портфолио** — сетка из `images/portfolio` (15 работ), hover-zoom + glow
6. **Отзывы** — сетка карточек с плейсхолдерами (готово под замену)
7. **Контакты** — форма (имя/контакт/сообщение → Formspree placeholder) + прямые
   ссылки: WhatsApp (+7 707 017 1318), Telegram @wersomd, тел, email
8. **Footer** — glitch-лого, ссылки, год

## Contacts / CTA
- Primary: WhatsApp `https://wa.me/77070171318`
- Форма: Formspree (placeholder endpoint, пометить комментом), fallback — WhatsApp
- Telegram: `https://t.me/wersomd`
- Email: `serdivergent@gmail.com`, тел: `+7 707 017 1318`

## Out of scope
- Backend, реальная отправка формы (только Formspree endpoint)
- Реальные отзывы (плейсхолдеры)
- Мультиязычность (только RU)
