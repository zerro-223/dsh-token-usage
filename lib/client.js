window.__ModuleLoader__.load({
	id: "dsh-token-usage",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _dp = require("@deepseek-ai/dsh-client-ui-primitives");
		const h = react.createElement;
		//#region css
		const css = "\n/* ============ dsh-token-usage ============ */\n.ts-root{position:relative}\n.ts-trigger{min-width:0;height:32px;box-sizing:border-box;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:transparent;border:0;border-radius:8px;align-items:center;justify-content:center;gap:6px;padding:0 10px;font:inherit;font-size:13px;line-height:18px;display:flex;transition:color var(--ds-transition-duration) var(--ds-ease-in-out),background-color var(--ds-transition-duration) var(--ds-ease-in-out)}\n.ts-trigger:hover,.ts-trigger:focus-visible{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}\n.ts-triggerRail{width:32px;padding:0}\n.ts-triggerLabel{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ts-triggerBadge{flex:none;min-width:18px;height:18px;box-sizing:border-box;color:var(--dsw-alias-label-primary-foreground);background:var(--dsw-alias-state-business-primary);border-radius:9px;align-items:center;justify-content:center;padding:0 5px;font-size:11px;line-height:18px;display:inline-flex;font-variant-numeric:tabular-nums}\n\n/* overlay */\n.ts-overlay{position:fixed;inset:0;z-index:900;font-family:var(--dsw-font-family)}\n.ts-mask{position:absolute;inset:0;background:var(--dsw-alias-bg-mask-2);backdrop-filter:blur(2px);animation:ts-fade-in .22s ease both}\n.ts-panel{position:absolute;top:50%;left:50%;width:min(1120px,calc(100vw - 40px));height:min(calc(100vh - 48px),820px);max-width:calc(100vw - 40px);max-height:calc(100vh - 48px);box-sizing:border-box;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:16px;box-shadow:var(--dsw-shadow-lv3,0 12px 40px rgba(0,0,0,.18));display:flex;flex-direction:column;overflow:hidden;transform:translate(-50%,-50%);animation:ts-panel-in .32s cubic-bezier(.16,1,.3,1) both}\n.ts-overlay.ts-closing .ts-mask{animation:ts-fade-out .18s ease both}\n.ts-overlay.ts-closing .ts-panel{animation:ts-panel-out .18s ease both}\n@keyframes ts-fade-in{from{opacity:0}to{opacity:1}}\n@keyframes ts-fade-out{from{opacity:1}to{opacity:0}}\n@keyframes ts-panel-in{from{opacity:0;transform:translate(-50%,-46%) scale(.97)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}\n@keyframes ts-panel-out{from{opacity:1;transform:translate(-50%,-50%) scale(1)}to{opacity:0;transform:translate(-50%,-46%) scale(.98)}}\n\n.ts-header{flex:none;display:flex;align-items:center;gap:14px;padding:18px 24px 14px;border-bottom:1px solid var(--dsw-alias-border-l1)}\n.ts-title{min-width:0;flex:1;display:flex;flex-direction:column;gap:3px}\n.ts-titleRow{display:flex;align-items:center;gap:8px;min-width:0}\n.ts-titleIcon{flex:none;color:var(--dsw-alias-state-business-primary);display:flex}\n.ts-titleText{margin:0;color:var(--dsw-alias-label-primary);font-size:16px;font-weight:600;line-height:22px;white-space:nowrap}\n.ts-subtitle{margin:0;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ts-seg{flex:none;box-sizing:border-box;display:flex;align-items:center;gap:3px;padding:3px;background:var(--dsw-specific-selector);border-radius:9px}\n.ts-segBtn{box-sizing:border-box;height:28px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:transparent;border:0;border-radius:7px;padding:0 12px;font:inherit;font-size:12px;line-height:28px;transition:color .15s ease,background-color .15s ease,box-shadow .15s ease}\n.ts-segBtn:hover{color:var(--dsw-alias-label-primary)}\n.ts-segBtnActive{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-active);box-shadow:none}\n.ts-filter{flex:none;display:flex;align-items:center;gap:6px}\n.ts-filterLabel{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:16px;white-space:nowrap}\n.ts-filterSelect{height:28px;max-width:170px;box-sizing:border-box;color:var(--dsw-alias-label-primary);background:var(--dsw-specific-selector);border:1px solid var(--dsw-alias-border-l2);border-radius:7px;padding:0 8px;font:inherit;font-size:12px;line-height:28px;cursor:pointer;transition:border-color .15s ease,background-color .15s ease}\n.ts-filterSelect:hover{border-color:var(--dsw-alias-border-l3)}\n.ts-headerIconBtn{flex:none;width:28px;height:28px;box-sizing:border-box;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:transparent;border:0;border-radius:7px;display:flex;align-items:center;justify-content:center;transition:color .15s ease,background-color .15s ease;font:inherit}\n.ts-headerIconBtn:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}\n.ts-headerIconBtn.ts-spinning svg{animation:ts-spin .8s linear infinite}\n@keyframes ts-spin{to{transform:rotate(360deg)}}\n\n.ts-body{flex:1;min-height:0;overflow-y:auto;padding:20px 24px 24px;display:flex;flex-direction:column;gap:20px}\n.ts-body::-webkit-scrollbar{width:8px}\n.ts-body::-webkit-scrollbar-thumb{background:var(--dsw-alias-scrollbar-bg-l2);border-radius:4px}\n.ts-body::-webkit-scrollbar-thumb:hover{background:var(--dsw-alias-scrollbar-hover-l2)}\n\n.ts-stats{flex:none;display:grid;grid-template-columns:repeat(7,1fr);gap:12px}\n.ts-stat{position:relative;box-sizing:border-box;min-width:0;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1);padding:16px 18px;display:flex;flex-direction:column;gap:7px;overflow:hidden;animation:ts-rise .45s cubic-bezier(.22,1,.36,1) both}\n.ts-stat::before{content:\"\";position:absolute;inset:0 0 auto 0;height:2px;border-radius:2px 2px 0 0;opacity:.85}\n.ts-statAccentDs::before{background:var(--dsw-static-deepseek-500)}\n.ts-statAccentBlue::before{background:var(--dsw-static-blue-500)}\n.ts-statAccentGreen::before{background:var(--dsw-static-green-500)}\n.ts-statAccentAmber::before{background:var(--dsw-static-amber-500)}\n.ts-statAccentRed::before{background:var(--dsw-static-red-400)}\n.ts-statAccentNeutral::before{background:var(--dsw-alias-label-tertiary)}\n.ts-statLabel{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ts-statValue{margin:0;color:var(--dsw-alias-label-primary);font-size:24px;font-weight:600;line-height:32px;font-variant-numeric:tabular-nums;letter-spacing:.2px;white-space:nowrap}\n.ts-statSub{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n@keyframes ts-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}\n\n.ts-grid{flex:none;display:grid;grid-template-columns:minmax(0,3fr) minmax(0,2fr);gap:12px}\n.ts-card{box-sizing:border-box;min-width:0;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1);padding:18px 20px;display:flex;flex-direction:column;gap:14px;animation:ts-rise .45s cubic-bezier(.22,1,.36,1) both}\n.ts-cardHead{flex:none;display:flex;align-items:baseline;gap:10px}\n.ts-cardTitle{margin:0;color:var(--dsw-alias-label-primary);font-size:13px;font-weight:600;line-height:20px}\n.ts-cardHint{margin:0;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:18px}\n.ts-cardBody{flex:1;min-height:0;display:flex;flex-direction:column}\n\n/* trend chart */\n.ts-trend{flex:none}\n\n.ts-lineWrap{position:relative;flex:1;min-height:0;width:100%}\n.ts-axisX{fill:var(--dsw-alias-label-tertiary);font-size:10px;font-family:var(--dsw-font-family)}\n.ts-axisY{fill:var(--dsw-alias-label-tertiary);font-size:10px;font-family:var(--dsw-font-family);font-variant-numeric:tabular-nums}\n.ts-tip{position:absolute;z-index:5;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);pointer-events:none;box-sizing:border-box;min-width:160px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv3,0 8px 24px rgba(0,0,0,.16));padding:10px 12px;font-size:11px;line-height:18px;color:var(--dsw-alias-label-primary);white-space:nowrap;animation:ts-fade-in .12s ease both}\n.ts-tipDate{margin:0 0 6px;color:var(--dsw-alias-label-secondary);font-weight:600}\n.ts-tipRow{display:flex;align-items:center;gap:7px;color:var(--dsw-alias-label-secondary)}\n.ts-tipSwatch{flex:none;width:8px;height:8px;border-radius:2px}\n.ts-tipVal{margin-left:auto;padding-left:12px;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}\n\n.ts-legend{flex:none;display:flex;flex-wrap:wrap;gap:6px 18px}\n.ts-legendItem{display:flex;align-items:center;gap:6px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:20px;cursor:default;transition:opacity .18s ease,color .18s ease}\n.ts-legendItemActive{color:var(--dsw-alias-label-primary)}\n.ts-legendSwatch{flex:none;width:9px;height:9px;border-radius:2.5px}\n\n/* recent list */\n.ts-recent{flex:none;animation:ts-rise .45s cubic-bezier(.22,1,.36,1) both}\n.ts-recentList{display:flex;flex-direction:column}\n.ts-recentRow{display:flex;align-items:center;gap:12px;min-width:0;padding:10px 10px;border-radius:9px;font-size:12px;line-height:20px;color:var(--dsw-alias-label-secondary);transition:background-color .15s ease;animation:ts-rise .35s ease both}\n.ts-recentRow:hover{background:var(--dsw-alias-interactive-bg-hover)}\n.ts-recentTime{flex:none;width:74px;color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums}\n.ts-pill{flex:none;max-width:150px;border-radius:5px;background:var(--dsw-alias-fill-l2,var(--dsw-specific-selector));padding:0 7px;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:var(--dsw-font-mono,var(--ds-font-family-code));font-size:11px;line-height:18px}\n.ts-recentModel{min-width:0;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:var(--dsw-font-mono,var(--ds-font-family-code))}\n.ts-recentNums{flex:none;display:flex;align-items:center;gap:14px;color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums}\n.ts-recentNum{display:flex;align-items:center;gap:4px}\n.ts-recentDot{width:6px;height:6px;border-radius:2px;flex:none}\n\n/* states */\n.ts-state{flex:1;min-height:240px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--dsw-alias-label-tertiary);text-align:center;padding:24px}\n.ts-stateIcon{color:var(--dsw-alias-label-dimmed);display:flex}\n.ts-stateTitle{margin:0;color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:600}\n.ts-stateHint{margin:0;max-width:380px;font-size:12px;line-height:18px}\n.ts-stateBtn{height:28px;box-sizing:border-box;color:var(--dsw-alias-button-primary-fill);cursor:pointer;background:transparent;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:0 14px;font:inherit;font-size:12px;transition:background-color .15s ease,border-color .15s ease;margin-top:4px}\n.ts-stateBtn:hover{background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-border-l3)}\n\n.ts-loading{flex:1;min-height:0;display:flex;flex-direction:column;gap:20px}.ts-skeleton{position:relative;border-radius:10px;background:var(--dsw-alias-bg-skeleton);overflow:hidden}\n.ts-skeleton::after{content:\"\";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent);transform:translateX(-100%);animation:ts-shimmer 1.3s ease infinite}\n@keyframes ts-shimmer{to{transform:translateX(100%)}}\n@media (max-width:960px){\n  .ts-stats{grid-template-columns:repeat(4,1fr)}\n  .ts-grid{grid-template-columns:1fr}\n  .ts-barName{width:110px}\n}\n";
		const tagId = "dsh-token-usage/client.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-token-usage";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		//#endregion

		//#region utilities
		const SVG_NS = "http://www.w3.org/2000/svg";
		function fmtNum(n) {
			if (!isFinite(n)) return "0";
			return Math.round(n).toLocaleString("en-US");
		}
		function fmtTokens(n) {
			const v = Number(n) || 0;
			if (v >= 1e9) return (v / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
			if (v >= 1e6) return (v / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M";
			if (v >= 1e3) return (v / 1e3).toFixed(1).replace(/\.?0+$/, "") + "K";
			return String(Math.round(v));
		}
		function fmtTime(ts) {
			const d = new Date(ts);
			const p = (x) => String(x).padStart(2, "0");
			return p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
		}
		function fmtDay(date) {
			const parts = date.split("-");
			if (parts.length !== 3) return date;
			return parts[1] + "-" + parts[2];
		}
		function modelShort(model) {
			const base = String(model);
			const i = base.lastIndexOf("/");
			return i === -1 ? base : base.slice(i + 1);
		}
		function providerLabel(key) {
			const map = {
				"opencode-go": "OpenCode Go",
				"deepseek": "DeepSeek",
				"pi-ai": "Pi AI",
				"openai": "OpenAI",
				"anthropic": "Anthropic",
			};
			return map[key] || key;
		}
		const PALETTE = [
			"var(--dsw-static-deepseek-500)",
			"var(--dsw-static-blue-500)",
			"var(--dsw-static-green-500)",
			"var(--dsw-static-amber-500)",
			"var(--dsw-static-red-400)",
			"var(--dsw-static-blue-400)",
			"var(--dsw-static-green-400)",
			"var(--dsw-alias-label-tertiary)",
		];
		const SEG_META = [
			{ key: "inputTokens", labelKey: "legend.uncachedInput", color: "var(--dsw-static-deepseek-500)", axis: "left" },
			{ key: "outputTokens", labelKey: "legend.output", color: "var(--dsw-static-amber-500)", axis: "left" },
			{ key: "cacheReadTokens", labelKey: "legend.cacheHit", color: "var(--dsw-static-green-500)", axis: "right", dash: true },
		];
		//#endregion

		//#region hooks
		function useCountUp(target, duration) {
			const [value, setValue] = react.useState(0);
			const fromRef = react.useRef(0);
			const targetRef = react.useRef(0);
			targetRef.current = target;
			react.useEffect(() => {
				const from = fromRef.current;
				const to = targetRef.current;
				if (from === to) return;
				let raf = 0;
				const t0 = performance.now();
				const tick = (t) => {
					const p = Math.min(1, (t - t0) / (duration || 900));
					const eased = 1 - Math.pow(1 - p, 3);
					const v = from + (to - from) * eased;
					setValue(v);
					if (p < 1) raf = requestAnimationFrame(tick);
					else fromRef.current = to;
				};
				raf = requestAnimationFrame(tick);
				return () => cancelAnimationFrame(raf);
			}, [target, duration]);
			return value;
		}
		function useOverview(days, provider, model) {
			const [data, setData] = react.useState(null);
			const [error, setError] = react.useState(null);
			const [busy, setBusy] = react.useState(false);
			const [tick, setTick] = react.useState(0);
			react.useEffect(() => {
				let alive = true;
				const load = async () => {
					setBusy(true);
					try {
						const qs = "days=" + encodeURIComponent(days)
							+ (provider ? "&provider=" + encodeURIComponent(provider) : "")
							+ (model ? "&model=" + encodeURIComponent(model) : "");
						const res = await fetch("/token-stats/api/overview?" + qs, { headers: { accept: "application/json" } });
						if (!res.ok) throw new Error("HTTP " + res.status);
						const json = await res.json();
						if (alive) {
							setData(json);
							setError(null);
						}
					} catch (err) {
						if (alive) setError(err instanceof Error ? err.message : String(err));
					} finally {
						if (alive) setBusy(false);
					}
				};
				load();
				const timer = setInterval(load, 15000);
				return () => {
					alive = false;
					clearInterval(timer);
				};
			}, [days, provider, model, tick]);
			return { data, error, busy, refresh: () => setTick((t) => t + 1) };
		}
		function useMounted(delay) {
			const [mounted, setMounted] = react.useState(false);
			react.useEffect(() => {
				const raf = requestAnimationFrame(() => {
					const timer = setTimeout(() => setMounted(true), delay || 0);
					return clearTimeout.bind(null, timer);
				});
				return () => cancelAnimationFrame(raf);
			}, [delay]);
			return mounted;
		}
		//#endregion

		//#region atoms
		function StatCard(props) {
			const { label, value, sub, accent, delay, format } = props;
			const num = typeof value === "number" && isFinite(value) ? value : null;
			const v = useCountUp(num === null ? 0 : num);
			const display = num === null ? "—"
				: format === "tokens" ? fmtTokens(v)
				: format === "percent" ? (v * 100).toFixed(1) + "%"
				: fmtNum(v);
			const full = num === null ? undefined
				: format === "percent" ? (num * 100).toFixed(2) + "%"
				: fmtNum(num);
			return h("div", {
				className: "ts-stat ts-statAccent" + accent,
				style: { animationDelay: (delay || 0) + "ms" },
				title: full,
				children: [
					h("div", { className: "ts-statLabel", children: label }),
					h("p", { className: "ts-statValue", children: display }),
					sub ? h("div", { className: "ts-statSub", children: sub }) : null,
				],
			});
		}
		function Legend(props) {
			const { items, t, hoverIndex, onHover } = props;
			return h("div", {
				className: "ts-legend",
				children: items.map((it, i) => h("span", {
					className: "ts-legendItem" + (hoverIndex === i ? " ts-legendItemActive" : ""),
					key: it.labelKey,
					style: hoverIndex !== null && hoverIndex !== i ? { opacity: 0.45 } : undefined,
					onMouseEnter: onHover ? () => onHover(i) : undefined,
					onMouseLeave: onHover ? () => onHover(null) : undefined,
					children: [
						h("span", { className: "ts-legendSwatch", style: { background: it.color } }),
						t(it.labelKey),
					],
				})),
			});
		}
		function Segmented(props) {
			const { value, options, onChange, t } = props;
			return h("div", {
				className: "ts-seg",
				role: "tablist",
				children: options.map((opt) => h("button", {
					type: "button",
					key: opt.value,
					role: "tab",
					"aria-selected": value === opt.value,
					className: "ts-segBtn" + (value === opt.value ? " ts-segBtnActive" : ""),
					onClick: () => onChange(opt.value),
					children: t(opt.labelKey),
				})),
			});
		}
		function FilterSelect(props) {
			const { label, value, options, onChange, t } = props;
			const opts = value !== "" && !options.includes(value) ? [value, ...options] : options;
			return h("label", {
				className: "ts-filter",
				children: [
					h("span", { className: "ts-filterLabel", children: label }),
					h("select", {
						className: "ts-filterSelect",
						value,
						onChange: (e) => onChange(e.target.value),
						children: [
							h("option", { key: "", value: "", children: t("filter.all") }),
							opts.map((k) => h("option", { key: k, value: k, children: label === t("filter.model") ? modelShort(k) : providerLabel(k) })),
						],
					}),
				],
			});
		}
		function EmptyState(props) {
			const { t } = props;
			return h("div", {
				className: "ts-state",
				children: [
					h("div", {
						className: "ts-stateIcon",
						children: h("svg", {
							width: 44, height: 44, viewBox: "0 0 44 44", fill: "none", "aria-hidden": "true",
							children: [
								h("rect", { x: 7, y: 22, width: 7, height: 15, rx: 2, fill: "var(--dsw-static-deepseek-500)", opacity: 0.55 }),
								h("rect", { x: 18.5, y: 14, width: 7, height: 23, rx: 2, fill: "var(--dsw-static-blue-500)", opacity: 0.75 }),
								h("rect", { x: 30, y: 7, width: 7, height: 30, rx: 2, fill: "var(--dsw-alias-label-tertiary)", opacity: 0.9 }),
							],
						}),
					}),
					h("p", { className: "ts-stateTitle", children: t("empty.title") }),
					h("p", { className: "ts-stateHint", children: t("empty.hint") }),
				],
			});
		}
		function ErrorState(props) {
			const { t, message, onRetry } = props;
			return h("div", {
				className: "ts-state",
				children: [
					h("div", {
						className: "ts-stateIcon",
						children: h(_dp.IconWarningOutline16, { size: 40 }),
					}),
					h("p", { className: "ts-stateTitle", children: t("error.title") }),
					h("p", { className: "ts-stateHint", children: message }),
					h("button", { type: "button", className: "ts-stateBtn", onClick: onRetry, children: t("error.retry") }),
				],
			});
		}
		function LoadingState() {
			return h("div", {
				className: "ts-loading",
				children: [
					h("div", {
						className: "ts-stats",
						children: [0, 1, 2, 3, 4, 5, 6].map((i) => h("div", {
							key: i,
							className: "ts-skeleton",
							style: { height: 88, borderRadius: 12 },
						})),
					}),
					h("div", { className: "ts-skeleton", style: { height: 300, borderRadius: 12, flex: "none" } }),
					h("div", { className: "ts-skeleton", style: { height: 150, borderRadius: 12, flex: "none" } }),
				],
			});
		}
		//#endregion

		function TrendChart(props) {
			const { data, granularity, t, delay } = props;
			const wrapRef = react.useRef(null);
			const [width, setWidth] = react.useState(0);
			const [hover, setHover] = react.useState(null);
			const [legendHover, setLegendHover] = react.useState(null);
			const [mounted, setMounted] = react.useState(false);

			react.useLayoutEffect(() => {
				const el = wrapRef.current;
				if (!el) return;
				const update = (entry) => setWidth(entry ? entry.contentRect.width : el.clientWidth);
				update();
				const ro = new ResizeObserver((entries) => {
					if (entries[0]) update(entries[0]);
				});
				ro.observe(el);
				return () => ro.disconnect();
			}, []);

			react.useEffect(() => {
				const raf = requestAnimationFrame(() => setMounted(true));
				return () => cancelAnimationFrame(raf);
			}, []);

			const PLOT_H = 236;
			const PAD = { l: 46, r: 46, t: 16, b: 28 };
			const n = data.length;
			const plotW = Math.max(width - PAD.l - PAD.r, 1);
			const baseY = PLOT_H - PAD.b;
			// Dual y-axes: uncached input & output share the left scale (similar
			// magnitude); cache reads ride the right scale — on a shared linear
			// axis a 100x cache lead flattens the other two into the top pixels.
			const maxL = data.reduce((m, d) => Math.max(m, d.inputTokens, d.outputTokens), 0) || 1;
			const maxR = data.reduce((m, d) => Math.max(m, d.cacheReadTokens), 0) || 1;
			const xOf = (i) => (n <= 1 ? PAD.l + plotW / 2 : PAD.l + (i / (n - 1)) * plotW);
			const yOfL = (v) => PAD.t + (1 - v / maxL) * (baseY - PAD.t);
			const yOfR = (v) => PAD.t + (1 - v / maxR) * (baseY - PAD.t);
			const step = granularity === "hour" ? 1 : Math.max(1, Math.ceil(n / 16));

			// Monotone cubic interpolation (Fritsch-Carlson slopes): the curve
			// stays between neighbouring data points, so it can never overshoot
			// below zero / above the peak (Catmull-Rom overshoots).
			const monotonePath = (pts) => {
				const m = pts.length;
				if (m === 0) return "";
				if (m === 1) return "M " + pts[0].x.toFixed(2) + " " + pts[0].y.toFixed(2);
				const dx = new Array(m - 1);
				const dy = new Array(m - 1);
				const slope = new Array(m);
				for (let i = 0; i < m - 1; i += 1) {
					dx[i] = pts[i + 1].x - pts[i].x;
					dy[i] = pts[i + 1].y - pts[i].y;
					slope[i] = dx[i] !== 0 ? dy[i] / dx[i] : 0;
				}
				slope[m - 1] = slope[m - 2];
				for (let i = 1; i < m - 1; i += 1) {
					if (slope[i - 1] * slope[i] <= 0) slope[i] = 0;
					else {
						const w1 = 2 * dx[i] + dx[i - 1];
						const w2 = dx[i] + 2 * dx[i - 1];
						slope[i] = (w1 + w2) !== 0 ? (w1 * slope[i - 1] + w2 * slope[i]) / (w1 + w2) : 0;
					}
				}
				let d = "M " + pts[0].x.toFixed(2) + " " + pts[0].y.toFixed(2);
				for (let i = 0; i < m - 1; i += 1) {
					const p0 = pts[i];
					const p1 = pts[i + 1];
					const c1x = p0.x + dx[i] / 3;
					const c1y = p0.y + (slope[i] * dx[i]) / 3;
					const c2x = p1.x - dx[i] / 3;
					const c2y = p1.y - (slope[i + 1] * dx[i]) / 3;
					d += " C " + c1x.toFixed(2) + " " + c1y.toFixed(2) + ", " + c2x.toFixed(2) + " " + c2y.toFixed(2) + ", " + p1.x.toFixed(2) + " " + p1.y.toFixed(2);
				}
				return d;
			};
			const areaPath = (pts) => {
				if (pts.length === 0) return "";
				return monotonePath(pts)
					+ " L " + pts[pts.length - 1].x.toFixed(2) + " " + baseY
					+ " L " + pts[0].x.toFixed(2) + " " + baseY + " Z";
			};

			const series = SEG_META.map((s) => ({
				axis: s.axis,
				dash: s.dash === true,
				pts: data.map((d, i) => ({ x: xOf(i), y: s.axis === "right" ? yOfR(d[s.key]) : yOfL(d[s.key]) })),
			}));

			// Dual y-axis ticks, each with its own unit (M token / K token / token).
			// The right (cache-hit) scale is tinted green to match its curve.
			const axisMeta = (max) => ({
				unit: max >= 1e6 ? "M token" : max >= 1e3 ? "K token" : "token",
				text: (v) => {
					if (max >= 1e6) return (v / 1e6).toFixed(v >= 10e6 ? 0 : 1);
					if (max >= 1e3) return (v / 1e3).toFixed(v >= 10e3 ? 0 : 1);
					return String(Math.round(v));
				},
			});
			const metaL = axisMeta(maxL);
			const metaR = axisMeta(maxR);
			const midY = PAD.t + (baseY - PAD.t) / 2;
			const ticksL = [
				{ y: PAD.t, text: metaL.text(maxL) },
				{ y: midY, text: metaL.text(maxL / 2) },
				{ y: baseY, text: "0" },
			];
			const ticksR = [
				{ y: PAD.t, text: metaR.text(maxR) },
				{ y: midY, text: metaR.text(maxR / 2) },
				{ y: baseY, text: "0" },
			];

			return h("div", {
				className: "ts-card ts-trend",
				style: { animationDelay: (delay || 0) + "ms" },
				children: [
					h("div", {
						className: "ts-cardHead",
						children: [
							h("h3", { className: "ts-cardTitle", children: t("chart.trend") }),
							h("p", { className: "ts-cardHint", children: t("chart.trendHint") }),
						],
					}),
					h(Legend, {
						t,
						hoverIndex: legendHover,
						onHover: setLegendHover,
						items: SEG_META.map((s) => ({ labelKey: s.labelKey, color: s.color })),
					}),
					h("div", {
						ref: wrapRef,
						className: "ts-lineWrap",
						children: width > 0 ? [
							h("svg", {
								width, height: PLOT_H, viewBox: "0 0 " + width + " " + PLOT_H,
								children: [
									h("defs", {
										children: SEG_META.map((s, idx) => h("linearGradient", {
											key: s.key, id: "ts-grad-" + idx, x1: 0, y1: 0, x2: 0, y2: 1,
											children: [
												h("stop", { offset: "0%", stopOpacity: 0.2, style: { stopColor: s.color } }),
												h("stop", { offset: "100%", stopOpacity: 0.02, style: { stopColor: s.color } }),
											],
										})),
									}),
									ticksL.map((tk) => h("text", {
										key: "tl-" + tk.text,
										x: PAD.l - 8, y: tk.y + 4, textAnchor: "end",
										className: "ts-axisY",
										children: tk.text,
									})),
									h("text", {
										key: "ul", x: PAD.l - 8, y: PAD.t - 6, textAnchor: "end",
										className: "ts-axisY",
										children: metaL.unit,
									}),
									ticksR.map((tk) => h("text", {
										key: "tr-" + tk.text,
										x: width - PAD.r + 8, y: tk.y + 4, textAnchor: "start",
										className: "ts-axisY",
										style: { fill: "var(--dsw-static-green-500)" },
										children: tk.text,
									})),
									h("text", {
										key: "ur", x: width - PAD.r + 8, y: PAD.t - 6, textAnchor: "start",
										className: "ts-axisY",
										style: { fill: "var(--dsw-static-green-500)" },
										children: metaR.unit,
									}),
									[0, 1, 2, 3].map((i) => h("line", {
										key: "grid-" + i,
										x1: PAD.l, x2: width - PAD.r,
										y1: PAD.t + (i / 3) * (baseY - PAD.t),
										y2: PAD.t + (i / 3) * (baseY - PAD.t),
										strokeDasharray: "4 4",
										style: { stroke: "var(--dsw-alias-border-l1)" },
									})),
									series.map((s, idx) => h("path", {
										key: "area-" + idx,
										d: areaPath(s.pts),
										fill: "url(#ts-grad-" + idx + ")",
										opacity: mounted ? 0.9 : 0,
										style: { transition: "opacity .8s ease " + (idx * 160 + 320) + "ms" },
									})),
									series.map((s, idx) => {
										const dashed = s.dash === true;
										const active = legendHover === idx;
										const dimmed = legendHover !== null && !active;
										const anim = dashed
											? "opacity .9s ease " + (idx * 160 + 260) + "ms"
											: "stroke-dashoffset 1.1s cubic-bezier(.3,.6,.2,1) " + (idx * 160) + "ms";
										const d = monotonePath(s.pts);
										const shape = dashed
											? { strokeDasharray: "6 4" }
											: { pathLength: 1, strokeDasharray: 1, strokeDashoffset: mounted ? 0 : 1 };
										return h("g", {
											key: "line-" + idx,
											style: {
												opacity: dimmed ? 0.15 : 1,
												transition: "opacity .25s ease",
											},
											children: [
												// halo: background-colored outline keeps overlapping curves readable
												h("path", Object.assign({
													d, fill: "none",
													strokeLinecap: "round",
													opacity: mounted ? 1 : 0,
													style: {
														stroke: "var(--dsw-alias-bg-layer-2)",
														strokeWidth: active ? 6 : 5,
														transition: anim + ", stroke-width .2s ease",
													},
												}, shape)),
												h("path", Object.assign({
													d, fill: "none",
													strokeLinecap: "round",
													opacity: mounted ? 1 : 0,
													style: {
														stroke: SEG_META[idx].color,
														strokeWidth: active ? 3 : 2,
														transition: anim + ", stroke-width .2s ease",
													},
												}, shape)),
											],
										});
									}),
									data.map((d, i) => {
										const showX = n <= 12 || i % step === 0 || i === n - 1;
										return showX ? h("text", {
											key: "x-" + i,
											x: xOf(i), y: PLOT_H - 8, textAnchor: "middle",
											className: "ts-axisX",
											children: granularity === "hour" ? d.label : fmtDay(d.label),
										}) : null;
									}),
									hover !== null ? h("g", {
										key: "hover",
										children: [
											h("line", {
												x1: xOf(hover), x2: xOf(hover), y1: PAD.t, y2: baseY,
												strokeDasharray: "3 3",
												style: { stroke: "var(--dsw-alias-border-l3)" },
											}),
											series.map((s, idx) => h("circle", {
												key: "pt-" + idx,
												cx: s.pts[hover].x, cy: s.pts[hover].y, r: 4,
												strokeWidth: 1.5,
												style: {
													fill: SEG_META[idx].color,
													stroke: "var(--dsw-alias-bg-layer-2)",
												},
											})),
										],
									}) : null,
									h("g", {
										children: data.map((d, i) => h("rect", {
											key: "hit-" + i,
											x: xOf(i) - plotW / n / 2, y: 0,
											width: Math.max(plotW / n, 10), height: PLOT_H,
											fill: "transparent",
											onMouseEnter: () => setHover(i),
											onMouseLeave: () => setHover(null),
										})),
									}),
								],
							}),
							hover !== null ? h("div", {
								className: "ts-tip",
								style: {
									left: Math.min(Math.max(xOf(hover), 90), width - 90) + "px",
									top: "8px",
									bottom: "auto",
								},
								children: [
									h("p", { className: "ts-tipDate", children: data[hover].date + (granularity === "hour" ? " " + data[hover].label : "") }),
									SEG_META.map((s) => h("div", {
										className: "ts-tipRow",
										key: s.key,
										children: [
											h("span", { className: "ts-tipSwatch", style: { background: s.color } }),
											h("span", { children: t(s.labelKey) }),
											h("span", { className: "ts-tipVal", children: fmtNum(data[hover][s.key]) }),
										],
									})),
									h("div", {
										className: "ts-tipRow",
										children: [
											h("span", { children: t("legend.requests") }),
											h("span", { className: "ts-tipVal", children: fmtNum(data[hover].requests) }),
										],
									}),
								],
							}) : null,
						] : null,
					}),
				],
			});
		}
		//#endregion

		//#region recent list
		function RecentList(props) {
			const { rows, t, delay } = props;
			return h("div", {
				className: "ts-card ts-recent",
				style: { animationDelay: (delay || 0) + "ms" },
				children: [
					h("div", {
						className: "ts-cardHead",
						children: [
							h("h3", { className: "ts-cardTitle", children: t("recent.title") }),
							h("p", { className: "ts-cardHint", children: t("recent.hint") }),
						],
					}),
					h("div", {
						className: "ts-recentList",
						children: rows.map((r, i) => {
							const nums = [
								{ label: t("legend.input"), v: r.inputTokens, color: "var(--dsw-static-deepseek-500)" },
								{ label: t("legend.output"), v: r.outputTokens, color: "var(--dsw-static-amber-500)" },
								{ label: t("legend.cacheRead"), v: r.cacheReadTokens, color: "var(--dsw-static-green-500)" },
							].filter((x) => x.v > 0);
							return h("div", {
								className: "ts-recentRow",
								key: r.ts + "-" + i,
								style: { animationDelay: (i * 40) + "ms" },
								children: [
									h("span", { className: "ts-recentTime", children: fmtTime(r.ts) }),
									h("span", { className: "ts-pill", title: r.provider, children: providerLabel(r.provider) }),
									h("span", { className: "ts-recentModel", title: r.model, children: modelShort(r.model) }),
									h("span", {
										className: "ts-recentNums",
										children: nums.map((x) => h("span", {
											className: "ts-recentNum",
											key: x.label,
											title: x.label + ": " + fmtNum(x.v),
											children: [
												h("span", { className: "ts-recentDot", style: { background: x.color } }),
												fmtTokens(x.v),
											],
										})),
									}),
								],
							});
						}),
					}),
				],
			});
		}
		//#endregion

		//#region panel
		function TokenStatsPanel(props) {
			const { t, onClose } = props;
			const [days, setDays] = react.useState("hour");
			const [provider, setProvider] = react.useState("");
			const [model, setModel] = react.useState("");
			const [closing, setClosing] = react.useState(false);
			const { data, error, busy, refresh } = useOverview(days, provider, model);
			const close = react.useCallback(() => {
				setClosing(true);
				setTimeout(onClose, 190);
			}, [onClose]);
			react.useEffect(() => {
				const onKeyDown = (e) => {
					if (e.key === "Escape") close();
				};
				document.addEventListener("keydown", onKeyDown);
				return () => document.removeEventListener("keydown", onKeyDown);
			}, [close]);
			react.useEffect(() => {
				const prev = document.body.style.overflow;
				document.body.style.overflow = "hidden";
				return () => {
					document.body.style.overflow = prev;
				};
			}, []);

			const totals = data ? data.totals : null;
			const statCards = totals ? [
				{ label: t("stat.total"), value: totals.inputTokens + totals.outputTokens + totals.cacheReadTokens + totals.cacheWriteTokens, sub: t("stat.totalHint"), accent: "Ds", delay: 60, format: "tokens" },
				{ label: t("stat.requests"), value: totals.requests, sub: null, accent: "Blue", delay: 100, format: "count" },
				{ label: t("stat.input"), value: totals.inputTokens, sub: null, accent: "Ds", delay: 140, format: "tokens" },
				{ label: t("stat.output"), value: totals.outputTokens, sub: totals.reasoningTokens ? t("stat.reasoning") + " " + fmtTokens(totals.reasoningTokens) : null, accent: "Amber", delay: 180, format: "tokens" },
				{ label: t("stat.cacheRead"), value: totals.cacheReadTokens, sub: null, accent: "Green", delay: 220, format: "tokens" },
				{ label: t("stat.cacheWrite"), value: totals.cacheWriteTokens, sub: null, accent: "Amber", delay: 260, format: "tokens" },
				{ label: t("stat.hitRate"), value: data ? data.cacheHitRate : null, sub: null, accent: "Neutral", delay: 300, format: "percent" },
			] : null;

			return h("div", {
				className: "ts-overlay" + (closing ? " ts-closing" : ""),
				role: "presentation",
				children: [
					h("div", { className: "ts-mask", "aria-hidden": "true", onClick: close }),
					h("div", {
						className: "ts-panel",
						role: "dialog",
						"aria-modal": "true",
						"aria-label": t("panel.title"),
						children: [
							h("div", {
								className: "ts-header",
								children: [
									h("div", {
										className: "ts-title",
										children: [
											h("div", {
												className: "ts-titleRow",
												children: [
													h("span", {
														className: "ts-titleIcon",
														children: h(_dp.IconDataOutline16, { size: 18 }),
													}),
													h("h2", { className: "ts-titleText", children: t("panel.title") }),
												],
											}),
											h("p", { className: "ts-subtitle", children: t("panel.subtitle") }),
										],
									}),
									h(Segmented, {
										value: days,
										onChange: setDays,
										t,
										options: [
											{ value: "hour", labelKey: "range.hour" },
											{ value: "7", labelKey: "range.7" },
											{ value: "month", labelKey: "range.month" },
											{ value: "30", labelKey: "range.30" },
										],
									}),
									data ? h(FilterSelect, {
										label: t("filter.provider"),
										value: provider,
										onChange: setProvider,
										options: data.filterOptions.providers,
										t,
									}) : null,
									data ? h(FilterSelect, {
										label: t("filter.model"),
										value: model,
										onChange: setModel,
										options: data.filterOptions.models,
										t,
									}) : null,
									h("button", {
										type: "button",
										className: "ts-headerIconBtn" + (busy ? " ts-spinning" : ""),
										"aria-label": t("refresh"),
										title: t("refresh"),
										onClick: refresh,
										children: h(_dp.IconRefreshOutline16, { size: 16 }),
									}),
									h("button", {
										type: "button",
										className: "ts-headerIconBtn",
										"aria-label": t("close"),
										title: t("close"),
										onClick: close,
										children: h(_dp.IconCloseOutline16, { size: 16 }),
									}),
								],
							}),
							h("div", {
								className: "ts-body",
								children: [
									error && !data ? h(ErrorState, { t, message: error, onRetry: refresh })
										: !data ? h(LoadingState, null)
										: totals.requests === 0 ? h(EmptyState, { t })
										: [
											h("div", {
												className: "ts-stats",
												children: statCards.map((c) => h(StatCard, {
													key: c.label,
													label: c.label,
													value: c.value,
													sub: c.sub,
													accent: c.accent,
													delay: c.delay,
													format: c.format,
												})),
											}),
											h(TrendChart, { data: data.series, granularity: data.granularity, t, delay: 220 }),
											data.recent && data.recent.length > 0 ? h(RecentList, { rows: data.recent.slice(0, 8), t, delay: 340 }) : null,
										],
									],
								},
							),
						],
					}),
				],
			});
		}
		//#endregion

		//#region sidebar action
		function TokenStatsAction(props) {
			const { wide, t } = props;
			const [open, setOpen] = react.useState(false);
			return h("div", {
				className: "ts-root",
				children: [
					h("button", {
						type: "button",
						className: "ts-trigger" + (wide ? "" : " ts-triggerRail"),
						"aria-haspopup": "dialog",
						"aria-expanded": open,
						"aria-label": t("action.label"),
						title: t("action.label"),
						onClick: () => setOpen(true),
						children: [
							h(_dp.IconDataOutline16, { size: wide ? 16 : 18 }),
							wide ? h("span", { className: "ts-triggerLabel", children: t("action.label") }) : null,
						],
					}),
					open ? h(TokenStatsPanel, { t, onClose: () => setOpen(false) }) : null,
				],
			});
		}
		//#endregion

		//#region locales
		const zh = {
			"action.label": "Token 用量",
			"panel.title": "Token 用量统计",
			"panel.subtitle": "按 API、模型与日期汇总的模型调用消耗",
			"range.hour": "当日",
			"range.7": "近7天",
			"range.month": "当月",
			"range.30": "近30天",
			"filter.provider": "API",
			"filter.model": "模型",
			"filter.all": "全部",
			"refresh": "刷新",
			"close": "关闭",
			"stat.total": "总 Tokens",
			"stat.totalHint": "输入 + 输出 + 缓存",
			"stat.requests": "请求数",
			"stat.input": "输入 Tokens",
			"stat.output": "输出 Tokens",
			"stat.cacheRead": "缓存读取",
			"stat.cacheWrite": "缓存写入",
			"stat.hitRate": "总命中率",
			"stat.reasoning": "含推理",
			"chart.trend": "Token 用量趋势",
			"chart.trendHint": "堆叠：未命中输入 / 缓存命中 / 输出",
			"legend.uncachedInput": "未命中输入",
			"legend.cacheHit": "缓存命中",
			"legend.output": "输出",
			"legend.requests": "请求",
			"legend.tokens": "TOKENS",
			"recent.title": "最近请求",
			"recent.hint": "最新 30 条调用记录",
			"empty.title": "暂无用量数据",
			"empty.hint": "向模型发起对话或任务后，这里会按 API、模型和日期展示 Token 消耗统计。",
			"error.title": "统计加载失败",
			"error.retry": "重试",
		};
		const en = {
			"action.label": "Token Usage",
			"panel.title": "Token Usage Stats",
			"panel.subtitle": "Model call consumption by API, model and date",
			"range.hour": "Today",
			"range.7": "7d",
			"range.month": "Month",
			"range.30": "30d",
			"filter.provider": "API",
			"filter.model": "Model",
			"filter.all": "All",
			"refresh": "Refresh",
			"close": "Close",
			"stat.total": "Total Tokens",
			"stat.totalHint": "input + output + cache",
			"stat.requests": "Requests",
			"stat.input": "Input Tokens",
			"stat.output": "Output Tokens",
			"stat.cacheRead": "Cache Read",
			"stat.cacheWrite": "Cache Write",
			"stat.hitRate": "Cache Hit Rate",
			"stat.reasoning": "incl. reasoning",
			"chart.trend": "Usage Trend",
			"chart.trendHint": "stacked: uncached input / cache hit / output",
			"legend.uncachedInput": "Uncached input",
			"legend.cacheHit": "Cache hit",
			"legend.output": "Output",
			"legend.requests": "Requests",
			"legend.tokens": "TOKENS",
			"recent.title": "Recent Requests",
			"recent.hint": "latest 30 calls",
			"empty.title": "No usage data yet",
			"empty.hint": "Start a conversation or task with a model and token consumption will show here, grouped by API, model and date.",
			"error.title": "Failed to load stats",
			"error.retry": "Retry",
		};
		//#endregion

		//#region entry
		const inject = ["slots", "locale"];
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register("tokenStats", { zh, en }), "token-usage: dictionaries");
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "token-usage",
				order: 30,
				locale: "tokenStats",
			}, TokenStatsAction));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
