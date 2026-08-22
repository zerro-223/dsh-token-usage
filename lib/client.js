window.__ModuleLoader__.load({
	id: "@zerro223/dsh-token-usage",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _dp = require("@deepseek-ai/dsh-client-ui-primitives");
		const h = react.createElement;
		//#region css
		const css = "\n/* ============ dsh-token-usage ============ */\n.ts-root{position:relative}\n.ts-trigger{min-width:0;height:32px;box-sizing:border-box;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:transparent;border:0;border-radius:8px;align-items:center;justify-content:center;gap:6px;padding:0 10px;font:inherit;font-size:13px;line-height:18px;display:flex;transition:color var(--ds-transition-duration) var(--ds-ease-in-out),background-color var(--ds-transition-duration) var(--ds-ease-in-out)}\n.ts-trigger:hover,.ts-trigger:focus-visible{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}\n.ts-triggerRail{width:32px;padding:0}\n.ts-triggerLabel{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n\n\n/* overlay */\n.ts-overlay{position:fixed;inset:0;z-index:900;font-family:var(--dsw-font-family)}\n.ts-mask{position:absolute;inset:0;background:var(--dsw-alias-bg-mask-2);backdrop-filter:blur(2px);animation:ts-fade-in .22s ease both}\n.ts-panel{position:absolute;top:50%;left:50%;width:min(1120px,calc(100vw - 40px));height:min(calc(100vh - 48px),820px);max-width:calc(100vw - 40px);max-height:calc(100vh - 48px);box-sizing:border-box;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:16px;box-shadow:var(--dsw-shadow-lv3,0 12px 40px rgba(0,0,0,.18));display:flex;flex-direction:column;overflow:hidden;transform:translate(-50%,-50%);animation:ts-panel-in .32s cubic-bezier(.16,1,.3,1) both}\n.ts-overlay.ts-closing .ts-mask{animation:ts-fade-out .18s ease both}\n.ts-overlay.ts-closing .ts-panel{animation:ts-panel-out .18s ease both}\n@keyframes ts-fade-in{from{opacity:0}to{opacity:1}}\n@keyframes ts-fade-out{from{opacity:1}to{opacity:0}}\n@keyframes ts-panel-in{from{opacity:0;transform:translate(-50%,-46%) scale(.97)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}\n@keyframes ts-panel-out{from{opacity:1;transform:translate(-50%,-50%) scale(1)}to{opacity:0;transform:translate(-50%,-46%) scale(.98)}}\n\n.ts-header{flex:none;display:flex;align-items:center;gap:14px;flex-wrap:wrap;row-gap:8px;padding:18px 24px 14px;border-bottom:1px solid var(--dsw-alias-border-l1)}\n.ts-title{min-width:200px;flex:1 1 200px;display:flex;flex-direction:column;gap:3px}\n.ts-titleRow{display:flex;align-items:center;gap:8px;min-width:0}\n.ts-titleIcon{flex:none;color:var(--dsw-alias-state-business-primary);display:flex}\n.ts-titleText{margin:0;color:var(--dsw-alias-label-primary);font-size:16px;font-weight:600;line-height:22px;white-space:nowrap}\n.ts-subtitle{margin:0;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ts-seg{flex:none;width:max-content;box-sizing:border-box;display:flex;flex-wrap:wrap;align-items:center;gap:3px;padding:3px;background:var(--dsw-specific-selector);border-radius:9px}\n.ts-segBtn{box-sizing:border-box;height:28px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:transparent;border:0;border-radius:7px;padding:0 12px;font:inherit;font-size:12px;line-height:28px;transition:color .15s ease,background-color .15s ease,box-shadow .15s ease}\n.ts-segBtn:hover{color:var(--dsw-alias-label-primary)}\n.ts-segBtnActive{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-active);box-shadow:none}\n.ts-filter{flex:none;display:flex;align-items:center;gap:6px}\n.ts-filterLabel{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:16px;white-space:nowrap}\n.ts-filterSelect{height:28px;max-width:170px;box-sizing:border-box;color:var(--dsw-alias-label-primary);background:var(--dsw-specific-selector);border:1px solid var(--dsw-alias-border-l2);border-radius:7px;padding:0 8px;font:inherit;font-size:12px;line-height:28px;cursor:pointer;transition:border-color .15s ease,background-color .15s ease}\n.ts-filterSelect:hover{border-color:var(--dsw-alias-border-l3)}\n.ts-headerIconBtn{flex:none;order:1;width:28px;height:28px;box-sizing:border-box;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:transparent;border:0;border-radius:7px;display:flex;align-items:center;justify-content:center;transition:color .15s ease,background-color .15s ease;font:inherit}\n.ts-headerIconBtn:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}\n.ts-headerIconBtn.ts-spinning svg{animation:ts-spin .8s linear infinite}\n.ts-exportWrap{position:relative;flex:none;display:flex;align-items:center}\n.ts-exportBtn{box-sizing:border-box;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:transparent;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;padding:0 12px;font:inherit;font-size:12px;line-height:26px;white-space:nowrap;display:inline-flex;align-items:center;gap:4px;transition:background-color .15s ease,border-color .15s ease,color .15s ease}\n.ts-exportBtn:hover,.ts-exportBtn.ts-active{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-border-l3)}\n.ts-exportBtnLabel{font-weight:600}\n.ts-exportMenu{position:absolute;right:0;top:calc(100% + 6px);z-index:30;min-width:160px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv3,0 8px 24px rgba(0,0,0,.16));padding:4px;display:flex;flex-direction:column;gap:2px}\n.ts-exportMenuItem{display:block;width:100%;box-sizing:border-box;text-align:left;color:var(--dsw-alias-label-primary);cursor:pointer;background:transparent;border:0;border-radius:6px;padding:6px 10px;font:inherit;font-size:12px;line-height:18px;white-space:nowrap}\n.ts-exportMenuItem:hover{background:var(--dsw-alias-interactive-bg-hover)}\n.ts-exportMenuItemDanger{color:var(--dsw-alias-state-error-primary)}\n.ts-exportMenuItemDanger:hover{background:var(--dsw-alias-interactive-bg-hover-danger,var(--dsw-alias-interactive-bg-hover))}\n.ts-customDate{height:28px;box-sizing:border-box;color:var(--dsw-alias-label-primary);background:var(--dsw-specific-input-major,var(--dsw-alias-bg-layer-1));border:1px solid var(--dsw-alias-border-l2);border-radius:7px;padding:0 8px;font:inherit;font-size:12px}\n.ts-controls{flex:1 1 100%;min-width:0;order:2;display:flex;align-items:center;gap:14px;flex-wrap:wrap}\n.ts-segWrap{position:relative;flex:0 1 auto;min-width:0}\n.ts-segWrap + .ts-filter{margin-left:auto}\n.ts-customPop{position:absolute;top:calc(100% + 6px);left:0;z-index:40;min-width:260px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv3,0 8px 24px rgba(0,0,0,.16));padding:12px;display:flex;flex-direction:column;gap:8px}\n.ts-customPopTitle{color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600;line-height:16px}\n.ts-customPopRow{display:flex;align-items:center;gap:8px}\n.ts-customPopLabel{flex:none;width:56px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:16px}\n@keyframes ts-spin{to{transform:rotate(360deg)}}\n\n.ts-body{flex:1;min-height:0;overflow-y:auto;padding:20px 24px 24px;display:flex;flex-direction:column;gap:20px}\n.ts-body::-webkit-scrollbar{width:8px}\n.ts-body::-webkit-scrollbar-thumb{background:var(--dsw-alias-scrollbar-bg-l2);border-radius:4px}\n.ts-body::-webkit-scrollbar-thumb:hover{background:var(--dsw-alias-scrollbar-hover-l2)}\n\n.ts-stats{flex:none;display:grid;grid-template-columns:repeat(6,1fr);gap:10px}\n.ts-stat{position:relative;box-sizing:border-box;min-width:0;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1);padding:16px 18px;display:flex;flex-direction:column;gap:7px;overflow:hidden;animation:ts-rise .45s cubic-bezier(.22,1,.36,1) both}\n.ts-stat::before{content:\"\";position:absolute;inset:0 0 auto 0;height:2px;border-radius:2px 2px 0 0;opacity:.85}\n.ts-statAccentDs::before{background:var(--dsw-static-deepseek-500)}\n.ts-statAccentBlue::before{background:var(--dsw-static-blue-500)}\n.ts-statAccentGreen::before{background:var(--dsw-static-green-500)}\n.ts-statAccentAmber::before{background:var(--dsw-static-amber-500)}\n.ts-statAccentRed::before{background:var(--dsw-static-red-400)}\n.ts-statAccentNeutral::before{background:var(--dsw-alias-label-tertiary)}\n.ts-statLabel{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ts-statValue{margin:0;color:var(--dsw-alias-label-primary);font-size:24px;font-weight:600;line-height:32px;font-variant-numeric:tabular-nums;letter-spacing:.2px;white-space:nowrap}\n.ts-statSub{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n@keyframes ts-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}\n\n.ts-card{box-sizing:border-box;min-width:0;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1);padding:18px 20px;display:flex;flex-direction:column;gap:14px;animation:ts-rise .45s cubic-bezier(.22,1,.36,1) both}\n.ts-cardHead{flex:none;display:flex;align-items:baseline;gap:10px}\n.ts-cardHeadText{display:flex;align-items:baseline;gap:10px;min-width:0}\n.ts-cardHead .ts-exportWrap{margin-left:auto}\n.ts-cardTitle{margin:0;color:var(--dsw-alias-label-primary);font-size:13px;font-weight:600;line-height:20px}\n.ts-cardHint{margin:0;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:18px}\n\n/* trend chart */\n.ts-trend{flex:none}\n\n.ts-lineWrap{position:relative;flex:1;min-height:0;width:100%}\n.ts-axisX{fill:var(--dsw-alias-label-tertiary);font-size:10px;font-family:var(--dsw-font-family)}\n.ts-axisY{fill:var(--dsw-alias-label-tertiary);font-size:10px;font-family:var(--dsw-font-family);font-variant-numeric:tabular-nums}\n.ts-tip{position:absolute;z-index:5;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);pointer-events:none;box-sizing:border-box;min-width:160px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv3,0 8px 24px rgba(0,0,0,.16));padding:10px 12px;font-size:11px;line-height:18px;color:var(--dsw-alias-label-primary);white-space:nowrap;animation:ts-fade-in .12s ease both}\n.ts-tipDate{margin:0 0 6px;color:var(--dsw-alias-label-secondary);font-weight:600}\n.ts-tipRow{display:flex;align-items:center;gap:7px;color:var(--dsw-alias-label-secondary)}\n.ts-tipSwatch{flex:none;width:8px;height:8px;border-radius:2px}\n.ts-tipVal{margin-left:auto;padding-left:12px;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}\n\n.ts-legend{flex:none;display:flex;flex-wrap:wrap;gap:6px 18px}\n.ts-legendItem{display:flex;align-items:center;gap:6px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:20px;cursor:pointer;transition:opacity .18s ease,color .18s ease}\n.ts-legendItemActive{color:var(--dsw-alias-label-primary)}\n.ts-legendItemHidden{opacity:.4}\n.ts-legendItemHidden .ts-legendSwatch{filter:grayscale(1)}\n.ts-legendSwatch{flex:none;width:9px;height:9px;border-radius:2.5px}\n\n/* recent list */\n.ts-recent{flex:none;animation:ts-rise .45s cubic-bezier(.22,1,.36,1) both}\n.ts-recentList{display:flex;flex-direction:column;max-height:306px;overflow-y:auto}\n.ts-recentRow{display:flex;align-items:center;gap:12px;min-width:0;padding:10px 10px;border-radius:9px;font-size:12px;line-height:20px;color:var(--dsw-alias-label-secondary);transition:background-color .15s ease;animation:ts-rise .35s ease both}\n.ts-recentRow:hover{background:var(--dsw-alias-interactive-bg-hover)}\n.ts-recentTime{flex:none;width:74px;color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums}\n.ts-pill{flex:none;max-width:150px;border-radius:5px;background:var(--dsw-alias-fill-l2,var(--dsw-specific-selector));padding:0 7px;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:var(--dsw-font-mono,var(--ds-font-family-code));font-size:11px;line-height:18px}\n.ts-recentModel{min-width:0;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:var(--dsw-font-mono,var(--ds-font-family-code))}\n.ts-recentNums{flex:none;display:flex;align-items:center;gap:14px;color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums}\n.ts-recentNum{display:flex;align-items:center;gap:4px}\n.ts-recentDot{width:6px;height:6px;border-radius:2px;flex:none}\n\n/* states */\n.ts-state{flex:1;min-height:240px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--dsw-alias-label-tertiary);text-align:center;padding:24px}\n.ts-stateIcon{color:var(--dsw-alias-label-dimmed);display:flex}\n.ts-stateTitle{margin:0;color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:600}\n.ts-stateHint{margin:0;max-width:380px;font-size:12px;line-height:18px}\n.ts-stateBtn{height:28px;box-sizing:border-box;color:var(--dsw-alias-button-primary-fill);cursor:pointer;background:transparent;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:0 14px;font:inherit;font-size:12px;transition:background-color .15s ease,border-color .15s ease;margin-top:4px}\n.ts-stateBtn:hover{background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-border-l3)}\n\n.ts-loading{flex:1;min-height:0;display:flex;flex-direction:column;gap:20px}.ts-skeleton{position:relative;border-radius:10px;background:var(--dsw-alias-bg-skeleton);overflow:hidden}\n.ts-skeleton::after{content:\"\";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent);transform:translateX(-100%);animation:ts-shimmer 1.3s ease infinite}\n@keyframes ts-shimmer{to{transform:translateX(100%)}}\n.ts-priceOverlay{position:absolute;inset:0;z-index:10;background:var(--dsw-alias-bg-layer-2);border-radius:16px;display:flex;flex-direction:column;overflow:hidden;animation:ts-fade-in .18s ease both}\n.ts-priceHeader{flex:none;display:flex;align-items:center;gap:14px;padding:18px 24px 14px;border-bottom:1px solid var(--dsw-alias-border-l1)}\n.ts-priceBody{flex:1;min-height:0;overflow-y:auto;padding:16px 24px;display:flex;flex-direction:column;gap:8px}\n.ts-priceRow{display:flex;align-items:center;gap:10px;min-width:0;padding:6px 8px;border-radius:8px;transition:background-color .15s ease}\n.ts-priceRow:hover{background:var(--dsw-alias-interactive-bg-hover)}\n.ts-priceHead{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;padding-top:2px;padding-bottom:4px;border-bottom:1px solid var(--dsw-alias-border-l1);margin-bottom:2px}\n.ts-priceCol{flex:none;width:96px;text-align:center;box-sizing:border-box}\n.ts-priceModel{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--dsw-alias-label-primary);font-size:12px;line-height:20px;font-family:var(--dsw-font-mono,var(--ds-font-family-code))}\n.ts-priceInput{width:96px;height:28px;box-sizing:border-box;color:var(--dsw-alias-label-primary);background:var(--dsw-specific-input-major,var(--dsw-alias-bg-layer-1));border:1px solid var(--dsw-alias-border-l2);border-radius:7px;padding:0 8px;font:inherit;font-size:12px;transition:border-color .15s ease}\n.ts-priceInput:focus{outline:none;border-color:var(--dsw-alias-border-l4)}\n.ts-priceClear{flex:none;width:24px;height:24px;box-sizing:border-box;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:transparent;border:0;border-radius:6px;display:flex;align-items:center;justify-content:center;transition:color .15s ease,background-color .15s ease}\n.ts-priceClear:hover{color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover-danger,var(--dsw-alias-interactive-bg-hover))}\n.ts-priceFooter{flex:none;display:flex;align-items:center;justify-content:flex-end;gap:10px;padding:14px 24px 18px;border-top:1px solid var(--dsw-alias-border-l1)}\n.ts-priceNote{flex:1;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}\n.ts-priceSave{height:28px;box-sizing:border-box;color:var(--dsw-alias-label-primary-foreground);cursor:pointer;background:var(--dsw-alias-button-primary-fill);border:0;border-radius:8px;padding:0 18px;font:inherit;font-size:12px;transition:background-color .15s ease}\n.ts-priceSave:hover{background:var(--dsw-alias-button-primary-hover)}\n.ts-priceBtnLabel{font-size:14px;font-weight:600;line-height:1}\n.ts-priceToolbar{flex:none;display:flex;align-items:center;gap:12px;padding:12px 24px 0}.ts-priceWarn{flex:none;color:var(--dsw-alias-state-error-primary);font-size:11px;line-height:16px;padding:8px 24px 0}\n.ts-priceSrc{flex:1;min-width:0;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ts-priceSearch{height:26px;box-sizing:border-box;color:var(--dsw-alias-label-primary);background:var(--dsw-specific-input-major,var(--dsw-alias-bg-layer-1));border:1px solid var(--dsw-alias-border-l2);border-radius:7px;padding:0 10px;font:inherit;font-size:12px;min-width:0;flex:0 1 220px;transition:border-color .15s ease}.ts-priceSearch:focus{outline:none;border-color:var(--dsw-alias-border-l4)}\n.ts-priceRefresh{flex:none;height:26px;box-sizing:border-box;color:var(--dsw-alias-label-secondary);cursor:pointer;background:transparent;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;padding:0 12px;font:inherit;font-size:12px;transition:background-color .15s ease,border-color .15s ease}\n.ts-priceRefresh:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-border-l3)}\n.ts-priceRefresh:disabled{opacity:.6;cursor:default}\n.ts-priceTag{flex:none;min-width:34px;text-align:center;color:var(--dsw-alias-state-success-secondary);font-size:11px;line-height:16px}\n.ts-priceTagManual{color:var(--dsw-alias-state-business-primary)}\n.ts-heat{position:relative}\n.ts-heatBody{display:flex;flex-direction:column;align-items:center;gap:8px;overflow-x:auto}\n.ts-heatContent{display:flex;align-items:flex-start;gap:8px;width:max-content;margin:0 auto}\n.ts-heatDays{flex:none;display:grid;grid-template-rows:repeat(7,12px);gap:3px;width:28px;margin-top:18px;font-size:10px;line-height:12px;color:var(--dsw-alias-label-tertiary);text-align:right;padding-right:2px;box-sizing:border-box}\n.ts-heatDay{height:12px;white-space:nowrap}\n.ts-heatDayEmpty{visibility:hidden}\n.ts-heatMain{display:flex;flex-direction:column;gap:4px}\n.ts-heatMonths{position:relative;height:14px;font-size:10px;color:var(--dsw-alias-label-tertiary);white-space:nowrap}\n.ts-heatMonth{position:absolute;top:0;white-space:nowrap}\n.ts-heatGrid{display:grid;grid-auto-flow:column;grid-template-rows:repeat(7,12px);grid-auto-columns:12px;gap:3px;width:max-content}\n.ts-heatCell{width:12px;height:12px;border-radius:3px;background:var(--dsw-alias-bg-layer-2)}\n.ts-heat-0{background:var(--dsw-alias-bg-layer-2)}\n.ts-heat-1{background:var(--dsw-static-blue-500);opacity:.25}\n.ts-heat-2{background:var(--dsw-static-blue-500);opacity:.45}\n.ts-heat-3{background:var(--dsw-static-blue-500);opacity:.7}\n.ts-heat-4{background:var(--dsw-static-blue-500);opacity:1}\n.ts-heat-empty{background:var(--dsw-alias-bg-layer-2)}\n.ts-heatLegend{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--dsw-alias-label-tertiary)}\n.ts-heatLegend .ts-heatCell{width:10px;height:10px;border-radius:2px}\n.ts-heatTip{position:absolute;z-index:20;box-sizing:border-box;min-width:120px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv3,0 8px 24px rgba(0,0,0,.16));padding:8px 10px;font-size:11px;line-height:16px;color:var(--dsw-alias-label-primary);white-space:nowrap;pointer-events:none;transform:translate(-50%,-100%);margin-top:-6px}\n.ts-heatTipDate{margin:0 0 2px;color:var(--dsw-alias-label-secondary);font-weight:600}\n.ts-heatTipVal{margin:0;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}\n.ts-modelSummary{flex:none}\n.ts-modelTableWrap{overflow-x:auto}\n.ts-modelTable{border-collapse:collapse;width:100%;font-size:12px;line-height:20px}\n.ts-modelTable th,.ts-modelTable td{padding:6px 10px;text-align:right;white-space:nowrap;border-bottom:1px solid var(--dsw-alias-border-l1)}\n.ts-modelTable th{color:var(--dsw-alias-label-tertiary);font-weight:600}\n.ts-modelTable th:first-child,.ts-modelTable td:first-child{text-align:left}\n.ts-modelTable .ts-modelName{font-family:var(--dsw-font-mono,var(--ds-font-family-code));max-width:220px;overflow:hidden;text-overflow:ellipsis}\n.ts-modelRow{cursor:pointer;transition:background-color .15s ease}\n.ts-modelRow:hover{background:var(--dsw-alias-interactive-bg-hover)}\n.ts-modelRowActive{background:var(--dsw-alias-interactive-bg-active)}\n@media (max-width:960px){\n  .ts-stats{grid-template-columns:repeat(3,1fr)}\n  .ts-filterSelect{max-width:130px}\n}\n";
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
		// Chinese unit conversion (万/亿) for the total-tokens hint,
		// two decimals kept, trailing zeros trimmed: 111111 -> "≈11.11万"
		function fmtZhTokens(n) {
			const v = Number(n) || 0;
			if (v >= 1e8) return "≈" + (v / 1e8).toFixed(2).replace(/\.?0+$/, "") + "亿";
			if (v >= 1e4) return "≈" + (v / 1e4).toFixed(2).replace(/\.?0+$/, "") + "万";
			return "≈" + Math.round(v);
		}
		function fmtUsd(v) {
			return "$" + Number(v).toFixed(2);
		}
		function fmtUsdPrecise(v) {
			const n = Number(v);
			if (!isFinite(n)) return "$0";
			if (n !== 0 && n < 0.01) return "$" + n.toFixed(4);
			return "$" + n.toFixed(2);
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
		const SEG_META = [
			{ key: "inputTokens", labelKey: "legend.input", color: "var(--dsw-static-deepseek-500)", axis: "left" },
			{ key: "outputTokens", labelKey: "legend.output", color: "var(--dsw-static-amber-500)", axis: "left" },
			{ key: "cacheReadTokens", labelKey: "legend.cacheHit", color: "var(--dsw-static-green-500)", axis: "left", dash: true },
			{ key: "costUsd", labelKey: "legend.cost", color: "var(--dsw-static-red-400)", axis: "right" },
		];
		//#endregion

		//#region hooks
		function useCountUp(target, duration) {
			const [value, setValue] = react.useState(0);
			const currentRef = react.useRef(0);
			const targetRef = react.useRef(0);
			targetRef.current = target;
			react.useEffect(() => {
				const from = currentRef.current;
				const to = targetRef.current;
				if (from === to) return;
				let raf = 0;
				const t0 = performance.now();
				const tick = (t) => {
					const p = Math.min(1, (t - t0) / (duration || 900));
					const eased = 1 - Math.pow(1 - p, 3);
					const v = from + (to - from) * eased;
					currentRef.current = v;
					setValue(v);
					if (p < 1) raf = requestAnimationFrame(tick);
					else currentRef.current = to;
				};
				raf = requestAnimationFrame(tick);
				return () => cancelAnimationFrame(raf);
			}, [target, duration]);
			return value;
		}
		function useOverview(days, provider, model, customStart, customEnd) {
			const [data, setData] = react.useState(null);
			const [error, setError] = react.useState(null);
			const [busy, setBusy] = react.useState(false);
			const [tick, setTick] = react.useState(0);
			const manualRef = react.useRef(false);
			react.useEffect(() => {
				let alive = true;
				let inflight = false;
				const load = async (manual) => {
					if (inflight) return;
					// Background polls are skipped while the tab is hidden and never
					// spin the refresh icon; manual refreshes always run.
					if (document.hidden && !manual) return;
					inflight = true;
					if (manual) setBusy(true);
					try {
						const qs = days === "custom"
							? "days=custom&start=" + encodeURIComponent(customStart || "") + "&end=" + encodeURIComponent(customEnd || "")
							: "days=" + encodeURIComponent(days)
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
						inflight = false;
						if (alive && manual) setBusy(false);
					}
				};
				const manual = manualRef.current;
				manualRef.current = false;
				if (days !== "custom" || (customStart && customEnd)) {
					load(manual);
					const timer = setInterval(() => load(false), 15000);
					return () => {
						alive = false;
						clearInterval(timer);
					};
				}
				return () => {
					alive = false;
				};
			}, [days, provider, model, customStart, customEnd, tick]);
			return {
				data, error, busy,
				refresh: () => { manualRef.current = true; setTick((t) => t + 1); },
			};
		}
		function useHeatmap(provider, model) {
			const [data, setData] = react.useState(null);
			const [error, setError] = react.useState(null);
			const [busy, setBusy] = react.useState(false);
			const [tick, setTick] = react.useState(0);
			const manualRef = react.useRef(false);
			react.useEffect(() => {
				let alive = true;
				let inflight = false;
				const load = async (manual) => {
					if (inflight) return;
					if (document.hidden && !manual) return;
					inflight = true;
					if (manual) setBusy(true);
					try {
						const qs = "days=364"
							+ (provider ? "&provider=" + encodeURIComponent(provider) : "")
							+ (model ? "&model=" + encodeURIComponent(model) : "");
						const res = await fetch("/token-stats/api/heatmap?" + qs, { headers: { accept: "application/json" } });
						if (!res.ok) throw new Error("HTTP " + res.status);
						const json = await res.json();
						if (alive) {
							setData(json);
							setError(null);
						}
					} catch (err) {
						if (alive) setError(err instanceof Error ? err.message : String(err));
					} finally {
						inflight = false;
						if (alive && manual) setBusy(false);
					}
				};
				const manual = manualRef.current;
				manualRef.current = false;
				load(manual);
				const timer = setInterval(() => load(false), 60000);
				return () => {
					alive = false;
					clearInterval(timer);
				};
			}, [provider, model, tick]);
			return {
				data, error, busy,
				refresh: () => { manualRef.current = true; setTick((t) => t + 1); },
			};
		}
		function usePrices() {
			const [prices, setPrices] = react.useState(null);
			const [auto, setAuto] = react.useState(null);
			const [autoUpdatedAt, setAutoUpdatedAt] = react.useState(null);
			const [autoBusy, setAutoBusy] = react.useState(false);
			const [loadError, setLoadError] = react.useState(null);
			const [autoError, setAutoError] = react.useState(null);
			const load = react.useCallback(async () => {
				try {
					const res = await fetch("/token-stats/api/prices", { headers: { accept: "application/json" } });
					if (res.ok) {
						const j = await res.json();
						setPrices(j.prices || {});
						setAuto(j.auto || {});
						setAutoUpdatedAt(j.autoUpdatedAt || null);
						setAutoError(j.autoError || null);
						setLoadError(null);
					} else {
						setLoadError("HTTP " + res.status);
					}
				} catch (err) {
					setLoadError(err instanceof Error ? err.message : String(err));
				}
			}, []);
			const save = react.useCallback(async (next) => {
				try {
					const res = await fetch("/token-stats/api/prices", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ prices: next }),
					});
					return res.ok;
				} catch {
					return false;
				}
			}, []);
			const refreshAuto = react.useCallback(async () => {
				setAutoBusy(true);
				try {
					const res = await fetch("/token-stats/api/prices/refresh", { method: "POST" });
					if (res.ok) {
						const j = await res.json();
						setAuto(j.auto || {});
						setAutoUpdatedAt(j.autoUpdatedAt || null);
						setAutoError(null);
						return true;
					}
					setAutoError("HTTP " + res.status);
					return false;
				} catch (err) {
					setAutoError(err instanceof Error ? err.message : String(err));
					return false;
				} finally {
					setAutoBusy(false);
				}
			}, []);
			return { prices, auto, autoUpdatedAt, autoBusy, loadError, autoError, load, save, refreshAuto };
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
				: format === "usd" ? fmtUsd(v)
				: fmtNum(v);
			const full = num === null ? undefined
				: format === "percent" ? (num * 100).toFixed(2) + "%"
				: format === "usd" ? "$" + num.toFixed(4)
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
			const { items, t, hoverIndex, onHover, hidden, onToggle } = props;
			return h("div", {
				className: "ts-legend",
				children: items.map((it, i) => {
					const off = hidden ? hidden.has(it.key) : false;
					return h("span", {
						className: "ts-legendItem" + (hoverIndex === i ? " ts-legendItemActive" : "") + (off ? " ts-legendItemHidden" : ""),
						key: it.key,
						title: t("chart.legendToggle"),
						style: hoverIndex !== null && hoverIndex !== i ? { opacity: 0.45 } : undefined,
						onMouseEnter: onHover ? () => onHover(i) : undefined,
						onMouseLeave: onHover ? () => onHover(null) : undefined,
						onClick: onToggle ? () => onToggle(it.key) : undefined,
						children: [
							h("span", { className: "ts-legendSwatch", style: { background: it.color } }),
							t(it.labelKey),
						],
					});
				}),
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
						children: [0, 1, 2, 3, 4, 5].map((i) => h("div", {
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
			const { data, granularity, t, delay, animateKey, cost } = props;
			const wrapRef = react.useRef(null);
			const [width, setWidth] = react.useState(0);
			const [hover, setHover] = react.useState(null);
			const [legendHover, setLegendHover] = react.useState(null);
			const [mounted, setMounted] = react.useState(false);
			const [morph, setMorph] = react.useState(null);
			const [hiddenKeys, setHiddenKeys] = react.useState(() => new Set());
			const animateKeyRef = react.useRef(animateKey);
			const pendingAnimateRef = react.useRef(false);
			const firstDataRef = react.useRef(true);
			const lastDataRef = react.useRef(data);
			const morphAnimRef = react.useRef(null);
			const toggleSeries = react.useCallback((key) => {
				setHiddenKeys((prev) => {
					const next = new Set(prev);
					if (next.has(key)) next.delete(key);
					else next.add(key);
					// keep at least one curve visible
					if (next.size >= SEG_META.length) return prev;
					return next;
				});
			}, []);
			// Legend click toggles a curve; hidden series are excluded from the
			// axis "max" computation and from drawing, so overlapping shapes
			// (cache hit vs cost in particular) can be studied separately.
			const visible = SEG_META.filter((s) => !hiddenKeys.has(s.key));

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

			react.useLayoutEffect(() => {
				const keyChanged = animateKey !== animateKeyRef.current;
				const dataChanged = data !== lastDataRef.current;
				const fromData = lastDataRef.current;
				lastDataRef.current = data;
				if (keyChanged) {
					animateKeyRef.current = animateKey;
					pendingAnimateRef.current = true;
				}
				if (firstDataRef.current) {
					firstDataRef.current = false;
					setMounted(false);
					const raf = requestAnimationFrame(() => setMounted(true));
					return () => cancelAnimationFrame(raf);
				}
				if (pendingAnimateRef.current && dataChanged) {
					pendingAnimateRef.current = false;
					if (morphAnimRef.current) cancelAnimationFrame(morphAnimRef.current);
					const startTime = performance.now();
					const duration = 600;
					const step = (now) => {
						const t = Math.min(1, (now - startTime) / duration);
						const eased = 1 - Math.pow(1 - t, 3);
						if (t < 1) {
							setMorph({ fromData, progress: eased });
							morphAnimRef.current = requestAnimationFrame(step);
						} else {
							setMorph(null);
							morphAnimRef.current = null;
						}
					};
					morphAnimRef.current = requestAnimationFrame(step);
				}
			}, [data, animateKey]);
			react.useEffect(() => () => {
				if (morphAnimRef.current) cancelAnimationFrame(morphAnimRef.current);
			}, []);

			const PLOT_H = 236;
			const PAD = { l: 46, r: 46, t: 16, b: 28 };
			const n = data.length;
			const plotW = Math.max(width - PAD.l - PAD.r, 1);
			const baseY = PLOT_H - PAD.b;
			// Round the axis max slightly upward so the curve does not touch the
			// very top edge and tick labels stay clean (0.255 -> 0.26).
			const ceilUp = (value) => {
				if (!(value > 0)) return 1;
				if (value >= 100) return Math.ceil(value);
				if (value >= 1) return Math.ceil(value * 10) / 10;
				if (value >= 0.01) return Math.ceil(value * 100) / 100;
				return Math.ceil(value * 10000) / 10000;
			};
			// Token curves (input / output / cache hit) share the left axis; the
			// cost curve uses the right axis. Only visible series contribute to
			// the per-axis max, so hiding a dominant series rescales the rest.
			const leftKeys = visible.filter((s) => s.axis === "left").map((s) => s.key);
			const rightKeys = visible.filter((s) => s.axis === "right").map((s) => s.key);
			const maxOfKeys = (arr, keys) => arr.reduce((m, d) => {
				let v = m;
				for (const k of keys) v = Math.max(v, d[k] || 0);
				return v;
			}, 0) || 1;
			const dataMaxL = ceilUp(maxOfKeys(data, leftKeys));
			const dataMaxR = ceilUp(maxOfKeys(data, rightKeys));
			const xOf = (i) => (n <= 1 ? PAD.l + plotW / 2 : PAD.l + (i / (n - 1)) * plotW);
			const yOfL = (v, m) => PAD.t + (1 - v / m) * (baseY - PAD.t);
			const yOfR = (v, m) => PAD.t + (1 - v / m) * (baseY - PAD.t);
			const step = granularity === "hour" ? 1 : Math.max(1, Math.ceil(n / 16));

			// Monotone cubic interpolation (Fritsch-Carlson): slopes are bounded
			// by 3x the smallest adjacent chord slope, so the curve can never
			// undershoot below zero / overshoot above the peak. A plain weighted
			// average of the chords violates that bound on sharp drops and dips
			// below the axis (tokens are never negative).
			const monotonePath = (pts) => {
				const m = pts.length;
				if (m === 0) return "";
				if (m === 1) return "M " + pts[0].x.toFixed(2) + " " + pts[0].y.toFixed(2);
				const dx = new Array(m - 1);
				const dy = new Array(m - 1);
				const sec = new Array(m - 1);
				const slope = new Array(m);
				for (let i = 0; i < m - 1; i += 1) {
					dx[i] = pts[i + 1].x - pts[i].x;
					dy[i] = pts[i + 1].y - pts[i].y;
					sec[i] = dx[i] !== 0 ? dy[i] / dx[i] : 0;
				}
				slope[0] = sec[0];
				slope[m - 1] = sec[m - 2];
				for (let i = 1; i < m - 1; i += 1) {
					if (sec[i - 1] * sec[i] <= 0) slope[i] = 0;
					else {
						const w1 = 2 * dx[i] + dx[i - 1];
						const w2 = dx[i] + 2 * dx[i - 1];
						let s = (w1 + w2) !== 0 ? (w1 * sec[i - 1] + w2 * sec[i]) / (w1 + w2) : 0;
						// Fritsch-Carlson bound: |m| <= 3 * min(|s_left|, |s_right|)
						const bound = 3 * Math.min(Math.abs(sec[i - 1]), Math.abs(sec[i]));
						slope[i] = Math.max(-bound, Math.min(bound, s));
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

			const MORPH_SAMPLES = 80;
			const monotoneSlopes = (arr, key) => {
				const len = arr.length;
				if (len === 0) return [];
				if (len === 1) return [0];
				const dy = new Array(len - 1);
				const slope = new Array(len);
				for (let i = 0; i < len - 1; i += 1) dy[i] = arr[i + 1][key] - arr[i][key];
				slope[0] = dy[0];
				slope[len - 1] = dy[len - 2];
				for (let i = 1; i < len - 1; i += 1) {
					if (dy[i - 1] * dy[i] <= 0) slope[i] = 0;
					else {
						// Fritsch-Carlson bound on the smoothed slope so the
						// sampled Hermite curve never dips below the zero axis.
						let s = (dy[i - 1] + dy[i]) / 2;
						const bound = 3 * Math.min(Math.abs(dy[i - 1]), Math.abs(dy[i]));
						slope[i] = Math.max(-bound, Math.min(bound, s));
					}
				}
				return slope;
			};
			const sampleSmoothValues = (arr, key, count) => {
				const len = arr.length;
				if (len === 0) return [];
				if (len === 1) return new Array(count).fill(arr[0][key]);
				const slopes = monotoneSlopes(arr, key);
				const out = [];
				for (let i = 0; i < count; i += 1) {
					const nx = i / (count - 1);
					const pos = nx * (len - 1);
					const idx = Math.min(Math.floor(pos), len - 2);
					const t = Math.max(0, Math.min(1, pos - idx));
					const mt = 1 - t;
					const y0 = arr[idx][key];
					const y1 = arr[idx + 1][key];
					const c1y = y0 + slopes[idx] / 3;
					const c2y = y1 - slopes[idx + 1] / 3;
					out.push(mt * mt * mt * y0 + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t * t * t * y1);
				}
				return out;
			};

			let maxL = dataMaxL;
			let maxR = dataMaxR;
			let series;
			if (morph && morph.fromData && morph.progress < 1) {
				const t = morph.progress;
				const maxFromL = ceilUp(maxOfKeys(morph.fromData, leftKeys));
				const maxToL = dataMaxL;
				const maxFromR = ceilUp(maxOfKeys(morph.fromData, rightKeys));
				const maxToR = dataMaxR;
				maxL = maxFromL + (maxToL - maxFromL) * t;
				maxR = maxFromR + (maxToR - maxFromR) * t;
				const xNorm = (i) => (MORPH_SAMPLES <= 1 ? 0.5 : i / (MORPH_SAMPLES - 1));
				series = visible.map((s) => {
					const fromVals = sampleSmoothValues(morph.fromData, s.key, MORPH_SAMPLES);
					const toVals = sampleSmoothValues(data, s.key, MORPH_SAMPLES);
					const pts = [];
					for (let i = 0; i < MORPH_SAMPLES; i += 1) {
						const v = Math.max(0, fromVals[i] + (toVals[i] - fromVals[i]) * t);
						const y = s.axis === "right" ? yOfR(v, maxR) : yOfL(v, maxL);
						pts.push({ x: PAD.l + xNorm(i) * plotW, y });
					}
					return { key: s.key, color: s.color, dash: s.dash === true, axis: s.axis, pts };
				});
			} else {
				series = visible.map((s) => ({
					key: s.key,
					color: s.color,
					dash: s.dash === true,
					axis: s.axis,
					// Token/cost values are never negative; clamp so no
					// interpolation artifact can render below the 0 axis.
					pts: data.map((d, i) => ({ x: xOf(i), y: s.axis === "right" ? yOfR(Math.max(0, d[s.key]), dataMaxR) : yOfL(Math.max(0, d[s.key]), dataMaxL) })),
				}));
			}

			// Left axis: token counts. Right axis: estimated USD cost.
			const axisMeta = (max) => ({
				unit: max >= 1e6 ? "M token" : max >= 1e3 ? "K token" : "token",
				text: (v) => {
					if (max >= 1e6) return (v / 1e6).toFixed(v >= 10e6 ? 0 : 1);
					if (max >= 1e3) return (v / 1e3).toFixed(v >= 10e3 ? 0 : 1);
					return String(Math.round(v));
				},
			});
			const axisMetaUsd = (max) => ({
				text: (v) => {
					if (max >= 1) return v.toFixed(2);
					if (max >= 0.01) return v.toFixed(2);
					return v.toFixed(4);
				},
			});
			const metaL = axisMeta(maxL);
			const metaR = axisMetaUsd(maxR);
			const midY = PAD.t + (baseY - PAD.t) / 2;
			const ticksL = [
				{ y: PAD.t, text: metaL.text(maxL) },
				{ y: midY, text: metaL.text(maxL / 2) },
				{ y: baseY, text: "0" },
			];
			const ticksR = [
				{ y: PAD.t, text: "$" + metaR.text(maxR) },
				{ y: midY, text: "$" + metaR.text(maxR / 2) },
				{ y: baseY, text: "$0" },
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
						hidden: hiddenKeys,
						onToggle: toggleSeries,
						items: visible.map((s) => ({ key: s.key, labelKey: s.labelKey, color: s.color, dash: s.dash === true })),
					}),
					h("div", {
						ref: wrapRef,
						className: "ts-lineWrap",
						children: width > 0 ? [
							h("svg", {
								width, height: PLOT_H, viewBox: "0 0 " + width + " " + PLOT_H,
								children: [
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
										style: { fill: "var(--dsw-static-red-400)" },
										children: tk.text,
									})),
									h("text", {
										key: "ur", x: width - PAD.r + 8, y: PAD.t - 6, textAnchor: "start",
										className: "ts-axisY",
										style: { fill: "var(--dsw-static-red-400)" },
										children: "$",
									}),
									[0, 1, 2, 3].map((i) => h("line", {
										key: "grid-" + i,
										x1: PAD.l, x2: width - PAD.r,
										y1: PAD.t + (i / 3) * (baseY - PAD.t),
										y2: PAD.t + (i / 3) * (baseY - PAD.t),
										strokeDasharray: "4 4",
										style: { stroke: "var(--dsw-alias-border-l1)" },
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
											key: "line-" + s.key,
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
														stroke: s.color,
														strokeWidth: active ? 3 : 2,
														transition: anim + ", stroke-width .2s ease",
													},
												}, shape)),
											],
										});
									}),
									// A single data point renders no stroked path (zero-length
									// subpaths are invisible), so draw a dot marker instead.
									n === 1 && morph === null ? series.map((s, idx) => h("circle", {
										key: "dot-" + s.key,
										cx: s.pts[0].x, cy: s.pts[0].y, r: 4.5,
										fill: s.color,
										stroke: "var(--dsw-alias-bg-layer-2)",
										strokeWidth: 2,
										opacity: mounted ? 1 : 0,
										style: { transition: "opacity .8s ease " + (idx * 160 + 260) + "ms" },
									})) : null,
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
												key: "pt-" + s.key,
												cx: s.pts[hover].x, cy: s.pts[hover].y, r: 4,
												strokeWidth: 1.5,
												style: {
													fill: s.color,
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
									visible.map((s) => h("div", {
										className: "ts-tipRow",
										key: s.key,
										children: [
											h("span", { className: "ts-tipSwatch", style: { background: s.color } }),
											h("span", { children: t(s.labelKey) }),
											h("span", { className: "ts-tipVal", children: s.key === "costUsd" ? fmtUsdPrecise(data[hover][s.key]) : fmtNum(data[hover][s.key]) }),
										],
									})),
									h("div", {
										className: "ts-tipRow",
										children: [
											h("span", { children: t("legend.cacheWrite") }),
											h("span", { className: "ts-tipVal", children: fmtNum(data[hover].cacheWriteTokens) }),
										],
									}),
									h("div", {
										className: "ts-tipRow",
										children: [
											h("span", { children: t("legend.reasoning") }),
											h("span", { className: "ts-tipVal", children: fmtNum(data[hover].reasoningTokens) }),
										],
									}),
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

		function ContributionHeatmap(props) {
			const { data, t, delay } = props;
			const [tip, setTip] = react.useState(null);
			// While the heatmap payload is still loading, render a card of the
			// same size so the panel does not shift when it arrives.
			if (data === null) {
				return h("div", {
					className: "ts-card ts-heat",
					style: { animationDelay: (delay || 0) + "ms" },
					children: [
						h("div", {
							className: "ts-cardHead",
							children: [
								h("h3", { className: "ts-cardTitle", children: t("heat.title") }),
								h("p", { className: "ts-cardHint", children: t("heat.hint") }),
							],
						}),
						h("div", { className: "ts-skeleton", style: { height: 158, borderRadius: 12 } }),
					],
				});
			}
			if (!data || data.length === 0) return null;
			const CELL = 12;
			const GAP = 3;
			const DAY_LABEL_ROWS = [0, 2, 4];
			const DAY_LABEL_KEYS = ["heat.dayMon", "heat.dayWed", "heat.dayFri"];
			const parseDay = (s) => {
				const p = s.split("-");
				return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
			};
			const totals = data.map((d) => d.inputTokens + d.outputTokens + d.cacheReadTokens + d.cacheWriteTokens);
			const max = Math.max(1, ...totals);
			const first = parseDay(data[0].date);
			// Monday-based weeks: 0 = Monday ... 6 = Sunday.
			const offset = (first.getDay() + 6) % 7;
			const weeks = Math.ceil((offset + data.length) / 7);
			const gridWidth = weeks * CELL + (weeks - 1) * GAP;
			const cells = [];
			for (let i = 0; i < weeks * 7; i += 1) {
				const j = i - offset;
				if (j < 0 || j >= data.length) {
					cells.push(null);
				} else {
					const v = totals[j];
					const ratio = v / max;
					const level = v <= 0 ? 0 : ratio < 0.25 ? 1 : ratio < 0.5 ? 2 : ratio < 0.75 ? 3 : 4;
					cells.push({ date: data[j].date, value: v, level });
				}
			}
			const monthLabel = (dateStr) => {
				const p = dateStr.split("-");
				return new Date(Number(p[0]), Number(p[1]) - 1, 1).toLocaleDateString(undefined, { month: "short" });
			};
			let lastMonth = "";
			const monthLabels = [];
			for (let c = 0; c < weeks; c += 1) {
				let firstCell = null;
				for (let r = 0; r < 7; r += 1) {
					const cell = cells[c * 7 + r];
					if (cell) { firstCell = cell; break; }
				}
				if (firstCell) {
					const month = firstCell.date.slice(0, 7);
					if (month !== lastMonth) {
						monthLabels.push({ col: c, label: monthLabel(firstCell.date) });
						lastMonth = month;
					}
				}
			}
			return h("div", {
				className: "ts-card ts-heat",
				style: { animationDelay: (delay || 0) + "ms" },
				children: [
					h("div", {
						className: "ts-cardHead",
						children: [
							h("h3", { className: "ts-cardTitle", children: t("heat.title") }),
							h("p", { className: "ts-cardHint", children: t("heat.hint") }),
						],
					}),
					h("div", {
						className: "ts-heatBody",
						children: [
							h("div", {
								className: "ts-heatContent",
								children: [
									h("div", {
										className: "ts-heatDays",
										children: [0, 1, 2, 3, 4, 5, 6].map((row) => {
											const keyIndex = DAY_LABEL_ROWS.indexOf(row);
											const label = keyIndex !== -1 ? t(DAY_LABEL_KEYS[keyIndex]) : "";
											return h("span", { key: row, className: "ts-heatDay" + (label ? "" : " ts-heatDayEmpty"), children: label });
										}),
									}),
									h("div", {
										className: "ts-heatMain",
										children: [
											h("div", {
												className: "ts-heatMonths",
												style: { width: gridWidth + "px" },
												children: monthLabels.map((m) => h("span", {
													key: m.col,
													className: "ts-heatMonth",
													style: { left: (m.col * (CELL + GAP)) + "px" },
													children: m.label,
												})),
											}),
											h("div", {
												className: "ts-heatGrid",
												children: cells.map((c, i) => h("span", {
													key: i,
													className: "ts-heatCell" + (c ? " ts-heat-" + c.level : " ts-heat-empty"),
													onMouseEnter: c ? (e) => {
														const cardEl = e.currentTarget.closest(".ts-heat");
														if (!cardEl) return;
														const cardRect = cardEl.getBoundingClientRect();
														const rect = e.currentTarget.getBoundingClientRect();
														setTip({
															date: c.date,
															value: c.value,
															left: rect.left - cardRect.left + rect.width / 2,
															top: rect.top - cardRect.top,
														});
													} : undefined,
													onMouseLeave: c ? () => setTip(null) : undefined,
												})),
											}),
										],
									}),
								],
							}),
							h("div", {
								className: "ts-heatLegend",
								children: [
									h("span", { className: "ts-heatLegendText", children: t("heat.less") }),
									[0, 1, 2, 3, 4].map((l) => h("span", { key: l, className: "ts-heatCell ts-heat-" + l })),
									h("span", { className: "ts-heatLegendText", children: t("heat.more") }),
								],
							}),
						],
					}),
					tip ? h("div", {
						className: "ts-heatTip",
						style: { left: tip.left + "px", top: tip.top + "px" },
						children: [
							h("p", { className: "ts-heatTipDate", children: tip.date }),
							h("p", { className: "ts-heatTipVal", children: fmtTokens(tip.value) }),
						],
					}) : null,
				],
			});
		}

		function ModelSummary(props) {
			const { models, t, selectedModel, onSelect, delay } = props;
			if (!models || models.length === 0) return null;
			return h("div", {
				className: "ts-card ts-modelSummary",
				style: { animationDelay: (delay || 0) + "ms" },
				children: [
					h("div", {
						className: "ts-cardHead",
						children: [
							h("h3", { className: "ts-cardTitle", children: t("model.title") }),
							h("p", { className: "ts-cardHint", children: t("model.hint") }),
						],
					}),
					h("div", {
						className: "ts-modelTableWrap",
						children: h("table", {
							className: "ts-modelTable",
							children: [
								h("thead", {
									children: h("tr", {
										children: [
											h("th", { children: t("model.model") }),
											h("th", { children: t("model.requests") }),
											h("th", { children: t("model.input") }),
											h("th", { children: t("model.output") }),
											h("th", { children: t("model.cacheHit") }),
											h("th", { children: t("model.cacheWrite") }),
											h("th", { children: t("model.cost") }),
										],
									}),
								}),
								h("tbody", {
									children: models.map((m) => h("tr", {
										key: m.key,
										className: "ts-modelRow" + (selectedModel === m.key ? " ts-modelRowActive" : ""),
										onClick: () => onSelect(m.key),
										title: t("model.clickHint"),
										children: [
											h("td", { className: "ts-modelName", children: modelShort(m.key) }),
											h("td", { children: fmtNum(m.requests) }),
											h("td", { children: fmtTokens(m.inputTokens) }),
											h("td", { children: fmtTokens(m.outputTokens) }),
											h("td", { children: fmtTokens(m.cacheReadTokens) }),
											h("td", { children: m.cacheWriteTokens > 0 ? fmtTokens(m.cacheWriteTokens) : "—" }),
											h("td", { children: m.costUsd === null ? (m.costUnknown ? t("model.unpriced") : "—") : fmtUsd(m.costUsd) }),
										],
									})),
								}),
							],
						}),
					}),
				],
			});
		}

		//#region recent list
		function RecentList(props) {
			const { rows, t, delay, data, onCleared } = props;
			const [exportOpen, setExportOpen] = react.useState(false);
			const [clearArmed, setClearArmed] = react.useState(false);
			const exportWrapRef = react.useRef(null);
			react.useEffect(() => {
				if (!exportOpen) {
					setClearArmed(false);
					return;
				}
				const onDocMouseDown = (e) => {
					if (exportWrapRef.current && !exportWrapRef.current.contains(e.target)) setExportOpen(false);
				};
				document.addEventListener("mousedown", onDocMouseDown);
				return () => document.removeEventListener("mousedown", onDocMouseDown);
			}, [exportOpen]);
			const downloadFile = (filename, content, mime) => {
				const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = filename;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			};
			const escapeCsv = (v) => {
				const s = String(v ?? "");
				return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
			};
			// Full history as NDJSON: streamed from the server, so a 500k-row
			// export is large but never assembled in browser memory twice.
			const exportJsonl = async () => {
				try {
					const res = await fetch("/token-stats/api/export", { headers: { accept: "application/x-ndjson" } });
					if (!res.ok) throw new Error("HTTP " + res.status);
					const blob = await res.blob();
					downloadFile("token-stats-" + Date.now() + ".jsonl", blob, "application/x-ndjson");
				} catch {
					// ignore: keep the menu simple
				}
				setExportOpen(false);
			};
			const exportJson = () => {
				if (!data) return;
				downloadFile("token-stats-" + Date.now() + ".json", JSON.stringify(data, null, 2), "application/json");
				setExportOpen(false);
			};
			const clearAll = async () => {
				try {
					const res = await fetch("/token-stats/api/clear", { method: "POST" });
					if (res.ok && onCleared) onCleared();
				} catch {
					// ignore
				}
				setExportOpen(false);
				setClearArmed(false);
			};
			const exportRecentCsv = () => {
				if (!data || !data.recent) return;
				const headers = ["time", "provider", "model", "inputTokens", "outputTokens", "cacheReadTokens", "cacheWriteTokens", "reasoningTokens"];
				const rowsData = data.recent.map((r) => [
					new Date(r.ts).toISOString(),
					r.provider,
					r.model,
					r.inputTokens,
					r.outputTokens,
					r.cacheReadTokens,
					r.cacheWriteTokens,
					r.reasoningTokens,
				]);
				const csv = [headers.join(","), ...rowsData.map((row) => row.map(escapeCsv).join(","))].join("\n");
				downloadFile("token-stats-recent-" + Date.now() + ".csv", csv, "text/csv;charset=utf-8");
				setExportOpen(false);
			};
			const exportModelCsv = () => {
				if (!data || !data.byModel) return;
				const headers = ["model", "requests", "inputTokens", "outputTokens", "cacheReadTokens", "cacheWriteTokens", "costUsd"];
				const rowsData = data.byModel.map((m) => [
					m.key,
					m.requests,
					m.inputTokens,
					m.outputTokens,
					m.cacheReadTokens,
					m.cacheWriteTokens,
					m.costUsd === null ? "" : m.costUsd,
				]);
				const csv = [headers.join(","), ...rowsData.map((row) => row.map(escapeCsv).join(","))].join("\n");
				downloadFile("token-stats-model-summary-" + Date.now() + ".csv", csv, "text/csv;charset=utf-8");
				setExportOpen(false);
			};
			return h("div", {
				className: "ts-card ts-recent",
				style: { animationDelay: (delay || 0) + "ms" },
				children: [
					h("div", {
						className: "ts-cardHead",
						children: [
							h("div", {
								className: "ts-cardHeadText",
								children: [
									h("h3", { className: "ts-cardTitle", children: t("recent.title") }),
									h("p", { className: "ts-cardHint", children: t("recent.hint") }),
								],
							}),
							h("div", {
								ref: exportWrapRef,
								className: "ts-exportWrap",
								children: [
									h("button", {
										type: "button",
										className: "ts-exportBtn" + (exportOpen ? " ts-active" : ""),
										"aria-label": t("export.label"),
										title: t("export.label"),
										onClick: () => setExportOpen((v) => !v),
										children: h("span", { className: "ts-exportBtnLabel", children: t("export.label") }),
									}),
									exportOpen ? h("div", {
										className: "ts-exportMenu",
										children: [
											h("button", { type: "button", className: "ts-exportMenuItem", onClick: exportJsonl, children: t("export.jsonl") }),
											h("button", { type: "button", className: "ts-exportMenuItem", onClick: exportJson, children: t("export.jsonView") }),
											h("button", { type: "button", className: "ts-exportMenuItem", onClick: exportRecentCsv, children: t("export.recentCsv") }),
											h("button", { type: "button", className: "ts-exportMenuItem", onClick: exportModelCsv, children: t("export.modelCsv") }),
											h("button", {
												type: "button",
												className: "ts-exportMenuItem ts-exportMenuItemDanger",
												onClick: () => {
													if (!clearArmed) setClearArmed(true);
													else clearAll();
												},
												children: t(clearArmed ? "data.clearConfirm" : "data.clear"),
											}),
										],
									}) : null,
								],
							}),
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
								title: r.purpose || r.sessionId ? [r.purpose, r.sessionId].filter(Boolean).join(" · ") : undefined,
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

		//#region price panel
		const PRICE_FIELDS = ["input", "output", "cacheRead", "cacheWrite"];
		const blankPriceRow = () => Object.fromEntries(PRICE_FIELDS.map((f) => [f, ""]));
		function PricePanel(props) {
			const { models, prices, auto, autoUpdatedAt, autoBusy, loadError, autoError, onRefreshAuto, onClose, onSave, t } = props;
			const autoWarn = loadError ? t("price.loadError") + " " + loadError
				: autoError ? t("price.autoError") + " " + autoError
				: (!autoUpdatedAt && auto !== null && Object.keys(auto).length === 0) ? t("price.notFetched") : null;
			const [draft, setDraft] = react.useState(() => {
				const base = {};
				for (const m of models) base[m] = blankPriceRow();
				for (const [m, p] of Object.entries(prices || {})) {
					base[m] = base[m] || blankPriceRow();
					for (const f of PRICE_FIELDS) {
						if (p[f] !== undefined) base[m][f] = String(p[f]);
					}
				}
				return base;
			});
			const setField = (model, field, value) => {
				setDraft((prev) => {
					const row = { ...(prev[model] || blankPriceRow()) };
					row[field] = value;
					return { ...prev, [model]: row };
				});
			};
			const rowValue = (model, field) => {
				const v = draft[model] && draft[model][field];
				return v === undefined ? "" : v;
			};
			const submit = () => {
				const next = {};
				for (const [m, row] of Object.entries(draft)) {
					const parsed = {};
					for (const f of PRICE_FIELDS) {
						const v = parseFloat(row[f]);
						if (isFinite(v) && v >= 0) parsed[f] = v;
					}
					if (Object.keys(parsed).length > 0) next[m] = parsed;
				}
				onSave(next);
			};
			const hasAny = models.some((m) => {
				const row = draft[m];
				return row && PRICE_FIELDS.some((f) => row[f] !== "");
			});
			const [q, setQ] = react.useState("");
			const normKey = (s) => String(s).toLowerCase().replace(/[-_.]/g, "");
			const findAutoRow = (modelId) => {
				if (!auto) return null;
				if (auto[modelId]) return auto[modelId];
				const norm = normKey(modelId);
				for (const [id, row] of Object.entries(auto)) {
					if (row === null || typeof row !== "object" || Array.isArray(row)) continue;
					if (normKey(id) === norm) return row;
					const slash = id.lastIndexOf("/");
					if (slash !== -1 && slash + 1 < id.length && normKey(id.slice(slash + 1)) === norm) return row;
					if (typeof row._name === "string" && normKey(row._name) === norm) return row;
				}
				return null;
			};
			const query = q.trim().toLowerCase();
			const filtered = query === ""
				? models
				: models.filter((m) => {
					const autoRow = findAutoRow(m);
					const name = autoRow && typeof autoRow._name === "string" ? autoRow._name.toLowerCase() : "";
					return m.toLowerCase().includes(query) || name.includes(query);
				});
			return h("div", {
				className: "ts-priceOverlay",
				children: [
					h("div", {
						className: "ts-priceHeader",
						children: [
							h("div", {
								className: "ts-title",
								children: [
									h("h2", { className: "ts-titleText", children: t("price.title") }),
									h("p", { className: "ts-subtitle", children: t("price.hint") }),
								],
							}),
							h("button", {
								type: "button",
								className: "ts-headerIconBtn",
								"aria-label": t("close"),
								title: t("close"),
								onClick: onClose,
								children: h(_dp.IconCloseOutline16, { size: 16 }),
							}),
						],
					}),
					h("div", {
						className: "ts-priceToolbar",
						children: [
							h("span", {
								className: "ts-priceSrc",
								children: t("price.autoSource") + (autoUpdatedAt ? " · " + String(autoUpdatedAt).slice(0, 16).replace("T", " ") : ""),
							}),
							h("input", {
								type: "search",
								className: "ts-priceSearch",
								placeholder: t("price.search"),
								value: q,
								onChange: (e) => setQ(e.target.value),
								"aria-label": t("price.search"),
							}),
							h("button", {
								type: "button",
								className: "ts-priceRefresh",
								onClick: onRefreshAuto,
								disabled: autoBusy,
								children: autoBusy ? t("price.refreshing") : t("price.refreshAuto"),
							}),
						],
					}),
					autoWarn ? h("div", { className: "ts-priceWarn", children: autoWarn }) : null,
					h("div", {
						className: "ts-priceBody",
						children: models.length === 0
							? h("div", { className: "ts-state", children: h("p", { className: "ts-stateHint", children: t("price.empty") }) })
							: filtered.length === 0
								? h("div", { className: "ts-state", children: h("p", { className: "ts-stateHint", children: t("price.noMatch") }) })
								: [
									h("div", {
										className: "ts-priceRow ts-priceHead",
										key: "head",
										children: [
											h("span", { className: "ts-priceModel", children: t("price.model") }),
											PRICE_FIELDS.map((f) => h("span", { key: f, className: "ts-priceCol", children: t("price." + f) })),
											h("span", { className: "ts-priceTag", children: "" }),
											h("span", { className: "ts-priceClear", children: "" }),
										],
									}),
									...filtered.map((m) => {
										const autoRow = findAutoRow(m);
										const hasManual = draft[m] && PRICE_FIELDS.some((f) => draft[m][f] !== "");
										const autoCny = autoRow && autoRow._currency && autoRow._currency !== "USD";
										return h("div", {
											className: "ts-priceRow",
											key: m,
											children: [
												h("span", { className: "ts-priceModel", title: m, children: modelShort(m) }),
												PRICE_FIELDS.map((f) => h("input", {
													key: f,
													className: "ts-priceInput",
													type: "number",
													step: "0.001",
													min: "0",
													placeholder: autoRow && autoRow[f] !== undefined ? String(autoRow[f]) : t("price." + f),
													value: rowValue(m, f),
													onChange: (e) => setField(m, f, e.target.value),
												})),
												h("span", {
													className: "ts-priceTag" + (hasManual ? " ts-priceTagManual" : ""),
													title: autoCny ? t("price.autoCnyTitle") : undefined,
													children: hasManual ? t("price.manualTag") : autoRow ? (autoCny ? t("price.autoCnyTag") : t("price.autoTag")) : "",
												}),
												h("button", {
													type: "button",
													className: "ts-priceClear",
													title: t("price.clear"),
													onClick: () => PRICE_FIELDS.forEach((f) => setField(m, f, "")),
													children: h(_dp.IconCloseFill14, { size: 12 }),
												}),
											],
										});
									}),
								],
					}),
					h("div", {
						className: "ts-priceFooter",
						children: [
							!hasAny ? h("span", { className: "ts-priceNote", children: t("price.note") }) : null,
							h("button", { type: "button", className: "ts-stateBtn", onClick: onClose, children: t("price.cancel") }),
							h("button", { type: "button", className: "ts-priceSave", onClick: submit, children: t("price.save") }),
						],
					}),
				],
			});
		}
		//#endregion

		//#region panel
		function TokenStatsPanel(props) {
			const { t, onClose } = props;
			const [days, setDays] = react.useState("5h");
			const [provider, setProvider] = react.useState("");
			const [model, setModel] = react.useState("");
			const [customStart, setCustomStart] = react.useState("");
			const [customEnd, setCustomEnd] = react.useState("");
			const [customOpen, setCustomOpen] = react.useState(false);
			const [closing, setClosing] = react.useState(false);
			const [priceOpen, setPriceOpen] = react.useState(false);
			const panelRef = react.useRef(null);
			const customPopRef = react.useRef(null);
			const { data, error, busy, refresh } = useOverview(days, provider, model, customStart, customEnd);
			const heatmap = useHeatmap(provider, model);
			const refreshAll = () => { refresh(); heatmap.refresh(); };
			const chartAnimateKey = days + "|" + provider + "|" + model + "|" + customStart + "|" + customEnd;
			const priceApi = usePrices();
			const MAX_CUSTOM_DAYS = 30;
			const toDateKey = (d) => {
				const mm = String(d.getMonth() + 1).padStart(2, "0");
				const dd = String(d.getDate()).padStart(2, "0");
				return d.getFullYear() + "-" + mm + "-" + dd;
			};
			const parseDate = (s) => {
				const p = s.split("-");
				return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
			};
			const clampRange = (startStr, endStr) => {
				if (!startStr || !endStr) return { start: startStr, end: endStr };
				const start = parseDate(startStr);
				const end = parseDate(endStr);
				const diff = Math.round((end - start) / 86400000);
				if (diff < 0) return { start: startStr, end: startStr };
				if (diff > MAX_CUSTOM_DAYS - 1) {
					const newEnd = new Date(start.getFullYear(), start.getMonth(), start.getDate() + MAX_CUSTOM_DAYS - 1);
					return { start: startStr, end: toDateKey(newEnd) };
				}
				return { start: startStr, end: endStr };
			};
			const handleDaysChange = (v) => {
				if (v === "custom") {
					if (!customStart || !customEnd) {
						const today = new Date();
						const end = toDateKey(today);
						const start = toDateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6));
						setCustomStart(start);
						setCustomEnd(end);
					}
					setCustomOpen(true);
				} else {
					setCustomOpen(false);
				}
				setDays(v);
			};
			const close = react.useCallback(() => {
				setClosing(true);
				setTimeout(onClose, 190);
			}, [onClose]);
			react.useEffect(() => {
				const panel = panelRef.current;
				const prevActive = document.activeElement;
				if (panel) {
					const focusable = panel.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
					if (focusable) focusable.focus();
					else panel.focus();
				}
				const onKeyDown = (e) => {
					if (e.key === "Escape") close();
					if (e.key === "Tab" && panel) {
						const focusables = panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
						if (focusables.length === 0) return;
						const first = focusables[0];
						const last = focusables[focusables.length - 1];
						const active = document.activeElement;
						if (e.shiftKey) {
							if (active === first || !panel.contains(active)) {
								e.preventDefault();
								last.focus();
							}
						} else {
							if (active === last || !panel.contains(active)) {
								e.preventDefault();
								first.focus();
							}
						}
					}
				};
				document.addEventListener("keydown", onKeyDown);
				return () => {
					document.removeEventListener("keydown", onKeyDown);
					if (prevActive && prevActive.focus) prevActive.focus();
				};
			}, [close]);
			react.useEffect(() => {
				const prev = document.body.style.overflow;
				document.body.style.overflow = "hidden";
				return () => {
					document.body.style.overflow = prev;
				};
			}, []);
			react.useEffect(() => {
				if (!customOpen) return;
				const onDocMouseDown = (e) => {
					if (customPopRef.current && !customPopRef.current.contains(e.target)) setCustomOpen(false);
				};
				document.addEventListener("mousedown", onDocMouseDown);
				return () => document.removeEventListener("mousedown", onDocMouseDown);
			}, [customOpen]);

			const totals = data ? data.totals : null;
			const statCards = totals ? [
				{ label: t("stat.total"), value: totals.inputTokens + totals.outputTokens + totals.cacheReadTokens + totals.cacheWriteTokens, sub: fmtZhTokens(totals.inputTokens + totals.outputTokens + totals.cacheReadTokens + totals.cacheWriteTokens), accent: "Ds", delay: 60, format: "tokens" },
				{ label: t("stat.requests"), value: totals.requests, sub: null, accent: "Blue", delay: 100, format: "count" },
				{ label: t("stat.input"), value: totals.inputTokens, sub: null, accent: "Ds", delay: 140, format: "tokens" },
				{ label: t("stat.output"), value: totals.outputTokens, sub: totals.reasoningTokens ? t("stat.reasoning") + " " + fmtTokens(totals.reasoningTokens) : null, accent: "Amber", delay: 180, format: "tokens" },
				{ label: t("stat.hitRate"), value: data ? data.cacheHitRate : null, sub: null, accent: "Neutral", delay: 300, format: "percent" },
				{ label: t("stat.cost"), value: data && data.cost ? data.cost.usd : null, sub: data && data.cost && data.cost.usd === null ? t("cost.unpriced") : data && data.cost && data.cost.unknownModels.length > 0 ? t("cost.partial") : null, accent: "Red", delay: 340, format: "usd" },
			] : null;

			const priceModels = data
				? [...new Set([
					...data.filterOptions.models,
					...Object.keys(priceApi.prices || {}),
					...Object.keys(priceApi.auto || {}).filter((k) => {
						const v = priceApi.auto[k];
						return k !== "_updatedAt" && v !== null && typeof v === "object" && !Array.isArray(v);
					}),
				])].sort()
				: [];

			return h("div", {
				className: "ts-overlay" + (closing ? " ts-closing" : ""),
				role: "presentation",
				children: [
					h("div", { className: "ts-mask", "aria-hidden": "true", onClick: close }),
					h("div", {
						ref: panelRef,
						className: "ts-panel",
						role: "dialog",
						"aria-modal": "true",
						"aria-label": t("panel.title"),
						tabIndex: -1,
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
									h("div", {
										className: "ts-controls",
										children: [
											h("div", {
												ref: customPopRef,
												className: "ts-segWrap",
												children: [
													h(Segmented, {
														value: days,
														onChange: handleDaysChange,
														t,
														options: [
															{ value: "5h", labelKey: "range.5h" },
															{ value: "hour", labelKey: "range.hour" },
															{ value: "7", labelKey: "range.7" },
															{ value: "month", labelKey: "range.month" },
															{ value: "30", labelKey: "range.30" },
															{ value: "90", labelKey: "range.90" },
															{ value: "year", labelKey: "range.year" },
															{ value: "custom", labelKey: "range.custom" },
														],
													}),
													days === "custom" && customOpen ? h("div", {
														className: "ts-customPop",
														children: [
															h("div", { className: "ts-customPopTitle", children: t("range.custom") }),
															h("div", {
																className: "ts-customPopRow",
																children: [
																	h("span", { className: "ts-customPopLabel", children: t("custom.start") }),
																	h("input", {
																		type: "date",
																		className: "ts-customDate",
																		value: customStart,
																		max: customEnd || undefined,
																		onChange: (e) => {
																			const next = clampRange(e.target.value, customEnd);
																			setCustomStart(next.start);
																			setCustomEnd(next.end);
																		},
																	}),
																],
															}),
															h("div", {
																className: "ts-customPopRow",
																children: [
																	h("span", { className: "ts-customPopLabel", children: t("custom.end") }),
																	h("input", {
																		type: "date",
																		className: "ts-customDate",
																		value: customEnd,
																		min: customStart || undefined,
																		onChange: (e) => {
																			const next = clampRange(customStart, e.target.value);
																			setCustomStart(next.start);
																			setCustomEnd(next.end);
																		},
																	}),
																],
															}),
														],
													}) : null,
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
										],
									}),
									h("button", {
										type: "button",
										className: "ts-headerIconBtn",
										"aria-label": t("price.title"),
										title: t("price.title"),
										onClick: () => {
											if (priceOpen) setPriceOpen(false);
											else {
												priceApi.load();
												setPriceOpen(true);
											}
										},
										children: h("span", { className: "ts-priceBtnLabel", children: "$" }),
									}),
									h("button", {
										type: "button",
										className: "ts-headerIconBtn" + (busy ? " ts-spinning" : ""),
										"aria-label": t("refresh"),
										title: t("refresh"),
										onClick: refreshAll,
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
							priceOpen && data ? h(PricePanel, {
								models: priceModels,
								loadError: priceApi.loadError,
								autoError: priceApi.autoError,
								prices: priceApi.prices,
								auto: priceApi.auto,
								autoUpdatedAt: priceApi.autoUpdatedAt,
								autoBusy: priceApi.autoBusy,
								onRefreshAuto: async () => {
									const ok = await priceApi.refreshAuto();
									if (ok) refreshAll();
								},
								t,
								onClose: () => setPriceOpen(false),
								onSave: async (next) => {
									const ok = await priceApi.save(next);
									if (ok) {
										setPriceOpen(false);
										refreshAll();
									}
								},
							}) : null,
							h("div", {
								className: "ts-body",
								children: [
									error && !data ? h(ErrorState, { t, message: error, onRetry: refreshAll })
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
											h(TrendChart, { data: data.series, granularity: data.granularity, t, delay: 220, animateKey: chartAnimateKey, cost: data.cost }),
											h(ContributionHeatmap, { data: heatmap.data ? heatmap.data.series : null, t, delay: 280 }),
											h(ModelSummary, {
												models: data.byModel || [],
												t,
												selectedModel: model,
												onSelect: (m) => setModel((prev) => (prev === m ? "" : m)),
												delay: 300,
											}),
											data.recent && data.recent.length > 0 ? h(RecentList, { rows: data.recent, t, delay: 340, data, onCleared: refreshAll }) : null,
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
			"range.5h": "5小时",
			"range.hour": "当日",
			"range.7": "近7天",
			"range.month": "当月",
			"range.30": "近30天",
			"range.90": "近90天",
			"range.year": "今年",
			"range.custom": "自定义",
			"custom.start": "开始日期",
			"custom.end": "结束日期",
			"filter.provider": "API",
			"filter.model": "模型",
			"filter.all": "全部",
			"refresh": "刷新",
			"close": "关闭",
			"stat.total": "总 Tokens",
			"stat.requests": "请求数",
			"stat.input": "输入 Tokens",
			"stat.output": "输出 Tokens",
			"stat.hitRate": "总命中率",
			"stat.cost": "估算成本",
			"cost.unpriced": "未配置价格",
			"cost.partial": "部分模型未定价",
			"price.title": "模型价格配置",
			"price.model": "模型",
			"price.hint": "单价：美元 / 100万 tokens",
			"price.input": "输入",
			"price.output": "输出",
			"price.cacheRead": "缓存读",
			"price.cacheWrite": "缓存写",
			"price.search": "搜索模型…",
			"price.noMatch": "没有匹配的模型",
			"price.autoCnyTag": "自动·源CNY",
			"price.autoCnyTitle": "自动价格已从 modelradar.cn 的 CNY 价格换算为 USD",
			"price.save": "保存",
			"price.cancel": "取消",
			"price.clear": "清除价格",
			"price.empty": "暂无模型",
			"price.note": "未填写价格：保存时将忽略该模型",
			"price.autoSource": "价格源：modelradar.cn · 统一换算为 USD",
			"price.loadError": "无法读取价格接口：",
			"price.autoError": "自动价格更新失败：",
			"price.notFetched": "自动价格尚未获取",
			"price.refreshAuto": "从 ModelRadar 刷新",
			"price.refreshing": "刷新中…",
			"price.autoTag": "自动",
			"price.manualTag": "手动",
			"export.label": "导出",
			"export.jsonl": "JSONL（全部历史记录）",
			"export.jsonView": "JSON（当前视图）",
			"export.recentCsv": "CSV（最近请求）",
			"export.modelCsv": "CSV（模型汇总）",
			"data.clear": "清空全部历史",
			"data.clearConfirm": "再次点击，确认清空",
			"stat.reasoning": "含推理",
			"chart.trend": "Token 用量趋势",
			"chart.trendHint": "曲线：输入 / 输出 / 缓存命中 / 成本",
			"chart.legendToggle": "点击隐藏或显示该曲线",
			"legend.input": "输入",
			"legend.cacheHit": "缓存命中",
			"legend.output": "输出",
			"legend.requests": "请求",
			"legend.cacheWrite": "缓存写",
			"legend.reasoning": "推理",
			"legend.cost": "成本",
			"legend.tokens": "TOKENS",
			"heat.title": "每日用量",
			"heat.hint": "近一年（52 周）每日 Token 用量",
			"heat.dayMon": "周一",
			"heat.dayWed": "周三",
			"heat.dayFri": "周五",
			"heat.less": "少",
			"heat.more": "多",
			"model.title": "模型汇总",
			"model.hint": "按模型统计，点击行可筛选",
			"model.model": "模型",
			"model.requests": "请求",
			"model.input": "输入",
			"model.output": "输出",
			"model.cacheHit": "缓存命中",
			"model.cacheWrite": "缓存写",
			"model.cost": "成本",
			"model.unpriced": "未定价",
			"model.clickHint": "点击筛选该模型",
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
			"range.5h": "5h",
			"range.hour": "Today",
			"range.7": "7d",
			"range.month": "Month",
			"range.30": "30d",
			"range.90": "90d",
			"range.year": "Year",
			"range.custom": "Custom",
			"custom.start": "Start date",
			"custom.end": "End date",
			"filter.provider": "API",
			"filter.model": "Model",
			"filter.all": "All",
			"refresh": "Refresh",
			"close": "Close",
			"stat.total": "Total Tokens",
			"stat.requests": "Requests",
			"stat.input": "Input Tokens",
			"stat.output": "Output Tokens",
			"stat.hitRate": "Cache Hit Rate",
			"stat.cost": "Est. Cost",
			"cost.unpriced": "no prices set",
			"cost.partial": "some models unpriced",
			"price.title": "Model Prices",
			"price.model": "Model",
			"price.hint": "USD per 1M tokens",
			"price.input": "Input",
			"price.output": "Output",
			"price.cacheRead": "Cache read",
			"price.cacheWrite": "Cache write",
			"price.search": "Search models…",
			"price.noMatch": "No matching models",
			"price.autoCnyTag": "auto·CNY",
			"price.autoCnyTitle": "Auto price converted to USD from the CNY price on modelradar.cn",
			"price.save": "Save",
			"price.cancel": "Cancel",
			"price.clear": "Clear price",
			"price.empty": "No models yet",
			"price.note": "Models without prices are ignored on save",
			"price.autoSource": "Source: modelradar.cn · converted to USD",
			"price.loadError": "Cannot reach the prices API: ",
			"price.autoError": "Auto price refresh failed: ",
			"price.notFetched": "Auto prices not fetched yet",
			"price.refreshAuto": "Refresh from ModelRadar",
			"price.refreshing": "Refreshing…",
			"price.autoTag": "auto",
			"price.manualTag": "manual",
			"export.label": "Export",
			"export.jsonl": "JSONL (full history)",
			"export.jsonView": "JSON (current view)",
			"export.recentCsv": "CSV (recent requests)",
			"export.modelCsv": "CSV (model summary)",
			"data.clear": "Clear all history",
			"data.clearConfirm": "Click again to confirm",
			"stat.reasoning": "incl. reasoning",
			"chart.trend": "Usage Trend",
			"chart.trendHint": "curves: input / output / cache hit / cost",
			"chart.legendToggle": "Click to hide/show this series",
			"legend.input": "Input",
			"legend.cacheHit": "Cache hit",
			"legend.output": "Output",
			"legend.requests": "Requests",
			"legend.cacheWrite": "Cache write",
			"legend.reasoning": "Reasoning",
			"legend.cost": "Cost",
			"legend.tokens": "TOKENS",
			"heat.title": "Daily Usage",
			"heat.hint": "Daily token usage for the last year (52 weeks)",
			"heat.dayMon": "Mon",
			"heat.dayWed": "Wed",
			"heat.dayFri": "Fri",
			"heat.less": "Less",
			"heat.more": "More",
			"model.title": "Model Summary",
			"model.hint": "Per-model stats; click a row to filter",
			"model.model": "Model",
			"model.requests": "Requests",
			"model.input": "Input",
			"model.output": "Output",
			"model.cacheHit": "Cache hit",
			"model.cacheWrite": "Cache write",
			"model.cost": "Cost",
			"model.unpriced": "unpriced",
			"model.clickHint": "Click to filter this model",
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
