const endpoints = [
  { name: 'Healthcheck', url: 'http://localhost:5000/api/health', method: 'GET' },
  { name: 'Banners (BannerCarousel)', url: 'http://localhost:5000/api/banners', method: 'GET' },
  { name: 'Fleet (FleetCarousel)', url: 'http://localhost:5000/api/fleet', method: 'GET' },
  { name: 'Bases (BasesGrid)', url: 'http://localhost:5000/api/bases', method: 'GET' },
  { name: 'Commodities (OilTracker)', url: 'http://localhost:5000/api/commodities', method: 'GET' },
  { name: 'Notices (NoticeCarousel)', url: 'http://localhost:5000/api/notices/active', method: 'GET' },
  { name: 'Site Content (About/Services/Hero/Contact)', url: 'http://localhost:5000/api/content', method: 'GET' },
  { name: 'Better Auth Session Check', url: 'http://localhost:5000/api/auth/get-session', method: 'GET' }
];

async function validate() {
  console.log('=== TESTE DE COMUNICAÇÃO: CLIENT -> SERVER ===\n');
  let allOk = true;

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        method: ep.method,
        headers: {
          'Origin': 'http://localhost:3000',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const corsOrigin = res.headers.get('access-control-allow-origin');
      const corsCreds = res.headers.get('access-control-allow-credentials');
      let data = null;
      try { data = await res.json(); } catch {}

      const corsOk = corsOrigin === 'http://localhost:3000' && corsCreds === 'true';
      const statusOk = res.status >= 200 && res.status < 300;

      console.log(`[${statusOk && corsOk ? 'PASS' : 'WARN'}] ${ep.name}`);
      console.log(`  URL: ${ep.url}`);
      console.log(`  Status: ${res.status}`);
      console.log(`  CORS Origin: ${corsOrigin}`);
      console.log(`  CORS Credentials: ${corsCreds}`);
      console.log(`  Data Preview: ${JSON.stringify(data).slice(0, 100)}...\n`);

      if (!statusOk || !corsOk) allOk = false;
    } catch (err) {
      console.log(`[FAIL] ${ep.name} -> Error: ${err.message}\n`);
      allOk = false;
    }
  }

  // Test Preflight OPTIONS (browser preflight)
  try {
    const preflight = await fetch('http://localhost:5000/api/fleet', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    console.log('[PREFLIGHT OPTIONS CHECK]');
    console.log('  Status:', preflight.status);
    console.log('  Access-Control-Allow-Origin:', preflight.headers.get('access-control-allow-origin'));
    console.log('  Access-Control-Allow-Methods:', preflight.headers.get('access-control-allow-methods'));
    console.log('  Access-Control-Allow-Headers:', preflight.headers.get('access-control-allow-headers'));
  } catch (err) {
    console.log('[PREFLIGHT FAIL]', err.message);
  }

  // Test Admin Login from Client
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/sign-in/email', {
      method: 'POST',
      headers: {
        'Origin': 'http://localhost:3000',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@trrkrupinski.com.br',
        password: 'admin123456'
      })
    });
    const loginData = await loginRes.json();
    console.log('\n[ADMIN LOGIN CHECK (Client -> Server)]');
    console.log('  Status:', loginRes.status);
    console.log('  User Email:', loginData.user?.email);
    console.log('  User Role:', loginData.user?.role);
    console.log('  Cookie Set-Cookie Header Present:', Boolean(loginRes.headers.get('set-cookie')));
  } catch (err) {
    console.log('[LOGIN CHECK FAIL]', err.message);
  }

  console.log('\n=== RESULTADO GERAL:', allOk ? 'TUDO FUNCIONANDO PERFEITAMENTE!' : 'ATENÇÃO EM ALGUNS ITENS', '===');
}

validate();
