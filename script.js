(function () {
  const authOverlay = document.getElementById('authOverlay');
  const loginTabBtn = document.getElementById('loginTabBtn');
  const registerTabBtn = document.getElementById('registerTabBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginError = document.getElementById('loginError');
  const registerError = document.getElementById('registerError');
  const logoutBtn = document.getElementById('logoutBtn');
  const userAvatar = document.getElementById('userAvatar');
  const orderPriceInput = document.getElementById('orderPrice');
  const orderAmountInput = document.getElementById('orderAmount');
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  const buyTab = document.getElementById('buyTab');
  const sellTab = document.getElementById('sellTab');
  const chartArea = document.getElementById('chartArea');
  const orderTotal = document.getElementById('orderTotal');

  const state = {
    side: 'buy',
    balance: 12450.8,
    btcPrice: 43250.5,
    holdings: {
      BTC: { amount: 0.05, avg: 42000 }
    }
  };

  function setActiveTab(tab) {
    if (tab === 'login') {
      loginTabBtn?.classList.add('active');
      registerTabBtn?.classList.remove('active');
      loginForm?.classList.add('active');
      registerForm?.classList.remove('active');
      loginError && (loginError.style.display = 'none');
    } else {
      registerTabBtn?.classList.add('active');
      loginTabBtn?.classList.remove('active');
      registerForm?.classList.add('active');
      loginForm?.classList.remove('active');
      registerError && (registerError.style.display = 'none');
    }
  }

  function updateOrderSummary() {
    const price = Number(orderPriceInput?.value || state.btcPrice);
    const amount = Number(orderAmountInput?.value || 0.01);
    const fee = price * amount * 0.001;
    const total = price * amount + fee;

    if (orderTotal) {
      orderTotal.textContent = `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    if (placeOrderBtn) {
      const label = state.side === 'buy' ? 'Buy BTC' : 'Sell BTC';
      placeOrderBtn.textContent = label;
      placeOrderBtn.classList.toggle('sell', state.side === 'sell');
    }
  }

  function generateCandles() {
    if (!chartArea) return;

    chartArea.innerHTML = '';
    const candleCount = 28;

    for (let i = 0; i < candleCount; i++) {
      const candle = document.createElement('div');
      candle.className = 'candle';

      const isRed = Math.random() > 0.55;
      const bodyHeight = 24 + Math.random() * 52;
      const wickHeight = 8 + Math.random() * 20;

      const wickTop = document.createElement('div');
      wickTop.className = 'wick';
      wickTop.style.height = `${wickHeight}%`;

      const body = document.createElement('div');
      body.className = 'body';
      body.style.height = `${bodyHeight}%`;
      if (isRed) {
        body.style.background = '#ef4444';
        candle.classList.add('red');
      } else {
        body.style.background = '#10b981';
      }

      const wickBottom = document.createElement('div');
      wickBottom.className = 'wick';
      wickBottom.style.height = `${Math.max(8, wickHeight * 0.7)}%`;

      candle.appendChild(wickTop);
      candle.appendChild(body);
      candle.appendChild(wickBottom);
      chartArea.appendChild(candle);
    }
  }

  function setUserInitials(name) {
    if (!userAvatar) return;
    const clean = name.trim();
    if (!clean) {
      userAvatar.textContent = 'JC';
      return;
    }

    const parts = clean.split(/\s+/);
    const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('');
    userAvatar.textContent = initials || 'JC';
  }

  function handleLoginSubmit(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail')?.value.trim() || '';
    const password = document.getElementById('loginPassword')?.value.trim() || '';

    if (!email || !password) {
      if (loginError) {
        loginError.textContent = 'Please fill in all fields.';
        loginError.style.display = 'block';
      }
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      if (loginError) {
        loginError.textContent = 'Please enter a valid email address.';
        loginError.style.display = 'block';
      }
      return;
    }

    if (password.length < 6) {
      if (loginError) {
        loginError.textContent = 'Password must be at least 6 characters.';
        loginError.style.display = 'block';
      }
      return;
    }

    if (loginError) loginError.style.display = 'none';
    setUserInitials(email.split('@')[0]);
    authOverlay?.classList.add('hidden');
    generateCandles();
  }

  function handleRegisterSubmit(event) {
    event.preventDefault();

    const fullName = document.getElementById('regFullName')?.value.trim() || '';
    const email = document.getElementById('regEmail')?.value.trim() || '';
    const password = document.getElementById('regPassword')?.value.trim() || '';
    const confirm = document.getElementById('regConfirm')?.value.trim() || '';

    if (!fullName || !email || !password || !confirm) {
      if (registerError) {
        registerError.textContent = 'All fields are required.';
        registerError.style.display = 'block';
      }
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      if (registerError) {
        registerError.textContent = 'Please enter a valid email address.';
        registerError.style.display = 'block';
      }
      return;
    }

    if (password.length < 8) {
      if (registerError) {
        registerError.textContent = 'Password must be at least 8 characters.';
        registerError.style.display = 'block';
      }
      return;
    }

    if (password !== confirm) {
      if (registerError) {
        registerError.textContent = 'Passwords do not match.';
        registerError.style.display = 'block';
      }
      return;
    }

    if (registerError) registerError.style.display = 'none';
    setUserInitials(fullName);
    authOverlay?.classList.add('hidden');
    generateCandles();
  }

  function handleSideSwitch(nextSide) {
    state.side = nextSide;
    if (buyTab) buyTab.classList.toggle('active', nextSide === 'buy');
    if (sellTab) sellTab.classList.toggle('active', nextSide === 'sell');
    updateOrderSummary();
  }

  function handlePlaceOrder() {
    const price = Number(orderPriceInput?.value || state.btcPrice);
    const amount = Number(orderAmountInput?.value || 0.01);
    const fee = price * amount * 0.001;
    const total = price * amount + fee;

    if (state.side === 'buy') {
      if (state.balance < total) {
        if (loginError) {
          loginError.textContent = 'Insufficient demo balance.';
          loginError.style.display = 'block';
          return;
        }
      }

      state.balance -= total;
      state.holdings.BTC = state.holdings.BTC || { amount: 0, avg: price };
      const current = state.holdings.BTC.amount;
      const average = state.holdings.BTC.avg;
      state.holdings.BTC.amount = current + amount;
      state.holdings.BTC.avg = (current * average + amount * price) / (current + amount || 1);
    } else {
      if ((state.holdings.BTC?.amount || 0) < amount) {
        if (loginError) {
          loginError.textContent = 'Not enough BTC to sell.';
          loginError.style.display = 'block';
          return;
        }
      }

      state.balance += total;
      state.holdings.BTC.amount = Math.max(0, (state.holdings.BTC?.amount || 0) - amount);
    }

    const balanceEl = document.getElementById('navBalance');
    if (balanceEl) {
      balanceEl.textContent = state.balance.toFixed(2);
    }

    if (loginError) {
      loginError.textContent = `${state.side === 'buy' ? 'Buy' : 'Sell'} order placed successfully.`;
      loginError.style.display = 'block';
      loginError.style.color = '#10b981';
      setTimeout(() => {
        loginError.style.display = 'none';
        loginError.style.color = '#f87171';
      }, 1800);
    }
  }

  loginTabBtn?.addEventListener('click', () => setActiveTab('login'));
  registerTabBtn?.addEventListener('click', () => setActiveTab('register'));
  loginForm?.addEventListener('submit', handleLoginSubmit);
  registerForm?.addEventListener('submit', handleRegisterSubmit);
  logoutBtn?.addEventListener('click', () => {
    authOverlay?.classList.remove('hidden');
    setActiveTab('login');
    document.getElementById('loginEmail').value = 'demo@trader.com';
    document.getElementById('loginPassword').value = 'password123';
    if (loginError) loginError.style.display = 'none';
    if (registerError) registerError.style.display = 'none';
  });

  buyTab?.addEventListener('click', () => handleSideSwitch('buy'));
  sellTab?.addEventListener('click', () => handleSideSwitch('sell'));
  orderPriceInput?.addEventListener('input', updateOrderSummary);
  orderAmountInput?.addEventListener('input', updateOrderSummary);
  placeOrderBtn?.addEventListener('click', handlePlaceOrder);

  setActiveTab('login');
  updateOrderSummary();
  generateCandles();
})();
