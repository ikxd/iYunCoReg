// sidepanel/sidepanel.js — Side Panel logic

const STATUS_ICONS = {
  pending: '',
  running: '',
  completed: '\u2713',  // ✓
  skipped: '\u00BB',    // »
  failed: '\u2717',     // ✗
  stopped: '\u25A0',    // ■
};

const logArea = document.getElementById('log-area');
const displayOauthUrl = document.getElementById('display-oauth-url');
const displayLocalhostUrl = document.getElementById('display-localhost-url');
const displayStatus = document.getElementById('display-status');
const statusBar = document.getElementById('status-bar');
const rowMailProvider = document.getElementById('row-mail-provider');
const inputEmail = document.getElementById('input-email');
const inputPassword = document.getElementById('input-password');
const btnPasteEmail = document.getElementById('btn-paste-email');
const btnCopyEmail = document.getElementById('btn-copy-email');
const btnTogglePassword = document.getElementById('btn-toggle-password');
const btnCopyPassword = document.getElementById('btn-copy-password');
const btnStop = document.getElementById('btn-stop');
const btnReset = document.getElementById('btn-reset');
const stepsProgress = document.getElementById('steps-progress');
const btnAutoRun = document.getElementById('btn-auto-run');
const btnAutoContinue = document.getElementById('btn-auto-continue');
const autoContinueBar = document.getElementById('auto-continue-bar');
const btnClearLog = document.getElementById('btn-clear-log');
const selectLanguage = document.getElementById('select-language');
const inputVpsUrl = document.getElementById('input-vps-url');
const btnPasteVpsUrl = document.getElementById('btn-paste-vps-url');
const selectMailProvider = document.getElementById('select-mail-provider');
const mailLoginHelp = document.getElementById('mail-login-help');
const mailLoginHelpTitle = document.getElementById('mail-login-help-title');
const mailLoginHelpText = document.getElementById('mail-login-help-text');
const btnMailLoginDone = document.getElementById('btn-mail-login-done');
const inputRunCount = document.getElementById('input-run-count');
const autoHint = document.getElementById('auto-hint');
let currentLanguage = localStorage.getItem('multipage-language') || 'zh-CN';
let lastKnownState = null;
let lastMailLoginPrompt = null;

// ============================================================
// Toast Notifications
// ============================================================

const toastContainer = document.getElementById('toast-container');

const TOAST_ICONS = {
  error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  warn: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
};

const AUTO_BUTTON_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';

const I18N = {
  'zh-CN': {
    titleRunCount: '运行次数',
    titleAutoRun: '自动执行全部步骤',
    titleStop: '停止当前流程',
    titleReset: '重置全部步骤',
    titleTheme: '切换主题',
    titleSkipStep: '跳过这一步',
    titleClearLog: '清空日志',
    labelCpaAuth: 'CPA Auth',
    labelLanguage: '语言',
    labelAlias: '别名',
    labelCleanup: '清理',
    labelVerify: '验证',
    labelMailbox: '邮箱名',
    labelEmail: '邮箱',
    labelPassword: '密码',
    labelOauth: 'OAuth',
    labelCallback: '回调',
    mailProvider163: '163 邮箱 (mail.163.com)',
    mailProviderQq: 'QQ 邮箱 (wx.mail.qq.com)',
    mailProviderGmail: 'Gmail (mail.google.com)',
    placeholderCpaAuth: 'http://ip:port/management.html#/oauth',
    placeholderEmailManual: '请手动输入邮箱地址',
    placeholderPassword: '留空则自动生成',
    waiting: '等待中...',
    btnConfirm: '确定',
    btnAuto: '自动',
    btnStop: '停止',
    btnContinue: '继续',
    btnCopy: '复制',
    btnPaste: '粘贴',
    btnRefresh: '刷新',
    btnDeleteUsed: '删除已用',
    btnDelete: '删除',
    btnMarkUsed: '标记已用',
    btnMarkUnused: '标记未用',
    btnPreserve: '保留',
    btnUnpreserve: '取消保留',
    btnClear: '清空',
    btnSkip: '跳过',
    btnShow: '显示',
    btnHide: '隐藏',
    sectionWorkflow: '流程',
    sectionConsole: '控制台',
    step1: '获取 OAuth 链接',
    step2: '打开注册页',
    step3: '填写邮箱 / 密码',
    step4: '获取注册验证码',
    step5: '填写姓名 / 生日',
    step6: '通过 OAuth 登录',
    step7: '获取登录验证码',
    step8: 'OAuth 自动确认',
    step9: 'CPA Auth 验证',
    statusRunning: ({ step }) => `第 ${step} 步执行中...`,
    statusFailed: ({ step }) => `第 ${step} 步失败`,
    statusStopped: ({ step }) => `第 ${step} 步已停止`,
    statusAllFinished: '全部步骤已完成',
    statusSkipped: ({ step }) => `第 ${step} 步已跳过`,
    statusDone: ({ step }) => `第 ${step} 步完成`,
    statusReady: '就绪',
    autoHintEmailManual: '请手动输入邮箱，然后点击继续',
    autoHintError: '自动运行被错误中断。修复问题或跳过失败步骤后继续',
    fetchedEmail: ({ email }) => `已获取 ${email}`,
    autoFetchFailed: ({ message }) => `自动获取失败：${message}`,
    mailLoginRequiredToast: ({ provider }) => `${provider} 需要先登录，我已经为你打开邮箱页。`,
    mailLoginHelpTitle: ({ provider }) => `${provider} 需要登录`,
    mailLoginHelpText: ({ provider, host, step }) => `我已经为你打开 ${provider}${host ? `（${host}）` : ''}。请先在那个页面完成登录，然后回到这里点击”确定”，再重新执行第 ${step} 步。`,
    mailLoginConfirmed: '已关闭邮箱登录提示，请重新执行当前步骤。',
    pleaseEnterEmailFirst: '请先粘贴邮箱地址或点击 Auto',
    skipFailed: ({ message }) => `跳过失败：${message}`,
    stepSkippedToast: ({ step }) => `第 ${step} 步已跳过`,
    stoppingFlow: '正在停止当前流程...',
    continueNeedEmail: '请先获取或粘贴邮箱地址',
    continueFailed: ({ message }) => `继续失败：${message}`,
    confirmReset: '要重置全部步骤和数据吗？',
    copiedValue: ({ label }) => `已复制${label}`,
    copiedValueFallback: ({ label }) => `已复制 ${label}`,
    copyFailed: ({ label, message }) => `${label}复制失败：${message}`,
    nothingToCopy: ({ label }) => `${label}为空，无法复制`,
    pastedCpaAuth: '已从剪贴板粘贴 CPA Auth 地址',
    pastedEmail: '已从剪贴板粘贴邮箱',
    pasteFailed: ({ message }) => `粘贴失败：${message}`,
    clipboardEmpty: '剪贴板为空',
    clipboardNoUsefulText: '剪贴板中没有可用内容',
    autoRunRunning: ({ runLabel }) => `运行中${runLabel}`,
    autoRunPaused: ({ runLabel }) => `已暂停${runLabel}`,
    autoRunInterrupted: ({ runLabel }) => `已中断${runLabel}`,
  },
  'en-US': {
    titleRunCount: 'Number of runs',
    titleAutoRun: 'Run all steps automatically',
    titleStop: 'Stop current flow',
    titleReset: 'Reset all steps',
    titleTheme: 'Toggle theme',
    titleSkipStep: 'Skip this step',
    titleClearLog: 'Clear log',
    labelCpaAuth: 'CPA Auth',
    labelLanguage: 'Language',
    labelAlias: 'Alias',
    labelCleanup: 'Cleanup',
    labelVerify: 'Verify',
    labelMailbox: 'Mailbox',
    labelEmail: 'Email',
    labelPassword: 'Password',
    labelOauth: 'OAuth',
    labelCallback: 'Callback',
    mailProvider163: '163 Mail (mail.163.com)',
    mailProviderQq: 'QQ Mail (wx.mail.qq.com)',
    mailProviderGmail: 'Gmail (mail.google.com)',
    placeholderCpaAuth: 'http://ip:port/management.html#/oauth',
    placeholderEmailManual: 'Please enter email manually',
    placeholderPassword: 'Leave blank to auto-generate',
    waiting: 'Waiting...',
    btnConfirm: 'OK',
    btnAuto: 'Auto',
    btnStop: 'Stop',
    btnContinue: 'Continue',
    btnCopy: 'Copy',
    btnPaste: 'Paste',
    btnRefresh: 'Refresh',
    btnDeleteUsed: 'Delete Used',
    btnDelete: 'Delete',
    btnMarkUsed: 'Mark Used',
    btnMarkUnused: 'Mark Unused',
    btnPreserve: 'Preserve',
    btnUnpreserve: 'Unpreserve',
    btnClear: 'Clear',
    btnSkip: 'Skip',
    btnShow: 'Show',
    btnHide: 'Hide',
    sectionWorkflow: 'Workflow',
    sectionConsole: 'Console',
    step1: 'Get OAuth Link',
    step2: 'Open Signup',
    step3: 'Fill Email / Password',
    step4: 'Get Signup Code',
    step5: 'Fill Name / Birthday',
    step6: 'Login via OAuth',
    step7: 'Get Login Code',
    step8: 'OAuth Auto Confirm',
    step9: 'CPA Auth Verify',
    statusRunning: ({ step }) => `Step ${step} running...`,
    statusFailed: ({ step }) => `Step ${step} failed`,
    statusStopped: ({ step }) => `Step ${step} stopped`,
    statusAllFinished: 'All steps finished',
    statusSkipped: ({ step }) => `Step ${step} skipped`,
    statusDone: ({ step }) => `Step ${step} done`,
    statusReady: 'Ready',
    autoHintEmailManual: 'Please enter email manually, then continue',
    autoHintError: 'Auto run was interrupted by an error. Fix it or skip the failed step, then continue',
    fetchedEmail: ({ email }) => `Fetched ${email}`,
    autoFetchFailed: ({ message }) => `Auto fetch failed: ${message}`,
    mailLoginRequiredToast: ({ provider }) => `${provider} sign-in is required. A mail tab has been opened for you.`,
    mailLoginHelpTitle: ({ provider }) => `${provider} sign-in required`,
    mailLoginHelpText: ({ provider, host, step }) => `We opened ${provider}${host ? ` (${host})` : ''} for you. Please finish sign-in there, then return here, click "OK", and rerun step ${step}.`,
    mailLoginConfirmed: 'Mail sign-in reminder dismissed. Please rerun the current step.',
    pleaseEnterEmailFirst: 'Please paste email address or use Auto first',
    skipFailed: ({ message }) => `Skip failed: ${message}`,
    stepSkippedToast: ({ step }) => `Step ${step} skipped`,
    stoppingFlow: 'Stopping current flow...',
    continueNeedEmail: 'Please fetch or paste an email address first!',
    continueFailed: ({ message }) => `Continue failed: ${message}`,
    confirmReset: 'Reset all steps and data?',
    copiedValue: ({ label }) => `Copied ${label}`,
    copiedValueFallback: ({ label }) => `${label} copied`,
    copyFailed: ({ label, message }) => `Failed to copy ${label}: ${message}`,
    nothingToCopy: ({ label }) => `${label} is empty`,
    pastedCpaAuth: 'Pasted CPA Auth URL from clipboard',
    pastedEmail: 'Pasted email from clipboard',
    pasteFailed: ({ message }) => `Paste failed: ${message}`,
    clipboardEmpty: 'Clipboard is empty',
    clipboardNoUsefulText: 'Clipboard does not contain usable text',
    autoRunRunning: ({ runLabel }) => `Running${runLabel}`,
    autoRunPaused: ({ runLabel }) => `Paused${runLabel}`,
    autoRunInterrupted: ({ runLabel }) => `Interrupted${runLabel}`,
  },
};

function t(key, vars = {}) {
  const pack = I18N[currentLanguage] || I18N['zh-CN'];
  const fallbackPack = I18N['zh-CN'];
  const value = pack[key] ?? fallbackPack[key] ?? key;
  if (typeof value === 'function') return value(vars);
  return String(value).replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
}

function setAutoRunButton(label) {
  btnAutoRun.innerHTML = `${AUTO_BUTTON_ICON} ${label}`;
}

function getCopyLabel(kind) {
  if (currentLanguage === 'zh-CN') {
    if (kind === 'email') return '邮箱';
    if (kind === 'password') return '密码';
    return '内容';
  }
  if (kind === 'email') return 'email';
  if (kind === 'password') return 'password';
  return 'value';
}

function applyLanguage(language) {
  currentLanguage = I18N[language] ? language : 'zh-CN';
  localStorage.setItem('multipage-language', currentLanguage);
  document.documentElement.lang = currentLanguage;
  if (selectLanguage) {
    selectLanguage.value = currentLanguage;
  }

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    node.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    node.placeholder = t(key);
  });
  document.querySelectorAll('[data-i18n-title]').forEach((node) => {
    const key = node.dataset.i18nTitle;
    node.title = t(key);
  });

  inputPassword.placeholder = t('placeholderPassword');
  if (!displayOauthUrl.classList.contains('has-value')) {
    displayOauthUrl.textContent = t('waiting');
  }
  if (!displayLocalhostUrl.classList.contains('has-value')) {
    displayLocalhostUrl.textContent = t('waiting');
  }
  updateEmailSourceUI();
  syncPasswordToggleLabel();
  updateProgressCounter();
  if (lastKnownState) {
    updateStatusDisplay(lastKnownState);
  } else {
    displayStatus.textContent = t('statusReady');
  }
  if (mailLoginHelp.style.display !== 'none' && lastMailLoginPrompt) {
    showMailLoginHelp(lastMailLoginPrompt);
  }
}

async function saveVpsUrlValue(value) {
  const vpsUrl = String(value || '').trim();
  inputVpsUrl.value = vpsUrl;
  if (!vpsUrl) return;
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING',
    source: 'sidepanel',
    payload: { vpsUrl },
  });
}

async function copyTextValue(value, kind) {
  const trimmed = String(value || '').trim();
  const label = getCopyLabel(kind);
  if (!trimmed) {
    showToast(t('nothingToCopy', { label }), 'warn');
    return;
  }

  try {
    await navigator.clipboard.writeText(trimmed);
    showToast(t('copiedValue', { label }), 'success', 2000);
  } catch (err) {
    showToast(t('copyFailed', { label, message: err.message || err }), 'error');
  }
}

async function pasteCpaAuthFromClipboard(options = {}) {
  const { silentIfFilled = false } = options;
  if (silentIfFilled && inputVpsUrl.value.trim()) return;

  try {
    const text = String(await navigator.clipboard.readText() || '').trim();
    if (!text) {
      showToast(t('clipboardEmpty'), 'warn');
      return;
    }
    await saveVpsUrlValue(text);
    showToast(t('pastedCpaAuth'), 'success', 2000);
  } catch (err) {
    showToast(t('pasteFailed', { message: err.message || err }), 'warn');
  }
}

function showToast(message, type = 'error', duration = 4000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `${TOAST_ICONS[type] || ''}<span class="toast-msg">${escapeHtml(message)}</span><button class="toast-close">&times;</button>`;

  toast.querySelector('.toast-close').addEventListener('click', () => dismissToast(toast));
  toastContainer.appendChild(toast);

  if (duration > 0) {
    setTimeout(() => dismissToast(toast), duration);
  }
}

function dismissToast(toast) {
  if (!toast.parentNode) return;
  toast.classList.add('toast-exit');
  toast.addEventListener('animationend', () => toast.remove());
}

// ============================================================
// State Restore on load
// ============================================================

async function restoreState() {
  try {
    const state = await chrome.runtime.sendMessage({ type: 'GET_STATE', source: 'sidepanel' });
    lastKnownState = state;
    applyLanguage(state.language || currentLanguage);

    if (state.oauthUrl) {
      displayOauthUrl.textContent = state.oauthUrl;
      displayOauthUrl.classList.add('has-value');
    }
    if (state.localhostUrl) {
      displayLocalhostUrl.textContent = state.localhostUrl;
      displayLocalhostUrl.classList.add('has-value');
    }
    if (state.email) {
      inputEmail.value = state.email;
    }
    syncPasswordField(state);
    if (state.vpsUrl) {
      inputVpsUrl.value = state.vpsUrl;
    }
    if (state.language) {
      selectLanguage.value = state.language;
    }
    if (state.mailProvider) {
      selectMailProvider.value = state.mailProvider;
    }

    if (state.stepStatuses) {
      for (const [step, status] of Object.entries(state.stepStatuses)) {
        updateStepUI(Number(step), status);
      }
    }

    if (state.logs) {
      for (const entry of state.logs) {
        appendLog(entry);
      }
    }

    updateStatusDisplay(state);
    updateProgressCounter();
    updateEmailSourceUI();
    updateMailProviderUI();

    if (state.autoRunPausedPhase === 'waiting_email') {
      autoContinueBar.dataset.reason = 'waiting_email';
      autoHint.textContent = t('autoHintEmailManual');
      autoContinueBar.style.display = 'flex';
      btnAutoRun.disabled = false;
      inputRunCount.disabled = false;
    } else if (state.autoRunPausedPhase === 'error') {
      autoContinueBar.dataset.reason = 'error';
      autoHint.textContent = t('autoHintError');
      autoContinueBar.style.display = 'flex';
      btnAutoRun.disabled = false;
      inputRunCount.disabled = false;
    }
  } catch (err) {
    console.error('Failed to restore state:', err);
  }
}

function syncPasswordField(state) {
  inputPassword.value = state.customPassword || state.password || '';
}

function updateMailProviderUI() {
  rowMailProvider.style.display = '';
}

function updateEmailSourceUI() {
  inputEmail.placeholder = t('placeholderEmailManual');
  autoHint.textContent = t('autoHintEmailManual');
  btnPasteEmail.disabled = false;
}

// ============================================================
// UI Updates
// ============================================================

function updateStepUI(step, status) {
  const statusEl = document.querySelector(`.step-status[data-step="${step}"]`);
  const row = document.querySelector(`.step-row[data-step="${step}"]`);

  if (statusEl) statusEl.textContent = STATUS_ICONS[status] || '';
  if (row) {
    row.className = `step-row ${status}`;
  }

  updateButtonStates();
  updateProgressCounter();
}

function updateProgressCounter() {
  let completed = 0;
  document.querySelectorAll('.step-row').forEach(row => {
    if (row.classList.contains('completed') || row.classList.contains('skipped')) completed++;
  });
  stepsProgress.textContent = `${completed} / 9`;
}

function updateButtonStates() {
  const statuses = {};
  document.querySelectorAll('.step-row').forEach(row => {
    const step = Number(row.dataset.step);
    if (row.classList.contains('completed')) statuses[step] = 'completed';
    else if (row.classList.contains('skipped')) statuses[step] = 'skipped';
    else if (row.classList.contains('running')) statuses[step] = 'running';
    else if (row.classList.contains('failed')) statuses[step] = 'failed';
    else if (row.classList.contains('stopped')) statuses[step] = 'stopped';
    else statuses[step] = 'pending';
  });

  const anyRunning = Object.values(statuses).some(s => s === 'running');

  for (let step = 1; step <= 9; step++) {
    const btn = document.querySelector(`.step-btn[data-step="${step}"]`);
    const skipBtn = document.querySelector(`.step-skip-btn[data-step="${step}"]`);
    if (!btn) continue;

    const currentStatus = statuses[step];

    if (anyRunning) {
      btn.disabled = true;
      if (skipBtn) skipBtn.disabled = true;
    } else if (step === 1) {
      btn.disabled = false;
    } else {
      const prevStatus = statuses[step - 1];
      btn.disabled = !(
        prevStatus === 'completed'
        || prevStatus === 'skipped'
        || currentStatus === 'failed'
        || currentStatus === 'completed'
        || currentStatus === 'stopped'
        || currentStatus === 'skipped'
      );
    }

    if (skipBtn) {
      skipBtn.disabled = !(currentStatus === 'failed' || currentStatus === 'stopped');
    }
  }

  updateStopButtonState(anyRunning || autoContinueBar.style.display !== 'none');
}

function updateStopButtonState(active) {
  btnStop.disabled = !active;
}

function updateStatusDisplay(state) {
  if (!state || !state.stepStatuses) return;
  lastKnownState = state;

  statusBar.className = 'status-bar';

  const running = Object.entries(state.stepStatuses).find(([, s]) => s === 'running');
  if (running) {
    displayStatus.textContent = t('statusRunning', { step: running[0] });
    statusBar.classList.add('running');
    return;
  }

  const failed = Object.entries(state.stepStatuses).find(([, s]) => s === 'failed');
  if (failed) {
    displayStatus.textContent = t('statusFailed', { step: failed[0] });
    statusBar.classList.add('failed');
    return;
  }

  const stopped = Object.entries(state.stepStatuses).find(([, s]) => s === 'stopped');
  if (stopped) {
    displayStatus.textContent = t('statusStopped', { step: stopped[0] });
    statusBar.classList.add('stopped');
    return;
  }

  const entries = Object.entries(state.stepStatuses);
  const allProgressed = entries.every(([, s]) => s === 'completed' || s === 'skipped');
  if (allProgressed) {
    displayStatus.textContent = t('statusAllFinished');
    statusBar.classList.add('completed');
    return;
  }

  const lastProgressed = entries
    .filter(([, s]) => s === 'completed' || s === 'skipped')
    .map(([k]) => Number(k))
    .sort((a, b) => b - a)[0];

  if (lastProgressed) {
    displayStatus.textContent = state.stepStatuses[lastProgressed] === 'skipped'
      ? t('statusSkipped', { step: lastProgressed })
      : t('statusDone', { step: lastProgressed });
  } else {
    displayStatus.textContent = t('statusReady');
  }
}

function appendLog(entry) {
  const time = new Date(entry.timestamp).toLocaleTimeString('en-US', { hour12: false });
  const levelLabel = entry.level.toUpperCase();
  const line = document.createElement('div');
  line.className = `log-line log-${entry.level}`;

  const stepMatch = entry.message.match(/Step (\d)/);
  const stepNum = stepMatch ? stepMatch[1] : null;

  let html = `<span class="log-time">${time}</span> `;
  html += `<span class="log-level log-level-${entry.level}">${levelLabel}</span> `;
  if (stepNum) {
    html += `<span class="log-step-tag step-${stepNum}">S${stepNum}</span>`;
  }
  html += `<span class="log-msg">${escapeHtml(entry.message)}</span>`;

  line.innerHTML = html;
  logArea.appendChild(line);
  logArea.scrollTop = logArea.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showMailLoginHelp(payload = {}) {
  lastMailLoginPrompt = payload;
  const provider = String(payload.label || payload.provider || 'Mail').trim();
  const loginUrl = String(payload.loginUrl || '').trim();
  let host = '';
  try {
    host = loginUrl ? new URL(loginUrl).host : '';
  } catch {
    host = '';
  }
  const step = Number(payload.step) || 4;
  mailLoginHelpTitle.textContent = t('mailLoginHelpTitle', { provider, host, step });
  mailLoginHelpText.textContent = t('mailLoginHelpText', { provider, host, step });
  mailLoginHelp.style.display = 'flex';
}

function hideMailLoginHelp() {
  mailLoginHelp.style.display = 'none';
  lastMailLoginPrompt = null;
}


function syncPasswordToggleLabel() {
  btnTogglePassword.textContent = inputPassword.type === 'password' ? t('btnShow') : t('btnHide');
}

// ============================================================
// Button Handlers
// ============================================================

document.querySelectorAll('.step-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const step = Number(btn.dataset.step);
    if (step === 3) {
      const email = inputEmail.value.trim();
      if (!email) {
        showToast(t('pleaseEnterEmailFirst'), 'warn');
        return;
      }
      await chrome.runtime.sendMessage({ type: 'EXECUTE_STEP', source: 'sidepanel', payload: { step, email } });
    } else {
      await chrome.runtime.sendMessage({ type: 'EXECUTE_STEP', source: 'sidepanel', payload: { step } });
    }
  });
});

document.querySelectorAll('.step-skip-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const step = Number(btn.dataset.step);
    const response = await chrome.runtime.sendMessage({
      type: 'SKIP_STEP',
      source: 'sidepanel',
      payload: { step },
    });
    if (response?.error) {
      showToast(t('skipFailed', { message: response.error }), 'error');
      return;
    }
    showToast(t('stepSkippedToast', { step }), 'warn', 2000);
  });
});

btnPasteEmail.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text && text.trim()) {
      inputEmail.value = text.trim();
      showToast(t('pastedEmail'), 'success', 1500);
    }
  } catch (err) {
    showToast(t('pasteFailed', { message: err.message }), 'error');
  }
});

btnCopyEmail.addEventListener('click', async () => {
  await copyTextValue(inputEmail.value, 'email');
});

btnCopyPassword.addEventListener('click', async () => {
  await copyTextValue(inputPassword.value, 'password');
});

btnPasteVpsUrl.addEventListener('click', async () => {
  await pasteCpaAuthFromClipboard();
});

btnMailLoginDone.addEventListener('click', async () => {
  hideMailLoginHelp();
  showToast(t('mailLoginConfirmed'), 'info', 2500);
});


btnTogglePassword.addEventListener('click', () => {
  inputPassword.type = inputPassword.type === 'password' ? 'text' : 'password';
  syncPasswordToggleLabel();
});

btnStop.addEventListener('click', async () => {
  btnStop.disabled = true;
  await chrome.runtime.sendMessage({ type: 'STOP_FLOW', source: 'sidepanel', payload: {} });
  showToast(t('stoppingFlow'), 'warn', 2000);
});

// Auto Run
btnAutoRun.addEventListener('click', async () => {
  const totalRuns = parseInt(inputRunCount.value) || 1;
  btnAutoRun.disabled = true;
  inputRunCount.disabled = true;
  setAutoRunButton(t('autoRunRunning', { runLabel: '' }));
  await chrome.runtime.sendMessage({ type: 'AUTO_RUN', source: 'sidepanel', payload: { totalRuns } });
});

btnAutoContinue.addEventListener('click', async () => {
  const reason = autoContinueBar.dataset.reason || 'waiting_email';
  const email = inputEmail.value.trim();
  if (reason === 'waiting_email' && !email) {
    showToast(t('continueNeedEmail'), 'warn');
    return;
  }
  const response = await chrome.runtime.sendMessage({
    type: 'CONTINUE_AUTO_RUN',
    source: 'sidepanel',
    payload: { email },
  });
  if (response?.error) {
    showToast(t('continueFailed', { message: response.error }), 'error');
    return;
  }
  autoContinueBar.style.display = 'none';
  autoContinueBar.dataset.reason = '';
});

// Reset
btnReset.addEventListener('click', async () => {
  if (confirm(t('confirmReset'))) {
    await chrome.runtime.sendMessage({ type: 'RESET', source: 'sidepanel' });
    displayOauthUrl.textContent = t('waiting');
    displayOauthUrl.classList.remove('has-value');
    displayLocalhostUrl.textContent = t('waiting');
    displayLocalhostUrl.classList.remove('has-value');
    inputEmail.value = '';
    displayStatus.textContent = t('statusReady');
    statusBar.className = 'status-bar';
    logArea.innerHTML = '';
    document.querySelectorAll('.step-row').forEach(row => row.className = 'step-row');
    document.querySelectorAll('.step-status').forEach(el => el.textContent = '');
    btnAutoRun.disabled = false;
    inputRunCount.disabled = false;
    setAutoRunButton(t('btnAuto'));
    autoContinueBar.style.display = 'none';
    updateStopButtonState(false);
    updateButtonStates();
    updateProgressCounter();
    hideMailLoginHelp();
  }
});

// Clear log
btnClearLog.addEventListener('click', () => {
  logArea.innerHTML = '';
});

// Save settings on change
inputEmail.addEventListener('change', async () => {
  const email = inputEmail.value.trim();
  if (email) {
    await chrome.runtime.sendMessage({ type: 'SAVE_EMAIL', source: 'sidepanel', payload: { email } });
  }
});

inputVpsUrl.addEventListener('change', async () => {
  const vpsUrl = inputVpsUrl.value.trim();
  if (vpsUrl) {
    await chrome.runtime.sendMessage({ type: 'SAVE_SETTING', source: 'sidepanel', payload: { vpsUrl } });
  }
});

inputPassword.addEventListener('change', async () => {
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING',
    source: 'sidepanel',
    payload: { customPassword: inputPassword.value },
  });
});

selectMailProvider.addEventListener('change', async () => {
  updateMailProviderUI();
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING', source: 'sidepanel',
    payload: { mailProvider: selectMailProvider.value },
  });
});

selectLanguage.addEventListener('change', async () => {
  applyLanguage(selectLanguage.value || 'zh-CN');
  await chrome.runtime.sendMessage({
    type: 'SAVE_SETTING',
    source: 'sidepanel',
    payload: { language: currentLanguage },
  });
});


// ============================================================
// Listen for Background broadcasts
// ============================================================

chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case 'LOG_ENTRY':
      appendLog(message.payload);
      if (message.payload.level === 'error') {
        showToast(message.payload.message, 'error');
      }
      break;

    case 'STEP_STATUS_CHANGED': {
      const { step, status } = message.payload;
      updateStepUI(step, status);
      chrome.runtime.sendMessage({ type: 'GET_STATE', source: 'sidepanel' }).then(updateStatusDisplay);
      if (status === 'completed') {
        chrome.runtime.sendMessage({ type: 'GET_STATE', source: 'sidepanel' }).then(state => {
          syncPasswordField(state);
          if (state.oauthUrl) {
            displayOauthUrl.textContent = state.oauthUrl;
            displayOauthUrl.classList.add('has-value');
          }
          if (state.localhostUrl) {
            displayLocalhostUrl.textContent = state.localhostUrl;
            displayLocalhostUrl.classList.add('has-value');
          }
        });
      }
      break;
    }

    case 'AUTO_RUN_RESET': {
      // Full UI reset for next run
      displayOauthUrl.textContent = t('waiting');
      displayOauthUrl.classList.remove('has-value');
      displayLocalhostUrl.textContent = t('waiting');
      displayLocalhostUrl.classList.remove('has-value');
      inputEmail.value = '';
      displayStatus.textContent = t('statusReady');
      statusBar.className = 'status-bar';
      logArea.innerHTML = '';
      document.querySelectorAll('.step-row').forEach(row => row.className = 'step-row');
      document.querySelectorAll('.step-status').forEach(el => el.textContent = '');
      updateStopButtonState(false);
      updateProgressCounter();
      hideMailLoginHelp();
      break;
    }

    case 'DATA_UPDATED': {
      if (message.payload.email) {
        inputEmail.value = message.payload.email;
      }
      if (message.payload.password !== undefined) {
        inputPassword.value = message.payload.password || '';
      }
      if (message.payload.oauthUrl) {
        displayOauthUrl.textContent = message.payload.oauthUrl;
        displayOauthUrl.classList.add('has-value');
      }
      if (message.payload.localhostUrl) {
        displayLocalhostUrl.textContent = message.payload.localhostUrl;
        displayLocalhostUrl.classList.add('has-value');
      }
      break;
    }

    case 'MAIL_LOGIN_REQUIRED': {
      const provider = String(message.payload?.label || message.payload?.provider || 'Mail').trim();
      showToast(t('mailLoginRequiredToast', { provider }), 'warn', 5000);
      showMailLoginHelp(message.payload || {});
      break;
    }


    case 'AUTO_RUN_STATUS': {
      const { phase, currentRun, totalRuns } = message.payload;
      const runLabel = totalRuns > 1 ? ` (${currentRun}/${totalRuns})` : '';
      switch (phase) {
        case 'waiting_email':
          autoContinueBar.dataset.reason = 'waiting_email';
          autoHint.textContent = t('autoHintEmailManual');
          autoContinueBar.style.display = 'flex';
          setAutoRunButton(t('autoRunPaused', { runLabel }));
          btnAutoRun.disabled = false;
          inputRunCount.disabled = false;
          updateStopButtonState(true);
          break;
        case 'error':
          autoContinueBar.dataset.reason = 'error';
          autoHint.textContent = t('autoHintError');
          autoContinueBar.style.display = 'flex';
          setAutoRunButton(t('autoRunInterrupted', { runLabel }));
          btnAutoRun.disabled = false;
          inputRunCount.disabled = false;
          updateStopButtonState(false);
          break;
        case 'running':
          autoContinueBar.dataset.reason = '';
          autoContinueBar.style.display = 'none';
          setAutoRunButton(t('autoRunRunning', { runLabel }));
          btnAutoRun.disabled = true;
          inputRunCount.disabled = true;
          updateStopButtonState(true);
          break;
        case 'complete':
          btnAutoRun.disabled = false;
          inputRunCount.disabled = false;
          setAutoRunButton(t('btnAuto'));
          autoContinueBar.style.display = 'none';
          autoContinueBar.dataset.reason = '';
          updateStopButtonState(false);
          hideMailLoginHelp();
          break;
        case 'stopped':
          btnAutoRun.disabled = false;
          inputRunCount.disabled = false;
          setAutoRunButton(t('btnAuto'));
          autoContinueBar.style.display = 'none';
          autoContinueBar.dataset.reason = '';
          updateStopButtonState(false);
          hideMailLoginHelp();
          break;
      }
      break;
    }
  }
});

// ============================================================
// Theme Toggle
// ============================================================

const btnTheme = document.getElementById('btn-theme');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('multipage-theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('multipage-theme');
  if (saved) {
    setTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  }
}

btnTheme.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// ============================================================
// Init
// ============================================================

initTheme();
applyLanguage(currentLanguage);
restoreState().then(() => {
  syncPasswordToggleLabel();
  updateButtonStates();
});
