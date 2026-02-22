export default function Home() {
  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <div className="p-8 space-y-8">
        {/* Typography verification */}
        <h1 className="font-display text-4xl">
          Clover Labs — Space Grotesk
        </h1>
        <p className="font-body text-lg text-on-surface-muted">
          Body text in Inter — muted variant
        </p>
        <code className="font-mono text-sm text-on-surface-subtle">
          const code = &quot;JetBrains Mono — subtle variant&quot;;
        </code>

        {/* Color token verification */}
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-surface-raised border border-surface-border" />
          <div className="w-24 h-24 bg-surface-light border border-surface-light-border" />
          <div className="w-24 h-24 bg-surface-light-raised border border-surface-light-border" />
        </div>

        {/* Light section verification */}
        <section className="section-light p-8 rounded">
          <h2 className="font-display text-2xl">Light Section</h2>
          <p className="text-on-surface-light-muted">Muted text on light surface</p>
        </section>
      </div>
    </main>
  );
}
