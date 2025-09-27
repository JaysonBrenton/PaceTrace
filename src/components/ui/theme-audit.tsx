import Link from "next/link";

import { Button } from "./button";
import { Card } from "./card";
import { FormField } from "./form-field";
import { Input } from "./input";
import { Muted } from "./muted";
import { Select } from "./select";

export function ThemeAudit() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-fg">Typography</h2>
        <Card className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold">Heading One</h1>
            <h2 className="text-2xl font-semibold">Heading Two</h2>
            <h3 className="text-xl font-semibold">Heading Three</h3>
          </div>
          <div className="space-y-2">
            <p className="text-base text-fg">Body text keeps race insights legible lap after lap.</p>
            <Muted>
              Muted copy balances emphasis — perfect for helper descriptions or supporting text.
            </Muted>
            <p className="text-sm text-accent">
              <Link href="/styleguide" className="font-medium">
                Inline links use the accent palette
              </Link>
            </p>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-fg">Form controls</h2>
        <Card className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField htmlFor="audit-email" label="Email" requiredIndicator="*">
              <Input id="audit-email" placeholder="you@pace.team" />
            </FormField>
            <FormField htmlFor="audit-email-focused" label="Email (focused)">
              <Input
                id="audit-email-focused"
                placeholder="focus state"
                className="ring-2 ring-accent ring-offset-2 ring-offset-bg"
              />
            </FormField>
            <FormField htmlFor="audit-select" label="Team role">
              <Select id="audit-select" defaultValue="driver">
                <option value="driver">Driver</option>
                <option value="engineer">Engineer</option>
                <option value="strategist">Strategist</option>
              </Select>
            </FormField>
            <FormField htmlFor="audit-password" label="Password" error="Must be at least 8 characters" errorId="audit-password-error">
              <Input id="audit-password" type="password" invalid aria-describedby="audit-password-error" />
            </FormField>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-fg">Buttons</h2>
        <Card className="flex flex-wrap items-center gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button isLoading>Loading</Button>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-fg">Cards & Alerts</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-3">
            <h3 className="text-xl font-semibold">Telemetry snapshot</h3>
            <Muted>Cards sit on the surface token and rely on elevated shadows.</Muted>
            <div className="rounded-lg border border-border/60 bg-bg-subtle/60 p-4">
              <p className="text-sm text-fg-muted">Lap delta</p>
              <p className="text-2xl font-semibold text-fg">-0.213s</p>
            </div>
          </Card>
          <div className="space-y-4">
            <div className="rounded-lg border border-success/40 bg-success/10 p-4 text-sm text-success">
              Success alert keeps status positive.
            </div>
            <div className="rounded-lg border border-warn/40 bg-warn/10 p-4 text-sm text-warn">
              Warning alert calls attention without overpowering.
            </div>
            <div className="rounded-lg border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
              Destructive alert highlights critical actions.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
