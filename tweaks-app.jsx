/* Tweaks UI — accent color, density, heading font, hero diagram on/off */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#d4a574",
  "density": "Comfortable",
  "headingFont": "Serif",
  "diagramOn": true
}/*EDITMODE-END*/;

(function () {
  const { useEffect } = React;

  function hexToRgb(hex) {
    const m = hex.replace('#', '').match(/.{2}/g);
    if (!m) return '0,0,0';
    return m.map(h => parseInt(h, 16)).join(',');
  }

  function App() {
    const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

    useEffect(() => {
      const root = document.documentElement;
      root.style.setProperty('--accent', t.accent);
      const rgb = hexToRgb(t.accent);
      root.style.setProperty('--accent-soft', `rgba(${rgb}, 0.13)`);

      const body = document.body;
      body.classList.toggle('tweak-cozy',  t.density === 'Cozy');
      body.classList.toggle('tweak-roomy', t.density === 'Roomy');

      root.style.setProperty('--type-display',
        t.headingFont === 'Mono'
          ? "'IBM Plex Mono', monospace"
          : t.headingFont === 'Sans'
            ? "'IBM Plex Sans', system-ui, sans-serif"
            : "'Source Serif 4', Georgia, serif");

      const diag = document.getElementById('arch-mount');
      if (diag) diag.style.display = t.diagramOn ? 'flex' : 'none';
    }, [t.accent, t.density, t.headingFont, t.diagramOn]);

    return (
      <window.TweaksPanel title="Tweaks">
        <window.TweakColor
          label="Accent"
          value={t.accent}
          onChange={(v) => setTweak('accent', v)}
          options={['#d4a574', '#b8997b', '#7fa0ad', '#8eb59f', '#b86d5f', '#a48bbf']}
        />
        <window.TweakRadio
          label="Density"
          value={t.density}
          onChange={(v) => setTweak('density', v)}
          options={['Cozy', 'Comfortable', 'Roomy']}
        />
        <window.TweakRadio
          label="Headings"
          value={t.headingFont}
          onChange={(v) => setTweak('headingFont', v)}
          options={['Serif', 'Sans', 'Mono']}
        />
        <window.TweakToggle
          label="Hero diagram"
          value={t.diagramOn}
          onChange={(v) => setTweak('diagramOn', v)}
        />
      </window.TweaksPanel>
    );
  }

  const mount = document.getElementById('tweaks-mount');
  if (mount && window.ReactDOM) {
    ReactDOM.createRoot(mount).render(<App />);
  }
})();
